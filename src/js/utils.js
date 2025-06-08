export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

//Display footer and header
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

// Display Anime Cards
export function displayResults(animeList, container) {
  container.innerHTML = animeList
    .map(
      (anime) => `
        <div class="anime-card">
          <a href="/details/index.html?id=${anime.mal_id}" class="anime-card-link">
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-card-img" />
            <h3 class="anime-card-title">${anime.title}</h3>
          </a>
        </div>
      `
    )
    .join("");
}
