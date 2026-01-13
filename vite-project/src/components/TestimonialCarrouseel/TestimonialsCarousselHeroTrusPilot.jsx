import { useEffect, useState } from "react";
import Arrow from "../UtilsComponent/Arrows";

export default function TestimonialsCarousselHeroTrusPilot({ reviews = [] }) {
  const [index, setIndex] = useState(0);
  if (!reviews.length) return null;

  const review = reviews[index];
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((i) => (i + 1) % reviews.length);

  return (
    <div className="relative overflow-visible">
      {/* arrows OUTSIDE the rounded/overflow-hidden card */}
      {/* LEFT ARROWS */}
      <Arrow
        dir="prev"
        variant="mobile"
        onClick={prev}
        posClass="absolute left-3 top-1/2 -translate-y-1/2 z-50"
      />
      <Arrow
        dir="prev"
        variant="desktop"
        onClick={prev}
        posClass="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50"
      />

      {/* RIGHT ARROWS */}
      <Arrow
        dir="next"
        variant="mobile"
        onClick={next}
        posClass="absolute right-3 top-1/2 -translate-y-1/2"
      />
      <Arrow
        dir="next"
        variant="desktop"
        onClick={next}
        posClass="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 "
      />

      {/* the card itself can clip content */}
      <div className="h-full flex flex-col justify-between overflow-hidden rounded-2xl">
        {/* REVIEW CONTENT */}
        <div className="px-10">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {review.title}
          </h3>
          <p className="text-gray-700 leading-relaxed text-center whitespace-pre-line">
            “{review.content}”
          </p>
        </div>

        {/* FOOTER */}
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500 mb-2">
            <strong>{review.name}</strong> · {review.date}
          </div>
          <div className="flex justify-center items-center gap-2 text-sm text-emerald-600">
            ★ Verified on Trustpilot
          </div>
        </div>
      </div>
    </div>
  );
}
