export function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}

export function saveFavorite(anime) {
  const current = getFavorites();
  const exists = current.find((fav) => fav.id === anime.id);
  if (exists) {
    alert('Already in favorites!');
    return;
  }
  const updated = [...current, anime];
  localStorage.setItem('favorites', JSON.stringify(updated));
  alert(`"${anime.title}" added to favorites!`);
}

export function removeFavorite(id) {
  const current = getFavorites();
  const updated = current.filter((anime) => anime.id !== Number(id)); //convert to number 
  localStorage.setItem('favorites', JSON.stringify(updated));
}

export function isFavorite(id) {
  const current = getFavorites();
  return current.some((anime) => anime.id === id);
}