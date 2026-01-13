// src/components/YouTubeWithThumbnail.jsx
import React, { useMemo, useState } from "react";

function extractYouTubeId(input = "") {
  const s = String(input || "").trim();

  // If already an ID
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;

  // Matches: v=XXXXXXXXXXX, youtu.be/XXXXXXXXXXX, /embed/XXXXXXXXXXX
  const m = s.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/i);
  return m ? m[1] : null;
}

export default function YouTubeWithThumbnail({
  url = "", // new
  mode = "thumbnail", // "thumbnail" | "iframe"
  defaultVideoId = "KFKGv5Nojag", // fallback for old blogs
}) {
  const [play, setPlay] = useState(false);

  const videoId = useMemo(() => {
    const id = extractYouTubeId(url);
    return id || defaultVideoId;
  }, [url, defaultVideoId]);

  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  

  // ✅ New behaviour (thumbnail -> play)
  return (
    <div className="overflow-hidden rounded-xl shadow-lg aspect-video relative">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
        title="YouTube video player"
        frameBorder="0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      
    </div>
  );
}
