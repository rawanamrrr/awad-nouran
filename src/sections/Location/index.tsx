import venueImage from "@/assets/venue.webp";

export const Location = () => {
  return (
    <section className="text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] pt-32 pb-20 px-6 md:text-[19px] md:leading-[29.45px] md:pt-44 md:pb-28">
      <div className="text-[17px] box-border caret-transparent leading-[26.35px] max-w-md mix-blend-multiply outline-[3px] text-center mx-auto md:text-[19px] md:leading-[29.45px]">
        <h2 className="text-5xl box-border caret-transparent leading-[48px] outline-[3px] md:text-7xl md:leading-[72px]">
          {"Location"}
        </h2>
        <p className="text-[36px] box-border caret-transparent leading-[44px] outline-[3px] mt-6 font-great_vibes md:text-[50px] md:leading-[60px]">
          {"JW Marriott Hotel"}
        </p>
        <p className="text-slate-600/70 text-base font-light box-border caret-transparent tracking-[2.4px] leading-6 outline-[3px] uppercase mt-4 font-jost md:text-lg md:tracking-[2.7px] md:leading-7">
          {"Tut Ballroom"}
        </p>
        <p className="text-slate-600/80 text-xs font-light box-border caret-transparent leading-[19.5px] outline-[3px] mt-8 font-jost md:text-[13px] md:leading-[21.125px]">
          {
            "The Tut Ballroom at the JW Marriott Hotel will be the setting for our celebration."
          }
        </p>
        <p className="text-slate-600/80 text-xs font-light box-border caret-transparent leading-[19.5px] outline-[3px] mt-4 font-jost md:text-[13px] md:leading-[21.125px]">
          {
            "We recommend arriving a little early to settle in and enjoy the surroundings before the celebration begins."
          }
        </p>
        <div className="relative text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] translate-x-[-50.0%] w-[96%] mt-8 left-2/4 md:text-[19px] md:leading-[29.45px] md:w-[90%]">
          <img
            src={venueImage}
            alt="Illustration of the venue"
            className="text-[17px] box-border caret-transparent leading-[26.35px] max-w-full outline-[3px] pointer-events-none w-full md:text-[19px] md:leading-[29.45px]"
          />
        </div>
        <a
          href="https://maps.app.goo.gl/5qZ7yJ4gAQYVpKRZ7"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[17px] items-center box-border caret-transparent inline-flex flex-col leading-[26.35px] outline-[3px] mt-10 md:text-[19px] md:leading-[29.45px]"
        >
          <span className="relative text-[17px] box-border caret-transparent block leading-[26.35px] min-h-[auto] min-w-[auto] outline-[3px] border border-slate-600/40 p-[3px] border-solid md:text-[19px] md:leading-[29.45px]">
            <span className="text-[17px] box-border caret-transparent block leading-[26.35px] outline-[3px] border border-slate-600/20 px-10 py-3 border-solid md:text-[19px] md:leading-[29.45px]">
              <span className="text-[10px] font-light box-border caret-transparent block tracking-[3.2px] leading-[15.5px] outline-[3px] uppercase font-jost">
                {"Get Directions"}
              </span>
            </span>
          </span>
        </a>
      </div>
    </section>
  );
};
