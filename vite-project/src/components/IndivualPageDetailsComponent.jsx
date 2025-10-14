import React from "react";

export default function Details({
  title,
  children,
  isOpen = false,
  onToggle = () => {},
}) {
  return (
    <details
      open={isOpen}
      className="group p-3 rounded-xl border border-gray-200 bg-white/80"
      onClick={(e) => {
        // prevent native <details> toggle from interfering
        e.preventDefault();
        onToggle();
      }}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
        <span className="font-semibold text-gray-900">{title}</span>
        <span
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </summary>
      <div className="mt-1 overflow-hidden">
        <div
          className={`transition-[max-height] duration-300 ease-out ${
            isOpen ? "max-h-[1000px]" : "max-h-0"
          }`}
        >
          <div className="text-sm leading-relaxed text-gray-700">
            {children}
          </div>
        </div>
      </div>
    </details>
  );
}
