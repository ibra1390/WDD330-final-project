import { saveFavorite, removeFavorite, isFavorite } from "./storage.js";

// Simple card: image + title
export function animeCardTemplate(anime) {
  const poster =
    anime.images?.jpg?.image_url ||
    "https://via.placeholder.com/225x320?text=No+Image";

  return `
    <div class="anime-card" data-id="${anime.mal_id}">
      <img src="${poster}" alt="${anime.title}" />
      <h3>${anime.title}</h3>
    </div>
  `;
}

// Expanded card: shows buttons
export function expandedAnimeCardTemplate(anime, isFavView = false) {
  const poster =
    anime.images?.jpg?.image_url ||
    "https://via.placeholder.com/225x320?text=No+Image";

  // En la vista de favoritos el botón será "Remove", sino "Add" o "Remove" según estado
  const removeBtn = isFavView
    ? `<button class="remove-btn" data-id="${anime.id || anime.mal_id}">✖ Remove</button>`
    : `<button class="favorite-btn">${isFavorite(anime.mal_id) ? "✖ Remove" : "🤍 Add"}</button>`;

  return `
    <div class="anime-card expanded${isFavView ? " favorite" : ""}" data-id="${anime.id || anime.mal_id}">
      <img src="${poster}" alt="${anime.title}" />
      <div class="anime-details">
        <h3>${anime.title}</h3>
        ${removeBtn}
        <button class="details-btn">View Details</button>
      </div>
    </div>
  `;
}
// Render cards inside container
export function renderAnimeCards(container, animeList, sectionTitle = "") {
  if (!animeList?.length) {
    container.innerHTML = '<p class="error">No anime found.</p>';
    return;
  }

  container.innerHTML = `
    ${sectionTitle ? `<h2 class="section-title">${sectionTitle}</h2>` : ""}
    <div class="anime-grid">
      ${animeList.map((anime) => animeCardTemplate(anime)).join("")}
    </div>
  `;

  addAnimeCardListeners(container, animeList);
}

// Add click listeners to expand cards
function addAnimeCardListeners(container, animeList) {
  const grid = container.querySelector(".anime-grid");
  grid.replaceWith(grid.cloneNode(true)); // Reset events
  const newGrid = container.querySelector(".anime-grid");

  newGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".anime-card");
    if (!card) return;

    const animeId = Number(card.dataset.id);
    const anime = animeList.find((a) => a.mal_id === animeId);
    const expanded = container.querySelector(".anime-card.expanded");

    // Collapse if already expanded
    if (expanded && expanded.dataset.id == animeId) {
      card.outerHTML = animeCardTemplate(anime);
      setTimeout(() => addAnimeCardListeners(container, animeList), 0);
      return;
    }

    // Collapse previous expanded
    if (expanded) {
      const prevId = Number(expanded.dataset.id);
      const prevAnime = animeList.find((a) => a.mal_id === prevId);
      expanded.outerHTML = animeCardTemplate(prevAnime);
    }

    // Expand current
    card.outerHTML = expandedAnimeCardTemplate(anime);
    setTimeout(() => setupExpandedCard(anime), 0);
  });
}

// Setup favorite button
export function setupFavoriteButton(card, anime) {
  const favBtn = card.querySelector(".favorite-btn");
  if (!favBtn) return;

  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isFav = isFavorite(anime.mal_id);

    if (isFav) {
      removeFavorite(anime.mal_id);
      alert(`Removed "${anime.title}" from favorites.`);
    } else {
      saveFavorite({
        id: anime.mal_id,
        title: anime.title,
        images: anime.images,
        synopsis: anime.synopsis,
      });
      alert(`"${anime.title}" added to favorites!`);
    }

    // Update text button
    favBtn.textContent = isFavorite(anime.mal_id) ? "✖ Remove" : "🤍 Add";
  });
}

// Handle buttons in expanded card
function setupExpandedCard(anime) {
  const card = document.querySelector(`.anime-card[data-id="${anime.mal_id}"]`);
  const detailsBtn = card.querySelector(".details-btn");

  setupFavoriteButton(card, anime);

  detailsBtn.addEventListener("click", () => {
    window.location.href = `../details/index.html?id=${anime.mal_id}`;
  });
}

