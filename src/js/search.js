import AnimeService from "./ExternalServices.mjs";
import { renderAnimeCards } from "./animeCards.js";

function initSearch() {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");
  const hint = document.getElementById("search-hint");

  if (searchForm && searchInput && resultsContainer) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (!query) return;
      
      //Hide hint-image 
      if (hint && !hint.classList.contains("hidden")) {
        hint.classList.add("hint-fade-out");
        setTimeout(() => hint.classList.add("hidden"), 500);
      }

      try {
        const animeList = await AnimeService.searchAnimeByTitle(query);
        renderAnimeCards(resultsContainer, animeList, `Results for "${query}"`);
      } catch (err) {
        resultsContainer.innerHTML = `<p class="error">Error: ${err.message}</p>`;
      }
    });
  }
}

export { initSearch };
