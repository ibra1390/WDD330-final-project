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

// Get data from localStorage by key (returns array or empty array)
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Save data to localStorage by key
export function postLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
