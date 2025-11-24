import React, { useState, useRef, useEffect } from "react";
import { PlayButton } from "./Icons";
import eight from "../assets/8.avif";
// Import your video file
import backgroundVideo from "../assets/Abe-video.mp4"; 

const Hero: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  useEffect(() => {
    if (isVideoPlaying && videoRef.current) {
      // Play the video when the state changes to true
      videoRef.current.play().catch((err) => {
        console.error("Video playback failed:", err);
      });
    }
  }, [isVideoPlaying]);

  return (
    <section id="home" className="relative h-[500px] w-full overflow-hidden">
      {/* Background Container for Image and Video */}
      <div className="absolute inset-0 z-0">
        {/* Video Background (visible when isVideoPlaying is true) */}
        <video
          ref={videoRef}
          src={backgroundVideo}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
            isVideoPlaying ? "opacity-100" : "opacity-0"
          }`}
          loop
          muted // Autoplay generally requires muted
          playsInline
          // Add 'controls' if you want user controls (play/pause/volume) to appear
        />

        {/* Image Background (hidden when isVideoPlaying is true) */}
        <img
          src={eight}
          alt="Garage Workshop Background"
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isVideoPlaying ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Dark Overlay for text readability - Adjust opacity as needed */}
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

          {/* This button now triggers the local video playback */}
          {!isVideoPlaying && (
            <button
              onClick={handlePlayVideo}
              className="flex items-center gap-4 cursor-pointer group w-fit focus:outline-none"
            >
              <PlayButton />
              <div className="text-white text-xs font-bold tracking-widest group-hover:text-brand-red transition-colors">
                <div className="text-lg font-normal mb-1 font-heading">
                  WATCH VIDEO
                </div>
                <div className="text-gray-400">ABOUT US</div>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
