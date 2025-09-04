import React from "react";

/**
 * StoriesCarousel
 * Minimal dependency-free testimonial carousel matching the screenshot vibe.
 * - Top: title + CTA pill + subtitle + thin divider
 * - Center: large orange headline, body with bold spans, author line
 * - Left/right circular arrows
 * - Auto-play (can be disabled), pauses on hover, keyboard accessible
 */

const ITEMS = [
  {
    headline: "“Focused work mode in minutes”",
    body: (
      <>
        “20 drops, slow breaths, and I’m ready for calls—focused without the jitters.”
      </>
    ),
    author: "Priya S., London, UK",
  },
  {
    headline: "“Clearer mornings”",
    body: (
      <>
        “I keep Meso in my handbag. Less fog, more clarity during the day.”
      </>
    ),
    author: "Teri R., Dublin, IE",
  },
  {
    headline: "“Feet on the ground”",
    body: (
      <>
        “When the day tailspins, this helps me feel anchored and steady.”
      </>
    ),
    author: "Ana M., Porto, PT",
  },
  {
    headline: "“Less reactive, more present”",
    body: (
      <>
        “I notice a pause before I react. Conversations feel easier and calmer.”
      </>
    ),
    author: "Marcus D., Austin, TX",
  },
  {
    headline: "“Softer edges to anxiety”",
    body: (
      <>
        “A few drops help take the edge off those nervous flutters, subtle but noticeable.”
      </>
    ),
    author: "Lila K., Seattle, WA",
  },
  {
    headline: "“Creative flow switch”",
    body: (
      <>
        “I use it before writing sessions. Ideas connect and my creative flow lasts longer.”
      </>
    ),
    author: "Javier P., Barcelona, ES",
  },
  {
    headline: "“From scattered to centered”",
    body: (
      <>
        “Great mid-day reset after screen overload. My focus comes back online, especially if I go for a walk.”
      </>
    ),
    author: "Chen W., Vancouver, CA",
  },
  {
    headline: "“Calm focus for deep work”",
    body: (
      <>
        “Pairs perfectly with my noise-cancelling headphones. I get into the zone faster.”
      </>
    ),
    author: "Naomi B., New York, NY",
  },
  {
    headline: "“Parenting is easier”",
    body: (
      <>
        “I’m less snappy during the dinner rush: more patience, more presence.”
      </>
    ),
    author: "Sofia L., Toronto, CA",
  },
  {
    headline: "“Gentle wind-down, sharper start”",
    body: (
      <>
        “I take it after lunch to unwind in the evenings. When I take it in the mornings, I feel clearer and more intentional.”
      </>
    ),
    author: "Hugo F., Lisbon, PT",
  },
  {
    headline: "“More Intense Dreams”",
    body: (
      <>
        “I was never one to recall my dreams, or even have very interesting ones. Not so with Meso! Feels like I’m at the movies while I sleep.”
      </>
    ),
    author: "Josh, Australia",
  },
];


export default function CarouselsHero({ autoPlay = true, intervalMs = 6000 }) {
  const [i, setI] = React.useState(0);
  const count = ITEMS.length;
  const wrap = (n) => (n + count) % count;

  const next = React.useCallback(() => setI((v) => wrap(v + 1)), [count]);
  const prev = React.useCallback(() => setI((v) => wrap(v - 1)), [count]);

  // autoplay with pause on hover
  const hoverRef = React.useRef(null);
  React.useEffect(() => {
    if (!autoPlay) return;
    let id;
    const start = () => (id = window.setInterval(next, intervalMs));
    const stop = () => id && window.clearInterval(id);
    start();
    const el = hoverRef.current;
    if (el) {
      el.addEventListener("mouseenter", stop);
      el.addEventListener("mouseleave", start);
    }
    return () => {
      stop();
      if (el) {
        el.removeEventListener("mouseenter", stop);
        el.removeEventListener("mouseleave", start);
      }
    };
  }, [autoPlay, intervalMs, next]);

  // keyboard
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <section className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20" ref={hoverRef}>
        {/* Header */}
        <div className="text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">Meso Stories</h2>
          <a
            href="#get"
            className="mt-4 inline-flex items-center rounded-full  border border-[var(--brand)]   px-6 py-2 hover:bg-[var(--brand)] text-[var(--brand)] font-semibold hover:text-white transition"
          >
            Get Meso
          </a>
          <p className="mx-auto mt-5 max-w-3xl text-gray-700">
            Meso cares about its community and the wider wellness space. Here’s what some of our
            customers are saying:
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-gray-700">
            Join Meso Movement
          </p>
          <div className="mx-auto mt-6 h-px w-48 bg-black/10" />
        </div>

        {/* Slide */}
        <div className="relative mt-10">
          {/* arrows */}
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black/60 hover:bg-black/5"
          >
            ←
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-black/60 hover:bg-black/5"
          >
            →
          </button>

          {/* content */}
          <div className="mx-auto max-w-4xl text-center px-12">
            <h3 className="font-serif text-3xl sm:text-5xl text-[var(--brand)]">
              {ITEMS[i].headline}
            </h3>
            <p className="mt-6 text-gray-800 text-lg leading-relaxed">{ITEMS[i].body}</p>
            <p className="mt-5 text-gray-600 italic">{ITEMS[i].author}</p>
          </div>

          {/* dots */}
          <div className="mt-8 flex justify-center gap-2">
            {ITEMS.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  i === idx ? "bg-[var(--brand)] w-6" : "bg-black/20"
                }`}
              />
            ))}
          </div>
        </div>
         <p className="mx-auto mt-5 max-w-3xl text-gray-700">
           Individual experiences may vary. Meso is a general wellness liquid technology and is not
intended to diagnose, treat, cure, or prevent any disease.
          </p>
      </div>
      
    </section>
  );
}
