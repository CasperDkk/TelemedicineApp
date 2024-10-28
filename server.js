const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2/promise'); 
const bcrypt = require('bcryptjs');
const https = require('https');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection pool setup
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Session management using MySQLStore
const sessionStore = new MySQLStore({}, pool);

app.use(session({
    key: 'telemedicine_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // Session expiry set to 1hr
        secure: false, // Set to true if using HTTPS
        httpOnly: true // Helps mitigate against XSS attacks
    }
}));

// Initialize database and create tables if they don't exist
async function initDatabase() {
    const connection = await pool.getConnection();
    try {
        // Create the telemedhub db if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS telemedhub`);

        // Create tables in the telemedhub db
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                email VARCHAR(100) UNIQUE,
                password_hash VARCHAR(255),
                phone VARCHAR(15),
                date_of_birth DATE,
                gender ENUM('male', 'female', 'other'),
                address TEXT
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                specialization VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                phone VARCHAR(15),
                schedule JSON
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT,
                doctor_id INT,
                appointment_date DATE,
                appointment_time TIME,
                status ENUM('scheduled', 'completed', 'canceled'),
                FOREIGN KEY (patient_id) REFERENCES Patients(id),
                FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
            )
        `);
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Admin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE,
                password_hash VARCHAR(255),
                role ENUM('admin')
            )
        `);
        
        console.log("Database and tables created successfully.");
        
    } catch (error) {
        console.error("Error creating database or tables:", error);
    } finally {
        connection.release();
    }
}

// Function to insert sample data
async function insertSampleData() {
    const connection = await pool.getConnection();
    try {
        console.log("Inserting sample data...");

        // Sample patients
        const hashedPassword = await bcrypt.hash('password123', 10); // Sample password
        await connection.query('INSERT IGNORE INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
            ['Riccardo', 'Calafiori', 'r.cc@example.com', hashedPassword, '8974567890', '1990-01-01', 'male', '554 Forbidden Forest']);
        
        // Sample doctors
        await connection.query('INSERT IGNORE INTO Doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)', 
            ['Hermione', 'Granger', 'Cardiology', 'mudblood@example.com', '0987654321', JSON.stringify({ Monday: "9-5", Tuesday: "9-5" })]);
        
        // Sample admin
        const adminPasswordHash = await bcrypt.hash('adminpass', 10);
        await connection.query('INSERT IGNORE INTO Admin (username, password_hash, role) VALUES (?, ?, ?)', 
            ['admin', adminPasswordHash, 'admin']);
        
        console.log("Sample data inserted successfully.");
        
    } catch (error) {
        console.error("Error inserting sample data:", error);
    } finally {
        connection.release();
    }
}

// Call this function after initializing the database
initDatabase().then(() => {
    insertSampleData(); // Insert sample data after creating tables
}).then(() => {
    // Load SSL certificate
    const options = {
        key: fs.readFileSync('path/to/your/private-key.pem'), // Path to your private key .pem
        cert: fs.readFileSync('path/to/your/certificate.pem') // Path to your certificate .pem
    };

    // Create HTTPS server
    const server = https.createServer(options, app);

    // Start server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => console.error(err));