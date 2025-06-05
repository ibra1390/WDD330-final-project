import AnimeService from "./ExternalServices.mjs";

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
      displayResults(animeList);
    } catch (err) {
      resultsContainer.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  });
}

function displayResults(animeList) {
  resultsContainer.innerHTML = animeList
    .map((anime) => {
      return `
        <div class="anime-card">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}" />
          <h3>${anime.title}</h3>
          <p>${anime.synopsis?.slice(0, 120) || "No description available"}...</p>
        </div>
      `;
    })
    .join("");
}
