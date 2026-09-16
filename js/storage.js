/* =========================================================
   STORAGE.JS
   Local form storage
   ========================================================= */


/* =========================================================
   STORAGE KEY
   ========================================================= */

const FORM_STORAGE_KEY = "formData";


/* =========================================================
   SAVE FORM
   ========================================================= */

function saveForm() {

    const data = {};

    document
        .querySelectorAll("input, textarea, select")
        .forEach(element => {

            data[element.id] = element.value;

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


    if (!saved) {
        return;
    }


    try {

        const data =
            JSON.parse(saved);


        Object.entries(data).forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(id);

                if (element) {
                    element.value = value;
                }

            }
        );


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