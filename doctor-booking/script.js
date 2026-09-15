const doctors = [
    {
        id: 1,
        name: "Dr. Arun Kumar",
        specialization: "Cardiologist",
        experience: "12 years",
        rating: "4.9",
        fee: "₹600",
        hospital: "City Heart Hospital",
        initials: "AK",
        available: true
    },
    {
        id: 2,
        name: "Dr. Meera Nair",
        specialization: "Dermatologist",
        experience: "9 years",
        rating: "4.8",
        fee: "₹500",
        hospital: "Skin Care Clinic",
        initials: "MN",
        available: true
    },
    {
        id: 3,
        name: "Dr. Rahul Menon",
        specialization: "Neurologist",
        experience: "15 years",
        rating: "4.9",
        fee: "₹800",
        hospital: "Neuro Care Centre",
        initials: "RM",
        available: false
    },
    {
        id: 4,
        name: "Dr. Anjali Thomas",
        specialization: "Pediatrician",
        experience: "8 years",
        rating: "4.7",
        fee: "₹450",
        hospital: "Children's Care Hospital",
        initials: "AT",
        available: true
    },
    {
        id: 5,
        name: "Dr. Vivek Raj",
        specialization: "Orthopedic",
        experience: "11 years",
        rating: "4.8",
        fee: "₹650",
        hospital: "Ortho Plus Hospital",
        initials: "VR",
        available: true
    },
    {
        id: 6,
        name: "Dr. Neha Joseph",
        specialization: "Dentist",
        experience: "7 years",
        rating: "4.8",
        fee: "₹400",
        hospital: "Bright Smile Dental Clinic",
        initials: "NJ",
        available: true
    },
    {
        id: 7,
        name: "Dr. Suresh Pillai",
        specialization: "Cardiologist",
        experience: "18 years",
        rating: "4.9",
        fee: "₹900",
        hospital: "Life Care Hospital",
        initials: "SP",
        available: false
    },
    {
        id: 8,
        name: "Dr. Priya Menon",
        specialization: "Dermatologist",
        experience: "10 years",
        rating: "4.8",
        fee: "₹550",
        hospital: "Derma Wellness Clinic",
        initials: "PM",
        available: true
    },
    {
        id: 9,
        name: "Dr. Akhil Thomas",
        specialization: "Orthopedic",
        experience: "13 years",
        rating: "4.7",
        fee: "₹600",
        hospital: "City Orthopedic Centre",
        initials: "AT",
        available: true
    }
];


const timeOptions = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM"
];


const doctorList = document.getElementById("doctorList");
const searchInput = document.getElementById("searchInput");
const specializationFilter =
    document.getElementById("specializationFilter");
const doctorCount = document.getElementById("doctorCount");
const noResults = document.getElementById("noResults");

const bookingModal = document.getElementById("bookingModal");
const successModal = document.getElementById("successModal");
const profileModal = document.getElementById("profileModal");
const appointmentsModal =
    document.getElementById("appointmentsModal");

const selectedDoctor =
    document.getElementById("selectedDoctor");

const profileDetails =
    document.getElementById("profileDetails");

const bookingForm =
    document.getElementById("bookingForm");

const bookingDetails =
    document.getElementById("bookingDetails");

const appointmentsList =
    document.getElementById("appointmentsList");

const appointmentDate =
    document.getElementById("appointmentDate");

const appointmentTime =
    document.getElementById("appointmentTime");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const closeProfileBtn =
    document.getElementById("closeProfileBtn");

const closeAppointmentsBtn =
    document.getElementById("closeAppointmentsBtn");

const doneBtn =
    document.getElementById("doneBtn");

const appointmentsBtn =
    document.getElementById("appointmentsBtn");

const themeBtn =
    document.getElementById("themeBtn");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");


let selectedDoctorId = null;


/* Display doctor cards */

