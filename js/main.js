/* =========================================================
   MAIN.JS
   Application initialization and page events
   ========================================================= */


/* =========================================================
   1. DAMAGE TYPE
   ========================================================= */

function toggleDamageFields() {

    const damageType =
        document.getElementById("damageSelect").value;

    const physicalSection =
        document.getElementById("physicalSection");

    const tipsSection =
        document.getElementById("tipsSection");


    /* -----------------------------------------------------
       Hide all conditional sections
       ----------------------------------------------------- */

    physicalSection.classList.add("hidden");

    tipsSection.classList.add("hidden");

    additionalcontainer.classList.add("hidden");


    /* -----------------------------------------------------
       Show relevant section
       ----------------------------------------------------- */

    if (damageType === "physical") {
        physicalSection.classList.remove("hidden");
        additionalcontainer.classList.remove("hidden");
    }

    if (damageType === "tips") {
        tipsSection.classList.remove("hidden");
        additionalcontainer.classList.remove("hidden");
    }


    /* -----------------------------------------------------
       Save current state
       ----------------------------------------------------- */

    saveForm();
}


/* =========================================================
   2. RESET FORM
   ========================================================= */

function resetForm() {

    const confirmed =
        confirm(
            "Are you sure you want to clear all answers?"
        );


    if (!confirmed) {
        return;
    }


    /* -----------------------------------------------------
       Clear form controls
       ----------------------------------------------------- */

    document
        .querySelectorAll("input, textarea, select")
        .forEach(element => {

            element.value = "";

        });


    /* -----------------------------------------------------
       Reset conditional sections
       ----------------------------------------------------- */

    toggleDamageFields();


    /* -----------------------------------------------------
       Clear saved data
       ----------------------------------------------------- */

    clearSavedForm();


    /* -----------------------------------------------------
       Notify user
       ----------------------------------------------------- */

    alert(
        "Form has been reset."
    );
}


/* =========================================================
   3. EVENT LISTENERS
   ========================================================= */

function setupEventListeners() {

    const damageSelect =
        document.getElementById("damageSelect");

    const phone =
        document.getElementById("phone");

    const email =
        document.getElementById("email");

    const exportButton =
        document.getElementById("exportTxtButton");

    const copyButton =
        document.getElementById("copyButton");

    const resetButton =
        document.getElementById("resetButton");


    /* -----------------------------------------------------
       Damage type
       ----------------------------------------------------- */

    damageSelect.addEventListener(
        "change",
        () => {

            toggleDamageFields();

            validateDamageType();

        }
    );


    /* -----------------------------------------------------
       Contact validation
       ----------------------------------------------------- */

    phone.addEventListener(
        "input",
        validateContactFields
    );

    email.addEventListener(
        "input",
        validateContactFields
    );


    /* -----------------------------------------------------
       Autosave
       ----------------------------------------------------- */

    document
        .querySelectorAll("input, textarea, select")
        .forEach(element => {

            element.addEventListener(
                "input",
                saveForm
            );

        });


    /* -----------------------------------------------------
       Export
       ----------------------------------------------------- */

    exportButton.addEventListener(
        "click",
        exportTXT
    );


    /* -----------------------------------------------------
       Clipboard
       ----------------------------------------------------- */

    copyButton.addEventListener(
        "click",
        copyToClipboard
    );


    /* -----------------------------------------------------
       Reset
       ----------------------------------------------------- */

    resetButton.addEventListener(
        "click",
        resetForm
    );
}


/* =========================================================
   4. INITIALIZATION
   ========================================================= */

function initializeApp() {

    loadForm();

    toggleDamageFields();

    setupEventListeners();
}


/* =========================================================
   5. START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

/*
 * =========================================================
 * MAIN APPLICATION
 * =========================================================
 *
 * Global application initialization.
 *
 * This file should coordinate the different modules,
 * but should not contain their internal logic.
 *
 */

/* =========================================================
   MAIN APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeSupportMode();

});


/* =========================================================
   SUPPORT MODE
   ========================================================= */

function initializeSupportMode() {

    const trigger = document.getElementById(
        "support-mode-trigger"
    );

    if (!trigger) {
        return;
    }


    trigger.addEventListener("contextmenu", (event) => {

        event.preventDefault();

        openSupportModeLogin();

    });

}