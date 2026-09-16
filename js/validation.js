/* =========================================================
   VALIDATION.JS
   Validation logic for the Replacement Form
   ========================================================= */


/* =========================================================
   1. CONTACT VALIDATION
   ========================================================= */

function validateContactFields() {

    let valid = true;

    const phone = document.getElementById("phone");
    const email = document.getElementById("email");

    const phoneError = document.getElementById("phoneError");
    const emailError = document.getElementById("emailError");


    /* -----------------------------------------------------
       Phone validation
       ----------------------------------------------------- */

    const phonePattern = /^\+?[0-9\s\-()]{7,20}$/;

    if (
        phone.value.trim() !== "" &&
        !phonePattern.test(phone.value.trim())
    ) {

        phone.classList.add("error");

        phoneError.style.display = "block";

        valid = false;

    } else {

        phone.classList.remove("error");

        phoneError.style.display = "none";
    }


    /* -----------------------------------------------------
       Email validation
       ----------------------------------------------------- */

    const emailPattern =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (
        email.value.trim() !== "" &&
        !emailPattern.test(email.value.trim())
    ) {

        email.classList.add("error");

        emailError.style.display = "block";

        valid = false;

    } else {

        email.classList.remove("error");

        emailError.style.display = "none";
    }


    return valid;
}


/* =========================================================
   2. REQUIRED FIELD VALIDATION
   ========================================================= */

function validateRequiredFields() {

    let valid = true;


    document
        .querySelectorAll("input[required]")
        .forEach(input => {

            const errorId = `${input.id}ReqError`;

            let errorElement =
                document.getElementById(errorId);


            /* -------------------------------------------------
               Create error message if it doesn't exist
               ------------------------------------------------- */

            if (!errorElement) {

                errorElement =
                    document.createElement("small");

                errorElement.id = errorId;

                errorElement.className =
                    "validation-message";

                errorElement.textContent =
                    "This field is required.";

                input.insertAdjacentElement(
                    "afterend",
                    errorElement
                );
            }


            /* -------------------------------------------------
               Validate value
               ------------------------------------------------- */

            if (input.value.trim() === "") {

                input.classList.add("error");

                errorElement.style.display = "block";

                valid = false;

            } else {

                input.classList.remove("error");

                errorElement.style.display = "none";
            }

        });


    return valid;
}


/* =========================================================
   3. DAMAGE TYPE VALIDATION
   ========================================================= */

function validateDamageType() {

    const damageSelect =
        document.getElementById("damageSelect");

    const damageError =
        document.getElementById("damageError");


    if (damageSelect.value === "") {

        damageSelect.classList.add("error");

        damageError.style.display = "block";

        return false;

    }


    damageSelect.classList.remove("error");

    damageError.style.display = "none";

    return true;
}


/* =========================================================
   4. COMPLETE FORM VALIDATION
   ========================================================= */

function validateForm() {

    const requiredValid =
        validateRequiredFields();

    const damageValid =
        validateDamageType();

    const contactValid =
        validateContactFields();


    return (
        requiredValid &&
        damageValid &&
        contactValid
    );
}