// Load Appointments on Dashboard
async function loadAppointments() {
    try {
        const response = await fetch('/api/appointments'); // Ensure this endpoint is correct
        
        if (response.ok) {
            const appointments = await response.json();
            const appointmentsBody = document.getElementById('appointments-body');
            const noAppointmentsMessage = document.getElementById('no-appointments-message');

            if (appointments.length > 0) {
                noAppointmentsMessage.style.display = 'none'; // Hide message
                appointmentsBody.innerHTML = appointments.map(appointment => `
                    <tr>
                        <td>${new Date(appointment.date).toLocaleString()}</td> <!-- Format date here -->
                        <td>${appointment.doctorName}</td>
                        <td>${appointment.status}</td>
                    </tr>
                `).join('');
            } else {
                noAppointmentsMessage.style.display = 'block'; // Show message
                appointmentsBody.innerHTML = ''; // Clear table
            }
        } else {
            console.error('Failed to load appointments');
            document.getElementById('appointments-body').innerHTML = ''; // Clear table
            document.getElementById('no-appointments-message').style.display = 'block'; // Show error message
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        document.getElementById('appointments-body').innerHTML = ''; // Clear table
        document.getElementById('no-appointments-message').style.display = 'block'; // Show error message
    }
}