const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

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
  const fullname = `${req.body["first-name"] || ""} ${req.body["last-name"] || ""}`.trim();
  const email = req.body.email;
  const message = req.body.message;

  const sql = "INSERT INTO contact_messages (fullname, email, message) VALUES (?, ?, ?)";

  db.query(sql, [fullname, email, message], err => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving contact form");
    } else {
      res.status(200).send("Contact form saved successfully");
    }
  });
});

// Trip request
app.post("/submit-trip", (req, res) => {
  const fullname = req.body.fullname;
  const budget = req.body.budget;
  const travelers = req.body.travelers;
  const days = req.body.days;
  const date = req.body.date;
  const traveltype = req.body.traveltype;
  const hotel = req.body.hotel;
  const notes = req.body.notes;

  const sql = `
    INSERT INTO trip_requests 
    (fullname, budget, travelers, days, travel_date, travel_type, hotel, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [fullname, budget, travelers, days, date, traveltype, hotel, notes], err => {
    if (err) {
      console.error(err);
      res.status(500).send("Error saving trip request");
    } else {
      const query = new URLSearchParams({
        budget: budget || "",
        travelers: travelers || "",
        days: days || "",
        traveltype: traveltype || "",
        hotel: hotel || ""
      });

      res.redirect(`/html/trip-results.html?${query.toString()}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});