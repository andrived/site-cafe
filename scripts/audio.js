const audio = document.getElementById("audio");

const player = document.getElementById("audioPlayer");
const playerTab = document.getElementById("playerTab");
const tabIcon = document.getElementById("tabIcon");

const cover = document.getElementById("cover");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const trackCounter = document.getElementById("trackCounter");

let playlist = [];
let currentTrack = 0;
const INITIAL_VOLUME = 0.05;

/* charger la playlist */

async function loadPlaylist() {
  try {
    const response = await fetch("playlist.json");

    if (!response.ok) {
      throw new Error("Impossible de charger playlist.json");
    }

    playlist = await response.json();

    if (!Array.isArray(playlist) || playlist.length === 0) {
      throw new Error("La playlist est vide.");
    }

    loadTrack(0, true);

  } catch (error) {
    console.error(error);

    trackTitle.textContent = "Erreur";
    trackArtist.textContent = "Impossible de charger la playlist";
  }
}

/* charger un audio */

function loadTrack(index, autoplay = false) {
  if (!playlist.length) return;

  currentTrack = (index + playlist.length) % playlist.length;

  const track = playlist[currentTrack];

  audio.src = track.file;

  trackTitle.textContent = track.title || "Titre inconnu";
  trackArtist.textContent = track.artist || "Artiste inconnu";

  if (track.cover) {
    cover.src = track.cover;
  } else {
    cover.src = "covers/wai.jpg";
  }

  trackCounter.textContent =
    `${currentTrack + 1} / ${playlist.length}`;

  progress.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";

  if (autoplay) {
    audio.play().catch((error) => {
      console.warn(
        "La lecture automatique a été bloquée par le navigateur. Le visiteur peut démarrer la musique avec le bouton Lecture.",
        error
      );
    });
  }
}

/* audio joué et mis en pause */

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch((error) => {
      console.error("Impossible de démarrer la lecture audio.", error);
    });
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  playBtn.textContent = "❚❚";
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
});

/* audio précédente et suivante */

prevBtn.addEventListener("click", () => {
  loadTrack(currentTrack - 1, true);
});

nextBtn.addEventListener("click", () => {
  loadTrack(currentTrack + 1, true);
});

/* passe automatiquement au morceau suivant */

audio.addEventListener("ended", () => {
  loadTrack(currentTrack + 1, true);
});

/* progression de la musique */

audio.addEventListener("loadedmetadata", () => {
  if (Number.isFinite(audio.duration)) {
    duration.textContent = formatTime(audio.duration);
  }
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  progress.value =
    (audio.currentTime / audio.duration) * 100;

  currentTime.textContent =
    formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
  if (!audio.duration) return;

  audio.currentTime =
    (progress.value / 100) * audio.duration;
});

/* contrôle du volume */

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

audio.volume = INITIAL_VOLUME;
volume.value = String(INITIAL_VOLUME);

/* la languette/onglet */

playerTab.addEventListener("click", () => {
  player.classList.toggle("is-hidden");

  const hidden = player.classList.contains("is-hidden");

  if (hidden) {
    tabIcon.textContent = "‹";
    playerTab.setAttribute(
      "aria-label",
      "Afficher le lecteur"
    );
  } else {
    tabIcon.textContent = "›";
    playerTab.setAttribute(
      "aria-label",
      "Masquer le lecteur"
    );
  }
});

/* la durée de la musique */

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/* initialisation de la playlist */

loadPlaylist();
