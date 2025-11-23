import React from "react";
import { PlayButton } from "./Icons";
import eight from '../assets/8.avif';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-[600px] w-full overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={eight}
          alt="Garage Workshop Background"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl pl-4 md:pl-0">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-white font-medium tracking-wide text-lg">
              Serving you since 1992
            </span>
            <div className="h-[2px] w-12 bg-brand-red"></div>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 font-heading">
            Upgrade Your Car's <br /> Performance
          </h2>

          <a
            href="https://www.youtube.com/watch?v=PUkAIAIzA0I"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 cursor-pointer group w-fit"
          >
            <PlayButton />
            <div className="text-white text-xs font-bold tracking-widest group-hover:text-brand-red transition-colors">
              <div className="text-lg font-normal mb-1 font-heading">
                WATCH VIDEO
              </div>
              <div className="text-gray-400">ABOUT US</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
