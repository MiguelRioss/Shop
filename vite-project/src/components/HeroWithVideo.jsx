import React from "react";
import YouTubeWithThumbnail from "./YouTubeWithThumbnail.jsx";
/**
 * HeroWithVideo
 * - Left: video player + CTA button
 * - Right: heading, description, benefits list with icons
 * - Responsive: stacks on mobile, side-by-side on desktop
 */
export default function HeroWithVideo() {
  return (
    <section className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side: video + button */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <YouTubeWithThumbnail />
            </div>
            <a
              href="#get"
              className="block w-full rounded-full  px-6 py-4 text-center text-lg font-semibold text-white shadow hover:opacity-90 sm:w-auto"
              style={{
                  background:
                    "linear-gradient(to right, var(--brand-from), var(--brand-to))",
                }}
            >
              Get Meso
            </a>
          </div>

          {/* Right side: text */}
          <div className="lg:pl-10">
            <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
              How’s your nervous system doing now?
            </h2>
            <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
              Your body has a built-in calm switch—the vagus nerve—that helps you settle after everyday
stress. A simple ritual with Meso can support a more balanced, relaxed state over time.
            </p>

            <ul className="mt-8 ">
              <li className="flex items-start ">
                <img src="/icon_sparkles.png" alt="Feel calmer" className="w-25 h-25 inline-block align-center" />
                <div>
                  <p className="font-semibold mt-7"
                   style={{ color: "var(--brand)" }}>Feel calmer, fast</p>
                  <p className="text-gray-600 text-sm">Within the hour.*</p>
                </div>
              </li>

              <li className="flex items-start ">
                <img src="/icon_moon.png" alt="Feel calmer" className="w-25 h-25 inline-block align-center" />
                <div>
                  <p className="font-semibold mt-7 "
                   style={{ color: "var(--brand)" }}>Ease everyday stress</p>
                  <p className="text-gray-600 text-sm">Use anywhere, any time.</p>
                </div>
              </li>

              <li className="flex items-start ">
                <img src="/icon_sun.png" alt="Feel calmer" className="w-25 h-25 inline-block align-center" />

                <div>
                  <p className="font-semibold mt-7"
                   style={{ color: "var(--brand)" }}>Wind down for better rest</p>
                  <p className="text-gray-600 text-sm">No sleeping pills, no grogginess.</p>
                </div>
              </li>
            </ul>
                 <div>
                  <p className="text-gray-600 mt-7 text-sm">* Results and timing vary. For general wellness; not intended to diagnose, treat, cure, or
prevent any disease.</p>
                </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}
