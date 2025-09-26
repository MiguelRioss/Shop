import React from "react";

export default function PlaceholderPage({ title, message = "Content coming soon." }) {
  return (
    <main className="bg-[var(--secondBackground)] min-h-[60vh]">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </main>
  );
}
