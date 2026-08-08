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

function toggleDuaAudio(id, btn) {
  const url = duaAudios[id];
  if (!url) return;
  
  if (currentAudio && currentAudioBtn === btn) {
    if (!currentAudio.paused) {
      currentAudio.pause();
      btn.textContent = "▶";
      btn.classList.remove("playing");
    } else {
      currentAudio.play().catch(err => showAudioError(btn));
      btn.textContent = "⏸";
      btn.classList.add("playing");
    }
    return;
  }
  
  if (currentAudio) {
    currentAudio.pause();
    if (currentAudioBtn) {
      currentAudioBtn.textContent = "▶";
      currentAudioBtn.classList.remove("playing");
    }
  }
  
  btn.textContent = "⏳";
  currentAudio = new Audio(url);
  currentAudioBtn = btn;
  
  currentAudio.addEventListener("canplaythrough", () => {
    if (currentAudioBtn === btn) {
      currentAudio.play().catch(err => showAudioError(btn));
      btn.textContent = "⏸";
      btn.classList.add("playing");
    }
  });
  
  currentAudio.addEventListener("ended", () => {
    btn.textContent = "▶";
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
  btn.textContent = "❌";
  btn.classList.remove("playing");
  alert(translations[lang]["duas.playError"] || "Could not load audio. Please check your connection.");
  setTimeout(() => {
    if (btn.textContent === "❌") btn.textContent = "▶";
  }, 3000);
}



export { toggleDuaAudio, showAudioError };
