document.addEventListener("DOMContentLoaded", function () {
    const appointmentsTable = document.getElementById("appointmentsTable").getElementsByTagName('tbody')[0];

    // Fetch and display appointments
    async function fetchAppointments() {
        const response = await fetch('/admin/appointments');
        const appointments = await response.json();
        
        // Clear existing rows
        appointmentsTable.innerHTML = '';

        // Populate table with appointments
        appointments.forEach(appointment => {
            const row = appointmentsTable.insertRow();
            row.innerHTML = `
                <td>${appointment.id}</td>
                <td>${appointment.patient_id}</td> <!-- Replace with actual patient name if available -->
                <td>${appointment.doctor_id}</td> <!-- Replace with actual doctor name if available -->
                <td>${appointment.appointment_date}</td>
                <td>${appointment.appointment_time}</td>
                <td>${appointment.status}</td>
                <td>
                    <button onclick="updateAppointment(${appointment.id})">Update</button> 
                    <button onclick="cancelAppointment(${appointment.id})">Cancel</button>
                </td>`;
        });
    }

    // Update appointment status (to be implemented)
    window.updateAppointment = async (id) => {
        // Logic to update appointment goes here
        alert(`Update functionality for appointment ID ${id} not implemented yet.`);
    };

    // Cancel appointment
    window.cancelAppointment = async (id) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            const response = await fetch(`/appointments/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Appointment canceled successfully!');
                fetchAppointments(); // Refresh the list
            } else {
                alert('Error canceling appointment.');
            }
        }
    };

    fetchAppointments(); // Initial load of appointments
});