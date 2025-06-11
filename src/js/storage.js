// Get favorite animes from localStorage or empty array if none
export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Add an anime to favorites in localStorage
export function saveFavorite(anime) {
  const current = getFavorites();
  anime.id = Number(anime.id);
  const exists = current.find((fav) => fav.id === anime.id);

  if (exists) {
    alert("Already in favorites!");
    return;
  }

  const updated = [...current, anime];
  localStorage.setItem("favorites", JSON.stringify(updated));
}

// Remove an anime from favorites by id
export function removeFavorite(id) {
  const current = getFavorites();
  const updated = current.filter((anime) => anime.id !== Number(id));
  localStorage.setItem("favorites", JSON.stringify(updated));
}

// Check if an anime is already favorite by id
export function isFavorite(id) {
  const current = getFavorites();
  return current.some((anime) => anime.id === Number(id));
}
