import { useEffect } from "react";
import { preloadMusic, toggleMusic, useMusic } from "@/lib/music";

export const MusicButton = () => {
  const { playing, visible } = useMusic();

  useEffect(() => {
    preloadMusic();
  }, []);

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-label={playing ? "Turn the music off" : "Turn the music on"}
      aria-pressed={playing}
      tabIndex={visible ? 0 : -1}
      className="group fixed z-[60] flex h-12 w-12 items-center justify-center rounded-full text-slate-600 backdrop-blur-sm transition-[opacity,transform] duration-500 hover:scale-105 active:scale-95"
      style={{
        right: "max(16px, env(safe-area-inset-right))",
        bottom: "max(16px, env(safe-area-inset-bottom))",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        WebkitTapHighlightColor: "transparent",
        background: "linear-gradient(145deg, rgba(255,251,246,0.96), rgba(247,238,226,0.94))",
        // double border (like the "Get Directions" button) + soft shadow
        boxShadow:
          "0 0 0 1px rgba(71,85,105,0.30), inset 0 0 0 3px rgba(252,246,238,0.96), inset 0 0 0 4px rgba(71,85,105,0.16), 0 10px 22px -10px rgba(71,85,105,0.55)",
      }}
    >
      {/* soft pulse while the music is playing */}
      {playing && (
        <span
          aria-hidden="true"
          className="music-pulse pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 0 1.5px rgba(71,85,105,0.35)" }}
        />
      )}

      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="relative transition-opacity duration-300"
        style={{ opacity: playing ? 1 : 0.7 }}
      >
        {/* musical notes */}
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.12" />
        <circle cx="18" cy="16" r="3" fill="currentColor" fillOpacity="0.12" />
        {/* slash when the music is off (a light "halo" underneath keeps it readable) */}
        {!playing && (
          <>
            <path d="M4 4 20 20" stroke="rgb(252,246,238)" strokeWidth="4" />
            <path d="M4 4 20 20" />
          </>
        )}
      </svg>
    </button>
  );
};
