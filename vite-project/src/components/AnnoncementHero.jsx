export function AnnouncementHero({
  announcement,
  containerClass = "mx-auto max-w-7xl",
  gradientFrom = "var(--brand-from)",
  gradientTo = "var(--brand-to)",
  className = "",
}) {
  if (!announcement?.show) return null;

  const grad = `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`;

  return (
    <div
      className={`w-full text-white text-sm ${className}`.trim()}
      style={{ background: grad }}
    >
      <div className={`${containerClass} px-4 py-2 text-center`}>
        {announcement.text}
      </div>
    </div>
  );
}
