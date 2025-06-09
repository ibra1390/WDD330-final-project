import AnimeService from "./ExternalServices.mjs";
import { displayResults } from "./utils.js";

function renderSimilarSection(title, animeList, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Add a title for the similar section
  container.innerHTML = `<h3>${title}</h3>`;

  // Create a wrapper div for the anime cards with the same class que usas en displayResults
  const listContainer = document.createElement("div");
  listContainer.classList.add("anime-grid"); // same class you use for search results grid

  container.appendChild(listContainer);

  // Use your existing displayResults function to render the cards
  displayResults(animeList, listContainer);

  // Since your cards have links (<a>), no need to add extra click handlers here
}

export async function loadSimilarAnimes(anime) {
  const { title, genres, mal_id } = anime;
  const firstGenre = genres?.[0];

  try {
    const results = [];

    // Search by title
    const titleResults = await AnimeService.searchAnimeByTitle(title);
    results.push(...titleResults);

    // Search by first genre
    if (firstGenre) {
      const genreResults = await AnimeService.searchAnimeByGenre(firstGenre.mal_id);
      results.push(...genreResults);
    }

    // Remove duplicates by mal_id
    const uniqueMap = new Map();
    results.forEach((a) => {
      if (a.mal_id !== mal_id && !uniqueMap.has(a.mal_id)) {
        uniqueMap.set(a.mal_id, a);
      }
    });

    const uniqueResults = Array.from(uniqueMap.values());

    // Get a random subset, excluding the original anime
    const selected = uniqueResults
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    renderSimilarSection("Similar Animes", selected, "similar-animes");
  } catch (err) {
    console.error("Failed to load similar animes:", err);
  }
}
