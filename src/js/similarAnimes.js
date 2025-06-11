import AnimeService from "./ExternalServices.mjs";
import { renderAnimeCards } from "./animeCards.js";

function renderSimilarSection(animeList, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Use your existing displayResults function to render the cards
  renderAnimeCards(container, animeList);
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
      const genreResults = await AnimeService.searchAnimeByGenre(
        firstGenre.mal_id
      );
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
    const selected = uniqueResults.sort(() => 0.5 - Math.random()).slice(0, 6);

    renderSimilarSection(selected, "similar-animes");
  } catch (err) {
    console.error("Failed to load similar animes:", err);
  }
}