export default function HowItWorks({
  heading,
  subheading,
  steps,
  disclaimer
}) {
  return (
    <section className="bg-[var(--secondBackground)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {/* Heading */}
        <div className="mx-auto max-w-3xl mt-30 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-gray-900">
            {heading}
          </h2>
          <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {steps?.map((step, i) => (
            <div key={i} className="text-center">
              <div className="relative mx-auto h-52 w-52">
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-lg font-semibold shadow-lg">
                  {i + 1}
                </span>
              </div>
              <h3
                className="mt-10 font-serif text-2xl"
                style={{ color: "var(--brand)" }}
              >
                {step.title}
              </h3>
              <p className="mt-3 text-gray-700 max-w-xs mx-auto">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className="mx-auto max-w-3xl text-center">
          <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            {disclaimer}
          </p>
        </div>
      )}
    </section>
  );
}
