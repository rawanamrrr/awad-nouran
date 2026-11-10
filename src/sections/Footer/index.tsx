import { useEffect } from "react";
import footerSeal from "@/assets/footer-seal.webp";

export const Footer = () => {
  useEffect(() => {
    console.log("__ANIMA_DBG__ footer_visibility", {
      breakpointHint: "md+",
      forcedOpacityClassRemoved: true,
    });
  }, []);

  return (
    <footer className="relative text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] text-center pt-32 pb-20 px-6 md:text-[19px] md:leading-[29.45px] md:pt-44">
      <div className="text-[17px] box-border caret-transparent leading-[26.35px] opacity-100 outline-[3px] md:text-[19px] md:leading-[29.45px]">
        <img
          src={footerSeal}
          alt="A & N"
          className="text-[17px] box-border caret-transparent leading-[26.35px] max-w-full outline-[3px] pointer-events-none w-28 -mt-3 mb-8 mx-auto md:text-[19px] md:leading-[29.45px] md:w-36"
        />
        <p className="text-slate-600/80 text-xl box-border caret-transparent leading-[32.5px] outline-[3px] mb-10 md:text-3xl md:leading-9">
          {"We can't wait to celebrate with you."}
        </p>
        <p className="text-slate-600/60 text-[13px] font-light box-border caret-transparent leading-[20.15px] outline-[3px] mb-3 font-jost">
          {"With love,"}
        </p>
        <p className="text-6xl box-border caret-transparent leading-[75px] outline-[3px] mb-4 font-monsieur_la_doulaise_local md:text-7xl md:leading-[72px]">
          {"Awad"}
          <span className="text-slate-600/50 text-3xl box-border caret-transparent leading-9 outline-[3px] md:text-4xl md:leading-10">
            {"&"}
          </span>
          {"Nouran"}
        </p>
        <p className="text-slate-600/50 text-[13px] font-light box-border caret-transparent tracking-[0.325px] leading-[20.15px] outline-[3px] font-jost">
          {"19 November 2026"}
        </p>
        <p className="text-slate-600/40 text-sm font-light box-border caret-transparent leading-5 outline-[3px] mt-16 font-jost">
          {"Made with love by "}
          <a
            href="https://invitations.digitivaa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="box-border caret-transparent outline-[3px] underline underline-offset-2 hover:text-slate-600"
          >
            {"Digitiva"}
          </a>
        </p>
      </div>
    </footer>
  );
};
