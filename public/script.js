// Get elements
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const container = document.querySelector(".container");
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const btn = document.querySelector(".btn");

// Check local storage for dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
  darkModeToggle.checked = true;
  enableDarkMode();
}

// Toggle dark mode
darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

// Enable dark mode
function enableDarkMode() {
  body.classList.add("dark-mode");
  container.classList.add("dark-mode");
  header.classList.add("dark-mode");
  footer.classList.add("dark-mode");
  btn.classList.add("dark-mode");
  localStorage.setItem("darkMode", "enabled");
}

// Disable dark mode
function disableDarkMode() {
  body.classList.remove("dark-mode");
  container.classList.remove("dark-mode");
  header.classList.remove("dark-mode");
  footer.classList.remove("dark-mode");
  btn.classList.remove("dark-mode");
  localStorage.setItem("darkMode", "disabled");
}
