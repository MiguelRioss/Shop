
/**
 * HowItWorks
 * Three-step explainer matching your reference.
 * - Big centered heading + subtitle
 * - 3 circular images with numbered badges OVERLAPPING bottom edge
 * - Step titles in orange and descriptions under each
 * - Responsive: stacks on mobile, 3 columns on desktop
 */
export default function HowItWorks() {
  return (
    <section className="bg-[#var(--secondBackground)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">How Does Sensate Work?</h2>
          <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            Sensate is a non‑invasive device that is placed on your chest.
            It emits infrasonic waves through the body, via bone
            conduction.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {/* Step 1 */}
          <div className="text-center">
            <div className="relative mx-auto h-52 w-52">
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <img
                  src="/Images/friends.JPG"
                  alt="Place the device"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-lg font-semibold shadow-lg">1</span>
            </div>
            <h3 className="mt-10 font-serif text-2xl"
             style={{ color: "var(--brand)" }}>Place the device</h3>
            <p className="mt-3 text-gray-700 max-w-xs mx-auto">
              Place the Sensate on your chest using the provided lanyard.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="relative mx-auto h-52 w-52">
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <img
                  src="/Images/YOGA.JPG"
                  alt="Turn on the device"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-lg font-semibold shadow-lg">2</span>
            </div>
            <h3 className="mt-10 font-serif text-2xl "
             style={{ color: "var(--brand)" }}>Turn ON the device</h3>
            <p className="mt-3 text-gray-700 max-w-xs mx-auto">
              Sensate emits soft vibration that soothe your nervous system.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="relative mx-auto h-52 w-52">
              <div className="absolute inset-0 overflow-hidden rounded-full bg-[#e6eefb]">
                <img
                  src="Images/nature.JPG"
                  alt="Listen to calming sounds"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-lg font-semibold shadow-lg">3</span>
            </div>
            <h3 className="mt-10 font-serif text-2xl "  style={{ color: "var(--brand)" }}>Listen to calming sounds</h3>
            <p className="mt-3 text-gray-700 max-w-xs mx-auto">
              Use the Sensate app to immerse yourself in calming, relaxing music soundscapes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
