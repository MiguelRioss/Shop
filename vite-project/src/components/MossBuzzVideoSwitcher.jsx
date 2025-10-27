import React from "react";
import MossBuzzVideoFeed from "./MossBuzzVideoFeed.jsx";
import MossBuzzVideoCarousel from "./MossBuzzVideoCarousel.jsx";

const options = [
  { value: "reels", label: "Reels" },
  { value: "carousel", label: "Carousel" },
];

export default function MossBuzzVideoSwitcher({
  videos = [],
  shorts = [],
  title = "Featured Community Videos",
  subtitle = "Tap through real MOSBUZZ stories or switch to a carousel view.",
}) {
  const [mode, setMode] = React.useState("reels");
  const groupId = React.useId();

  const update = (value) => {
    setMode(value);
  };

  const onKeyDown = (e) => {
    const idx = options.findIndex((o) => o.value === mode);
    if (idx < 0) return;
    if (e.key === "ArrowRight") {
      update(options[(idx + 1) % options.length].value);
    } else if (e.key === "ArrowLeft") {
      update(options[(idx - 1 + options.length) % options.length].value);
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-0">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--brand)]">
          Section 2
        </p>
        <h2 className="mt-2 text-2xl font-serif text-gray-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">{subtitle}</p>
      </header>

      <div className="mb-8 flex justify-center">
        <div
          role="radiogroup"
          aria-labelledby={`${groupId}-label`}
          className="inline-flex rounded-full p-[2px]"
          style={{ background: "var(--brand-gradient)" }}
          onKeyDown={onKeyDown}
        >
          <div className="flex rounded-full overflow-hidden bg-white">
            <span id={`${groupId}-label`} className="sr-only">
              Select MOSBUZZ video view
            </span>
            {options.map((option) => {
              const active = option.value === mode;
              const inputId = `${groupId}-${option.value}`;
              return (
                <label
                  key={option.value}
                  htmlFor={inputId}
                  className="px-3 py-1.5 text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                  style={
                    active
                      ? {
                          background: "var(--brand-gradient)",
                          color: "#fff",
                          touchAction: "manipulation",
                        }
                      : {
                          color: "var(--brand-from)",
                          touchAction: "manipulation",
                        }
                  }
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={groupId}
                    className="sr-only"
                    checked={active}
                    onChange={() => update(option.value)}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          {mode === "reels" ? (
            <MossBuzzVideoFeed
              videos={videos}
              shorts={shorts}
              showHeader={false}
              title={title}
              subtitle={subtitle}
            />
          ) : (
            <MossBuzzVideoCarousel videos={videos} shorts={shorts} />
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          disabled
          className="inline-flex items-center rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-500 shadow-sm cursor-not-allowed"
        >
          Soon Submit Your Video
        </button>
      </div>
    </section>
  );
}
