document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registrationForm");
    const loginForm = document.getElementById("loginForm");
 
    // Registration Form Submission
    if (registrationForm) {
        registrationForm.addEventListener("submit", async function (e) {
            e.preventDefault(); // Prevent form submission
 
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
 
            // Send POST request to register user
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
 
            if (response.ok) {
                alert('Registration successful!');
                window.location.href = 'login.html'; // Redirect to login page
            } else {
                const errorData = await response.json();
                showError("usernameError", errorData.error);
            }
        });
    }
 
    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault(); // Prevent form submission
 
            const loginUsername = document.getElementById("loginUsername").value.trim();
            const loginPassword = document.getElementById("loginPassword").value.trim();
 
            // Send POST request to login user
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: loginUsername, password: loginPassword })
            });
 
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token); // Store JWT in local storage
                alert('Login successful!');
                window.location.href = 'dashboard.html'; // Redirect to dashboard page
            } else {
                const errorData = await response.json();
                showError("loginUsernameError", errorData.error);
            }
        });
    }
 
    // Function to display error messages
    function showError(fieldId, message) {
        document.getElementById(fieldId).innerText = message;
    }
 });