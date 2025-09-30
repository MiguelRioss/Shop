import React from "react";

/**
 * ProductViewSwitcher
 * Segmented toggle to switch between a scrollable carousel and a grid view.
 * Uses brand gradient for active state and gradient border for the control.
 */
export default function ProductViewSwitcher({
  products = [],
  Carousel,
  Grid,
  initial = "scroll",
  onViewChange,
}) {
  const [viewMode, setViewMode] = React.useState(initial);
  const groupId = React.useId();

  const options = [
    { value: "scroll", label: "Slideshow" },
    { value: "grid", label: "Grid" },
  ];

  const update = (mode) => {
    setViewMode(mode);
    if (typeof onViewChange === "function") onViewChange(mode);
  };

  // Keyboard support (left/right to switch)
  const onKeyDown = (e) => {
    const idx = options.findIndex((o) => o.value === viewMode);
    if (e.key === "ArrowRight") {
      update(options[(idx + 1) % options.length].value);
    } else if (e.key === "ArrowLeft") {
      update(options[(idx - 1 + options.length) % options.length].value);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 mb-6 mt-2 flex justify-center relative z-40 isolate">
        <div
          role="radiogroup"
          aria-labelledby={`${groupId}-label`}
          className="inline-flex rounded-full p-[2px] shadow-sm select-none pointer-events-auto"
          style={{ background: "var(--brand-gradient)" }}
          onKeyDown={onKeyDown}
        >
          <div className="flex rounded-full overflow-hidden bg-white">
            <span id={`${groupId}-label`} className="sr-only">
              Select product view mode
            </span>

            {options.map((opt) => {
              const active = viewMode === opt.value;
              const inputId = `${groupId}-${opt.value}`;
              return (
                <label
                  key={opt.value}
                  htmlFor={inputId}
                  className="px-3 py-1.5 text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                  style={
                    active
                      ? { background: "var(--brand-gradient)", color: "#fff", touchAction: "manipulation" }
                      : { color: "var(--brand-from)", touchAction: "manipulation" }
                  }
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={groupId}
                    className="sr-only"
                    checked={active}
                    onChange={() => update(opt.value)}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        Grid ? (
          <Grid products={products} />
        ) : (
          <Fallback message="Provide a Grid component via the Grid prop." />
        )
      ) : Carousel ? (
        <Carousel products={products} />
      ) : (
        <Fallback message="Provide a Carousel component via the Carousel prop." />
      )}
    </div>
  );
}

function Fallback({ message }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600 border rounded-lg">
      {message}
    </div>
  );
}

