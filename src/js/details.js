import AnimeService from "./ExternalServices.mjs";
import { loadHeaderFooter } from "./utils.js";
import { saveFavorite, removeFavorite, isFavorite } from "./storage.js";
import { loadSimilarAnimes } from "./similarAnimes.js";

loadHeaderFooter();

function getAnimeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Cleaning "Written by MAL Rewrite" at the end of some sypnosis
function cleanSynopsis(text) {
  if (!text) return "No synopsis available.";
  const cleaned = text.replace(/\s*\[Written by MAL Rewrite\]\s*$/, "").trim();
  return cleaned.length > 0 ? cleaned : "No synopsis available.";
}

function renderAnimeDetails(anime) {
  const container = document.getElementById("anime-detail");

  // Extract genre names and join them into a comma-separated string
  const genres = anime.genres.map((genre) => genre.name).join(", ");
  // Get the airing year from the 'aired' object, fallback to 'Unknown' if missing
  const year = anime.aired?.prop?.from?.year || "Unknown";

  container.innerHTML = `
    <div class="anime-detail-card">
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-detail-img"/>
      <div class="anime-detail-info">
        <h2>${anime.title}</h2>
        <p><strong>Episodes:</strong> ${anime.episodes || "N/A"}</p>
        <p><strong>Status:</strong> ${anime.status}</p>
        <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
        <p><strong>Genres:</strong> ${genres}</p> <!-- Genre names from array -->
        <p><strong>Year:</strong> ${year}</p> <!-- Aired year (start year) -->
        <p><strong>Synopsis:</strong> ${cleanSynopsis(anime.synopsis)}</p>
        <button id="add-favorite-btn" class="favorite-btn">Add to Favorites</button>
      </div>
    </div>
  `;

   // Add button functionality 
  const favoriteBtn = document.getElementById("add-favorite-btn");
  const animeData = {
    id: anime.mal_id,
    title: anime.title,
    image: anime.images.jpg.image_url,
  };

  function updateButton() {
    if (isFavorite(animeData.id)) {
      favoriteBtn.textContent = "✓ Remove from Favorites";
      favoriteBtn.classList.add("favorited");
    } else {
      favoriteBtn.textContent = "☆ Add to Favorites";
      favoriteBtn.classList.remove("favorited");
    }
  }

  favoriteBtn.addEventListener("click", () => {
    if (isFavorite(animeData.id)) {
      removeFavorite(animeData.id);
    } else {
      saveFavorite(animeData);
    }
    updateButton(); // Display the correct button state
  });

  updateButton();
}

async function loadAnimeDetail() {
  const animeId = getAnimeIdFromUrl();
  if (!animeId) return;

  try {
    const anime = await AnimeService.getAnimeById(animeId);
    renderAnimeDetails(anime);
    await loadSimilarAnimes(anime);
  } catch (err) {
    console.error("Failed to fetch anime details:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadAnimeDetail);
