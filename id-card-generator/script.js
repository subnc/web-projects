const form = document.getElementById("idForm");

const nameInput = document.getElementById("name");
const idInput = document.getElementById("idNumber");
const departmentInput = document.getElementById("department");
const designationInput = document.getElementById("designation");
const organizationInput = document.getElementById("organization");
const phoneInput = document.getElementById("phone");
const dobInput = document.getElementById("dob");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");

const photoInput = document.getElementById("photo");
const uploadedPhoto = document.getElementById("uploadedPhoto");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const removePhotoBtn = document.getElementById("removePhoto");

const card = document.getElementById("idCard");

const cardOrganization =
    document.getElementById("cardOrganization");

const cardName =
    document.getElementById("cardName");

const cardDesignation =
    document.getElementById("cardDesignation");

const cardId =
    document.getElementById("cardId");

const cardDepartment =
    document.getElementById("cardDepartment");

const cardDob =
    document.getElementById("cardDob");

const cardPhone =
    document.getElementById("cardPhone");

const cardEmail =
    document.getElementById("cardEmail");

const cardAddress =
    document.getElementById("cardAddress");

const footerId =
    document.getElementById("footerId");

const cardPhoto =
    document.getElementById("cardPhoto");

const cardPhotoPlaceholder =
    document.getElementById("cardPhotoPlaceholder");

const qrcode =
    document.getElementById("qrcode");

const cardColor =
    document.getElementById("cardColor");

const themeBtn =
    document.getElementById("themeBtn");

const resetBtn =
    document.getElementById("resetBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const printBtn =
    document.getElementById("printBtn");

const message =
    document.getElementById("message");


let photoData = "";

let selectedTemplate = "blue";


/* Template colors */

const templateColors = {
    blue: "#2563EB",
    green: "#16A34A",
    purple: "#7C3AED"
};


/* Change template */

function setTemplate(template) {

    selectedTemplate = template;

    cardColor.value =
        templateColors[template] ||
        templateColors.blue;

    card.style.setProperty(
        "--accent",
        cardColor.value
    );


    document
        .querySelectorAll(".template-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.template === template
            );

        });
}


/* Format date */

function formatDate(date) {

    if (!date) {
        return "DD/MM/YYYY";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


/* Update card */

function updateCard() {

    cardOrganization.textContent =
        organizationInput.value.trim() ||
        "ORGANIZATION NAME";


    cardName.textContent =
        nameInput.value.trim() ||
        "YOUR NAME";


    cardDesignation.textContent =
        designationInput.value.trim() ||
        "Designation";


    cardId.textContent =
        idInput.value.trim() ||
        "STU001";


    cardDepartment.textContent =
        departmentInput.value.trim() ||
        "Department";


    cardDob.textContent =
        formatDate(dobInput.value);


    cardPhone.textContent =
        phoneInput.value.trim() ||
        "Phone";


    cardEmail.textContent =
        emailInput.value.trim() ||
        "Email";


    cardAddress.textContent =
        addressInput.value.trim() ||
        "Address";


    footerId.textContent =
        idInput.value.trim() ||
        "STU001";


    card.style.setProperty(
        "--accent",
        cardColor.value
    );


    updateCardPhoto();

    updateQRCode();

    saveData();
}


/* Update QR code */

function updateQRCode() {

    if (typeof QRCode === "undefined") {
        return;
    }


    qrcode.innerHTML = "";


    const qrData = `
Name: ${nameInput.value || "Not provided"}
ID: ${idInput.value || "Not provided"}
Department: ${departmentInput.value || "Not provided"}
Designation: ${designationInput.value || "Not provided"}
Organization: ${organizationInput.value || "Not provided"}
Phone: ${phoneInput.value || "Not provided"}
DOB: ${formatDate(dobInput.value)}
Email: ${emailInput.value || "Not provided"}
Address: ${addressInput.value || "Not provided"}
`;


    new QRCode(qrcode, {

        text: qrData,

        width: 58,

        height: 58,

        colorDark: "#0f172a",

        colorLight: "#ffffff",

        correctLevel:
            QRCode.CorrectLevel.M

    });
}


/* Update card photo */

function updateCardPhoto() {

    if (photoData) {

        cardPhoto.src = photoData;

        cardPhoto.style.display =
            "block";

        cardPhotoPlaceholder.style.display =
            "none";

    } else {

        cardPhoto.removeAttribute("src");

        cardPhoto.style.display =
            "none";

        cardPhotoPlaceholder.style.display =
            "block";
    }
}


/* Update upload preview */

function updatePhotoPreview() {

    if (photoData) {

        uploadedPhoto.src = photoData;

        uploadedPhoto.style.display =
            "block";

        photoPlaceholder.style.display =
            "none";

    } else {

        uploadedPhoto.removeAttribute("src");

        uploadedPhoto.style.display =
            "none";

        photoPlaceholder.style.display =
            "block";
    }
}


/* Template buttons */

document
    .querySelectorAll(".template-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setTemplate(
                    button.dataset.template
                );

                updateCard();

            }
        );

    });


/* Custom accent color */

cardColor.addEventListener(
    "input",
    () => {

        card.style.setProperty(
            "--accent",
            cardColor.value
        );

        updateCard();

    }
);


/* Photo upload */

photoInput.addEventListener(
    "change",
    () => {

        const file =
            photoInput.files[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            showMessage(
                "Please select a valid image.",
                true
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                photoData =
                    event.target.result;

                updatePhotoPreview();

                updateCard();

                showMessage(
                    "Photo updated."
                );

            };


        reader.readAsDataURL(file);

    }
);


/* Remove photo */

removePhotoBtn.addEventListener(
    "click",
    () => {

        photoData = "";

        photoInput.value = "";

        updatePhotoPreview();

        updateCard();

        showMessage(
            "Photo removed."
        );

    }
);


/* Live form updates */

[
    nameInput,
    idInput,
    departmentInput,
    designationInput,
    organizationInput,
    phoneInput,
    dobInput,
    emailInput,
    addressInput
].forEach(input => {

    input.addEventListener(
        "input",
        updateCard
    );

});


/* Generate card */

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            nameInput.value.trim();

        const id =
            idInput.value.trim();

        const department =
            departmentInput.value.trim();

        const organization =
            organizationInput.value.trim();


        if (
            !name ||
            !id ||
            !department ||
            !organization
        ) {

            showMessage(
                "Please fill all required fields.",
                true
            );

            return;
        }


        updateCard();


        showMessage(
            "ID card generated successfully."
        );

    }
);


/* Display message */

function showMessage(
    text,
    error = false
) {

    message.textContent = text;

    message.style.color =
        error
            ? "var(--danger)"
            : "var(--success)";


    setTimeout(
        () => {

            message.textContent = "";

        },
        3000
    );
}


/* Reset */

resetBtn.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Reset all ID card details?"
            );


        if (!confirmed) {
            return;
        }


        form.reset();

        photoData = "";

        selectedTemplate = "blue";

        setTemplate("blue");

        updatePhotoPreview();

        updateCard();

        localStorage.removeItem(
            "idCardData"
        );

        showMessage(
            "Card reset successfully."
        );

    }
);


/* Theme */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );


        const lightMode =
            document.body.classList.contains(
                "light-mode"
            );


        themeBtn.textContent =
            lightMode
                ? "☾"
                : "☀";


        saveData();

    }
);


/* Download PNG */

downloadBtn.addEventListener(
    "click",
    async () => {

        if (
            typeof html2canvas ===
            "undefined"
        ) {

            showMessage(
                "Download library is not available.",
                true
            );

            return;
        }


        try {

            showMessage(
                "Preparing PNG..."
            );


            const canvas =
                await html2canvas(
                    card,
                    {
                        scale: 3,

                        useCORS: true,

                        backgroundColor:
                            "#ffffff",

                        logging: false
                    }
                );


            const link =
                document.createElement("a");


            const name =
                nameInput.value.trim() ||
                "id-card";


            link.download =
                `${name.replace(
                    /\s+/g,
                    "-"
                )}-id-card.png`;


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            link.click();


            showMessage(
                "ID card downloaded successfully."
            );


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to download the card.",
                true
            );

        }

    }
);


