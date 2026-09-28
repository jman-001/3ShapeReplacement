/* =========================================================
   SUPPORT MODE
   ========================================================= */


/* =========================================================
   SUPPORT MODE STATE
   ========================================================= */

/* =========================================================
   SUPPORT MODE
   ========================================================= */

const SUPPORT_MODE_KEY = "supportModeActive";


const SupportMode = {

    enabled: false,


    /* =====================================================
       INITIALIZE
       ===================================================== */

    init() {

        const savedState =
            sessionStorage.getItem(
                SUPPORT_MODE_KEY
            );

        if (savedState === "true") {

            this.enable();

        }

        this.setupTrigger();

    },


    /* =====================================================
       ENABLE
       ===================================================== */

    enable() {

        this.enabled = true;

        sessionStorage.setItem(
            SUPPORT_MODE_KEY,
            "true"
        );


        document.body.classList.add(
            "support-mode-active"
        );


        this.showPrivateNavigation();


        const indicator =
            document.getElementById(
                "support-mode-indicator"
            );

        if (indicator) {

            indicator.style.display = "block";

        }


        console.log(
            "Support Mode enabled."
        );

        window.dispatchEvent(
            new CustomEvent(
                "supportmodechange",
                { detail: { enabled: true } }
            )
        );

    },


    /* =====================================================
       DISABLE
       ===================================================== */

    disable() {

        this.enabled = false;

        sessionStorage.removeItem(
            SUPPORT_MODE_KEY
        );


        document.body.classList.remove(
            "support-mode-active"
        );


        const privateNavigation =
            document.querySelectorAll(
                "[data-private-navigation]"
            );

        privateNavigation.forEach(
            (item) => {

                item.style.display = "none";

            }
        );


        const indicator =
            document.getElementById(
                "support-mode-indicator"
            );

        if (indicator) {

            indicator.style.display = "none";

        }


        console.log(
            "Support Mode disabled."
        );

        window.dispatchEvent(
            new CustomEvent(
                "supportmodechange",
                { detail: { enabled: false } }
            )
        );

    },


    /* =====================================================
       PRIVATE NAVIGATION
       ===================================================== */

    showPrivateNavigation() {

        const privateNavigation =
            document.querySelectorAll(
                "[data-private-navigation]"
            );


        privateNavigation.forEach(
            (item) => {

                item.style.display = "flex";

            }
        );

    },


    /* =====================================================
       TRIGGER
       ===================================================== */

    setupTrigger() {

        const trigger =
            document.getElementById(
                "support-mode-trigger"
            );


        if (!trigger) {
            return;
        }


        trigger.addEventListener(
            "contextmenu",
            (event) => {

                event.preventDefault();

                openSupportModeLogin();

            }
        );

    }

};


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        SupportMode.init();

    }
);


/* =========================================================
   OPEN LOGIN
   ========================================================= */

function openSupportModeLogin() {

    console.log(
        "Opening Support Mode login."
    );


    if (
        document.getElementById(
            "support-mode-dialog"
        )
    ) {
        return;
    }


    const overlay =
        document.createElement("div");


    overlay.id =
        "support-mode-dialog";


    overlay.innerHTML = `

        <div class="support-dialog">

            <div class="support-dialog-header">

                <p class="support-dialog-eyebrow">
                    RESTRICTED ACCESS
                </p>

                <h2>
                    Support Mode
                </h2>

                <p>
                    Enter your support password to
                    access internal tools and resources.
                </p>

            </div>


            <form id="support-login-form">

                <label for="support-password">
                    Password
                </label>

                <input
                    type="password"
                    id="support-password"
                    autocomplete="off"
                >


                <p
                    id="support-login-error"
                    class="support-login-error"
                    hidden
                >
                    Incorrect password.
                </p>


                <div class="support-dialog-actions">

                    <button
                        type="button"
                        id="support-cancel"
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        class="support-login-button"
                    >
                        Unlock
                    </button>

                </div>

            </form>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    initializeSupportLogin();

}


/* =========================================================
   LOGIN
   ========================================================= */

function initializeSupportLogin() {

    const form =
        document.getElementById(
            "support-login-form"
        );


    const cancel =
        document.getElementById(
            "support-cancel"
        );


    const password =
        document.getElementById(
            "support-password"
        );


    const error =
        document.getElementById(
            "support-login-error"
        );


    cancel.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "support-mode-dialog"
                )
                .remove();

        }
    );


    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            /*
             * TEMPORARY DEVELOPMENT PASSWORD
             *
             * This is NOT our final security mechanism.
             */

            const authenticated =
                password.value === "fldsmdfr";


            if (!authenticated) {

                error.hidden = false;

                password.value = "";

                password.focus();

                return;

            }


            SupportMode.enable();


            document
                .getElementById(
                    "support-mode-dialog"
                )
                .remove();

        }
    );


    password.focus();

}
