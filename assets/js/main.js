const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
  if (themeToggle) themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

// Toggle theme - Wrapped in a check
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
}

// --- NEW: HAMBURGER MENU TOGGLE ---
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    // Optional: Add a class to the hamburger itself for "X" animation
    hamburger.classList.toggle("open");
  });

  // Close menu when a link is clicked (useful for one-page sites)
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
  });
}
// ----------------------------------

// Filter + Search Logic (Unified)
let activeCategory = "all";
const searchInput = document.getElementById("toolSearch");
const filterButtons = document.querySelectorAll(".tool-filters button");

// Only run filter logic if buttons exist
if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.filter;
      applyFilters();
    });
  });
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

function applyFilters() {
  const query = searchInput ? searchInput.value.toLowerCase() : "";
  const cards = document.querySelectorAll(".tool-card");

  if (cards.length > 0) {
    cards.forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const desc = card.querySelector("p").textContent.toLowerCase();
      const tags = card.dataset.tags ? card.dataset.tags.toLowerCase() : "";
      const category = card.dataset.category;

      const matchesSearch = title.includes(query) || desc.includes(query) || tags.includes(query);
      const matchesCategory = activeCategory === "all" || category === activeCategory;

      card.style.display = matchesSearch && matchesCategory ? "flex" : "none";
    });
  }
}

// BACK TO TOP BUTTON
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  };

  backToTopBtn.onclick = function() {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
}

// COOKIE CONSENT
document.addEventListener("DOMContentLoaded", function () {
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("acceptCookies");

  // Only run if both elements exist
  if (cookieBanner && acceptBtn) {
    if (!localStorage.getItem("cookieAccepted")) {
      setTimeout(() => {
        cookieBanner.classList.add("show");
      }, 2000);
    }

    acceptBtn.addEventListener("click", () => {
      cookieBanner.classList.remove("show");
      localStorage.setItem("cookieAccepted", "true");
    });
  }
});