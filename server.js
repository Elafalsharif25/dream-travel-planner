const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post("/submit-contact", (req, res) => {
    console.log("Contact Form Data:");
    console.log(req.body);
    res.send("Contact form submitted successfully!");
});

app.post("/submit-trip", (req, res) => {
    console.log("Trip Request Data:");
    console.log(req.body);
    res.send("Trip request submitted successfully!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
