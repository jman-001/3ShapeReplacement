/* =========================================================
   EXPORT.JS
   Export and clipboard functionality
   ========================================================= */


/* =========================================================
   1. BUILD EXPORT CONTENT
   ========================================================= */

function buildContent() {

    const selectedDamage = document.querySelector(
        'input[name="damageType"]:checked'
    );

    const damageType = selectedDamage.value;


    /* -----------------------------------------------------
       Company information
       ----------------------------------------------------- */

    const company =
        document.getElementById("company").value;

    const locationType =
        document.getElementById("locationType").value;

    const locationNumber =
        document.getElementById("locationNumber").value;

    const address =
        document.getElementById("address").value;

    const city =
        document.getElementById("city").value;

    const state =
        document.getElementById("state").value;

    const zip =
        document.getElementById("zip").value;

    const country =
        document.getElementById("country").value;


    /* -----------------------------------------------------
       Suite / Unit
       ----------------------------------------------------- */

    const suite =
        locationNumber.trim() !== ""
            ? `\n Suite / Unit: ${locationType} ${locationNumber}`
            : "";


    /* -----------------------------------------------------
       Responsible contact
       ----------------------------------------------------- */

    const firstName =
        document.getElementById("first_name").value;

    const lastName =
        document.getElementById("last_name").value;

    const phone =
        document.getElementById("phone").value;

    const email =
        document.getElementById("email").value;


    /* -----------------------------------------------------
       Base content
       ----------------------------------------------------- */

    let content =
        `Company Name: ${company}
Address: ${address}${suite}
City: ${city}
State: ${state}
Zip Code: ${zip}
Country: ${country}
Responsible Contact: ${firstName} ${lastName}
Phone Number: ${phone}
Email: ${email}

Dongle Replaced:
Latest Deployment Date:
Scanner replaced:
Subscription Type:
Direct Subscription?:

Damage Type: ${damageType}
`;


    /* =====================================================
       PHYSICAL DAMAGE
       ===================================================== */

    if (damageType === "physical") {

        content +=
            `

Experience level: ${document.getElementById("experience").value}
Incident report: ${document.getElementById("incident").value}
Incident cause: ${document.getElementById("cause").value}
Prevention: ${document.getElementById("prevention").value}
`;
    }


    /* =====================================================
       BROKEN TIPS
       ===================================================== */

    if (damageType === "tips") {

        content +=
            `

--- Disinfection ---
Times disinfected: ${document.getElementById("tip_disinfect_times").value}
Cleaning chemicals: ${document.getElementById("tip_cleaning_chemicals").value}
Disinfection chemicals: ${document.getElementById("tip_disinfection_chemicals").value}
Immersion time: ${document.getElementById("tip_immersion_time").value}
Other chemicals: ${document.getElementById("tip_other_chemicals").value}

--- Autoclave ---
Autoclave cycles: ${document.getElementById("tip_autoclave_cycles").value}
Autoclave model: ${document.getElementById("tip_autoclave_model").value}
Autoclave settings: ${document.getElementById("tip_autoclave_settings").value}
Airtight pouch: ${document.getElementById("tip_airtight_pouch").value}
Boiler water chemicals: ${document.getElementById("tip_boiler_chemicals").value}
`;
    }


    return content;
}


/* =========================================================
   2. EXPORT AS TXT
   ========================================================= */

function exportTXT() {

    if (!validateForm()) {

        alert(
            "Please correct the highlighted fields."
        );

        return;
    }


    const content =
        buildContent();


    const blob =
        new Blob(
            [content],
            { type: "text/plain" }
        );


    const link =
        document.createElement("a");


    link.href =
        URL.createObjectURL(blob);

    link.download =
        "Replacement_form.txt";


    link.click();


    URL.revokeObjectURL(link.href);
}


/* =========================================================
   3. COPY TO CLIPBOARD
   ========================================================= */

function copyToClipboard() {

    if (!validateForm()) {

        alert(
            "Please correct the highlighted fields."
        );

        return;
    }


    const content =
        buildContent();


    navigator.clipboard
        .writeText(content)

        .then(() => {

            alert(
                "Content copied to clipboard."
            );

        })

        .catch(() => {

            alert(
                "Unable to copy."
            );

        });
}