import TestimonialsCarousselHeroTrustPilot from "./TestimonialsCarousselHeroTrusPilot.jsx";
import TrustpilotSummary from "./TrustpilotSummary.jsx";

export default function TrustpilotSection({ reviews }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      {/* BIG SQUARE */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-10">
        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-12 items-stretch">
          
          {/* LEFT */}
          <TrustpilotSummary />

          {/* RIGHT */}
          <TestimonialsCarousselHeroTrustPilot reviews={reviews} />

        </div>
      </div>
    </section>
  );
}

