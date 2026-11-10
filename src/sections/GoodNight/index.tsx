import babyIcon from "@/assets/baby-sleeping.webp";

export const GoodNight = () => {
  return (
    <section className="relative box-border w-full bg-stone-100 mt-[70px] px-6 py-36 md:mt-[110px] md:py-56">
      <img
        src="https://c.animaapp.com/gADq8Fnr99KwOlxflEtgjg/assets/transport-nacre-bg.png"
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full w-full max-w-full object-cover"
      />
      <div className="relative z-[1] mx-auto max-w-[340px] bg-[url('https://motherofpearl.thedigitalyes.com/__l5e/assets-v1/52d29df6-7256-45ed-9a6c-da77faa33886/transport-paper-card.png')] bg-cover bg-center px-8 py-14 text-center shadow-[rgba(76,95,118,0.35)_0px_10px_30px_-12px] md:max-w-md md:px-12 md:py-16">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-white/50"></div>
        <img
          src={babyIcon}
          alt=""
          className="mx-auto w-32 max-w-full opacity-90 md:w-40"
        />
        <h2 className="mt-10 font-cormorant_garamond text-4xl leading-tight text-slate-600 md:text-6xl">
          {"A Little Note"}
        </h2>
        <p className="mx-auto mt-5 max-w-[280px] font-monsieur_la_doulaise_local text-5xl text-balance leading-[1.15] text-slate-600 md:max-w-[340px] md:text-7xl">
          {"“Wish your babies a good night”"}
        </p>
      </div>
    </section>
  );
};
