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
      
      //Executes fade-out if it's visible
      if (hint.classList.contains("fade-in")) {
        hint.classList.remove("fade-in");
        hint.classList.add("fade-out");
        hint.addEventListener("animationend", () => {
          hint.style.display = "none";
        }, { once: true });
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
