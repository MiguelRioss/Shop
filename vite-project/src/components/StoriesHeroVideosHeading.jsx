
export default function StoriesHeroVideosHeading({
  heading = "Sensate community stories",
  intro = "/* Texto para introduzir */",
  className = "",
  headingClass = "text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl xl:text-5xl",
  introClass = "mt-4 max-w-md text-neutral-600",
}) {
  const words = heading.trim().split(" ");
  const firstLine = words.slice(0, 2).join(" ");
  const secondLine = words.slice(2).join(" ");

  return (
    <div className={className}>
      <h2 className={headingClass}>{firstLine}</h2>
      <h2 className={`mt-1 ${headingClass}`}>{secondLine}</h2>
      {intro && <p className={introClass}>{intro}</p>}
    </div>
  );
}
