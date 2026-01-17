const FAVORITES_KEY = "favorites";

// Get favorites from localStorage
function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

// Save favorites
function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

// Toggle favorite
function toggleFavorite(toolId) {
  let favorites = getFavorites();

  if (favorites.includes(toolId)) {
    favorites = favorites.filter(id => id !== toolId);
  } else {
    favorites.push(toolId);
  }

  saveFavorites(favorites);
  updateFavoriteUI();
}

// Update star UI globally
function updateFavoriteUI() {
  const favorites = getFavorites();

  document.querySelectorAll(".tool-card").forEach(card => {
    const toolId = card.dataset.tool;
    const favBtn = card.querySelector(".fav-btn");

    if (!favBtn) return;

    if (favorites.includes(toolId)) {
      favBtn.textContent = "⭐";
      favBtn.classList.add("active");
    } else {
      favBtn.textContent = "☆";
      favBtn.classList.remove("active");
    }
  });
}

// Attach click handlers
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("fav-btn")) {
    const card = e.target.closest(".tool-card");
    toggleFavorite(card.dataset.tool);
  }
});

// Init on load
document.addEventListener("DOMContentLoaded", updateFavoriteUI);
