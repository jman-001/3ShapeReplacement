/* =========================================================
   STORAGE.JS
   Local form storage
   ========================================================= */


/* =========================================================
   STORAGE KEY
   ========================================================= */

const FORM_STORAGE_KEY = "replacement-form:v1";


/* =========================================================
   SAVE FORM
   ========================================================= */

function saveForm() {
    const data = {};
    const formRoot = document.getElementById("replacement-form");

    if (!formRoot) {
        return;
    }

    formRoot
        .querySelectorAll("input, textarea, select")
        .forEach(element => {
            const key = element.id || element.name;

            if (!key) {
                return;
            }

            if (element.type === "radio") {
                if (element.checked) {
                    data[key] = element.value;
                }
                return;
            }

            if (element.type === "checkbox") {
                data[key] = element.checked;
                return;
            }

            data[key] = element.value;
        });


    localStorage.setItem(
        FORM_STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =========================================================
   LOAD FORM
   ========================================================= */

function loadForm() {
    const saved =
        localStorage.getItem(FORM_STORAGE_KEY);
    const formRoot = document.getElementById("replacement-form");

    if (!saved || !formRoot) {
        return;
    }


    try {

        const data =
            JSON.parse(saved);


        formRoot.querySelectorAll("input, textarea, select").forEach((element) => {
            const key = element.id || element.name;

            if (!key || !(key in data)) {
                return;
            }

            if (element.type === "radio") {
                element.checked = element.value === data[key];
            } else if (element.type === "checkbox") {
                element.checked = Boolean(data[key]);
            } else {
                element.value = data[key];
            }
        });


    } catch (error) {

        console.error(
            "Unable to load saved form data:",
            error
        );

        localStorage.removeItem(
            FORM_STORAGE_KEY
        );
    }
}


/* =========================================================
   CLEAR FORM STORAGE
   ========================================================= */

function clearSavedForm() {

    localStorage.removeItem(
        FORM_STORAGE_KEY
    );
}
