import { translations } from '../config/translations.js';

// Media Audio Player Service
// ── DUA AUDIO PLAYER LOGIC ──
let currentAudio = null;
let currentAudioBtn = null;

const duaAudios = {
  1: "https://archive.org/download/TalbiyahImaamsOfTheHaramain/TalbiyyahSudais.mp3",
  2: "https://archive.org/download/588SAFARSEWAPSIKIDUA/588_SAFAR_SE_WAPSI_KI_DUA.mp3",
  3: "https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3"
};

const PLAY_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const PAUSE_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const LOADING_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const ERROR_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

function toggleDuaAudio(id, btn) {
  const url = duaAudios[id];
  if (!url) return;
  
  if (currentAudio && currentAudioBtn === btn) {
    if (!currentAudio.paused) {
      currentAudio.pause();
      btn.innerHTML = PLAY_ICON;
      btn.classList.remove("playing");
    } else {
      currentAudio.play().catch(err => showAudioError(btn));
      btn.innerHTML = PAUSE_ICON;
      btn.classList.add("playing");
    }
    return;
  }
  
  if (currentAudio) {
    currentAudio.pause();
    if (currentAudioBtn) {
      currentAudioBtn.innerHTML = PLAY_ICON;
      currentAudioBtn.classList.remove("playing");
    }
  }
  
  btn.innerHTML = LOADING_ICON;
  currentAudio = new Audio(url);
  currentAudioBtn = btn;
  
  currentAudio.addEventListener("canplaythrough", () => {
    if (currentAudioBtn === btn) {
      currentAudio.play().catch(err => showAudioError(btn));
      btn.innerHTML = PAUSE_ICON;
      btn.classList.add("playing");
    }
  });
  
  currentAudio.addEventListener("ended", () => {
    btn.innerHTML = PLAY_ICON;
    btn.classList.remove("playing");
    if (currentAudioBtn === btn) {
      currentAudio = null;
      currentAudioBtn = null;
    }
  });
  
  currentAudio.addEventListener("error", () => {
    showAudioError(btn);
  });
  
  currentAudio.load();
}

function showAudioError(btn) {
  const lang = document.documentElement.getAttribute('lang') || 'en';
  btn.innerHTML = ERROR_ICON;
  btn.classList.remove("playing");
  alert(translations[lang]["duas.playError"] || "Could not load audio. Please check your connection.");
  setTimeout(() => {
    btn.innerHTML = PLAY_ICON;
  }, 3000);
}



export { toggleDuaAudio, showAudioError };
