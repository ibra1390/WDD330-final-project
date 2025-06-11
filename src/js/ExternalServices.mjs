const jikanBaseUrl = import.meta.env.VITE_JIKAN_BASE_URL;
const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

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


  static async getAnimeById(id) {
    const res = await fetch(`${jikanBaseUrl}/anime/${id}`);
    const data = await convertToJson(res);
    return data.data;
  }


  static async fetchYouTubeTrailer(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query + " official trailer"
  )}&key=${youtubeApiKey}&maxResults=1&type=video`;

  const res = await fetch(url);
  const data = await convertToJson(res);
  return data.items?.[0] || null;
  }

}

