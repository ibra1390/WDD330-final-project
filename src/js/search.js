import AnimeService from "./ExternalServices.mjs";

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

function displayResults(animeList, container) {
  container.innerHTML = animeList
    .map(
      (anime) => `
        <div class="anime-card">
          <a href="/details/index.html?id=${anime.mal_id}" class="anime-card-link">
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" />
            <h3>${anime.title}</h3>
          </a>
        </div>
      `
    )
    .join("");
}

export { initSearch };
