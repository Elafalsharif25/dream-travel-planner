const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dream_travel_planner",
  port: 8889
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Contact form
app.post("/submit-contact", (req, res) => {
  const fullname = req.body["first-name"] + " " + req.body["last-name"];
  const email = req.body.email;
  const message = req.body.message;

  const sql = "INSERT INTO contact_messages (fullname, email, message) VALUES (?, ?, ?)";

  db.query(sql, [fullname, email, message], (err, result) => {
    if (err) {
      console.error(err);
      res.send("Error saving contact form");
    } else {
      res.send("Contact form submitted successfully!");
    }
  });
});
// Trip request
app.post("/submit-trip", (req, res) => {
  const { fullname, budget, travelers, days, date, traveltype, hotel, notes } = req.body;

  const sql = `
    INSERT INTO trip_requests 
    (fullname, budget, travelers, days, travel_date, travel_type, hotel, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [fullname, budget, travelers, days, date, traveltype, hotel, notes], (err, result) => {
    if (err) {
      console.error(err);
      res.send("Error saving trip request");
    } else {
      res.send("Trip request submitted successfully!");
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});