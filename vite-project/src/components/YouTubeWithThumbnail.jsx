import React, { useState } from "react";

export default function YouTubeWithThumbnail() {
  const [play, setPlay] = useState(false);
  const videoId = "KFKGv5Nojag"; // muda para o teu vídeo

  return (
    <div className="overflow-hidden rounded-xl shadow-lg aspect-video relative">
      
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
    
    </div>
  );
}