/* Print card */

printBtn.addEventListener(
    "click",
    () => {

        const printWindow =
            window.open(
                "",
                "_blank"
            );


        if (!printWindow) {

            showMessage(
                "Please allow pop-ups to print.",
                true
            );

            return;
        }


        const accentColor =
            cardColor.value ||
            "#2563EB";


        const cardHTML =
            card.outerHTML.replace(
                '<div id="idCard"',
                `<div id="idCard" style="--accent: ${accentColor};"`
            );


        printWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>ID Card</title>


                <style>

                    @page {
                        size: auto;
                        margin: 15mm;
                    }


                    * {
                        box-sizing: border-box;
                    }


                    body {

                        margin: 0;

                        min-height: 100vh;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        background: white;

                    }


                    .id-card {

                        position: relative;

                        width: 560px;

                        height: 354px;

                        overflow: hidden;

                        background: #ffffff;

                        color: #0f172a;

                        border-radius: 12px;

                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;

                        --accent:
                            ${accentColor};

                        box-shadow: none;

                    }


                    .card-header {

                        height: 65px;

                        padding: 10px 17px;

                        display: flex;

                        align-items: center;

                        justify-content:
                            space-between;

                        border-bottom:
                            3px solid
                            var(--accent);

                    }


                    .organization-block {

                        min-width: 0;

                        display: flex;

                        align-items: center;

                        gap: 10px;

                    }


                    .org-logo {

                        width: 36px;

                        height: 36px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        background:
                            var(--accent);

                        color: white;

                        border-radius: 7px;

                        font-size: 12px;

                        font-weight: bold;

                    }


                    .organization-name {

                        max-width: 350px;

                        overflow: hidden;

                        white-space: nowrap;

                        text-overflow: ellipsis;

                        font-size: 16px;

                        font-weight: bold;

                    }


                    .organization-subtitle {

                        margin-top: 2px;

                        color: #64748b;

                        font-size: 7px;

                        letter-spacing: 1.5px;

                    }


                    .card-title {

                        color: var(--accent);

                        font-size: 13px;

                        font-weight: bold;

                        letter-spacing: 1px;

                    }


                    .card-main {

                        height: 151px;

                        display: grid;

                        grid-template-columns:
                            90px 1fr 72px;

                        gap: 16px;

                        padding: 12px 17px;

                    }


                    .photo-box {

                        width: 90px;

                        height: 108px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        overflow: hidden;

                        background: #f1f5f9;

                        border:
                            2px solid
                            #cbd5e1;

                        border-radius: 7px;

                    }


                    .photo-box img {

                        width: 100%;

                        height: 100%;

                        object-fit: cover;

                    }


                    .person-details {

                        min-width: 0;

                    }


                    .person-details h2 {

                        max-width: 285px;

                        overflow: hidden;

                        white-space: nowrap;

                        text-overflow: ellipsis;

                        font-size: 20px;

                        line-height: 1.1;

                    }


                    .designation {

                        margin: 4px 0 10px;

                        color: var(--accent);

                        font-size: 10px;

                        font-weight: bold;

                    }


                    .detail-line {

                        display: grid;

                        grid-template-columns:
                            82px 1fr;

                        gap: 5px;

                        margin-bottom: 6px;

                        font-size: 8px;

                    }


                    .detail-line span {

                        color: #64748b;

                    }


                    .detail-line strong {

                        overflow: hidden;

                        white-space: nowrap;

                        text-overflow: ellipsis;

                    }


                    .qr-section {

                        display: flex;

                        flex-direction: column;

                        align-items: center;

                        gap: 4px;

                    }


                    .qr-code {

                        width: 64px;

                        height: 64px;

                        padding: 3px;

                        display: flex;

                        align-items: center;

                        justify-content: center;

                        background: white;

                        border:
                            1px solid
                            #e2e8f0;

                        border-radius: 4px;

                    }


                    .qr-code img {

                        width: 100% !important;

                        height: 100% !important;

                    }


                    .qr-section span {

                        color: #64748b;

                        font-size: 6px;

                        letter-spacing: 0.7px;

                    }


                    .contact-section {

                        height: 38px;

                        display: grid;

                        grid-template-columns:
                            1fr 1.4fr;

                        align-items: center;

                        gap: 15px;

                        padding: 0 17px;

                        border-top:
                            1px solid
                            #e2e8f0;

                    }


                    .contact-item {

                        min-width: 0;

                        display: flex;

                        align-items: center;

                        gap: 6px;

                        font-size: 8px;

                    }


                    .contact-icon {

                        color: var(--accent);

                        font-size: 10px;

                    }


                    .contact-item strong {

                        overflow: hidden;

                        white-space: nowrap;

                        text-overflow: ellipsis;

                    }


                    .address-section {

                        height: 32px;

                        display: flex;

                        align-items: center;

                        gap: 6px;

                        padding: 0 17px;

                        color: #64748b;

                        border-top:
                            1px solid
                            #e2e8f0;

                        font-size: 8px;

                    }


                    .address-section strong {

                        color: #0f172a;

                        overflow: hidden;

                        white-space: nowrap;

                        text-overflow: ellipsis;

                    }


                    .card-footer {

                        position: absolute;

                        bottom: 0;

                        left: 0;

                        width: 100%;

                        height: 43px;

                        padding: 0 17px;

                        display: flex;

                        align-items: center;

                        justify-content:
                            space-between;

                        background:
                            var(--accent);

                        color: white;

                        font-size: 8px;

                        letter-spacing: 1px;

                    }


                    .card-footer strong {

                        font-size: 10px;

                    }


                    @media print {

                        body {

                            min-height: auto;

                        }


                        .id-card {

                            print-color-adjust:
                                exact;

                            -webkit-print-color-adjust:
                                exact;

                        }

                    }

                </style>

            </head>


            <body>

                ${cardHTML}


                <script>

                    window.onload = function() {

                        setTimeout(
                            function() {
                                window.print();
                            },
                            300
                        );

                    };

                <\/script>

            </body>

            </html>

        `);


        printWindow.document.close();

    }
);


/* Save card data */

function saveData() {

    const data = {

        name:
            nameInput.value,

        idNumber:
            idInput.value,

        department:
            departmentInput.value,

        designation:
            designationInput.value,

        organization:
            organizationInput.value,

        phone:
            phoneInput.value,

        dob:
            dobInput.value,

        email:
            emailInput.value,

        address:
            addressInput.value,

        template:
            selectedTemplate,

        color:
            cardColor.value,

        photo:
            photoData,

        darkMode:
            !document.body.classList.contains(
                "light-mode"
            )

    };


    localStorage.setItem(
        "idCardData",
        JSON.stringify(data)
    );
}


/* Load saved card data */

function loadData() {

    const saved =
        localStorage.getItem(
            "idCardData"
        );


    if (!saved) {

        setTemplate("blue");

        updateCard();

        return;
    }


    try {

        const data =
            JSON.parse(saved);


        nameInput.value =
            data.name || "";

        idInput.value =
            data.idNumber || "";

        departmentInput.value =
            data.department || "";

        designationInput.value =
            data.designation || "";

        organizationInput.value =
            data.organization || "";

        phoneInput.value =
            data.phone || "";

        dobInput.value =
            data.dob || "";

        emailInput.value =
            data.email || "";

        addressInput.value =
            data.address || "";


        photoData =
            data.photo || "";


        selectedTemplate =
            data.template || "blue";


        setTemplate(
            selectedTemplate
        );


        if (data.color) {

            cardColor.value =
                data.color;

            card.style.setProperty(
                "--accent",
                data.color
            );

        }


        if (data.darkMode === false) {

            document.body.classList.add(
                "light-mode"
            );

            themeBtn.textContent =
                "☾";

        }


        updatePhotoPreview();

        updateCard();


    } catch (error) {

        console.error(
            "Unable to load saved data.",
            error
        );

        setTemplate("blue");

        updateCard();

    }
}


/* Start application */

loadData();