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

// Render the anime details in the page, including YouTube trailer if available
async function renderAnimeDetails(anime) {
  const container = document.getElementById("anime-detail");
  const poster =
    anime.images?.jpg?.image_url ||
    "https://via.placeholder.com/225x320?text=No+Image";

  // Try to fetch YouTube trailer with "official trailer" keyword
  let trailer = null;
  try {
    trailer = await AnimeService.fetchYouTubeTrailer(anime.title);
  } catch (error) {
    console.warn("Failed to load trailer:", error);
  }

  // Build trailer HTML or fallback message
  const trailerHtml = trailer
    ? `
    <div class="anime-trailer">
      <h3 class="trailer-title">🎥 Trailer</h3>
      <iframe
        src="https://www.youtube.com/embed/${trailer.id.videoId}"
        title="YouTube trailer"
        frameborder="0"
        allowfullscreen
      ></iframe>
      <p class="trailer-disclaimer">
        Note: Trailers may be fan-made or unofficial.
      </p>
    </div>
  `
    : `<p class="trailer-unavailable">No trailer available.</p>`;

  // Set HTML for anime detail card including trailer before favorite button
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

      ${trailerHtml}

      <button class="favorite-btn">
        ${isFavorite(anime.mal_id) ? "✖ Remove from Favorites" : "🤍 Add to Favorites"}
      </button>
    </div>
  </div>
  `;

  // Delegate favorite button logic to reusable function
  setupFavoriteButton(container, anime, "🤍 Add to Favorites", "✖ Remove from Favorites");
}

// Load anime details based on id in URL
async function loadAnimeDetail() {
  const params = new URLSearchParams(window.location.search);
  const animeId = params.get("id");
  if (!animeId) return;

  try {
    const anime = await AnimeService.getAnimeById(animeId);
    await renderAnimeDetails(anime);
    await loadSimilarAnimes(anime); // Load recommended similar animes
  } catch (error) {
    console.error("Error loading anime detail:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAnimeDetail);
