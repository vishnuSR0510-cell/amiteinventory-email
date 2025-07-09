const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ DB Connection Failed:', err);
  } else {
    console.log('✅ Connected to MySQL');
    db.connect(err => {
  if (err) {
    console.error('❌ DB Connection Failed:', err);
  } else {
    console.log('✅ Connected to MySQL');

    // ✅ Auto-create the table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        type VARCHAR(50),
        regno VARCHAR(50),
        phone VARCHAR(15),
        email VARCHAR(100),
        queries TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("❌ Failed to create table:", err);
      } else {
        console.log("✅ enquiries table is ready (or already exists).");
      }
    });
  }
});

  }
});

// Mail setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Enquiry endpoint
app.post("/send-email", (req, res) => {
  console.log("📩 Received data:", req.body);

  const { name, type, regno, phone, email, queries } = req.body;

  // Save to DB
  const sql = `
    INSERT INTO enquiries (name, type, regno, phone, email, queries) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [name, type, regno, phone, email, queries];

  db.query(sql, values, async (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    // Mail to admin
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Enquiry from ${name}`,
      html: `
        <h2>New Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Reg No:</strong> ${regno}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Queries:</strong> ${queries}</p>
      `
    };

    // Thank-you mail to customer
    const customerMail = {
  from: process.env.EMAIL_USER,
  to: email || process.env.EMAIL_TO, // fallback if email is missing
  subject: "✅ Amite Invent-ory - Enquiry Received",
  html: `
    <h3>Dear ${name},</h3>
    <p>Thank you for reaching out to <strong>Amite Invent-ory</strong>.</p>
    <p>We’ve received your enquiry and will respond soon.</p>
    <p><strong>Your Query:</strong> ${queries}</p>
    <p>📞 Call us at <strong>+91 9176860553</strong> if urgent.</p>
    <p>Best regards,<br>Team Amite Invent-ory</p>
  `
};


    try {
      await transporter.sendMail(adminMail);
      await transporter.sendMail(customerMail);
      res.json({ success: true });
    } catch (mailErr) {
      console.error("❌ Email Error:", mailErr);
      res.status(500).json({ success: false, error: "Email failed" });
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
