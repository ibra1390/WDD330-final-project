const jikanBaseUrl = import.meta.env.VITE_JIKAN_BASE_URL;


async function convertToJson(res) {
  const json = await res.json();
  if (res.ok) {
    return json;
  } else {
    throw new Error(json.message || "API error");
  }
}

export default class AnimeService {
  static async searchAnimeByTitle(title) {
    const res = await fetch(`${jikanBaseUrl}/anime?q=${encodeURIComponent(title)}&limit=10`);
    const data = await convertToJson(res);
    return data.data; // Jikan v4 returns data in 'data' field
  }

  static async fetchGenres() {
    const res = await fetch(`${jikanBaseUrl}/genres/anime`);
    const data = await convertToJson(res);
    return data.data; // This returns an array of genres
  }

  static async searchAnimeByGenre(genreId) {
    const res = await fetch(`${jikanBaseUrl}/anime?genres=${genreId}&limit=10`);
    const data = await convertToJson(res);
    return data.data;
  }
}
