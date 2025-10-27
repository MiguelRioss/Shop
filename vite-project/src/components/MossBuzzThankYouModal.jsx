// components/MossBuzzThankYouModal.jsx
import React from "react";

export default function MossBuzzThankYouModal({ open, onClose, copy = {} }) {
  const {
    title = "Thank You!",
    message = "Your MOSBUZZ® video has been uploaded successfully.",
    subtitle = "We'll review your submission and get back to you soon.",
    buttonText = "Close"
  } = copy || {};

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="thank-you-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="px-6 py-10 sm:px-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2
              id="thank-you-title"
              className="text-2xl font-serif text-gray-900"
            >
              {title}
            </h2>
            <p className="mt-3 text-gray-600">
              {message}
            </p>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-full bg-[var(--brand-from)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-80"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}