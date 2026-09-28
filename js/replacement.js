/* Replacement form initialization and page-specific interactions. */

function getSelectedDamageType() {
    return document.querySelector(
        '#replacement-form input[name="damageType"]:checked'
    )?.value || "";
}

function toggleDamageFields() {
    const damageType = getSelectedDamageType();
    const physicalSection = document.getElementById("physicalSection");
    const tipsSection = document.getElementById("tipsSection");
    const additionalContainer = document.getElementById("additionalcontainer");

    if (!physicalSection || !tipsSection || !additionalContainer) {
        return;
    }

    physicalSection.classList.toggle("hidden", damageType !== "physical");
    tipsSection.classList.toggle("hidden", damageType !== "tips");
    additionalContainer.classList.toggle(
        "hidden",
        damageType !== "physical" && damageType !== "tips"
    );

}

function resetForm() {
    if (!confirm("Are you sure you want to clear all answers?")) {
        return;
    }

    const formRoot = document.getElementById("replacement-form");

    formRoot.querySelectorAll("input, textarea, select").forEach((element) => {
        if (element.type === "radio" || element.type === "checkbox") {
            element.checked = false;
        } else {
            element.value = "";
        }

        element.classList.remove("error");
    });

    formRoot.querySelectorAll(".validation-message").forEach((message) => {
        message.style.display = "none";
    });

    clearSavedForm();
    toggleDamageFields();
    alert("Form has been reset.");
}

function setupReplacementEventListeners() {
    const formRoot = document.getElementById("replacement-form");
    const damageOptions = formRoot.querySelectorAll(
        'input[name="damageType"]'
    );

    damageOptions.forEach((option) => {
        option.addEventListener("change", () => {
            toggleDamageFields();
            validateDamageType();
        });
    });

    document.getElementById("phone").addEventListener(
        "input",
        validateContactFields
    );
    document.getElementById("email").addEventListener(
        "input",
        validateContactFields
    );

    formRoot.querySelectorAll("input, textarea, select").forEach((element) => {
        element.addEventListener("input", saveForm);
        element.addEventListener("change", saveForm);
    });

    document.getElementById("exportTxtButton").addEventListener(
        "click",
        exportTXT
    );
    document.getElementById("copyButton").addEventListener(
        "click",
        copyToClipboard
    );
    document.getElementById("resetButton").addEventListener(
        "click",
        resetForm
    );
}

function initializeReplacementForm() {
    if (!document.getElementById("replacement-form")) {
        return;
    }

    loadForm();
    toggleDamageFields();
    setupReplacementEventListeners();
}

document.addEventListener("DOMContentLoaded", initializeReplacementForm);
