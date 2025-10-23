// src/pages/PoliciesPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWebsiteConfig from "../hooks/useWebsiteConfig.js";
import {
  headerOffset,
  scrollToTarget,
} from "../components/ProductsCarrousell/utils/ScrollToCarroussel.js";

const linkify = (text) => {
  const parts = String(text).split(/(https?:\/\/\S+|[\w.+-]+@[\w.-]+\.[\w.-]+)/g);
  return parts.map((p, i) => {
    if (/^https?:\/\/\S+$/.test(p)) return <a key={i} href={p} target="_blank" rel="noreferrer" className="underline">{p}</a>;
    if (/^[\w.+-]+@[\w.-]+\.[\w.-]+$/.test(p)) return <a key={i} href={`mailto:${p}`} className="underline">{p}</a>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
};

export default function LegalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hash } = location;
  const { config, loading, error } = useWebsiteConfig();
  const policies = config?.policies;

  React.useEffect(() => {
    const stateTarget = location.state?.scrollTo;
    const hashTarget = hash ? hash.slice(1) : null;
    const target = stateTarget || hashTarget;

    if (target) {
      requestAnimationFrame(() => {
        scrollToTarget(`#${target}`, headerOffset());
      });
      if (stateTarget) {
        navigate(location.pathname, { replace: true, state: null });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [hash, location.pathname, location.state, navigate]);

  if (loading && !policies) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-center text-black/60">Loading policies…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-center text-red-600">
          We could not load the legal policies. Please try again later.
        </p>
      </main>
    );
  }

  if (!policies?.sections?.length) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-center text-black/60">No policies available.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 space-y-20">
      {policies.sections.map((sec) => (
        <section
          key={sec.id}
          id={sec.id}
          aria-labelledby={`${sec.id}-title`}
          className="scroll-mt-24"
          /* If your sticky navbar height differs, tune this: */
          style={{ scrollMarginTop: "105px" }}
        >
          <h2 id={`${sec.id}-title`} className="text-2xl font-semibold tracking-tight text-black">
            {sec.title}
          </h2>
          {sec.lastUpdated && (
            <p className="text-sm text-black/60 mt-1">Last updated: {sec.lastUpdated}</p>
          )}

          <div className="mt-4 space-y-3">
            {sec.blocks.map((b, idx) => {
              if (b.type === "h3") return <h3 key={idx} className="text-xl font-semibold mt-6">{b.text}</h3>;
              if (b.type === "p")  return <p key={idx} className="text-black/80 leading-relaxed">{linkify(b.text)}</p>;
              if (b.type === "ul") return (
                <ul key={idx} className="list-disc pl-6 space-y-1 text-black/80">
                  {b.items.map((it, i) => <li key={i}>{linkify(it)}</li>)}
                </ul>
              );
              if (b.type === "ol") return (
                <ol key={idx} className="list-decimal pl-6 space-y-1 text-black/80">
                  {b.items.map((it, i) => <li key={i}>{linkify(it)}</li>)}
                </ol>
              );
              return null;
            })}
          </div>
        </section>
      ))}
    </main>
  );
}