function displayDoctors(list) {

    doctorList.innerHTML = "";

    doctorCount.textContent =
        `${list.length} doctor${list.length !== 1 ? "s" : ""}`;

    if (list.length === 0) {

        noResults.classList.remove("hidden");

        return;
    }

    noResults.classList.add("hidden");

    list.forEach(doctor => {

        const card =
            document.createElement("article");

        card.className = "doctor-card";

        card.innerHTML = `
            <div class="doctor-top">

                <div class="doctor-avatar">
                    ${doctor.initials}
                </div>

                <div class="doctor-info">
                    <h3>${doctor.name}</h3>

                    <p class="specialization">
                        ${doctor.specialization}
                    </p>
                </div>

            </div>


            <div class="doctor-details">

                <div class="detail">
                    <span>★</span>
                    <strong class="rating">
                        ${doctor.rating}
                    </strong>
                    <span>rating</span>
                </div>

                <div class="detail">
                    <span>◷</span>
                    <span>${doctor.experience} experience</span>
                </div>

                <div class="detail">
                    <span>⌂</span>
                    <span>${doctor.hospital}</span>
                </div>

                <div class="detail">
                    <span>₹</span>
                    <strong>${doctor.fee}</strong>
                    <span>consultation</span>
                </div>

            </div>


            <div class="availability ${
                doctor.available ? "available" : "busy"
            }">

                <span></span>

                ${
                    doctor.available
                        ? "Available"
                        : "Currently Busy"
                }

            </div>


            <div class="doctor-actions">

                <button
                    class="profile-btn"
                    onclick="openProfile(${doctor.id})"
                >
                    View Profile
                </button>

                <button
                    class="book-doctor-btn"
                    onclick="openBooking(${doctor.id})"
                    ${!doctor.available ? "disabled" : ""}
                >
                    ${
                        doctor.available
                            ? "Book Appointment"
                            : "Not Available"
                    }
                </button>

            </div>
        `;

        doctorList.appendChild(card);
    });
}


/* Filter doctors */

function filterDoctors() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const specialization =
        specializationFilter.value;

    const filteredDoctors =
        doctors.filter(doctor => {

            const matchesSearch =
                doctor.name.toLowerCase().includes(searchText) ||
                doctor.specialization
                    .toLowerCase()
                    .includes(searchText) ||
                doctor.hospital
                    .toLowerCase()
                    .includes(searchText);

            const matchesSpecialization =
                specialization === "all" ||
                doctor.specialization === specialization;

            return matchesSearch &&
                matchesSpecialization;
        });

    displayDoctors(filteredDoctors);
}


/* Open doctor profile */

function openProfile(doctorId) {

    const doctor =
        doctors.find(item => item.id === doctorId);

    if (!doctor) {
        return;
    }

    profileDetails.innerHTML = `
        <div class="profile-top">

            <div class="profile-avatar">
                ${doctor.initials}
            </div>

            <div>

                <h3>${doctor.name}</h3>

                <p>${doctor.specialization}</p>

                <div class="profile-rating">
                    ★ ${doctor.rating} Rating
                </div>

            </div>

        </div>


        <div class="profile-grid">

            <div class="profile-item">
                <span>Experience</span>
                <strong>${doctor.experience}</strong>
            </div>

            <div class="profile-item">
                <span>Consultation Fee</span>
                <strong>${doctor.fee}</strong>
            </div>

            <div class="profile-item">
                <span>Hospital / Clinic</span>
                <strong>${doctor.hospital}</strong>
            </div>

            <div class="profile-item">
                <span>Availability</span>

                <strong class="${
                    doctor.available
                        ? "profile-available"
                        : "profile-busy"
                }">

                    ${
                        doctor.available
                            ? "Available"
                            : "Currently Busy"
                    }

                </strong>
            </div>

        </div>


        <div class="profile-about">

            <h3>About the Doctor</h3>

            <p>
                ${doctor.name} is an experienced
                ${doctor.specialization.toLowerCase()}
                providing professional consultation and
                patient-focused care.
            </p>

        </div>


        <button
            class="book-btn"
            onclick="bookFromProfile(${doctor.id})"
            ${!doctor.available ? "disabled" : ""}
        >
            ${
                doctor.available
                    ? "Book Appointment"
                    : "Not Available"
            }
        </button>
    `;

    profileModal.classList.remove("hidden");
}


/* Book directly from profile */

function bookFromProfile(doctorId) {

    profileModal.classList.add("hidden");

    openBooking(doctorId);
}


/* Open booking modal */

function openBooking(doctorId) {

    const doctor =
        doctors.find(item => item.id === doctorId);

    if (!doctor || !doctor.available) {
        return;
    }

    selectedDoctorId = doctorId;

    selectedDoctor.innerHTML = `
        <div class="selected-avatar">
            ${doctor.initials}
        </div>

        <div>
            <h3>${doctor.name}</h3>

            <p>
                ${doctor.specialization} • ${doctor.hospital}
            </p>
        </div>
    `;

    bookingForm.reset();

    setMinimumDate();

    appointmentTime.innerHTML = `
        <option value="">Select time</option>
    `;

    bookingModal.classList.remove("hidden");
}


/* Set today's date as minimum */

function setMinimumDate() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    appointmentDate.min =
        `${year}-${month}-${day}`;
}


/* Update available time slots */

