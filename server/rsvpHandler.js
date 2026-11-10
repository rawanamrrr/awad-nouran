// POST /api/rsvp  ->  validates the RSVP and emails it to the couple.
// Used by both the dev server (vite.config.ts) and the production server (server/index.js).
import { readFileSync } from "node:fs";
import tls from "node:tls";
import { parseEnv } from "node:util";
import nodemailer from "nodemailer";
import { buildRsvpEmail } from "./rsvpEmail.js";

// Trust the operating system's certificate store in addition to Node's built-in list.
// On many PCs an antivirus (Avast, Kaspersky...) inspects mail connections and re-signs them with
// its own root certificate, which Windows trusts but Node does not by default; without this the
// email fails with "self-signed certificate in certificate chain". Certificates are still fully
// verified. (Needs Node 24.5+; on older versions this is skipped and nothing changes.)
try {
  if (typeof tls.setDefaultCACertificates === "function") {
    tls.setDefaultCACertificates([...tls.getCACertificates("default"), ...tls.getCACertificates("system")]);
  }
} catch {
  /* keep Node's default certificate list */
}

// Settings come from .env.local (or .env), which are private and never committed.
// The files are re-read on every RSVP, so editing them never leaves stale values behind.
// Real environment variables (set on your host) win over the files.
//
//   SMTP_USER=you@gmail.com        the mail account that sends the RSVP emails
//   SMTP_PASS=...                  its password (for Gmail: an "App password")
//   CONTACT_EMAIL=you@gmail.com    where RSVPs are sent (defaults to SMTP_USER)
//   NEXT_PUBLIC_SITE_URL=https://  shown in the email footer (optional)
//   SMTP_HOST / SMTP_PORT          default: smtp.gmail.com / 587
const readEnvFile = (name) => {
  try {
    return parseEnv(readFileSync(new URL(`../${name}`, import.meta.url), "utf8"));
  } catch {
    return {};
  }
};
const getEnv = () => ({ ...readEnvFile(".env"), ...readEnvFile(".env.local"), ...process.env });

const MAX_BODY_BYTES = 20_000;
const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }; // 5 RSVPs / 10 min / IP

const hits = new Map(); // ip -> timestamps

const rateLimited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > RATE_LIMIT.max;
};

// Returns the mail settings, or null if the email account is not filled in yet.
const getMailConfig = (env) => {
  // RSVP_DRY_RUN=1 -> don't send anything, just print the email in the terminal (for testing).
  if (env.RSVP_DRY_RUN === "1") {
    return { transport: { jsonTransport: true }, from: "rsvp@localhost", to: "dry-run@localhost", dryRun: true };
  }
  const { SMTP_USER, SMTP_PASS } = env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  // 587 = STARTTLS (default), 465 = implicit TLS. Both are encrypted and the certificate is
  // always verified. Some antivirus programs (e.g. Avast "Mail Shield") re-sign port 465 with
  // a certificate Node does not trust, which is why 587 is the default.
  const port = Number(env.SMTP_PORT) || 587;
  return {
    transport: {
      host: env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465,
      requireTLS: port !== 465, // never fall back to an unencrypted connection
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    },
    from: env.RSVP_FROM || SMTP_USER,
    to: env.CONTACT_EMAIL || SMTP_USER,
    dryRun: false,
  };
};

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};

const readJson = (req) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("bad json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Returns a clean RSVP object, or null if the input is not valid. */
const validate = (body) => {
  if (!body || typeof body !== "object") return null;
  const name = str(body.name, 100);
  if (!name || typeof body.attending !== "boolean") return null;

  const attending = body.attending;
  const plusOne = attending && body.plusOne === true;

  return { name, attending, plusOne, message: str(body.message, 2000) };
};

export const handleRsvp = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed" });
  }

  const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "").split(",")[0].trim();
  if (rateLimited(ip)) return send(res, 429, { error: "Too many attempts. Please try again in a few minutes." });

  let body;
  try {
    body = await readJson(req);
  } catch (err) {
    return send(res, err.status ?? 400, { error: "Invalid request" });
  }

  // Honeypot: real guests never fill this hidden field. Pretend success to bots.
  if (typeof body?.website === "string" && body.website !== "") return send(res, 200, { ok: true });

  const rsvp = validate(body);
  if (!rsvp) return send(res, 400, { error: "Please check your answers and try again." });

  const env = getEnv();
  const mail = getMailConfig(env);
  if (!mail) {
    console.error("[rsvp] Email is not set up: fill SMTP_USER and SMTP_PASS in .env.local.");
    return send(res, 500, { error: "RSVPs are not available right now. Please contact the couple directly." });
  }

  try {
    const { subject, html, text } = buildRsvpEmail({ ...rsvp, siteUrl: env.NEXT_PUBLIC_SITE_URL || env.SITE_URL });
    const info = await nodemailer.createTransport(mail.transport).sendMail({
      from: mail.from,
      to: mail.to,
      subject,
      text,
      html,
    });
    if (mail.dryRun) console.log("[rsvp] dry run, email would be:", info.message);
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error(`[rsvp] sending failed (${mail.transport.host ?? "test"}:${mail.transport.port ?? ""}):`, err.message);
    return send(res, 502, { error: "We couldn't send your RSVP. Please try again." });
  }
};
