/* Builds the installer catalog from data/installers.json. */

function createInstallerElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function getModuleLabel(download, moduleNames) {
    const moduleName = moduleNames.get(download.module) || download.module;
    const version = download.moduleVersion
        ? ` (${download.moduleVersion})`
        : "";

    return `Download ${moduleName}${version}`;
}

function renderInstallerDownload(download, moduleNames) {
    const link = createInstallerElement(
        "a",
        "installer-download",
        getModuleLabel(download, moduleNames)
    );
    const arrow = createInstallerElement("span", "", "→");

    link.href = download.url;
    link.appendChild(arrow);

    return link;
}

function renderInstallerRelease(release, moduleNames) {
    const releaseElement = createInstallerElement(
        "div",
        "installer-version"
    );
    const versionInfo = createInstallerElement(
        "div",
        "installer-version-info"
    );
    const downloads = createInstallerElement(
        "div",
        "installer-downloads"
    );

    versionInfo.append(
        createInstallerElement("span", "installer-version-label", "Version"),
        createInstallerElement(
            "span",
            "installer-version-number",
            release.version
        )
    );

    (release.downloads || []).forEach((download) => {
        downloads.appendChild(renderInstallerDownload(download, moduleNames));
    });

    if (!downloads.children.length) {
        downloads.appendChild(
            createInstallerElement(
                "span",
                "installer-module-empty",
                "No module downloads available."
            )
        );
    }

    releaseElement.append(versionInfo, downloads);
    return releaseElement;
}

function renderInstallerGeneration(generation, moduleNames) {
    const family = createInstallerElement("section", "installer-family");
    const header = createInstallerElement(
        "button",
        "installer-family-header"
    );
    const panel = createInstallerElement("div", "installer-versions");
    const panelId = `installer-${generation.id}`;
    const expanded = Boolean(generation.expanded);

    header.type = "button";
    header.setAttribute("aria-expanded", String(expanded));
    header.setAttribute("aria-controls", panelId);
    header.append(
        createInstallerElement(
            "span",
            "installer-family-name",
            generation.name
        ),
        createInstallerElement(
            "span",
            "installer-family-arrow",
            expanded ? "↓" : "→"
        )
    );

    panel.id = panelId;
    panel.hidden = !expanded;

    if (generation.releases?.length) {
        const releases = [...generation.releases].sort((first, second) =>
            second.version.localeCompare(first.version, undefined, {
                numeric: true
            })
        );

        releases.forEach((release) => {
            panel.appendChild(renderInstallerRelease(release, moduleNames));
        });
    } else {
        panel.appendChild(
            createInstallerElement(
                "p",
                "installer-empty",
                "No installers have been published for this generation yet."
            )
        );
    }

    family.append(header, panel);
    return family;
}

function renderInstallerProduct(product) {
    const section = createInstallerElement("section", "installer-section");
    const sectionHeader = createInstallerElement(
        "div",
        "installer-section-header"
    );
    const moduleNames = new Map(
        (product.modules || []).map((module) => [module.id, module.name])
    );

    sectionHeader.append(
        createInstallerElement("h2", "", product.name),
        createInstallerElement("p", "", product.description)
    );
    section.appendChild(sectionHeader);

    (product.generations || []).forEach((generation) => {
        section.appendChild(
            renderInstallerGeneration(generation, moduleNames)
        );
    });

    return section;
}

function setupInstallerAccordion(catalog) {
    catalog.addEventListener("click", (event) => {
        const header = event.target.closest(".installer-family-header");

        if (!header || !catalog.contains(header)) {
            return;
        }

        const panel = document.getElementById(
            header.getAttribute("aria-controls")
        );
        const arrow = header.querySelector(".installer-family-arrow");
        const isExpanded = header.getAttribute("aria-expanded") === "true";

        header.setAttribute("aria-expanded", String(!isExpanded));
        panel.hidden = isExpanded;
        arrow.textContent = isExpanded ? "→" : "↓";
    });
}

async function initializeInstallerCatalog() {
    const catalog = document.getElementById("installerCatalog");

    if (!catalog) {
        return;
    }

    if (window.location.protocol === "file:") {
        catalog.setAttribute("aria-busy", "false");
        catalog.replaceChildren(
            createInstallerElement(
                "p",
                "catalog-status catalog-status-error",
                "Installer data cannot be loaded from file://. Start the local server with ./serve.ps1 and open http://localhost:8000/pages/installers.html."
            )
        );
        return;
    }

    try {
        const response = await fetch(catalog.dataset.source);

        if (!response.ok) {
            throw new Error(`Unable to load installers (${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data.products)) {
            throw new Error("Installer data does not contain a products list.");
        }

        catalog.replaceChildren(
            ...data.products.map(renderInstallerProduct)
        );
        setupInstallerAccordion(catalog);
    } catch (error) {
        console.error(error);
        catalog.replaceChildren(
            createInstallerElement(
                "p",
                "catalog-status catalog-status-error",
                "Installers could not be loaded. Please refresh the page or contact support."
            )
        );
    } finally {
        catalog.setAttribute("aria-busy", "false");
    }
}

document.addEventListener("DOMContentLoaded", initializeInstallerCatalog);