function updateTimeSlots() {

    const doctor =
        doctors.find(item => item.id === selectedDoctorId);

    const date =
        appointmentDate.value;

    if (!doctor || !date) {
        return;
    }

    const bookings =
        JSON.parse(
            localStorage.getItem("doctorBookings")
        ) || [];

    appointmentTime.innerHTML = `
        <option value="">
            Select available time
        </option>
    `;

    timeOptions.forEach(time => {

        const booked =
            bookings.some(booking =>
                booking.doctor === doctor.name &&
                booking.date === date &&
                booking.time === time
            );

        const option =
            document.createElement("option");

        option.textContent =
            booked
                ? `${time} — Booked`
                : time;

        if (booked) {

            option.disabled = true;
            option.value = "";

        } else {

            option.value = time;
        }

        appointmentTime.appendChild(option);
    });
}


/* Close booking modal */

function closeBooking() {

    bookingModal.classList.add("hidden");

    selectedDoctorId = null;
}


/* Format date */

function formatDate(date) {

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    };

    return new Date(date + "T00:00:00")
        .toLocaleDateString("en-IN", options);
}


/* Confirm appointment */

bookingForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const doctor =
            doctors.find(
                item => item.id === selectedDoctorId
            );

        if (!doctor) {
            return;
        }


        const patientName =
            document
                .getElementById("patientName")
                .value
                .trim();

        const patientPhone =
            document
                .getElementById("patientPhone")
                .value
                .trim();

        const date =
            appointmentDate.value;

        const time =
            appointmentTime.value;

        const reason =
            document
                .getElementById("reason")
                .value
                .trim();


        /* Validate phone number */

        const phonePattern =
            /^[0-9+\-\s]{10,15}$/;

        if (!phonePattern.test(patientPhone)) {

            showToast(
                "Invalid Phone Number",
                "Please enter a valid phone number."
            );

            return;
        }


        if (!date || !time) {

            showToast(
                "Incomplete Appointment",
                "Please select a date and available time."
            );

            return;
        }


        const bookings =
            JSON.parse(
                localStorage.getItem("doctorBookings")
            ) || [];


        /* Prevent duplicate bookings */

        const alreadyBooked =
            bookings.some(booking =>
                booking.doctor === doctor.name &&
                booking.date === date &&
                booking.time === time
            );


        if (alreadyBooked) {

            showToast(
                "Time Slot Unavailable",
                "Please choose another appointment time."
            );

            updateTimeSlots();

            return;
        }


        const booking = {

            id: "DB" + Date.now(),

            doctor: doctor.name,

            specialization:
                doctor.specialization,

            patientName:
                patientName,

            phone:
                patientPhone,

            date:
                date,

            time:
                time,

            reason:
                reason
        };


        saveBooking(booking);


        bookingDetails.innerHTML = `

            <div class="booking-detail">
                <span>Booking ID</span>
                <span>${booking.id}</span>
            </div>

            <div class="booking-detail">
                <span>Doctor</span>
                <span>${booking.doctor}</span>
            </div>

            <div class="booking-detail">
                <span>Specialization</span>
                <span>${booking.specialization}</span>
            </div>

            <div class="booking-detail">
                <span>Patient</span>
                <span>${booking.patientName}</span>
            </div>

            <div class="booking-detail">
                <span>Date</span>
                <span>${formatDate(booking.date)}</span>
            </div>

            <div class="booking-detail">
                <span>Time</span>
                <span>${booking.time}</span>
            </div>
        `;


        bookingModal.classList.add("hidden");

        successModal.classList.remove("hidden");
    }
);


/* Save appointment */

function saveBooking(booking) {

    const bookings =
        JSON.parse(
            localStorage.getItem("doctorBookings")
        ) || [];

    bookings.push(booking);

    localStorage.setItem(
        "doctorBookings",
        JSON.stringify(bookings)
    );
}


/* Display appointment history */

