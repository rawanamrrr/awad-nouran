import { useEffect, useRef, useState } from "react";
import envelopeVideo from "@/assets/intro-envelope.mp4";
import bridgeVideo from "@/assets/intro-bridge.mp4";
import introPoster from "@/assets/intro-poster.jpg";
import { playMusic, showMusicButton } from "@/lib/music";

type Phase = "idle" | "envelope" | "bridge" | "done";

const FADE_MS = 800; // overlay fade-out at the very end
const HANDOVER_MS = 120; // tiny fade from video 1 to video 2 (the two scenes are colour-matched)

/**
 * Full-screen intro:
 *  1. The first frame of the envelope video is shown as a still image.
 *  2. On tap the envelope video plays.
 *  3. When it ends the bridge video (already preloaded while the first one was
 *     loading/playing) plays right after it.
 *  4. When the bridge video ends the overlay fades out to reveal the invitation.
 */
export const Intro = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [bridgeLive, setBridgeLive] = useState(false);
  const [gone, setGone] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  );
  const envelopeRef = useRef<HTMLVideoElement>(null);
  const bridgeRef = useRef<HTMLVideoElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const watchdog = useRef<number>();

  const go = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  // Keep the page from scrolling behind the overlay.
  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gone]);

  const finish = () => {
    if (phaseRef.current === "done") return;
    window.clearTimeout(watchdog.current);
    go("done");
    window.scrollTo(0, 0);
    showMusicButton();
    // Unmount once the fade-out has finished (a timer is more reliable than transitionend).
    window.setTimeout(() => setGone(true), FADE_MS + 100);
  };

  useEffect(() => () => window.clearTimeout(watchdog.current), []);

  // Visitors who skip the intro (reduced motion) still get the music button.
  useEffect(() => {
    if (gone) showMusicButton();
  }, [gone]);

  const start = () => {
    if (phase !== "idle") return;
    const envelope = envelopeRef.current;
    if (!envelope) return finish();

    go("envelope");
    playMusic(); // must happen inside the tap, otherwise the browser blocks the sound
    envelope.play().catch(finish);
  };

  const playBridge = () => {
    const bridge = bridgeRef.current;
    if (!bridge) return finish();
    go("bridge");
    bridge.currentTime = 0;
    bridge.play().catch(finish);
    // Safety net: never leave the guest stuck on the intro if playback dies.
    const length = Number.isFinite(bridge.duration) ? bridge.duration : 8;
    watchdog.current = window.setTimeout(finish, (length + 8) * 1000);
  };

  if (gone) return null;

  // Video 2 only becomes visible once it is really drawing frames, so there is never a
  // blank or half-loaded frame on top of video 1's last frame.
  const showBridge = bridgeLive;

  return (
    <div
      role="button"
      tabIndex={phase === "idle" ? 0 : -1}
      aria-label="Open the invitation"
      onClick={start}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          start();
        }
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-stone-100 outline-none"
      style={{
        WebkitTapHighlightColor: "transparent",
        cursor: phase === "idle" ? "pointer" : "default",
        opacity: phase === "done" ? 0 : 1,
        pointerEvents: phase === "done" ? "none" : "auto",
        transition: `opacity ${FADE_MS}ms ease-in-out`,
      }}
    >
      {/* Placeholder under the video, only visible while the video's first frame is still loading. */}
      <img
        src={introPoster}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />

      {/* Video 1: envelope. No `poster` attribute on purpose: the video shows its own first
          frame (the `#t=0.001` makes iOS draw it), so nothing gets swapped when playback
          starts, which is what caused the flash on tap. */}
      <video
        ref={envelopeRef}
        src={`${envelopeVideo}#t=0.001`}
        preload="auto"
        muted
        playsInline
        onEnded={playBridge}
        onError={finish}
        className="absolute inset-0 h-full w-full select-none object-cover"
      />

      {/* Video 2: bridge. Preloads in the background while video 1 loads/plays. */}
      <video
        ref={bridgeRef}
        src={bridgeVideo}
        preload="auto"
        muted
        playsInline
        onEnded={finish}
        onError={finish}
        onPlaying={(e) => {
          const v = e.currentTarget;
          if (phaseRef.current !== "bridge") return;
          // Reveal on the first painted frame; the timer is a safety net for browsers where
          // that callback is late or never fires, so video 2 can never stay hidden.
          let shown = false;
          const reveal = () => {
            if (shown) return;
            shown = true;
            setBridgeLive(true);
          };
          if ("requestVideoFrameCallback" in v) v.requestVideoFrameCallback(reveal);
          window.setTimeout(reveal, 250);
        }}
        onPause={(e) => {
          const v = e.currentTarget;
          if (phaseRef.current === "bridge" && !v.ended) v.play().catch(() => undefined);
        }}
        className="absolute inset-0 h-full w-full select-none object-cover"
        style={{
          opacity: showBridge ? 1 : 0,
          transition: `opacity ${HANDOVER_MS}ms linear`,
        }}
      />

      <span
        className="pointer-events-none absolute inset-x-0 bottom-10 text-center font-jost text-[11px] font-light uppercase leading-4 tracking-[3px] text-slate-600/80"
        style={{ opacity: phase === "idle" ? 1 : 0, transition: "opacity 300ms ease" }}
      >
        Tap to open
      </span>
    </div>
  );
};
