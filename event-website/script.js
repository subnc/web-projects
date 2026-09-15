const EVENT_DATE = new Date(
    "November 21, 2026 09:00:00"
).getTime();

const THEME_KEY = "nexoraTheme";
const REGISTRATION_KEY = "nexoraRegistration";

const themeBtn = document.getElementById("themeBtn");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

const registrationForm =
    document.getElementById("registrationForm");

const confirmationModal =
    document.getElementById("confirmationModal");

const closeModal =
    document.getElementById("closeModal");

const modalDoneBtn =
    document.getElementById("modalDoneBtn");

const registrationId =
    document.getElementById("registrationId");

const toast =
    document.getElementById("toast");


// Load saved theme

const savedTheme =
    localStorage.getItem(THEME_KEY);

if (savedTheme === "light") {

    document.body.classList.add("light");

    themeBtn.textContent = "☀";

}


// Theme switcher

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    themeBtn.textContent =
        isLight ? "☀" : "☾";

    localStorage.setItem(
        THEME_KEY,
        isLight ? "light" : "dark"
    );

});


// Mobile navigation

menuBtn.addEventListener("click", () => {

    const isOpen =
        navLinks.classList.toggle("active");

    menuBtn.setAttribute(
        "aria-expanded",
        isOpen
    );

    menuBtn.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation"
            : "Open navigation"
    );

    menuBtn.textContent =
        isOpen ? "×" : "☰";

});


// Close navigation after selecting a link

document.querySelectorAll(
    ".nav-links a"
).forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuBtn.setAttribute(
            "aria-expanded",
            "false"
        );

        menuBtn.setAttribute(
            "aria-label",
            "Open navigation"
        );

        menuBtn.textContent = "☰";

    });

});


// Countdown

function updateCountdown() {

    const now =
        new Date().getTime();

    const difference =
        EVENT_DATE - now;


    if (difference <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (difference /
            (1000 * 60 * 60)) % 24
        );

    const minutes =
        Math.floor(
            (difference /
            (1000 * 60)) % 60
        );

    const seconds =
        Math.floor(
            (difference / 1000) % 60
        );


    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(updateCountdown, 1000);


// Generate registration ID

function generateRegistrationId() {

    const number =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return `NX-${number}`;

}


// Show toast

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// Open confirmation modal

function openModal(id) {

    registrationId.textContent = id;

    confirmationModal.classList.add("show");

    confirmationModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


// Close confirmation modal

function closeConfirmationModal() {

    confirmationModal.classList.remove("show");

    confirmationModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


// Registration

registrationForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        // Prevent duplicate registration

        if (
            localStorage.getItem(
                REGISTRATION_KEY
            )
        ) {

            showToast(
                "You are already registered for NEXORA."
            );

            return;
        }


        const name =
            document.getElementById(
                "name"
            ).value.trim();

        const email =
            document.getElementById(
                "email"
            ).value.trim();

        const phone =
            document.getElementById(
                "phone"
            ).value.trim();

        const role =
            document.getElementById(
                "role"
            ).value;

        const message =
            document.getElementById(
                "message"
            ).value.trim();


        // Validate required fields

        if (
            name.length < 2 ||
            email === "" ||
            phone === "" ||
            role === ""
        ) {

            showToast(
                "Please complete all required fields."
            );

            return;
        }


        // Validate phone number

        const phonePattern =
            /^[0-9+\-\s]{10,15}$/;

        if (
            !phonePattern.test(phone)
        ) {

            showToast(
                "Please enter a valid phone number."
            );

            return;
        }


        const id =
            generateRegistrationId();


        const registration = {

            id: id,

            name: name,

            email: email,

            phone: phone,

            role: role,

            message: message,

            registeredAt:
                new Date().toISOString()

        };


        // Save registration

        localStorage.setItem(
            REGISTRATION_KEY,
            JSON.stringify(registration)
        );


        registrationForm.reset();

        openModal(id);

    }
);


// Close modal

closeModal.addEventListener(
    "click",
    closeConfirmationModal
);

modalDoneBtn.addEventListener(
    "click",
    closeConfirmationModal
);


// Close modal by clicking outside

confirmationModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            confirmationModal
        ) {

            closeConfirmationModal();

        }

    }
);


// Escape key

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeConfirmationModal();

            navLinks.classList.remove(
                "active"
            );

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            menuBtn.setAttribute(
                "aria-label",
                "Open navigation"
            );

            menuBtn.textContent = "☰";

        }

    }
);