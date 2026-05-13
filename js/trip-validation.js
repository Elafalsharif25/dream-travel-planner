document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".trip-form");

  form.addEventListener("submit", function (event) {
    const fullname = document.getElementById("fullname").value.trim();

    const budgetValue = document.getElementById("budget").value.trim();
    const travelersValue = document.getElementById("travelers").value.trim();
    const daysValue = document.getElementById("days").value.trim();

    const budget = Number(budgetValue);
    const travelers = Number(travelersValue);
    const days = Number(daysValue);
    const date = document.getElementById("date").value;
    const traveltype = document.getElementById("traveltype").value;
    const hotel = document.getElementById("hotel").value;

    const namePattern = /^[A-Za-z\s]+$/;
    const today = new Date().toISOString().split("T")[0];

    if (
      fullname === "" ||
      budgetValue === "" ||
      travelersValue === "" ||
      daysValue === "" ||
      date === "" ||
      traveltype === "" ||
      hotel === ""
    ) {
      alert("Please fill in all required trip fields.");
      event.preventDefault();
      return;
    }
    if (isNaN(budget) || isNaN(travelers) || isNaN(days)) {
      alert("Budget, travelers, and days must be valid numbers.");
      event.preventDefault();
      return;
    }
    if (
      !namePattern.test(fullname) ||
      fullname.length < 3 ||
      fullname.length > 50
    ) {
      alert(
        "Full name must contain letters only and be between 3 and 50 characters.",
      );
      event.preventDefault();
      return;
    }

    if (budget < 1000 || budget > 50000) {
      alert("Budget must be between 1000 and 50000 SAR.");
      event.preventDefault();
      return;
    }
    if (!Number.isInteger(travelers) || !Number.isInteger(days)) {
      alert("Travelers and days must be whole numbers.");
      event.preventDefault();
      return;
    }
    if (travelers < 1 || travelers > 15) {
      alert("Number of travelers must be between 1 and 15.");
      event.preventDefault();
      return;
    }

    if (days < 1 || days > 30) {
      alert("Number of days must be between 1 and 30.");
      event.preventDefault();
      return;
    }

    if (date < today) {
      alert("Travel date cannot be in the past.");
      event.preventDefault();
      return;
    }

    alert("Trip request submitted successfully!");
  });
});
