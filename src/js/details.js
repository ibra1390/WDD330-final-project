import AnimeService from "./ExternalServices.mjs";
import { loadHeaderFooter } from "./utils.js";
import { loadSimilarAnimes } from "./similarAnimes.js";
import { setupFavoriteButton } from "./animeCards.js";
import { isFavorite } from "./storage.js";

loadHeaderFooter();

// Clean the synopsis text and remove MAL rewrite note
function cleanSynopsis(text) {
  if (!text) return "No synopsis available.";
  const cleaned = text.replace(/\s*\[Written by MAL Rewrite\]\s*$/, "").trim();
  return cleaned.length > 0 ? cleaned : "No synopsis available.";
}

// Render the anime details in the page
function renderAnimeDetails(anime) {
  const container = document.getElementById("anime-detail");
  const poster =
    anime.images?.jpg?.image_url ||
    "https://via.placeholder.com/225x320?text=No+Image";

  // Set HTML for anime detail card
  container.innerHTML = `
  <div class="anime-detail-card expanded" data-id="${anime.mal_id}">
    <img src="${poster}" alt="${anime.title}" class="anime-detail-img"/>
    <div class="anime-detail-info anime-details">
      <h2>${anime.title}</h2>
      <p><strong>🎬 Episodes:</strong> ${anime.episodes || "N/A"}</p>
      <p><strong>📺 Status:</strong> ${anime.status}</p>
      <p><strong>⭐ Score:</strong> ${anime.score || "N/A"}</p>
      <p><strong> Genres:</strong> ${anime.genres.map((g) => g.name).join(", ")}</p>
      <p><strong>Year:</strong> ${anime.aired?.prop?.from?.year || "Unknown"}</p>
      <p><strong>Synopsis:</strong> ${cleanSynopsis(anime.synopsis)}</p>
      <button class="favorite-btn">
        ${isFavorite(anime.mal_id) ? "✖ Remove from Favorites" : "🤍 Add to Favorites"}
      </button>
    </div>
  </div>
`;
  // Delegar lógica del botón a función reutilizable
  const card = container.querySelector(".anime-detail-card");
  setupFavoriteButton(container, anime, "🤍 Add to Favorites", "✖ Remove from Favorites");
}

// Load anime details based on id in URL
async function loadAnimeDetail() {
  const params = new URLSearchParams(window.location.search);
  const animeId = params.get("id");
  if (!animeId) return;

  try {
    const anime = await AnimeService.getAnimeById(animeId);
    renderAnimeDetails(anime);
    await loadSimilarAnimes(anime); // Load recommended similar animes
  } catch (error) {
    console.error("Error loading anime detail:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAnimeDetail);
