import AnimeService from "./ExternalServices.mjs";

// Initialize the genre filter dropdown
function initGenreFilter() {
  const genreSelect = document.getElementById("genreSelect");
  const resultsContainer = document.getElementById("search-results");

  if (!genreSelect || !resultsContainer) return;

  // Load genres on page load
  AnimeService.fetchGenres()
    .then((genres) => {
      genres.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.mal_id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
      });
    })
    .catch((err) => {
      console.error("Failed to load genres:", err.message);
    });

  // Handle genre selection
  genreSelect.addEventListener("change", async () => {
    const genreId = genreSelect.value;
    if (!genreId) return;

    try {
      const animeList = await AnimeService.searchAnimeByGenre(genreId);
      displayResults(animeList, resultsContainer);
    } catch (err) {
      resultsContainer.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  });
}

// Reuse same display function as in search.js
function displayResults(animeList, container) {
  container.innerHTML = animeList
    .map(
      (anime) => `
        <div class="anime-card">
          <img src="${anime.images.jpg.image_url}" alt="${anime.title}" />
          <h3>${anime.title}</h3>
        </div>
      `
    )
    .join("");
}

export { initGenreFilter };
