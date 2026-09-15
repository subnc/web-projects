# Doctor Booking

A professional frontend doctor appointment booking application built using HTML, CSS, and JavaScript.

The application allows users to search for doctors, filter doctors by specialization, view doctor profiles, select available appointment slots, book appointments, view booking history, and cancel appointments.

---

## Features

### Doctor Search
- Search doctors by name
- Search by specialization
- Search by hospital or clinic
- Real-time search results

### Specialization Filter
Users can filter doctors by:

- Cardiologist
- Dermatologist
- Neurologist
- Pediatrician
- Orthopedic
- Dentist

### Doctor Profiles
Each doctor includes:

- Doctor name
- Specialization
- Experience
- Rating
- Consultation fee
- Hospital or clinic
- Availability status
- Doctor information modal

### Appointment Booking
Users can:

- Select a doctor
- Enter patient name
- Select appointment date
- Select appointment time
- Enter phone number
- Add reason for visit
- Confirm the appointment

### Appointment Time Slots
The application provides predefined appointment slots.

Already booked slots are automatically displayed as:

`Booked`

and cannot be selected again.

### Duplicate Booking Protection
The application prevents multiple bookings for the same:

- Doctor
- Date
- Time

This provides basic appointment conflict protection.

### Appointment Confirmation
After successful booking, the application displays:

- Booking ID
- Doctor name
- Specialization
- Patient name
- Appointment date
- Appointment time

### Appointment History
Users can open **My Appointments** to view previously booked appointments.

Each appointment displays:

- Doctor
- Specialization
- Patient
- Date
- Time
- Phone number
- Booking ID
- Appointment status

### Cancel Appointment
Users can cancel an existing appointment.

Cancelled appointments are removed from Local Storage and their time slot becomes available again.

### Local Storage
The application uses browser Local Storage to store:

- Appointment data
- Selected theme

Appointments remain available after refreshing the browser.

### Dark and Light Mode
The application includes:

- Professional dark theme
- Professional light theme
- Persistent theme preference

### Toast Notifications
The application uses custom notifications for events such as:

- Invalid phone number
- Unavailable time slot
- Cancelled appointment
- Incomplete appointment information

### Responsive Design
The interface works across:

- Desktop
- Laptop
- Tablet
- Mobile devices

### Professional UI
The design includes:

- Blue and slate color system
- Modern cards
- Rounded components
- Hover effects
- Modal windows
- Responsive layouts
- Subtle shadows
- Professional typography

### Personal Signature
A subtle **Subin C** signature watermark is included at the bottom of the application.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- DOM Manipulation
- Local Storage
- Responsive Web Design

---

## Project Structure

```text
doctor-booking/
│
├── index.html
├── style.css
└── script.js