/* Shared JSON-driven catalog for Resources and Tools & Commands. */

(() => {
    const SUPPORT_MODE_KEY = "supportModeActive";

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function isSupportModeActive() {
        return sessionStorage.getItem(SUPPORT_MODE_KEY) === "true";
    }

    function showStatus(root, message, isError = false) {
        const status = createElement(
            "p",
            `catalog-message${isError ? " catalog-message-error" : ""}`,
            message
        );

        root.replaceChildren(status);
        root.setAttribute("aria-busy", "false");
    }

    function showAccessGate(root) {
        const gate = createElement("section", "catalog-access-gate");
        const eyebrow = createElement(
            "p",
            "catalog-access-eyebrow",
            "SUPPORT ONLY"
        );
        const title = createElement("h2", "", "Support Mode required");
        const description = createElement(
            "p",
            "",
            "Unlock Support Mode to view internal tools, commands, and downloads."
        );
        const button = createElement(
            "button",
            "catalog-primary-action",
            "Unlock Support Mode"
        );

        button.type = "button";
        button.addEventListener("click", () => openSupportModeLogin());
        gate.append(eyebrow, title, description, button);
        root.replaceChildren(gate);
        root.setAttribute("aria-busy", "false");
    }

    async function copyText(value, button) {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(value);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = value;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
            }

            const previousLabel = button.textContent;
            button.textContent = "Copied";
            setTimeout(() => {
                button.textContent = previousLabel;
            }, 1600);
        } catch (error) {
            console.error(error);
            button.textContent = "Unable to copy";
        }
    }

    function createLinkAction(action, dataUrl) {
        const link = createElement(
            "a",
            "catalog-action",
            action.label || (action.type === "download" ? "Download" : "Open")
        );
        let targetUrl;

        try {
            targetUrl = new URL(action.target, dataUrl);
        } catch {
            return createElement(
                "span",
                "catalog-action catalog-action-disabled",
                "Invalid link"
            );
        }

        if (!['http:', 'https:'].includes(targetUrl.protocol)) {
            return createElement(
                "span",
                "catalog-action catalog-action-disabled",
                "Unsupported link"
            );
        }

        link.href = targetUrl.href;

        if (action.type === "download" && action.source === "local") {
            link.download = action.filename || "";
        }

        if (action.type === "open" || action.source === "external") {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }

        link.appendChild(createElement("span", "catalog-action-arrow", "→"));
        return link;
    }

    function createItemAction(action, item, dataUrl) {
        if (action.type !== "copy") {
            return createLinkAction(action, dataUrl);
        }

        const button = createElement(
            "button",
            "catalog-action",
            action.label || "Copy"
        );
        const value = action.value || item.content?.value || "";

        button.type = "button";
        button.addEventListener("click", () => copyText(value, button));
        return button;
    }

    function createCatalogCard(item, categoryNames, dataUrl) {
        const card = createElement("article", "catalog-card");
        const heading = createElement("div", "catalog-card-heading");
        const category = createElement(
            "span",
            "catalog-category",
            categoryNames.get(item.category) || item.category
        );
        const title = createElement("h2", "", item.title);
        const description = createElement(
            "p",
            "catalog-description",
            item.description
        );
        const badges = createElement("div", "catalog-badges");

        heading.append(category, title);
        card.append(heading, description);

        if (item.version) {
            badges.appendChild(
                createElement("span", "catalog-badge", `Version ${item.version}`)
            );
        }

        (item.platforms || []).forEach((platform) => {
            badges.appendChild(createElement("span", "catalog-badge", platform));
        });

        (item.tags || []).forEach((tag) => {
            badges.appendChild(createElement("span", "catalog-badge", tag));
        });

        if (badges.children.length) {
            card.appendChild(badges);
        }

        if (item.content?.type === "command" && item.content.value) {
            const command = createElement("pre", "catalog-command");
            command.appendChild(createElement("code", "", item.content.value));
            card.appendChild(command);
        }

        if (item.notice) {
            card.appendChild(
                createElement("p", "catalog-notice", item.notice)
            );
        }

        const actions = createElement("div", "catalog-actions");

        (item.actions || []).forEach((action) => {
            actions.appendChild(createItemAction(action, item, dataUrl));
        });

        if (actions.children.length) {
            card.appendChild(actions);
        }

        return card;
    }

    function renderCatalog(root, data, dataUrl) {
        const categories = Array.isArray(data.categories)
            ? data.categories
            : [];
        const items = Array.isArray(data.items)
            ? data.items.filter((item) => item.enabled !== false)
            : [];
        const categoryNames = new Map(
            categories.map((category) => [category.id, category.name])
        );
        let activeCategory = "all";

        const controls = createElement("section", "catalog-controls");
        const searchLabel = createElement("label", "catalog-search");
        const searchText = createElement("span", "", "Search");
        const searchInput = document.createElement("input");
        const filters = createElement("nav", "catalog-filters");
        const grid = createElement("section", "catalog-grid");
        const empty = createElement(
            "p",
            "catalog-message",
            "No catalog entries match your search."
        );

        searchInput.type = "search";
        searchInput.placeholder = "Name, category, platform, or tag...";
        searchInput.autocomplete = "off";
        searchLabel.append(searchText, searchInput);
        controls.append(searchLabel, filters);
        grid.setAttribute("aria-live", "polite");

        const renderFilters = () => {
            const filterOptions = [
                { id: "all", name: "ALL" },
                ...categories
            ];

            filters.replaceChildren(
                ...filterOptions.map((category) => {
                    const button = createElement(
                        "button",
                        `catalog-filter${
                            category.id === activeCategory ? " active" : ""
                        }`,
                        category.name
                    );

                    button.type = "button";
                    button.dataset.category = category.id;
                    button.setAttribute(
                        "aria-pressed",
                        String(category.id === activeCategory)
                    );
                    return button;
                })
            );
        };

        const renderItems = () => {
            const query = searchInput.value.trim().toLowerCase();
            const visibleItems = items.filter((item) => {
                const matchesCategory =
                    activeCategory === "all" || item.category === activeCategory;
                const searchable = [
                    item.title,
                    item.description,
                    categoryNames.get(item.category),
                    ...(item.tags || []),
                    ...(item.platforms || [])
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return matchesCategory && searchable.includes(query);
            });

            grid.replaceChildren(
                ...visibleItems.map((item) =>
                    createCatalogCard(item, categoryNames, dataUrl)
                )
            );
            empty.hidden = visibleItems.length > 0;
        };

        filters.addEventListener("click", (event) => {
            const button = event.target.closest(".catalog-filter");

            if (!button) {
                return;
            }

            activeCategory = button.dataset.category;
            renderFilters();
            renderItems();
        });
        searchInput.addEventListener("input", renderItems);

        root.replaceChildren(controls, grid, empty);
        root.setAttribute("aria-busy", "false");
        renderFilters();
        renderItems();
    }

    async function loadCatalog(root) {
        if (root.dataset.loaded === "true") {
            return;
        }

        if (
            root.dataset.access === "support" &&
            !isSupportModeActive()
        ) {
            showAccessGate(root);
            return;
        }

        if (window.location.protocol === "file:") {
            showStatus(
                root,
                "Catalog data cannot be loaded from file://. Use the desktop shortcut or start ./serve.ps1.",
                true
            );
            return;
        }

        root.dataset.loaded = "true";
        root.setAttribute("aria-busy", "true");
        showStatus(root, "Loading catalog…");
        root.setAttribute("aria-busy", "true");

        try {
            const response = await fetch(root.dataset.source);

            if (!response.ok) {
                throw new Error(`Unable to load catalog (${response.status}).`);
            }

            const data = await response.json();

            if (!data.catalog || !Array.isArray(data.items)) {
                throw new Error("Catalog data has an invalid structure.");
            }

            renderCatalog(root, data, response.url);
        } catch (error) {
            console.error(error);
            root.dataset.loaded = "false";
            showStatus(
                root,
                "The catalog could not be loaded. Please refresh the page or contact support.",
                true
            );
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const root = document.querySelector("[data-catalog]");

        if (!root) {
            return;
        }

        loadCatalog(root);

        window.addEventListener("supportmodechange", (event) => {
            if (event.detail?.enabled && root.dataset.access === "support") {
                loadCatalog(root);
            }
        });
    });
})();
