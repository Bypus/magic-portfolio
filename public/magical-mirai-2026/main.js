// ─── main.js ─────────────────────────────────────────────────
// Intégration TextAlive App API + Web Audio FFT + mise à jour du player UI.

import audioAnalyser from './audio.js';

const { Player } = TextAliveApp;

// ─── 🔑 Token TextAlive depuis .env ──────────────────────────
const APP_TOKEN = window?.env?.TEXTALIVE_APP_TOKEN ||
  (typeof process !== 'undefined' ? process.env.TEXTALIVE_APP_TOKEN : undefined) ||
  'TdJxgmKtBQU37b7Y'; // fallback pour dev local

// ─── Chansons disponibles ────────────────────────────────────

const SONGS = {
  kotaete: {
    url: 'https://piapro.jp/t/6W2N/20251215164617',
    video: { beatId: 4827293, chordId: 2963754, repetitiveSegmentId: 3086261, lyricId: 126519, lyricDiffId: 28645 },
  },
  after: {
    url: 'https://piapro.jp/t/zoqO/20251214200738',
    video: { beatId: 4827294, chordId: 2963755, repetitiveSegmentId: 3086262, lyricId: 126591, lyricDiffId: 28627 },
  },
  shutter: {
    url: 'https://piapro.jp/t/PNpQ/20251209170719',
    video: { beatId: 4827295, chordId: 2963756, repetitiveSegmentId: 3086263, lyricId: 126542, lyricDiffId: 28628 },
  },
  sekai: {
    url: 'https://piapro.jp/t/B3yJ/20251215061727',
    video: { beatId: 4827296, chordId: 2963757, repetitiveSegmentId: 3086264, lyricId: 126594, lyricDiffId: 28629 },
  },
  tori: {
    url: 'https://piapro.jp/t/QBdL/20251215094303',
    video: { beatId: 4827297, chordId: 2963758, repetitiveSegmentId: 3086265, lyricId: 126593, lyricDiffId: 28630 },
  },
  takeover: {
    url: 'https://piapro.jp/t/E2i3/20251215092113',
    video: { beatId: 4827298, chordId: 2963759, repetitiveSegmentId: 3086266, lyricId: 126533, lyricDiffId: 28631 },
  },
};

let selectedSong = null;

// ─── Éléments UI ─────────────────────────────────────────────

const playerEl      = document.getElementById('player');
const btnPlay       = document.getElementById('btn-play');
const iconPlay      = document.getElementById('icon-play');
const iconPause     = document.getElementById('icon-pause');
const statusEl      = document.getElementById('status');
const songTitleEl   = document.getElementById('song-title');
const songArtistEl  = document.getElementById('song-artist');
const timeCurEl     = document.getElementById('time-cur');
const timeDurEl     = document.getElementById('time-dur');
const progressFill  = document.getElementById('progress-fill');
const progressSun   = document.getElementById('progress-sun');

