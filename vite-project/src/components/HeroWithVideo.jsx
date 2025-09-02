import React from "react";

/**
 * HeroWithVideo
 * - Left: video player + CTA button
 * - Right: heading, description, benefits list with icons
 * - Responsive: stacks on mobile, side-by-side on desktop
 */
export default function HeroWithVideo() {
  return (
    <section className="bg-[#fcfcf4]">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side: video + button */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <video
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                controls
                poster="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop"
                className="w-full aspect-video object-cover"
              />
            </div>
            <a
              href="#get"
              className="block w-full rounded-full bg-[#f5653b] px-6 py-4 text-center text-lg font-semibold text-white shadow hover:opacity-90 sm:w-auto"
            >
              Get Sensate
            </a>
          </div>

          {/* Right side: text */}
          <div className="lg:pl-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
              How’s your nervous system doing?
            </h2>
            <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
              Your vagus nerve affects how your body reacts to stress, and toning it over time with
              Sensate can improve your digestion, heart health, and breathing rate too.
            </p>

            <ul className="mt-8 space-y-6">
              <li className="flex items-start gap-3">
                <span className="text-2xl">😊</span>
                <div>
                  <p className="font-semibold text-[#f5653b]">Calms your anxiety</p>
                  <p className="text-gray-600 text-sm">In just 10 minutes</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-2xl">❤️</span>
                <div>
                  <p className="font-semibold text-[#f5653b]">Lowers your stress</p>
                  <p className="text-gray-600 text-sm">Anywhere, any time</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="text-2xl">💤</span>
                <div>
                  <p className="font-semibold text-[#f5653b]">Improves your sleep</p>
                  <p className="text-gray-600 text-sm">No pill, no hangovers</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
