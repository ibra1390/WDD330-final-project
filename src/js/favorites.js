import { getFavorites, removeFavorite } from "./storage.js";
import { loadHeaderFooter } from "./utils.js";

loadHeaderFooter();

// Renders the list of favorite anime from localStorage.
function renderFavorites() {
  const container = document.getElementById("favorites-list");
  const favorites = getFavorites();

  // If no favorites are found, display a message
  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites added yet.</p>";
    return;
  }

  // Generate anime cards with remove button
  const cards = favorites.map((anime) => {
    return `
      <div class="anime-card">
        <a href="../details/index.html?id=${anime.id}">
          <img src="${anime.image}" alt="${anime.title}" class="anime-img"/>
          <h3 class="anime-title">${anime.title}</h3>
        </a>
        <button class="remove-btn" data-id="${anime.id}">Remove</button>
      </div>
    `;
  });

  container.innerHTML = `
    <h2 class="section-title">Your Favorite Anime</h2>
    <div class="anime-grid">
      ${cards.join("")}
    </div>
  `;

  // Add event listeners to all remove buttons
  const removeButtons = container.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      removeFavorite(id);
      renderFavorites(); // Re-render the list to reflect changes
    });
  });
}

// When the page is fully loaded, render the favorites
document.addEventListener("DOMContentLoaded", renderFavorites);
