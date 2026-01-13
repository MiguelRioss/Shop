import React from "react";
import FAQ from "../components/FAQ";

export default function FaqsPage({ faq }) {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <FAQ {...(faq || { title: "FAQs", items: [] })} />
    </main>
  );
}
