import { useState } from "react";
import envelopeOpen from "@/assets/envelope-open.webp";

const ENVELOPE_CLOSED =
  "https://c.animaapp.com/gADq8Fnr99KwOlxflEtgjg/assets/rsvp-envelope-cerrado.png";
const OPEN_MS = 700;

type Answer = "yes" | "no";

export type RsvpPayload = {
  name: string;
  attending: boolean;
  plusOne: boolean;
  message: string;
};

// Posts the RSVP to the server, which emails it to the couple (see server/rsvpHandler.js).
const sendRsvp = async (payload: RsvpPayload & { website: string }): Promise<void> => {
  const res = await fetch("/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }
};

const labelClass =
  "mb-3 block font-jost text-[10px] font-medium uppercase tracking-[0.3em] text-slate-600/80";
const inputClass =
  "w-full border border-slate-600/30 bg-transparent px-4 py-3 text-center font-cormorant_garamond text-base text-slate-600 placeholder:text-slate-600/40 focus:border-slate-600/70 focus:outline-none";

const Radio = ({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: string;
}) => (
  <label className="flex cursor-pointer items-center justify-center gap-3 py-1.5 font-cormorant_garamond text-base text-slate-600">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="peer sr-only"
    />
    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-600/50 peer-checked:border-slate-600 peer-focus-visible:ring-2 peer-focus-visible:ring-slate-600/40 [&>span]:peer-checked:opacity-100">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-600 opacity-0 transition-opacity" />
    </span>
    {children}
  </label>
);

export const Rsvp = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Answer>("yes");
  const [plusOne, setPlusOne] = useState<Answer>("no");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // hidden field: only bots fill it
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const coming = attending === "yes";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please tell us your name.");
      return;
    }
    setError("");
    setSending(true);
    try {
      await sendRsvp({
        name: name.trim(),
        attending: coming,
        plusOne: coming && plusOne === "yes",
        message: message.trim(),
        website: honeypot,
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="relative z-10 mt-[-30px] box-border bg-[#fdebee] pb-20 md:pb-28">
      <img
        src="https://c.animaapp.com/gADq8Fnr99KwOlxflEtgjg/assets/rsvp-top-border.png"
        alt=""
        className="pointer-events-none w-full max-w-full"
      />
      <div className="px-6 pt-10 md:pt-16">
        <div className="mx-auto max-w-2xl pt-[60px]">
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="text-5xl leading-[48px] text-slate-600 md:text-7xl md:leading-[72px]">
              {"Confirm your attendance"}
            </h2>
            <p className="mt-4 max-w-md font-jost text-[15px] leading-[24.375px] text-slate-600/80">
              {
                "Nothing would make us happier than celebrating this day surrounded by our favourite people. Please let us know whether you'll be able to join us."
              }
            </p>
          </div>

          <button
            type="button"
            aria-label={open ? "Close the RSVP envelope" : "Open the RSVP envelope"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative mx-auto mb-10 block aspect-square w-[260px] bg-transparent p-0 text-center md:w-[340px]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <img
              src={ENVELOPE_CLOSED}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-500"
              style={{ opacity: open ? 0 : 1 }}
            />
            <img
              src={envelopeOpen}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-contain object-bottom transition-opacity duration-500"
              style={{ opacity: open ? 1 : 0 }}
            />
            <span
              className="absolute inset-x-0 -bottom-7 block font-jost text-[10px] font-light uppercase leading-[15.5px] tracking-[3.2px] text-slate-600/80 transition-opacity duration-300"
              style={{ opacity: open ? 0 : 1 }}
            >
              {"Tap to open"}
            </span>
          </button>

          {/* The form unfolds below the envelope once it is open. */}
          <div
            className="grid"
            style={{
              gridTemplateRows: open ? "1fr" : "0fr",
              opacity: open ? 1 : 0,
              visibility: open ? "visible" : "hidden",
              transition: `grid-template-rows ${OPEN_MS}ms ease-in-out, opacity ${OPEN_MS}ms ease-in-out, visibility 0s linear ${open ? 0 : OPEN_MS}ms`,
            }}
          >
            <div className="overflow-hidden">
              {done ? (
                <div className="mx-auto max-w-md py-10 text-center">
                  <p className="font-cormorant_garamond text-3xl text-slate-600">
                    {coming
                      ? `Thank you, ${name.trim()}.`
                      : `Thank you for letting us know, ${name.trim()}.`}
                  </p>
                  <p className="mt-3 font-jost text-[13px] font-light text-slate-600/80">
                    {coming ? "We can't wait to celebrate with you." : "You will be missed."}
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="mx-auto max-w-md text-center" noValidate>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  <div className="mb-8">
                    <label htmlFor="rsvp-name" className={labelClass}>
                      {"Your name"}
                    </label>
                    <input
                      id="rsvp-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>

                  <fieldset className="mb-8">
                    <legend className={`${labelClass} mx-auto`}>{"Will you be attending?"}</legend>
                    <Radio name="attending" value="yes" checked={coming} onChange={() => setAttending("yes")}>
                      Joyfully accepts
                    </Radio>
                    <Radio name="attending" value="no" checked={!coming} onChange={() => setAttending("no")}>
                      Regretfully declines
                    </Radio>
                  </fieldset>

                  {coming && (
                    <>
                      <fieldset className="mb-8">
                        <legend className={`${labelClass} mx-auto`}>{"Will you be bringing a +1?"}</legend>
                        <Radio name="plusOne" value="yes" checked={plusOne === "yes"} onChange={() => setPlusOne("yes")}>
                          Yes, with pleasure
                        </Radio>
                        <Radio name="plusOne" value="no" checked={plusOne === "no"} onChange={() => setPlusOne("no")}>
                          Just me
                        </Radio>
                      </fieldset>

                    </>
                  )}

                  <div className="mb-8">
                    <label htmlFor="rsvp-message" className={labelClass}>
                      {"Leave a message for the couple"}
                    </label>
                    <textarea
                      id="rsvp-message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a few words for Awad & Nouran, a wish, a memory, anything you like..."
                      className={`${inputClass} resize-none !text-left`}
                    />
                  </div>

                  {error && (
                    <p role="alert" className="mb-4 font-jost text-[12px] text-slate-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex flex-col items-center bg-transparent p-0 text-slate-600 disabled:opacity-60"
                  >
                    <span className="relative block border border-slate-600/40 p-[3px]">
                      <span className="block border border-slate-600/20 px-10 py-3">
                        <span className="block font-jost text-[10px] font-light uppercase leading-[15.5px] tracking-[3.2px]">
                          {sending ? "Sending..." : "Send RSVP"}
                        </span>
                      </span>
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
