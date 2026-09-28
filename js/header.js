/* Shared site header used by every page. */

(() => {
    const scriptPath = document.currentScript.getAttribute("src") || "";
    const projectRoot = scriptPath.startsWith("../") ? "../" : "";

    const pages = {
        home: `${projectRoot}index.html`,
        replacement: `${projectRoot}pages/replacement.html`,
        resources: `${projectRoot}pages/resources.html`,
        references: `${projectRoot}pages/reference-pictures.html`,
        installers: `${projectRoot}pages/installers.html`,
        tools: `${projectRoot}pages/tools-commands.html`
    };

    class SiteHeader extends HTMLElement {
        connectedCallback() {
            const activePage = this.getAttribute("active") || "";
            const activeClass = (page) =>
                page === activePage ? " active" : "";

            this.innerHTML = `
                <header id="site-header">
                    <a
                        href="${pages.home}"
                        class="navigation-logo"
                        aria-label="3Shape Internal Tools home"
                    >
                        <img
                            src="${projectRoot}assets/images/3shape_words.svg"
                            height="30"
                            alt="3Shape"
                        >
                    </a>

                    <nav class="site-navigation" aria-label="Main navigation">
                        <div class="navigation-menu">
                            <a
                                href="${pages.replacement}"
                                class="navigation-item${activeClass("replacement")}"
                            >
                                Replacement Form
                            </a>

                            <a
                                href="${pages.resources}"
                                class="navigation-item${activeClass("resources")}"
                            >
                                Resources
                            </a>

                            <a
                                href="${pages.references}"
                                class="navigation-item private-navigation${activeClass("references")}"
                                data-private-navigation
                            >
                                Reference Pictures
                            </a>

                            <a
                                href="${pages.installers}"
                                class="navigation-item private-navigation${activeClass("installers")}"
                                data-private-navigation
                            >
                                Installers
                            </a>

                            <a
                                href="${pages.tools}"
                                class="navigation-item private-navigation${activeClass("tools")}"
                                data-private-navigation
                            >
                                Tools &amp; Commands
                            </a>
                        </div>
                    </nav>

                    <div
                        class="support-mode-indicator private-navigation"
                        id="support-mode-indicator"
                        data-private-navigation
                    >
                        SUPPORT MODE
                    </div>
                </header>

                <button
                    type="button"
                    id="support-mode-trigger"
                    class="support-mode-button"
                    aria-label="Open Support Mode"
                >
                    <img
                        src="${projectRoot}assets/images/3shape_logo.png"
                        alt=""
                    >
                </button>
            `;
        }
    }

    if (!customElements.get("site-header")) {
        customElements.define("site-header", SiteHeader);
    }
})();
