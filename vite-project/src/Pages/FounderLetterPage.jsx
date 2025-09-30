// src/pages/FounderLetterPage.jsx
import React from "react";

export default function FounderLetterPage(props) {
  // if parent did <FounderLetterPage letter={...} />
  // use that; otherwise fall back to config
  const letter = props.letter ?? webConfig.founderLetter;
  if (!letter) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {letter.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          By {letter.author} • Updated {letter.updatedAt}
        </p>
      </header>

      {/* preserve line breaks exactly as in JSON */}
      <article className="font-serif text-[18px] leading-8 text-gray-900 whitespace-pre-wrap">
        {letter.body}
      </article>
    </main>
  );
}
