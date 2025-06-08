import AnimeService from "./ExternalServices.mjs";
import { displayResults } from "./utils.js";

function initSearch() {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");

  if (searchForm && searchInput && resultsContainer) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;

      try {
        const animeList = await AnimeService.searchAnimeByTitle(query);
        displayResults(animeList, resultsContainer);
      } catch (err) {
        resultsContainer.innerHTML = `<p class="error">Error: ${err.message}</p>`;
      }
    });
  }
}

export { initSearch };
