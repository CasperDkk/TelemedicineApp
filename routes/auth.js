//auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
const pool = require('../db'); 
const { authorizeRoles } = require('./middleware')

// Registration route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const [result] = await pool.query('INSERT INTO Patients (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM Patients WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role || 'patient' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store user ID in session
        req.session.userId = user.id; 
        req.session.role = user.role; //store role

        res.json({ token }); // Send the token back to the client
    } catch (error) {
        res.status(500).json({ error: 'Error during login' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

//Protected Admin Routes

// Get all patients
router.get('/admin/patients', authorizeRoles(['admin']), async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const [rows] = await connection.query('SELECT * FROM Patients');
        res.json(rows); // Return the list of patients
    } catch (error) {
        res.status(500).json({ error: 'Error fetching patients.' });
    } finally {
        connection.release();
    }
});

// Delete Patient Account
router.delete('/patients/:id', async (req, res) => {
    const patientId = req.params.id;
    const connection = await pool.getConnection();

    try {
        await connection.query('DELETE FROM Patients WHERE id=?', [patientId]);
        res.json({ message: 'Patient deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting patient.' });
    } finally {
        connection.release();
    }
});


// Add Doctor 
router.post('/doctors', async (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
 
    try {
        await pool.query('INSERT INTO Doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, specialization, email, phone, schedule]);
        res.status(201).json({ message: 'Doctor added successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding doctor.' });
    }
 });
 
 // Get All Doctors (Admin only)
router.get('/admin/doctors', authorizeRoles(['admin']), async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const [rows] = await connection.query('SELECT * FROM Doctors');
        res.json(rows); // Return the list of doctors
    } catch (error) {
        res.status(500).json({ error: 'Error fetching doctors.' });
    } finally {
        connection.release();
    }
});
 
 // Update Doctor Info
 router.put('/doctors/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
 
    try {
        await pool.query('UPDATE Doctors SET first_name=?, last_name=?, specialization=?, email=?, phone=?, schedule=? WHERE id=?',
            [first_name, last_name, specialization, email, phone, schedule, id]);
        res.json({ message: 'Doctor updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating doctor.' });
    }
 });
 
 // Delete Doctor
 router.delete('/doctors/:id', async (req, res) => {
    const { id } = req.params;
 
    try {
        await pool.query('DELETE FROM Doctors WHERE id=?', [id]);
        res.json({ message: 'Doctor deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting doctor.' });
    }
 });


 // Get All Appointments (Admin only)
router.get('/admin/appointments', authorizeRoles(['admin']), async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query('SELECT * FROM Appointments');
        res.json(rows); // Return the list of appointments
    } catch (error) {
        res.status(500).json({ error: 'Error fetching appointments.' });
    } finally {
        connection.release();
    }
});

// Update Appointment Status (Reschedule)
router.put('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { appointment_date, appointment_time } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.query('UPDATE Appointments SET appointment_date=?, appointment_time=? WHERE id=?',
            [appointment_date, appointment_time, id]);
        res.json({ message: 'Appointment updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating appointment.' });
    } finally {
        connection.release();
    }
});

// Delete Appointment (Cancel)
router.delete('/appointments/:id', async (req, res) => {
    const { id } = req.params;

    const connection = await pool.getConnection();

    try {
        await connection.query('DELETE FROM Appointments WHERE id=?', [id]);
        res.json({ message: 'Appointment canceled successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error canceling appointment.' });
    } finally {
        connection.release();
    }
});

module.exports = router;