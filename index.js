const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'password',
    database: 'reverse_ip_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Create table if not exists
db.query(`CREATE TABLE IF NOT EXISTS ip_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(255) NOT NULL
)`, (err, result) => {
    if (err) throw err;
    console.log('Table created or already exists');
});

app.get('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const reversedIp = ip.split('.').reverse().join('.');
    
    // Insert reversed IP into MySQL
    db.query('INSERT INTO ip_addresses (ip_address) VALUES (?)', [reversedIp], (err, result) => {
        if (err) throw err;
        console.log('Reversed IP stored in database');
    });

    res.send(`Reversed IP: ${reversedIp}`);
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
