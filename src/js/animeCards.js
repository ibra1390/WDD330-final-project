import { saveFavorite, removeFavorite, isFavorite } from "./storage.js";

// Simple card: image + title
export function animeCardTemplate(anime) {
  const poster = anime?.images?.jpg?.image_url || anime?.image || "https://via.placeholder.com/225x320?text=No+Image";

  return `
    <div class="anime-card" data-id="${anime.id || anime.mal_id}">
      <img src="${poster}" alt="${anime.title}" />
      <h3>${anime.title}</h3>
    </div>
  `;
}

// Expanded card: shows buttons
export function expandedAnimeCardTemplate(anime, isFavView = false) {
  const imageUrl = anime?.images?.jpg?.image_url || anime?.image || "https://via.placeholder.com/225x320?text=No+Image";
  const id = anime.id || anime.mal_id;

  const buttons = isFavView
    ? `<button class="remove-btn" data-id="${id}">✖ Remove</button>`
    : `<button class="favorite-btn">${isFavorite(id) ? "✖ Remove" : "🤍 Add"}</button>`;

  return `
    <div class="anime-card expanded${isFavView ? " favorite" : ""}" data-id="${id}">
      <img src="${imageUrl}" alt="${anime.title}">
      <div class="anime-details">
        <h3>${anime.title}</h3>
        ${buttons}
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
  grid.replaceWith(grid.cloneNode(true));
  const newGrid = container.querySelector(".anime-grid");

  newGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".anime-card");
    if (!card) return;

    const animeId = Number(card.dataset.id);
    const anime = animeList.find((a) => (a.mal_id || a.id) === animeId);
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
      const prevAnime = animeList.find((a) => (a.mal_id || a.id) === prevId);
      expanded.outerHTML = animeCardTemplate(prevAnime);
    }

    // Expand current
    card.outerHTML = expandedAnimeCardTemplate(anime);
    setTimeout(() => setupExpandedCard(anime), 0);
  });
}

// Setup favorite button
export function setupFavoriteButton(containerOrCard, anime, addText = "🤍 Add", removeText = "✖ Remove") {
  const favBtn = containerOrCard.querySelector(".favorite-btn");
  if (!favBtn) return;

  // Set initial button text based on favorite status
  const id = anime.id || anime.mal_id;
  favBtn.textContent = isFavorite(id) ? removeText : addText;

  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (isFavorite(id)) {
      removeFavorite(id);
      alert(`Removed "${anime.title}" from favorites.`);
    } else {
      saveFavorite({
        id: id,
        title: anime.title,
        image: anime?.images?.jpg?.image_url || anime.image || "",
      });
      alert(`"${anime.title}" added to favorites!`);
    }

    // Update button text after change
    favBtn.textContent = isFavorite(id) ? removeText : addText;
  });
}

// Handle buttons in expanded card
function setupExpandedCard(anime) {
  const card = document.querySelector(`.anime-card[data-id="${anime.id || anime.mal_id}"]`);
  setupFavoriteButton(card, anime);

  const detailsBtn = card.querySelector(".details-btn");
  detailsBtn?.addEventListener("click", () => {
    window.location.href = `../details/index.html?id=${anime.id || anime.mal_id}`;
  });
}

