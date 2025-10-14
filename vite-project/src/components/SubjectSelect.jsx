import React from "react";

/**
 * Generic SelectDropdown component
 * Reusable dropdown with keyboard navigation and accessible markup.
 *
 * Props:
 * - label: string → optional label text
 * - name: string → field name (used in onChange)
 * - value: string → currently selected value
 * - options: string[] → list of options
 * - onChange: function({ target: { name, value } }) → change handler
 */
export default function SelectDropdown({
  label = "Select",
  name = "select",
  value,
  options = [],
  onChange,
}) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(() =>
    Math.max(0, options.findIndex((o) => o === value))
  );
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  React.useEffect(() => {
    setActive(Math.max(0, options.findIndex((o) => o === value)));
  }, [value, options]);

  const choose = (val) => {
    if (typeof onChange === "function") {
      onChange({ target: { name, value: val } });
    }
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      setOpen(true);
      e.preventDefault();
      return;
    }
    if (open) {
      if (e.key === "ArrowDown") {
        setActive((i) => Math.min(options.length - 1, i + 1));
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setActive((i) => Math.max(0, i - 1));
        e.preventDefault();
      } else if (e.key === "Enter") {
        choose(options[active]);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setOpen(false);
        e.preventDefault();
      }
    }
  };

  return (
    <div ref={wrapRef} className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-800 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={name}
          className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 pr-9 text-left outline-none focus:ring-2 focus:ring-[var(--brand-from)]"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
        >
          <span>{value || "Select an option..."}</span>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
            ▾
          </span>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-30 mt-1 max-h-56 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none"
          >
            {options.map((opt, i) => (
              <li
                key={opt}
                role="option"
                aria-selected={value === opt}
                className={`px-3 py-2 cursor-pointer ${
                  i === active
                    ? "bg-[var(--brand)]/10 text-gray-900"
                    : "text-gray-800 hover:bg-black/5"
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(opt)}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
