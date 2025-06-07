import AnimeService from "./ExternalServices.mjs";
import { loadHeaderFooter } from "./utils.js";

loadHeaderFooter();

function getAnimeIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderAnimeDetails(anime) {
  const container = document.getElementById("anime-detail");

  container.innerHTML = `
    <div class="anime-detail-card">
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}" class="anime-detail-img"/>
      <div class="anime-detail-info">
        <h2>${anime.title}</h2>
        <p><strong>Episodes:</strong> ${anime.episodes || "N/A"}</p>
        <p><strong>Status:</strong> ${anime.status}</p>
        <p><strong>Score:</strong> ${anime.score || "N/A"}</p>
        <p><strong>Synopsis:</strong> ${anime.synopsis || "No synopsis available."}</p>
      </div>
    </div>
  `;
}

async function loadAnimeDetail() {
  const animeId = getAnimeIdFromUrl();
  if (!animeId) return;

  try {
    const anime = await AnimeService.getAnimeById(animeId);
    renderAnimeDetails(anime);
  } catch (err) {
    console.error("Failed to fetch anime details:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadAnimeDetail);