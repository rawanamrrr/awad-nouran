import { useEffect, useRef, useState } from "react";
import pearlFrame from "@/assets/pearl-frame.webp";
import couplePhoto from "@/assets/couple.jpg";

// Measured from the reference design, as a % of the (square) pearl image.
// Frame (outer edge of the gold oval) and photo window, both centred.
const RING_W = 40;
const RING_H = 55.8;
const BAND = 3.2; // thickness of the frame on every side
const box = (w: number, h: number) => ({
  left: `${50 - w / 2}%`,
  top: `${50 - h / 2}%`,
  width: `${w}%`,
  height: `${h}%`,
});

const REVEAL_THRESHOLD = 0.5; // fraction of the cover that must be scratched off
const SCRIPT_FONT = '"Monsieur La Doulaise Local", "Snell Roundhand", cursive';

// The scratch-off surface itself (no text yet).
const paintBase = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = canvas;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#efeae0";
  ctx.fillRect(0, 0, w, h);

  // soft light from the top left
  const glow = ctx.createRadialGradient(w * 0.35, h * 0.25, 0, w * 0.5, h * 0.5, h * 0.7);
  glow.addColorStop(0, "rgba(255,255,255,0.55)");
  glow.addColorStop(1, "rgba(220,210,190,0.25)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // fine speckle so it looks like a scratch-off surface
  const dots = Math.round((w * h) / 18);
  for (let i = 0; i < dots; i++) {
    const light = Math.random() > 0.5;
    ctx.fillStyle = light ? "rgba(255,255,255,0.55)" : "rgba(170,155,130,0.22)";
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
  }

};

// The "Scratch / to reveal" text. Drawn with `source-atop`, so it only lands on the part of the
// cover that is still there (if someone already scratched, those spots stay see-through).
const paintText = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width: w, height: h } = canvas;

  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = "#5d6e8e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${w * 0.26}px ${SCRIPT_FONT}`;
  ctx.fillText("Scratch", w / 2, h * 0.46);
  ctx.font = `${w * 0.15}px ${SCRIPT_FONT}`;
  ctx.fillText("to reveal", w / 2, h * 0.57);
  ctx.globalCompositeOperation = "source-over";
};

export const PhotoSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    // 1) Show the cover right away.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    paintBase(canvas);

    // 2) Add the text only once the script font is really loaded. Drawing it earlier would
    //    use a fallback font (that was the "damaged" lettering). If the font never arrives
    //    within 10 s (offline, blocked), draw it with the fallback rather than leave it empty.
    const drawText = () => {
      if (!cancelled) paintText(canvas);
    };
    const fontSpec = `40px "Monsieur La Doulaise Local"`;
    Promise.race([
      Promise.all([document.fonts.load(fontSpec, "Scratch to reveal"), document.fonts.ready]),
      new Promise((r) => setTimeout(r, 10_000)),
    ])
      .catch(() => undefined)
      .then(drawText);

    return () => {
      cancelled = true;
    };
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const scratchTo = (canvas: HTMLCanvasElement, x: number, y: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const from = last.current ?? { x, y };
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = canvas.width * 0.2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = { x, y };
  };

  const checkProgress = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 16) {
      total++;
      if (data[i] < 128) cleared++;
    }
    if (cleared / total > REVEAL_THRESHOLD) setRevealed(true);
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    last.current = null;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = point(e);
    scratchTo(e.currentTarget, x, y);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const { x, y } = point(e);
    scratchTo(e.currentTarget, x, y);
  };

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    checkProgress(e.currentTarget);
  };

  return (
    <section className="box-border w-full">
      <div
        className="relative mx-auto aspect-square w-full max-w-[760px] overflow-hidden"
        style={{ containerType: "inline-size" }}
      >
        <img
          src={pearlFrame}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />

        {/* gold oval frame: outline, beige band, tan line, cream line, tan band */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-[50%]"
          style={{
            ...box(RING_W, RING_H),
            background: "#d5c29b",
            boxShadow: [
              "inset 0 0 0 0.22cqw #bfae8c",
              "inset 0 0 0 1.6cqw #e6dac1",
              "inset 0 0 0 1.9cqw #c3af81",
              "inset 0 0 0 2.4cqw #f3eee4",
              "0 0.2cqw 0.8cqw rgba(80,60,30,0.22)",
            ].join(", "),
          }}
        />

        {/* photo + scratch cover */}
        <div
          className="absolute overflow-hidden rounded-[50%]"
          style={box(RING_W - 2 * BAND, RING_H - 2 * BAND)}
        >
          <img
            src={couplePhoto}
            alt="The couple"
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{ objectPosition: "50% 30%" }}
          />
          <canvas
            ref={canvasRef}
            aria-label="Scratch to reveal the photo"
            className="absolute inset-0 h-full w-full cursor-pointer transition-opacity duration-700"
            style={{
              touchAction: "none",
              opacity: revealed ? 0 : 1,
              pointerEvents: revealed ? "none" : "auto",
            }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          />
        </div>
      </div>
    </section>
  );
};
