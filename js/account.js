document.addEventListener("DOMContentLoaded", () => {
  const createAccountForm = document.getElementById("createAccountForm");
  const loginForm = document.getElementById("loginForm");
  const profileInfo = document.getElementById("profileInfo");
  const userTrips = document.getElementById("userTrips");
  const logoutBtn = document.getElementById("logoutBtn");

  if (createAccountForm) {
    createAccountForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const mobile = document.getElementById("mobile").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const message = document.getElementById("accountMessage");
      const namePattern = /^[A-Za-z\s]+$/;

      if (!namePattern.test(firstName)) {
        message.textContent = "First name should contain letters only.";
        message.className = "form-message error-message";
        return;
      }

      if (!namePattern.test(lastName)) {
        message.textContent = "Last name should contain letters only.";
        message.className = "form-message error-message";
        return;
      }
      if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.className = "form-message error-message";
        return;
      }

      try {
        const response = await fetch("/create-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            mobile,
            password,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          message.textContent = "Account created successfully.";
          message.className = "form-message success-message";

          setTimeout(() => {
            window.location.href = "login.html";
          }, 1200);
        } else {
          message.textContent = data.message;
          message.className = "form-message error-message";
        }
      } catch (error) {
        message.textContent = "Something went wrong.";
        message.className = "form-message error-message";
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const message = document.getElementById("loginMessage");

      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("userId", data.user.id);
          window.location.href = "../index.html";
        } else {
          message.textContent = data.message;
          message.className = "form-message error-message";
        }
      } catch (error) {
        message.textContent = "Something went wrong.";
        message.className = "form-message error-message";
      }
    });
  }

  if (profileInfo) {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "login.html";
      return;
    }

    loadProfile(userId);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userId");
      window.location.href = "welcome.html";
    });
  }
});
async function loadProfile(userId) {
  const profileInfo = document.getElementById("profileInfo");
  const userTrips = document.getElementById("userTrips");

  try {
    const response = await fetch(`/profile/${userId}`);
    const data = await response.json();

    if (!data.user) {
      profileInfo.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    const user = data.user;
    const trips = data.trips || [];

    const totalTrips = document.getElementById("totalTrips");
    const favoriteHotel = document.getElementById("favoriteHotel");
    const favoriteType = document.getElementById("favoriteType");

    if (totalTrips) {
  const savedPlans = JSON.parse(localStorage.getItem("selectedPlans")) || [];
  totalTrips.textContent = savedPlans.length;
}

    if (favoriteHotel) {
      favoriteHotel.textContent =
        trips.length > 0 ? trips[0].hotel || "Not selected" : "Not selected";
    }

    if (favoriteType) {
      favoriteType.textContent =
        trips.length > 0
          ? trips[0].travel_type || "Not selected"
          : "Not selected";
    }

    profileInfo.innerHTML = `
  <div class="profile-top-row">

    <div class="profile-user-info">
      <h3>${user.first_name} ${user.last_name}</h3>

      <p><strong>Email:</strong> ${user.email}</p>

      <p><strong>Mobile:</strong> ${user.mobile}</p>
    </div>

    <div class="dark-toggle-container">

      <span class="toggle-label">Dark Mode</span>

      <label class="switch">

        <input type="checkbox" id="darkModeToggle">

        <span class="slider"></span>

      </label>

    </div>

  </div>
`;
    setupDarkModeToggle();
    if (userTrips) {
      userTrips.innerHTML = "";
    }
  } catch (error) {
    console.error(error);
    profileInfo.innerHTML = "<p>Error loading profile.</p>";
  }
}
const avatarUpload = document.getElementById("avatarUpload");
const profileAvatar = document.getElementById("profileAvatar");

if (avatarUpload && profileAvatar) {
  const savedAvatar = localStorage.getItem("profileAvatar");

  if (savedAvatar) {
    profileAvatar.src = savedAvatar;
  }

  avatarUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        profileAvatar.src = e.target.result;
        localStorage.setItem("profileAvatar", e.target.result);
      };

      reader.readAsDataURL(file);
    }
  });
}
const selectedPlanCard = document.getElementById("selectedPlanCard");
const editPlansBtn = document.getElementById("editPlansBtn");

let editMode = false;

function renderSelectedPlans() {
  if (!selectedPlanCard) return;

  const savedPlans = JSON.parse(localStorage.getItem("selectedPlans")) || [];

  const totalTrips = document.getElementById("totalTrips");

  if (totalTrips) {
    totalTrips.textContent = savedPlans.length;
  }
  const totalBudget = document.getElementById("totalBudget");

  if (totalBudget) {
    const budgetSum = savedPlans.reduce(
      (sum, plan) => sum + Number(plan.userBudget || 0),
      0,
    );

    totalBudget.textContent = `${budgetSum.toLocaleString()} SAR`;
  }

  if (savedPlans.length === 0) {
    selectedPlanCard.innerHTML = "<p>No selected travel plans yet.</p>";
    return;
  }

  selectedPlanCard.innerHTML = savedPlans
    .map(
      (plan, index) => `
      <article class="result-card">

        <img
          src="../images/${plan.image}"
          alt="${plan.country}"
          class="card-img"
        >

        <h3>${plan.country}</h3>

<p><strong>Travel Type:</strong> ${plan.types ? plan.types.join(", ") : plan.type}</p>
<p><strong>Suggested Duration:</strong> ${plan.minDays ? plan.minDays + "+ Days" : plan.duration}</p>
<p><strong>Estimated Budget:</strong> ${plan.minBudget ? "Starting from " + plan.minBudget + " SAR" : plan.budget}</p>     <p>${plan.description}</p>
<div class="plan-buttons">

  <a 
    href="plan-details.html?index=${index}" 
    class="plan-btn details-btn"
  >
    View Details
  </a>
        ${
          editMode
            ? `<button class="delete-plan-btn" data-index="${index}">
                Delete Plan
              </button>`
            : ""
        }
</div>
      </article>
    `,
    )
    .join("");

  document.querySelectorAll(".delete-plan-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const index = Number(button.dataset.index);
    const plans = JSON.parse(localStorage.getItem("selectedPlans")) || [];
    const plan = plans[index];
    const userId = localStorage.getItem("userId");

    if (!plan) return;

    const confirmDelete = confirm("Are you sure you want to delete this plan?");
    if (!confirmDelete) return;

    try {
      if (plan.id && userId) {
        const response = await fetch(`/delete-trip/${plan.id}?userId=${userId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Could not delete plan from database.");
          return;
        }
      }

      plans.splice(index, 1);
      localStorage.setItem("selectedPlans", JSON.stringify(plans));

      renderSelectedPlans();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the plan.");
    }
  });
});

}

if (editPlansBtn) {
  editPlansBtn.addEventListener("click", () => {

    const savedPlans =
      JSON.parse(localStorage.getItem("selectedPlans")) || [];

    if (savedPlans.length === 0) {
      alert("No plans available to edit.");
      return;
    }

    editMode = !editMode;

    editPlansBtn.textContent =
      editMode ? "Done Editing" : "Edit Plans";

    renderSelectedPlans();
  });
}

renderSelectedPlans();
