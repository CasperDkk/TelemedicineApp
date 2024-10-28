// api.js

// Base URL for API requests
const BASE_URL = '/api';

// Function to log in a user
async function loginUser(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    return response;
}

// Function to register a new user
async function registerUser(fullName, email, password) {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
    });

    return response;
}

// Function to fetch user's appointments
async function getAppointments() {
    const response = await fetch(`${BASE_URL}/appointments`, { method: 'GET' });
    
    if (!response.ok) throw new Error('Failed to fetch appointments');
    
    return await response.json();
}

// Function to log out a user
async function logoutUser() {
    const response = await fetch(`${BASE_URL}/logout`, { method: 'POST' });
    
    return response;
}