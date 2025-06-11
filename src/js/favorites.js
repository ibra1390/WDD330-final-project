import { loadHeaderFooter } from "./utils.js";
import { getFavorites, removeFavorite } from "./storage.js";
import { expandedAnimeCardTemplate } from "./animeCards.js";

loadHeaderFooter();

// Show the list of favorite anime on the page
function renderFavorites() {
  const container = document.getElementById("favorites-list");
  const favorites = getFavorites();

  
  // Show a message if there are not favorites
  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites added yet.</p>";
    return;
  }

  // Create the cards with buttons using the expanded template
  container.innerHTML = `
    <div class="anime-grid">
      ${favorites.map(anime => expandedAnimeCardTemplate(anime, true)).join("")}
    </div>
  `;

  // Add one click listener to the grid for handling buttons
  container.querySelector(".anime-grid").addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove-btn");
    if (removeBtn) {
      const id = removeBtn.dataset.id;
      const anime = favorites.find(a => a.id == id);
      if (!anime) return;

      // Remove anime from favorites
      removeFavorite(id);
      alert(`Removed "${anime.title}" from favorites.`);

      // Refresh the list after removal
      renderFavorites();
      return;
    }

    // Details button
    const detailsBtn = e.target.closest(".details-btn");
    if (detailsBtn) {
      const card = detailsBtn.closest(".anime-card");
      const id = card.dataset.id;
      window.location.href = `../details/index.html?id=${id}`;
      return;
    }
  });
}

document.addEventListener("DOMContentLoaded", renderFavorites);
