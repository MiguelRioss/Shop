
export default function StoriesJoinButton({
  href = "/join",                // change to your join page / modal trigger
  title = "Join the community",
  onClick,                       // optional: handle in-app modal
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition " +
    "bg-[var(--brand-gradient,#111)] text-white shadow hover:opacity-95";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${className}`}>
        {title}
      </button>
    );
  }
  return (
    <a href={href} className={`${base} ${className}`}>
      {title}
    </a>
  );
}
