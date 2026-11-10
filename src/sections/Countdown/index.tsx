import { useEffect, useState } from "react";
import countdownBg from "@/assets/countdown-bg.webp";
import { CountdownUnit } from "@/sections/Countdown/components/CountdownUnit";

// Wedding: 19 November 2026, 9:00 PM (Egypt time, UTC+2)
const WEDDING_DATE = new Date("2026-11-19T21:00:00+02:00").getTime();

const getTimeLeft = () => {
  const diff = Math.max(0, WEDDING_DATE - Date.now());
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
};

export const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="box-border w-full" style={{ backgroundColor: "#fce5eb" }}>
      <div
        className="relative mx-auto w-full max-w-[900px]"
        style={{ aspectRatio: "1645 / 956", containerType: "inline-size" }}
      >
        <img
          src={countdownBg}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
        />

        <h2
          className="absolute inset-x-0 text-center font-cormorant_garamond font-normal"
          style={{
            top: "15%",
            transform: "translateY(-50%)",
            fontSize: "7cqw",
            lineHeight: 1,
            color: "#7f8ea3",
          }}
        >
          Countdown
        </h2>

        <div
          className="absolute grid grid-cols-4"
          style={{ left: "17%", right: "17%", top: "50%", transform: "translateY(-50%)" }}
        >
          <CountdownUnit value={timeLeft.days} label="Days" />
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <CountdownUnit value={timeLeft.minutes} label="Minutes" />
          <CountdownUnit value={timeLeft.seconds} label="Seconds" />
        </div>

        <p
          className="absolute inset-x-0 text-center font-monsieur_la_doulaise_local"
          style={{
            top: "87%",
            transform: "translateY(-50%)",
            fontSize: "10cqw",
            lineHeight: 1,
            color: "#7f8ea3",
          }}
        >
          See you soon!
        </p>
      </div>
    </section>
  );
};
