const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.redirect("/html/welcome.html");
});
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dream_travel_planner",
  port: 8889,
});

db.connect((err, result) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

function cleanInput(value) {
  return String(value || "").trim();
}

// Create Account
app.post("/create-account", (req, res) => {
  const firstName = cleanInput(req.body.firstName);
  const lastName = cleanInput(req.body.lastName);
  const email = cleanInput(req.body.email);
  const mobile = cleanInput(req.body.mobile);
  const password = cleanInput(req.body.password);

  if (!firstName || !lastName || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters." });
  }

  const sql = `
    INSERT INTO users (first_name, last_name, email, mobile, password)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [firstName, lastName, email, mobile, password], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already exists." });
      }
      return res.status(500).json({ message: "Error creating account." });
    }

    res.status(200).json({ message: "Account created successfully." });
  });
});

// Login
app.post("/login", (req, res) => {
  const email = cleanInput(req.body.email);
  const password = cleanInput(req.body.password);

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const sql =
    "SELECT id, first_name, last_name, email, mobile FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Login failed." });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful.",
      user: results[0],
    });
  });
});

// Profile
app.get("/profile/:id", (req, res) => {
  const userId = req.params.id;

  const userSql =
    "SELECT id, first_name, last_name, email, mobile FROM users WHERE id = ?";
  const tripsSql =
    "SELECT * FROM trip_requests WHERE user_id = ? ORDER BY created_at DESC";

  db.query(userSql, [userId], (err, userResults) => {
    if (err || userResults.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    db.query(tripsSql, [userId], (tripErr, tripResults) => {
      if (tripErr) {
        return res.status(500).json({ message: "Error loading trips." });
      }

      res.status(200).json({
        user: userResults[0],
        trips: tripResults,
      });
    });
  });
});

// Contact form
app.post("/submit-contact", (req, res) => {
  const fullname =
    `${req.body["first-name"] || ""} ${req.body["last-name"] || ""}`.trim();
  const email = req.body.email;
  const message = req.body.message;

  const sql =
    "INSERT INTO contact_messages (fullname, email, message) VALUES (?, ?, ?)";

  db.query(sql, [fullname, email, message], (err) => {
    if (err) {
      res.status(500).send("Error saving contact form");
    } else {
      res.status(200).send("Contact form saved successfully");
    }
  });
});

// Trip request
app.post("/submit-trip", (req, res) => {
  const userId = req.body.user_id || null;
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
    (user_id, fullname, budget, travelers, days, travel_date, travel_type, hotel, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [userId, fullname, budget, travelers, days, date, traveltype, hotel, notes],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving trip request");
      } else {
        const query = new URLSearchParams({
          tripId: result.insertId || "",
          budget: budget || "",
          travelers: travelers || "",
          days: days || "",
          traveltype: traveltype || "",
          hotel: hotel || "",
        });

        res.redirect(`/html/trip-results.html?${query.toString()}`);
      }
    },
  );
});

app.delete("/delete-trip/:id", (req, res) => {
  const tripId = req.params.id;
  const userId = req.query.userId;

  if (!tripId || !userId) {
    return res.status(400).json({ message: "Trip ID and user ID are required." });
  }

  const sql = "DELETE FROM trip_requests WHERE id = ? AND user_id = ?";

  db.query(sql, [tripId, userId], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ message: "Error deleting trip from database." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Trip not found in database." });
    }

    res.status(200).json({ message: "Trip deleted from database successfully." });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
