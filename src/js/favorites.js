import { loadHeaderFooter } from "./utils.js";
import { getFavorites, removeFavorite } from "./storage.js";
import { animeCardTemplate, expandedAnimeCardTemplate } from "./animeCards.js";

loadHeaderFooter();

// Show the list of favorite anime on the page
function renderFavorites() {
  const container = document.getElementById("favorites-list");
  const favorites = getFavorites();
  const title = document.getElementById("favorites-title");
  
  // Show an image if there are not favorites
  if (!favorites.length) {
    title.classList.add("hidden");
    container.innerHTML = `
      <div class="empty-favorites">
        <img src="../images/nofavorites.png" alt="No favorites yet" class="empty-fav-img" />
      </div>
    `;
    return;
  }

  // Show title only if favorites exist
  title.classList.remove("hidden");

  container.innerHTML = `
    <div class="anime-grid">
      ${favorites.map((anime) => animeCardTemplate(anime)).join("")}
    </div>
  `;

  // Create the cards with buttons using the expanded template
  container.innerHTML = `
    <div class="anime-grid">
      ${favorites.map((anime) => animeCardTemplate(anime)).join("")}
    </div>
  `;

const grid = container.querySelector(".anime-grid");
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".anime-card");
    if (!card) return;

    const id = Number(card.dataset.id);
    const anime = favorites.find((a) => a.id === id);
    const expanded = container.querySelector(".anime-card.expanded");

    if (expanded && expanded.dataset.id == id) {
      card.outerHTML = animeCardTemplate(anime);
      setTimeout(() => renderFavorites(), 0);
      return;
    }

    if (expanded) {
      const prevId = Number(expanded.dataset.id);
      const prevAnime = favorites.find((a) => a.id === prevId);
      expanded.outerHTML = animeCardTemplate(prevAnime);
    }

    card.outerHTML = expandedAnimeCardTemplate(anime, true);

    setTimeout(() => {
      const newCard = container.querySelector(`.anime-card[data-id="${id}"]`);
      const removeBtn = newCard.querySelector(".remove-btn");
      const detailsBtn = newCard.querySelector(".details-btn");

      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFavorite(id);
        alert(`Removed "${anime.title}" from favorites.`);
        renderFavorites();
      });

      detailsBtn.addEventListener("click", () => {
        window.location.href = `../details/index.html?id=${id}`;
      });
    }, 0);
  });
}

document.addEventListener("DOMContentLoaded", renderFavorites);