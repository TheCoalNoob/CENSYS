let selectedRole = "";

function selectRole(role) {
  selectedRole = role;
  document.getElementById("roleSelect").style.display = "none";
  document.getElementById("loginBox").classList.remove("hidden");

  document.getElementById("loginTitle").innerText =
    role === "firestation" ? "Fire Station Login" : "Barangay Login";
}

function login() {
  const u = document.getElementById("username").value.trim().toLowerCase();
  const p = document.getElementById("password").value.trim().toLowerCase();

  // FIRE STATION
  if (selectedRole === "firestation" && u === "firestation" && p === "firestation") {
    window.location.href = "firestation/dashboard.html";
    return;
  }

  // BARANGAYS
  const barangays = {
    kalunasan: "barangay/kalunasan.html",
    sannicolas: "barangay/san-nicolas.html",
    kalubihan: "barangay/kalubihan.html"
  };

  if (selectedRole === "barangay" && barangays[u] && u === p) {
    window.location.href = barangays[u];
    return;
  }

  document.getElementById("error").innerText = "Invalid credentials";
}
