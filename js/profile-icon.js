document.addEventListener("DOMContentLoaded", () => {
  const profileIcons = document.querySelectorAll(".profile-icon");

  const savedAvatar = localStorage.getItem("profileAvatar");

  if (savedAvatar) {
    profileIcons.forEach((icon) => {
      icon.src = savedAvatar;
    });
  }
});
