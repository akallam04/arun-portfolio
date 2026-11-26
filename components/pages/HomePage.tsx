import { HOME } from "@/lib/data";
import { HomeActions } from "./HomeActions";
import { HomePhoto } from "./HomePhoto";
import { HomeStatus } from "./HomeStatus";

export function HomePage() {
  return (
    <section id="home" data-page aria-labelledby="home-title" className="page">
      <div className="page-inner">
        <div className="grid flex-1 items-center gap-7 desk:mx-auto desk:min-h-0 desk:w-full desk:max-w-[clamp(1080px,152vh,1700px)] desk:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] desk:gap-x-14 desk:gap-y-0">
          <div className="flex justify-center desk:order-last desk:justify-start">
            <div className="relative">
              <HomePhoto />
              <div className="absolute -bottom-7 -left-14 hidden w-[clamp(300px,46vh,460px)] desk:block" data-pinned-card>
                <HomeStatus pinned />
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[17px] font-medium text-muted desk:text-[clamp(15px,2.3vh,26px)]">{HOME.hello}</p>
            <h1
              id="home-title"
              className="mt-1 text-[clamp(56px,17vw,84px)] font-black leading-[0.9] tracking-[-0.025em] text-ink desk:mt-[clamp(2px,0.6vh,10px)] desk:text-[clamp(70px,13.4vh,200px)]"
              style={{ fontStretch: "125%" }}
            >
              <span className="block">{HOME.first}</span>
              <span className="block">{HOME.last}</span>
            </h1>
            <p
              className="mt-4 text-[22px] font-bold text-ink desk:mt-[clamp(10px,2vh,28px)] desk:text-[clamp(20px,3.2vh,40px)]"
              style={{ fontStretch: "112%" }}
            >
              {HOME.role}
            </p>
            <p className="mt-1.5 max-w-[34ch] text-[18px] leading-snug text-ink-2 desk:mt-[clamp(4px,0.9vh,12px)] desk:max-w-[40ch] desk:text-[clamp(16px,2.4vh,29px)]">
              {HOME.lede}
            </p>
            <div className="mt-5 desk:hidden">
              <HomeStatus />
            </div>
            <div className="mt-5 desk:mt-[clamp(16px,3.2vh,44px)]">
              <HomeActions />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
