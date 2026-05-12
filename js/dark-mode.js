document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.documentElement.classList.add("dark-mode");
  }

  setupDarkModeToggle();
});

function setupDarkModeToggle() {
  const darkModeToggle = document.getElementById("darkModeToggle");

  if (!darkModeToggle) return;

  darkModeToggle.checked = localStorage.getItem("darkMode") === "enabled";

  darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
}