function fmt(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function setStatus(msg) { statusEl.textContent = msg; }

function setPlaying(playing) {
  iconPlay.style.display  = playing ? 'none'  : 'block';
  iconPause.style.display = playing ? 'block' : 'none';
}

// Met à jour la barre de progression + thème du player
function updateProgress(position, duration) {
  if (!duration) return;
  const pct = Math.max(0, Math.min(100, (position / duration) * 100));
  const t = pct / 100; // 0→1

  // Couleur des barres : jaune doré → orange coucher de soleil
  const r = Math.round(255);
  const g = Math.round(210 - t * 110); // 210→100
  const b = Math.round(60 - t * 30);   // 60→30
  const barColor = `rgb(${r},${g},${b})`;
  document.documentElement.style.setProperty('--bar-color', barColor);

  progressFill.style.width = `${pct}%`;
  progressSun.style.left   = `${pct}%`;

  // Thème du player : bascule vers "sunset" à partir de 50% de la chanson
  if (pct >= 50) {
    playerEl.classList.add('sunset');
    progressSun.classList.add('sunset');
  } else {
    playerEl.classList.remove('sunset');
    progressSun.classList.remove('sunset');
  }

  timeCurEl.textContent = fmt(position);

  // Transmet la progression au canvas + FFT fallback
  window.Beach.setProgress(position, duration);
  audioAnalyser.setFallbackProgress(pct / 100);
}

// ─── Player TextAlive ─────────────────────────────────────────

const audioEl = document.createElement('audio');
audioEl.crossOrigin = 'anonymous'; // attempt CORS for Web Audio FFT

const player = new Player({
  app: { token: APP_TOKEN },
  mediaElement: audioEl,
});

let songDuration = 0;
let audioInitialized = false;

// Update FFT each frame via requestAnimationFrame
function fftLoop() {
  requestAnimationFrame(fftLoop);
  if (!audioInitialized) return;
  audioAnalyser.update();
  window.Beach.setAudioData({
    bass: audioAnalyser.bass,
    mids: audioAnalyser.mids,
    highs: audioAnalyser.highs,
  });
}
fftLoop();

player.addListener({

  onAppReady(app) {
    if (!app.managed) {
      // Attendre le choix de l'utilisateur dans le modal
      if (selectedSong) {
        setStatus('Chargement de la chanson…');
        player.createFromSongUrl(selectedSong.url, { video: selectedSong.video });
      }
    }
  },

  onVideoReady(video) {
    // Infos de la chanson
    const song = player.data?.song;
    if (song) {
      songTitleEl.textContent  = song.name   || '—';
      songArtistEl.textContent = song.artist?.name || '';
    }
    songDuration = player.video?.duration ?? 0;
    timeDurEl.textContent = fmt(songDuration);
    setStatus('Prêt');
    btnPlay.disabled = false;
  },

  onPlay()  {
    setPlaying(true);
    setStatus('');
    if (!audioInitialized) {
      audioAnalyser.init(audioEl);
      audioInitialized = true;
    }
    audioAnalyser.resume();
  },
  onPause() { setPlaying(false); /*setStatus('En pause');*/ },
  onStop()  { setPlaying(false); /*setStatus('Terminé');*/ updateProgress(0, songDuration); },

  // ── Progression & thème ───────────────────────────────────
  onTimeUpdate(position) {
    updateProgress(position, songDuration);
    if (!player.video) return;

    // Mot courant
    const word = player.video.findWord(position);
    if (!word || word === player._lastWord) return;
    player._lastWord = word;

    const phrase  = word.parent;
    const isFirst = phrase?.children[0] === word;
    const wordIdx = phrase ? phrase.children.indexOf(word) : 0;
    const phraseLen = phrase ? phrase.children.length : 1;
    const phraseDur = phrase ? phrase.duration : 1000;

    window.Beach.spawnWord(word.text, wordIdx, isFirst, phraseLen, phraseDur);
  },

  onBeat(beat) {
    window.Beach.triggerBeat();
    audioAnalyser.setFallbackBeat();
  },

});

// ─── Modal de sélection ──────────────────────────────────────

const songModal = document.getElementById('song-modal');

document.querySelectorAll('.song-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.song;
    selectedSong = SONGS[key];
    if (!selectedSong) return;

    songModal.classList.add('hidden');
    playerEl.style.display = '';
    setStatus('Chargement de la chanson…');
    player.createFromSongUrl(selectedSong.url, { video: selectedSong.video });
  });
});

// ─── Contrôles ───────────────────────────────────────────────

btnPlay.addEventListener('click', () => {
  player.isPlaying ? player.requestPause() : player.requestPlay();
});

// ── Mute ─────────────────────────────────────────────────────

const btnMute   = document.getElementById('btn-mute');
const iconVol   = document.getElementById('icon-vol');
const iconMuted = document.getElementById('icon-muted');
let isMuted = false;

btnMute.addEventListener('click', () => {
  isMuted = !isMuted;
  audioAnalyser.setVolume(isMuted ? 0 : 1);
  iconVol.style.display   = isMuted ? 'none' : 'block';
  iconMuted.style.display = isMuted ? 'block' : 'none';
});

// ── Seek : clic + drag sur la barre de progression ───────────

const progressTrack = document.getElementById('progress-track');
let isSeeking = false;

function seekToEvent(e) {
  if (!songDuration) return;
  const rect = progressTrack.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const targetMs = pct * songDuration;

  // Mise à jour visuelle immédiate pendant le drag
  updateProgress(targetMs, songDuration);

  // Seek effectif dans le player
  player.requestMediaSeek(targetMs);
}

progressTrack.addEventListener('mousedown', (e) => {
  if (!songDuration) return;
  isSeeking = true;
  seekToEvent(e);
});

progressTrack.addEventListener('touchstart', (e) => {
  if (!songDuration) return;
  isSeeking = true;
  seekToEvent(e);
}, { passive: true });

window.addEventListener('mousemove', (e) => {
  if (isSeeking) seekToEvent(e);
});

window.addEventListener('touchmove', (e) => {
  if (isSeeking) seekToEvent(e);
}, { passive: true });

window.addEventListener('mouseup',  () => { isSeeking = false; });
window.addEventListener('touchend', () => { isSeeking = false; });

setStatus('Initialisation…');
