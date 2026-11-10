// Production server: serves the built site (dist/) and the RSVP email endpoint.
//   npm run build && npm start
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleRsvp } from "./rsvpHandler.js";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

const serveFile = (req, res, file) => {
  const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const { size } = statSync(file);
  res.setHeader("Content-Type", type);
  res.setHeader("Accept-Ranges", "bytes");
  // Hashed build assets can be cached for a long time; index.html must stay fresh.
  res.setHeader("Cache-Control", file.includes(`${path.sep}assets${path.sep}`) ? "public, max-age=31536000, immutable" : "no-cache");

  // Byte ranges: iPhone Safari needs them to play <video>.
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
  if (range) {
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end || start >= size) {
      res.statusCode = 416;
      res.setHeader("Content-Range", `bytes */${size}`);
      return res.end();
    }
    res.statusCode = 206;
    res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
    res.setHeader("Content-Length", end - start + 1);
    return createReadStream(file, { start, end }).pipe(res);
  }

  res.setHeader("Content-Length", size);
  if (req.method === "HEAD") return res.end();
  createReadStream(file).pipe(res);
};

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");

    if (url.pathname === "/api/rsvp") return handleRsvp(req, res);

    let file = path.join(DIST, decodeURIComponent(url.pathname));
    if (!file.startsWith(DIST)) {
      res.statusCode = 403; // path traversal attempt
      return res.end();
    }
    if (!existsSync(file) || statSync(file).isDirectory()) file = path.join(DIST, "index.html");
    if (!existsSync(file)) {
      res.statusCode = 404;
      return res.end("Run `npm run build` first.");
    }
    serveFile(req, res, file);
  })
  .listen(PORT, () => console.log(`Invitation running on http://localhost:${PORT}`));
