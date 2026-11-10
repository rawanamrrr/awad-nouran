import { Intro } from "@/sections/Intro";
import { MusicButton } from "@/components/MusicButton";
import { Hero } from "@/sections/Hero";
import { Countdown } from "@/sections/Countdown";
import { PhotoSection } from "@/sections/PhotoSection";
import { Location } from "@/sections/Location";
import { GoodNight } from "@/sections/GoodNight";
import { Rsvp } from "@/sections/Rsvp";
import { Footer } from "@/sections/Footer";

export const App = () => {
  return (
    <div className="text-slate-600 text-[17px] not-italic normal-nums font-normal accent-auto bg-blend-overlay bg-stone-100 bg-[url(data:image/svg+xml,%3Csvg%20viewBox=%270%200%20400%20400%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter%20id=%27noiseFilter%27%3E%3CfeTurbulence%20type=%27fractalNoise%27%20baseFrequency=%270.9%27%20numOctaves=%274%27%20stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect%20width=%27100%25%27%20height=%27100%25%27%20filter=%27url%28%23noiseFilter)] bg-size-[200px] box-border caret-transparent block tracking-[normal] leading-[26.35px] list-outside list-disc outline-[3px] pointer-events-auto text-start indent-[0px] normal-case visible overflow-hidden border-separate font-cormorant_garamond md:text-[19px] md:leading-[29.45px]">
      <div className="text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] md:text-[19px] md:leading-[29.45px]">
        <div
          role="region"
          aria-label="Notifications (F8)"
          className="text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] pointer-events-none md:text-[19px] md:leading-[29.45px]"
        >
          <ol className="fixed text-[17px] box-border caret-transparent flex flex-col-reverse leading-[26.35px] list-none max-h-[1000px] max-w-none outline-[3px] w-full z-[100] p-4 right-auto top-0 bottom-auto md:text-[19px] md:flex-col md:leading-[29.45px] md:max-w-[420px] md:right-0 md:top-auto md:bottom-0"></ol>
        </div>
        <section
          aria-label="Notifications alt+T"
          className="text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] md:text-[19px] md:leading-[29.45px]"
        ></section>
        <Intro />
        <MusicButton />
        <main className="text-[17px] bg-stone-100 box-border caret-transparent leading-[26.35px] outline-[3px] overflow-x-clip md:text-[19px] md:leading-[29.45px]">
          <Hero />
          <div className="text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] md:text-[19px] md:leading-[29.45px]">
            <Countdown />
          </div>
          <div className="text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] md:text-[19px] md:leading-[29.45px]">
            <PhotoSection />
          </div>
          <div className="text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] md:text-[19px] md:leading-[29.45px]">
            <Location />
          </div>
          <div className="text-[17px] box-border caret-transparent leading-[26.35px] outline-[3px] md:text-[19px] md:leading-[29.45px]">
            <GoodNight />
          </div>
          <div className="text-[17px] box-border caret-transparent leading-[26.35px] opacity-100 outline-[3px] transform-none md:text-[19px] md:leading-[29.45px]">
            <Rsvp />
          </div>
          <div className="text-[17px] box-border caret-transparent leading-[26.35px] opacity-100 outline-[3px] transform-none md:text-[19px] md:leading-[29.45px]">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};
