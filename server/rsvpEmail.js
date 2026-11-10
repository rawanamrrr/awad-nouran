// Builds the RSVP email (subject + plain text + HTML).
// Email clients ignore most modern CSS, so this uses tables and inline styles only.

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Wedding palette: soft pink and warm beige.
const TAUPE = "#5c4a3d"; // main text
const MUTED = "#9a8672"; // small labels
const PINK = "#fce5eb"; // page background
const PAPER = "#fbf6ee"; // card
const BEIGE = "#e8dcc0"; // header
const TAN = "#cdb98e"; // accents
const LINE = "#eadfce";
const SERIF = "Georgia, 'Times New Roman', serif";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Cairo",
  }).format(date);

const row = (label, valueHtml) => `
  <tr>
    <td style="padding:14px 0;border-bottom:1px solid ${LINE};width:38%;vertical-align:top;font:12px ${SERIF};letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">${label}</td>
    <td style="padding:14px 0;border-bottom:1px solid ${LINE};vertical-align:top;font:16px ${SERIF};color:${TAUPE};">${valueHtml}</td>
  </tr>`;

const dash = `<span style="color:#c9bba7;">—</span>`;

/**
 * @param {{
 *   name: string,
 *   attending: boolean,
 *   plusOne: boolean,
 *   message: string,
 *   siteUrl?: string,
 *   receivedAt?: Date,
 * }} rsvp
 */
export const buildRsvpEmail = ({ name, attending, plusOne, message, siteUrl, receivedAt = new Date() }) => {
  const yes = attending === true;
  const guests = yes ? 1 + (plusOne ? 1 : 0) : 0;
  const when = formatDate(receivedAt);

  // Subjects are plain-text headers: keep them on one line (no header injection).
  const subjectName = name.replace(/\s+/g, " ");
  const subject = yes
    ? `RSVP · ${subjectName} · Attending${guests > 1 ? ` (${guests} guests)` : ""}`
    : `RSVP · ${subjectName} · Can't attend`;

  const badge = yes
    ? `<span style="display:inline-block;padding:6px 14px;border-radius:999px;background:#e3ead8;color:#2f5a2a;font:bold 13px ${SERIF};">✓ Will attend</span>`
    : `<span style="display:inline-block;padding:6px 14px;border-radius:999px;background:#f3dcd7;color:#8a3a2e;font:bold 13px ${SERIF};">✕ Can't attend</span>`;

  const messageBlock = message
    ? `<div dir="auto" style="margin-top:6px;padding:14px 16px;background:${PINK};border-left:3px solid ${TAN};border-radius:4px;font:16px/1.6 ${SERIF};color:${TAUPE};">${escapeHtml(message).replace(/\n/g, "<br>")}</div>`
    : dash;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:${PINK};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(subject)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PINK};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr>
          <td style="background:${BEIGE};border-radius:14px 14px 0 0;padding:30px 28px;text-align:center;border-bottom:3px solid ${TAN};">
            <div style="font:12px ${SERIF};letter-spacing:3px;text-transform:uppercase;color:#8a7458;">New RSVP</div>
            <div style="margin-top:8px;font:italic 30px ${SERIF};color:${TAUPE};">Awad &amp; Nouran</div>
          </td>
        </tr>
        <tr>
          <td style="background:${PAPER};border-radius:0 0 14px 14px;padding:28px;">
            <div dir="auto" style="font:26px ${SERIF};color:${TAUPE};">${escapeHtml(name)}</div>
            <div style="margin-top:12px;">${badge}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:1px solid ${LINE};">
              ${yes ? row("Guests", `${guests} ${guests === 1 ? "person" : "people"}`) : ""}
              ${yes ? row("Bringing a +1", plusOne ? "Yes" : "No") : ""}
              ${row("Message", messageBlock)}
              ${row("Received", escapeHtml(when))}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 8px;text-align:center;font:12px ${SERIF};color:#b08a96;">
            Sent automatically from your wedding website${siteUrl ? ` · <a href="${escapeHtml(siteUrl)}" style="color:${TAUPE};">${escapeHtml(siteUrl)}</a>` : ""}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    "New RSVP - Awad & Nouran",
    "",
    `Name: ${name}`,
    `Attending: ${yes ? "Yes" : "No"}`,
    ...(yes ? [`Guests: ${guests}`, `Bringing a +1: ${plusOne ? "Yes" : "No"}`] : []),
    `Message: ${message || "-"}`,
    `Received: ${when}`,
    ...(siteUrl ? ["", siteUrl] : []),
  ].join("\n");

  return { subject, html, text };
};
