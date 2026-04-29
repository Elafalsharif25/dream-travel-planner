const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// =====================
// CONTACT FORM
// =====================
app.post("/submit-contact", (req, res) => {
    console.log("Contact Form Data:");
    console.log(req.body);

    res.send("Contact form submitted successfully!");
});

// =====================
// TRIP REQUEST FORM
// =====================
app.post("/submit-trip", (req, res) => {
    console.log("Trip Request Data:");
    console.log(req.body);

    res.send("Trip request submitted successfully!");
});

// =====================
// START SERVER
// =====================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
