export const Hero = () => {
  return (
    <section className="relative text-[17px] bg-stone-100 box-border caret-transparent flex flex-col leading-[26.35px] min-h-svh outline-[3px] overflow-hidden md:text-[19px] md:leading-[29.45px]">
      <div className="absolute text-[17px] bg-stone-100 box-border caret-transparent leading-[26.35px] outline-[3px] inset-0 md:text-[19px] md:leading-[29.45px]"></div>
      <img
        src="https://c.animaapp.com/gADq8Fnr99KwOlxflEtgjg/assets/hero-frame.png"
        alt=""
        className="absolute text-[17px] box-border caret-transparent h-full leading-[26.35px] max-w-full object-cover outline-[3px] pointer-events-none w-full inset-0 md:text-[19px] md:leading-[29.45px]"
      />
      <div className="relative text-[17px] items-center box-border caret-transparent flex basis-[0%] flex-col grow justify-center leading-[26.35px] min-h-[auto] min-w-[auto] outline-[3px] text-center z-20 px-6 md:text-[19px] md:leading-[29.45px]">
        <p className="text-[17px] box-border caret-transparent tracking-[0.425px] leading-[23.375px] min-h-[auto] min-w-[auto] outline-[3px] md:text-[19px] md:tracking-[0.475px] md:leading-[26.125px]">
          <span className="text-[17px] box-border caret-transparent block tracking-[0.425px] leading-[23.375px] outline-[3px] md:text-[19px] md:tracking-[0.475px] md:leading-[26.125px]">
            {"Together with"}
          </span>
          <span className="text-[17px] box-border caret-transparent block tracking-[0.425px] leading-[23.375px] outline-[3px] md:text-[19px] md:tracking-[0.475px] md:leading-[26.125px]">
            {"their families"}
          </span>
        </p>
        <div className="text-[17px] items-center box-border caret-transparent flex flex-col leading-[26.35px] min-h-[auto] min-w-[auto] outline-[3px] mt-8 md:text-[19px] md:leading-[29.45px] md:mt-10">
          <h1 className="text-[50px] box-border caret-transparent leading-[47.5px] min-h-[auto] min-w-[auto] outline-[3px] font-monsieur_la_doulaise_local md:text-[64px] md:leading-[60.8px]">
            {"Awad"}
          </h1>
          <p className="text-lg box-border caret-transparent leading-[18px] min-h-[auto] min-w-[auto] outline-[3px] my-2.5 md:text-xl md:leading-7 md:my-3.5">
            {"&"}
          </p>
          <h1 className="text-[50px] box-border caret-transparent leading-[47.5px] min-h-[auto] min-w-[auto] outline-[3px] font-monsieur_la_doulaise_local md:text-[64px] md:leading-[60.8px]">
            {"Nouran"}
          </h1>
        </div>
        <p className="text-[17px] box-border caret-transparent tracking-[0.425px] leading-[23.375px] min-h-[auto] min-w-[auto] outline-[3px] mt-6 md:text-[19px] md:tracking-[0.475px] md:leading-[26.125px] md:mt-8">
          {"invite you to their wedding"}
        </p>
        <p className="text-[17px] font-medium font-cinzel tracking-[2px] leading-7 box-border caret-transparent min-h-[auto] min-w-[auto] outline-[3px] mt-6 md:text-[19px] md:tracking-[2.5px] md:mt-8">
          {"19.11.2026 · 9:00 PM"}
        </p>
        <div className="text-[17px] items-center box-border caret-transparent flex flex-col leading-[26.35px] min-h-[auto] min-w-[auto] outline-[3px] mt-5 md:text-[19px] md:leading-[29.45px] md:mt-6">
          <p className="text-xl box-border caret-transparent tracking-[0.5px] leading-[27.5px] min-h-[auto] min-w-[auto] outline-[3px] md:text-2xl md:tracking-[0.6px] md:leading-8">
            {"JW Marriott Hotel"}
          </p>
          <p className="text-[11px] font-light box-border caret-transparent tracking-[2.75px] leading-[17.05px] min-h-[auto] min-w-[auto] outline-[3px] uppercase mt-1 font-jost md:text-xs md:tracking-[3px] md:leading-4">
            {"Tut Ballroom"}
          </p>
        </div>
      </div>
    </section>
  );
};
