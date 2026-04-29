document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form");

    form.addEventListener("submit", function (event) {
        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const gender = document.getElementById("gender").value;
        const mobile = document.getElementById("mobile").value.trim();
        const dob = document.getElementById("dob").value;
        const email = document.getElementById("email").value.trim();
        const language = document.getElementById("language").value;
        const message = document.getElementById("message").value.trim();

        const namePattern = /^[A-Za-z\s]+$/;
        const mobilePattern = /^05[0-9]{8}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            firstName === "" ||
            lastName === "" ||
            gender === "" ||
            mobile === "" ||
            dob === "" ||
            email === "" ||
            language === "" ||
            message === ""
        ) {
            alert("Please fill in all required fields.");
            event.preventDefault();
            return;
        }

        if (!namePattern.test(firstName) || firstName.length < 2) {
            alert("First name must contain letters only and be at least 2 characters.");
            event.preventDefault();
            return;
        }

        if (!namePattern.test(lastName) || lastName.length < 2) {
            alert("Last name must contain letters only and be at least 2 characters.");
            event.preventDefault();
            return;
        }

        if (!mobilePattern.test(mobile)) {
            alert("Mobile number must start with 05 and contain exactly 10 digits.");
            event.preventDefault();
            return;
        }

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            event.preventDefault();
            return;
        }

        if (message.length < 10 || message.length > 500) {
            alert("Message must be between 10 and 500 characters.");
            event.preventDefault();
            return;
        }

        alert("Contact form submitted successfully!");
    });
});
