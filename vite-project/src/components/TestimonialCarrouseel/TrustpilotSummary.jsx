export default function TrustpilotSummary({
  score = 4.7,
  totalReviews = 28,
  breakdown = {
    5: 28,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
}) {
  const max = Math.max(...Object.values(breakdown));

  return (
    <div className="flex flex-col justify-start">
      {/* Score */}
      <div className="text-5xl font-bold mb-1">{score}</div>
      <div className="text-sm text-gray-600 mb-2">Excellent</div>

      {/* Stars */}
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={i < Math.round(score) ? "#00b67a" : "#d1d5db"}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>

      <div className="text-sm text-gray-600 mb-6">
        {totalReviews} reviews
      </div>

      {/* ⭐ RATING BARS (THIS WAS MISSING) */}
      <div className="space-y-3 mb-6">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="w-10 text-gray-700">{star}-star</span>
            <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{
                  width: `${(breakdown[star] / max) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Link */}
      <a
        href="https://www.trustpilot.com/review/ibogenics.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 underline"
      >
        Check our trust pilot page
      </a>
    </div>
  );
}
