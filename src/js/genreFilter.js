import AnimeService from "./ExternalServices.mjs";
import { renderAnimeCards } from "./animeCards.js";

// Initialize the genre filter dropdown
function initGenreFilter() {
  const genreSelect = document.getElementById("genreSelect");
  const resultsContainer = document.getElementById("search-results");
  const hint = document.getElementById("search-hint");

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
    const genreName = genreSelect.options[genreSelect.selectedIndex].text;

    if (!genreId) return;

    //Executes fade-out if it's visible
    if (hint.classList.contains("fade-in")) {
      hint.classList.remove("fade-in");
      hint.classList.add("fade-out");
      hint.addEventListener("animationend", () => {
       hint.style.display = "none";
      }, { once: true });
    }

    try {
      const animeList = await AnimeService.searchAnimeByGenre(genreId);
      renderAnimeCards(
        resultsContainer,
        animeList,
        `Results for "${genreName}"`
      );
    } catch (err) {
      resultsContainer.innerHTML = `<p class="error">Error: ${err.message}</p>`;
    }
  });
}

export { initGenreFilter };