function displayAppointments() {

    const bookings =
        JSON.parse(
            localStorage.getItem("doctorBookings")
        ) || [];

    appointmentsList.innerHTML = "";


    if (bookings.length === 0) {

        appointmentsList.innerHTML = `

            <div class="empty-appointments">

                <div class="empty-appointments-icon">
                    ◷
                </div>

                <h3>No appointments yet</h3>

                <p>
                    Your booked appointments will appear here.
                </p>

            </div>
        `;

        return;
    }


    bookings
        .slice()
        .reverse()
        .forEach(booking => {

            const doctor =
                doctors.find(
                    item => item.name === booking.doctor
                );


            const card =
                document.createElement("div");

            card.className =
                "appointment-card";


            card.innerHTML = `

                <div class="appointment-card-top">

                    <div class="appointment-doctor">

                        <div class="appointment-avatar">
                            ${doctor ? doctor.initials : "DR"}
                        </div>

                        <div>

                            <h3>
                                ${booking.doctor}
                            </h3>

                            <p>
                                ${booking.specialization}
                            </p>

                        </div>

                    </div>


                    <span class="appointment-status">
                        Confirmed
                    </span>

                </div>


                <div class="appointment-info">

                    <div class="appointment-info-item">
                        <span>Patient</span>
                        <strong>
                            ${booking.patientName}
                        </strong>
                    </div>

                    <div class="appointment-info-item">
                        <span>Date</span>
                        <strong>
                            ${formatDate(booking.date)}
                        </strong>
                    </div>

                    <div class="appointment-info-item">
                        <span>Time</span>
                        <strong>
                            ${booking.time}
                        </strong>
                    </div>

                    <div class="appointment-info-item">
                        <span>Phone</span>
                        <strong>
                            ${booking.phone}
                        </strong>
                    </div>

                </div>


                <div class="appointment-bottom">

                    <div class="appointment-id">
                        Booking ID: ${booking.id}
                    </div>

                    <button
                        class="cancel-btn"
                        onclick="cancelAppointment('${booking.id}')"
                    >
                        Cancel
                    </button>

                </div>
            `;


            appointmentsList.appendChild(card);
        });
}


/* Cancel appointment */

function cancelAppointment(bookingId) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this appointment?"
        );

    if (!confirmCancel) {
        return;
    }


    let bookings =
        JSON.parse(
            localStorage.getItem("doctorBookings")
        ) || [];


    bookings =
        bookings.filter(
            booking => booking.id !== bookingId
        );


    localStorage.setItem(
        "doctorBookings",
        JSON.stringify(bookings)
    );


    displayAppointments();


    showToast(
        "Appointment Cancelled",
        "The appointment has been cancelled."
    );
}


/* Show notification */

function showToast(title, message) {

    toastTitle.textContent =
        title;

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


/* Close success modal */

doneBtn.addEventListener(
    "click",
    function() {

        successModal.classList.add("hidden");
    }
);


/* Close booking modal */

closeModalBtn.addEventListener(
    "click",
    closeBooking
);


/* Close profile modal */

closeProfileBtn.addEventListener(
    "click",
    function() {

        profileModal.classList.add("hidden");
    }
);


/* Close appointment history */

closeAppointmentsBtn.addEventListener(
    "click",
    function() {

        appointmentsModal.classList.add("hidden");
    }
);


/* Close modal when clicking outside */

bookingModal.addEventListener(
    "click",
    function(event) {

        if (event.target === bookingModal) {
            closeBooking();
        }
    }
);


profileModal.addEventListener(
    "click",
    function(event) {

        if (event.target === profileModal) {
            profileModal.classList.add("hidden");
        }
    }
);


successModal.addEventListener(
    "click",
    function(event) {

        if (event.target === successModal) {
            successModal.classList.add("hidden");
        }
    }
);


appointmentsModal.addEventListener(
    "click",
    function(event) {

        if (event.target === appointmentsModal) {
            appointmentsModal.classList.add("hidden");
        }
    }
);


/* Search and filter */

searchInput.addEventListener(
    "input",
    filterDoctors
);

specializationFilter.addEventListener(
    "change",
    filterDoctors
);


/* Update time slots when date changes */

appointmentDate.addEventListener(
    "change",
    updateTimeSlots
);


/* Open appointment history */

appointmentsBtn.addEventListener(
    "click",
    function() {

        displayAppointments();

        appointmentsModal.classList.remove("hidden");
    }
);


/* Theme */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "doctorBookingTheme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light-mode"
        );

        themeBtn.textContent = "🌙";

    } else {

        themeBtn.textContent = "☀️";
    }
}


function toggleTheme() {

    document.body.classList.toggle(
        "light-mode"
    );


    const isLight =
        document.body.classList.contains(
            "light-mode"
        );


    localStorage.setItem(
        "doctorBookingTheme",
        isLight ? "light" : "dark"
    );


    themeBtn.textContent =
        isLight ? "🌙" : "☀️";
}


themeBtn.addEventListener(
    "click",
    toggleTheme
);


/* Keyboard support */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeBooking();

            profileModal.classList.add("hidden");

            successModal.classList.add("hidden");

            appointmentsModal.classList.add("hidden");
        }
    }
);


/* Load page */

loadTheme();

displayDoctors(doctors);