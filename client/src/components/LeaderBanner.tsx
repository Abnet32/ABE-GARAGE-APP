import React from "react";
import { PlayButton } from "./Icons";
import seven from '../assets/7.avif';

const LeaderBanner: React.FC = () => {
  return (
    <section className="relative h-[400px] w-full overflow-hidden">
      {/* Image Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={seven}
          alt="Mechanic working"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-blue/90 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-white font-medium tracking-wide text-lg">
              Serving you since 1992
            </span>
            <div className="h-[2px] w-12 bg-brand-red"></div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-8 font-heading">
            We are leaders in <br /> Car Mechanical Work
          </h2>

          <a
            href="https://www.youtube.com/watch?v=PUkAIAIzA0I"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 cursor-pointer group w-fit "
          >
            <PlayButton small />
            <div className="text-white text-[10px] font-bold tracking-widest group-hover:text-brand-red transition-colors ">
              <div className="text-base font-normal font-heading">
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

export default LeaderBanner;
