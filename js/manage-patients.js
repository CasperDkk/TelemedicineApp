document.addEventListener("DOMContentLoaded", function () {
    const patientsTable = document.getElementById("patientsTable").getElementsByTagName('tbody')[0];

    // Fetch and display patients
    async function fetchPatients() {
        const response = await fetch('/admin/patients');
        const patients = await response.json();
        
        // Clear existing rows
        patientsTable.innerHTML = '';

        // Populate table with patients
        patients.forEach(patient => {
            const row = patientsTable.insertRow();
            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.first_name}</td>
                <td>${patient.last_name}</td>
                <td>${patient.email}</td>
                <td>${patient.phone}</td>
                <td><button onclick="deletePatient(${patient.id})">Delete</button></td>`;
        });
    }

    // Filter patients based on search input
    window.filterPatients = () => {
        const searchInput = document.getElementById("searchInput").value.toLowerCase();
        const rows = patientsTable.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {
            const firstName = rows[i].cells[1]?.textContent.toLowerCase() || "";
            const lastName = rows[i].cells[2]?.textContent.toLowerCase() || "";
            if (firstName.includes(searchInput) || lastName.includes(searchInput)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    };

    // Delete patient
    window.deletePatient = async (id) => {
        if (confirm('Are you sure you want to delete this patient?')) {
            const response = await fetch(`/patients/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Patient deleted successfully!');
                fetchPatients(); // Refresh the list
            } else {
                alert('Error deleting patient.');
            }
        }
    };

    fetchPatients(); // Initial load of patients
});