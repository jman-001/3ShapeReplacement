/* =========================================================
   INSTALLERS.JS
   ========================================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const familyHeaders =
            document.querySelectorAll(
                ".installer-family-header"
            );


        familyHeaders.forEach(
            (header) => {

                header.addEventListener(
                    "click",
                    () => {

                        const family =
                            header.closest(
                                ".installer-family"
                            );


                        const versions =
                            family.querySelector(
                                ".installer-versions"
                            );


                        const arrow =
                            header.querySelector(
                                ".installer-family-arrow"
                            );


                        const isExpanded =
                            header.getAttribute(
                                "aria-expanded"
                            ) === "true";


                        /*
                         * Toggle state
                         */

                        header.setAttribute(
                            "aria-expanded",
                            String(!isExpanded)
                        );


                        /*
                         * Show / hide versions
                         */

                        versions.hidden =
                            isExpanded;


                        /*
                         * Change arrow
                         */

                        if (isExpanded) {

                            arrow.textContent = "→";

                        } else {

                            arrow.textContent = "↓";

                        }

                    }
                );

            }
        );

    }
);