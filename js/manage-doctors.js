document.addEventListener("DOMContentLoaded", function () {
    const doctorForm = document.getElementById("doctorForm");
    const doctorsTable = document.getElementById("doctorsTable").getElementsByTagName('tbody')[0];

    // Fetch and display doctors
    async function fetchDoctors() {
        const response = await fetch('/api/doctors');
        const doctors = await response.json();
        
        // Clear existing rows
        doctorsTable.innerHTML = '';

        // Populate table with doctors
        doctors.forEach(doctor => {
            const row = doctorsTable.insertRow();
            row.innerHTML = `
                <td>${doctor.id}</td>
                <td>${doctor.first_name} ${doctor.last_name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.email}</td>
                <td>${doctor.phone}</td>
                <td><button onclick="editDoctor(${doctor.id})">Edit</button> 
                    <button onclick="deleteDoctor(${doctor.id})">Delete</button></td>`;
        });
    }

    // Add or update doctor
    doctorForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(doctorForm);
        const data = Object.fromEntries(formData);

        const method = data.doctorId ? 'PUT' : 'POST'; // Determine if it's an update or add

        const response = await fetch(data.doctorId ? `/api/doctors/${data.doctorId}` : '/api/doctors', {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Doctor saved successfully!');
            fetchDoctors(); // Refresh the list
            doctorForm.reset(); // Reset form fields
        } else {
            alert('Error saving doctor.');
        }
    });

    // Edit doctor
    window.editDoctor = async (id) => {
        const response = await fetch(`/api/doctors/${id}`);
        const doctor = await response.json();
        
        document.getElementById("doctorId").value = doctor.id;
        document.getElementById("first_name").value = doctor.first_name;
        document.getElementById("last_name").value = doctor.last_name;
        document.getElementById("specialization").value = doctor.specialization;
        document.getElementById("email").value = doctor.email;
        document.getElementById("phone").value = doctor.phone;
        document.getElementById("schedule").value = doctor.schedule; // Assuming it's in JSON format
    };

    // Delete doctor
    window.deleteDoctor = async (id) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            const response = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Doctor deleted successfully!');
                fetchDoctors(); // Refresh the list
            } else {
                alert('Error deleting doctor.');
            }
        }
    };

    fetchDoctors(); // Initial load of doctors
});

