const audio = ducument.getElementById('audio');

const player = document.getElementById('audioplayer');
const playerTab = document.getElementById('playertab');
const tabIcon = document.getElementById('tabicon');

const cover = document.getElementById('cover');
const trackTitle = document.getElementById('tracktitle');
const trackArtist = document.getElementById('trackartist');

const playbtn = document.getElementById('playbtn');
const prevbtn = document.getElementById('prevbtn');
const nextbtn = document.getElementById('nextbtn');

const progress = document.getElementById('progress');
const currentTime = document.getElementById('currenttime');
const duration = document.getElementById('duration');

const volumeSlider = document.getElementById('volumeslider');
const trackcounter = document.getElementById('trackcounter');

let playlist = []
let currentTrack = 0;

/* charge la playlist depuis JSON */
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

    loadTrack(0);

  } catch (error) {
    console.error(error);

    trackTitle.textContent = "Erreur";
    trackArtist.textContent = "Impossible de charger la playlist";
  }
}

/* charge un morceau dans le lecteur */
function loadTrack(index, autoplay = false) {
    if(!playlist.length) return;

currentTrack = (index + playlist.length) % playlist.length;

const track = playlist[currentTrack];

audio.src= track.files;

trackTitle.textContent = track.title || "Titre inconnu";
trackArtist.textContent = track.artist || "Artiste inconnu";

if(track.cover) {
    cover.src = track.cover;
} else {
    cover.src = "images/default-cover.jpg";
}

trackcounter.textContent = `${currentTrack + 1} / ${playlist.length}`;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    if (autoplay) {
        audio.play().catch(() => {})
    }
}

/* jouer ou mettre en pause le morceau */

playbtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().catch(() => {});
    } else {
        audio.pause();
    }
});

audio.addEventListener("play", () => {
    playbtn.textContent = "⏸️";
});

audio.addEventListener("pause", () => {
    playbtn.textContent = "▶️";
});

/* passer au morceau suivant */
nextbtn.addEventListener("click", () => {
    loadTrack(currentTrack + 1, true);
});

/* aller au morceau précédent */
prevbtn.addEventListener("click", () => {
    loadTrack(currentTrack - 1, true);
})

/* passe automatiquement au morceau suivant à la fin du morceau inital */
audio.addEventListener("ended", () => {
    loadTrack(currentTrack + 1, true);
})

/* progression du morceau */
audio.addEventListener("loadmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTime.textContent = formatTime(audio.currentTime);
});

progress.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100)
});

/* niveau du volume */
volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});
audio.volume = 1;

/* ouvrir et fermer le lecteur audio */
playerTab.addEventListener("click",() => {
    player.classList.toggle("is-hidden");

    const hidden = player.classList.contains("is-hidden");

    if(hidden) {
        tabIcon.textContent = "<";
        playerTab.setAttribute("aria-label", "ouvrir le lecteur audio");
    } else {
        tabIcon.textContent = ">";
        playerTab.setAttribute("aria-label", "fermer le lecteur audio");
    }
});

/* temps de lecture */

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/* initialisation */
loadPlaylist();