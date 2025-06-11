import { loadHeaderFooter } from "./utils.js";
import { initSearch } from "./search.js";
import { initGenreFilter } from "./genreFilter.js";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  initSearch();
  initGenreFilter();
});
