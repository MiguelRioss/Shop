import React, { useState } from "react";

export default function YouTubeWithThumbnail() {
  const [play, setPlay] = useState(false);
  const videoId = "KFKGv5Nojag"; // muda para o teu vídeo

  return (
    <div className="overflow-hidden rounded-xl shadow-lg aspect-video relative">
      {!play ? (
        <button
          onClick={() => setPlay(true)}
          className="w-full h-full relative"
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube thumbnail"
            className="w-full h-full object-cover"
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 rounded-full p-4  mt-20 shadow-lg hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4  text-[#f5653b]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

        </button>
      ) : (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
