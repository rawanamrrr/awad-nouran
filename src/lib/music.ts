import { useSyncExternalStore } from "react";
import musicUrl from "@/assets/music.mp3";

// One background song for the whole site. The intro starts it on the guest's first tap
// (browsers only allow sound after a tap); the floating button then mutes / unmutes it.

type MusicState = { playing: boolean; visible: boolean };

const TARGET_VOLUME = 0.7;

let state: MusicState = { playing: false, visible: false };
const listeners = new Set<() => void>();
const patch = (next: Partial<MusicState>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

let audio: HTMLAudioElement | null = null;
let fadeTimer: number | undefined;
let wantPlaying = false; // what the guest asked for (used to resume after the tab was hidden)
let preloadScheduled = false;
let preloadTimer: number | undefined;
let started = false; // once the guest started the music we must never reset the audio element

const getAudio = () => {
  if (!audio) {
    audio = new Audio();
    audio.src = musicUrl;
    audio.loop = true;
    audio.preload = "none"; // don't compete with the intro videos while they load
    audio.volume = 0;

    // If anything pauses the song while the guest wants it (phone call, another app, the browser),
    // start it again instead of staying silent while the button still says "on".
    audio.addEventListener("pause", () => {
      if (wantPlaying && !document.hidden && audio && !audio.ended) {
        audio.play().catch(() => {
          wantPlaying = false;
          patch({ playing: false });
        });
      }
    });
    audio.addEventListener("error", () => {
      wantPlaying = false;
      patch({ playing: false });
    });
  }
  return audio;
};

const fadeTo = (target: number, ms: number, done?: () => void) => {
  const a = getAudio();
  window.clearInterval(fadeTimer);
  const steps = Math.max(1, Math.round(ms / 50));
  const delta = (target - a.volume) / steps;
  let n = 0;
  fadeTimer = window.setInterval(() => {
    n += 1;
    a.volume = Math.min(1, Math.max(0, n >= steps ? target : a.volume + delta));
    if (n >= steps) {
      window.clearInterval(fadeTimer);
      done?.();
    }
  }, 50);
};

/** Start downloading the song once the page and the intro videos had their turn. */
export const preloadMusic = () => {
  if (preloadScheduled || typeof window === "undefined") return;
  preloadScheduled = true;
  const go = () => {
    preloadTimer = window.setTimeout(() => {
      const a = getAudio();
      // load() RESETS the element: doing it after the guest tapped would cut the song off.
      if (started || !a.paused || a.preload === "auto") return;
      a.preload = "auto";
      a.load();
    }, 2500);
  };
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
};

/** Must be called from a tap / key press handler. */
export const playMusic = () => {
  const a = getAudio();
  started = true;
  window.clearTimeout(preloadTimer);
  wantPlaying = true;
  patch({ playing: true });
  a.play()
    .then(() => fadeTo(TARGET_VOLUME, 1500))
    .catch(() => {
      // Browser refused (no tap yet, or the file failed): show the button as "off".
      wantPlaying = false;
      patch({ playing: false });
    });
};

export const pauseMusic = () => {
  wantPlaying = false;
  patch({ playing: false });
  fadeTo(0, 400, () => audio?.pause());
};

export const toggleMusic = () => (state.playing ? pauseMusic() : playMusic());

/** Called when the intro is over, so the button appears on the invitation itself. */
export const showMusicButton = () => patch({ visible: true });

if (typeof document !== "undefined") {
  // Be polite: silence when the guest switches tab / locks the phone, resume when they return.
  document.addEventListener("visibilitychange", () => {
    if (!audio) return;
    if (document.hidden) {
      audio.pause();
    } else if (wantPlaying) {
      audio.play().catch(() => undefined);
    }
  });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export const useMusic = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
