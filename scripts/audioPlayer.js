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

/* Charge la playlist depuis JSON */
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

/* Charge un morceau dans le lecteur */
function loadTrack(index, autoplay = false) {
    if(!playlist.length) return;

currentTrack = (index + playlist.length) % playlist.length;

const track = playlist[currentTrack];

audio.src= track.files;

trackTitle.trackContent = track.title || "Titre inconnu";
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
