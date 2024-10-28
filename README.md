## TeleMed: A Comprehensive Telemedicine Platform
TeleMed is a robust telemedicine platform designed to connect patients with healthcare providers virtually, making healthcare services more accessible. With TeleMed, users can register, locate nearby health centers, book appointments with doctors, and consult healthcare professionals online. Built with a responsive HTML, CSS, and JavaScript frontend and a Node.js and MySQL backend, TeleMed offers a user-friendly experience with secure, efficient management of medical services.

## Key Features
### User Authentication and Role Management
Registration and Login: Secure registration and login system with role-based access control for patients and doctors.
Profile Management: Users can update their personal information and view appointment history.
### Location-Based Services
Health Center Locator: Integrated with Google Maps API to help users locate nearby health centers based on their current or specified location.
### Appointment Booking
Doctor Availability: Patients can view doctors' availability and book appointments directly on the platform.
Appointment Management: Users can schedule, reschedule, or cancel appointments and receive notifications.
### Doctor Management
Specialization and Availability: Doctors can manage their availability, specializations, and appointment slots.
Consultation Services: Enables virtual consultations through a secure communication channel.
### User-Friendly Interface
Responsive Design: The application adapts seamlessly across all devices.
Intuitive Navigation: Simple, intuitive navigation paths for booking appointments or managing profiles.
### Security and Compliance
Data Security: Utilizes HTTPS, JWT-based authentication, and data encryption to protect user information.
Compliance: Adheres to healthcare standards and regulations, ensuring confidentiality in handling user data.
## Project Setup and Requirements
### Prerequisites
Node.js and Express
MySQL database
Google Maps API key (for health center locator feature)
### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/CasperDkk/TelemedicineApp.git
   cd TelemedicineApp
2. **Install the necessary dependencies:**
   ```bash
   npm install
3. **Configure the .env file with your database credentials, Google Maps API key, and JWT secret.**
4. **Initialize the MySQL database and run the migrations:**
   ```bash
   node setupDatabase.js
5. **Start the application:**
   ```bash
   npm start
## Core Project Components
### User Management and Authentication

Secure registration and login with password hashing.
Session-based authentication and session management.
Patient Management

### CRUD operations for patient profiles.
Patient account management and appointment history.
Doctor Management

### CRUD operations for doctor profiles and availability.
Specialization and availability updates.
Appointment Booking

### Appointment scheduling, rescheduling, and cancellations.
Notifications for appointment status updates.
Location-Based Health Center Locator

### Integration with Google Maps API to locate nearby health centers.
### Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js, MySQL
- APIs: Google Maps API for health center location services
- Authentication: JWT for secure authentication
- Security: HTTPS and data encryption for secure data handling
