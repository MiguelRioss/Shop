import StoriesHeroVideosHeading from "./StoriesHeroVideosHeading";
import StoriesHeroVideosGrid from "./StoriesHeroVideosGrid";
import StoriesJoinButton from "./StoriesJoinButton";

const sampleVideos = [
  { src: "/videos/video1.mp4", poster: "", title: "Community story — Hal" },
  { src: "/videos/video2.mp4", poster: "", title: "Community story — Hal" },
  { src: "/videos/video9.mp4", poster: "", title: "Community story — Pedro" },
  { src: "/videos/video3.mp4", poster: "", title: "Community story — Hal" },
];

export default function StoriesHeroVideos({
  heading = "Sensate community stories",
  intro = "/* Texto para introduzir */",
  videos = sampleVideos,
  bgClass = "relative isolate w-full bg-[#E7EEF8]",
  onUploadClick, // 👈 add this
}) {
  return (
    <section className={bgClass}>
      {/* Decorative lines */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_10%_-10%,rgba(255,255,255,.6),transparent_60%),linear-gradient(120deg,transparent_0,transparent_40%,rgba(255,255,255,.45)_40%,transparent_41%),linear-gradient(-120deg,transparent_0,transparent_45%,rgba(255,255,255,.45)_45%,transparent_46%)]" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <StoriesHeroVideosHeading heading={heading} intro={intro} />

            {/* 👇 Put buttons under the description */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onUploadClick}
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow hover:bg-neutral-50"
              >
                Upload a photo
              </button>
            
            </div>
          </div>

          <div className="lg:col-span-8">
            <StoriesHeroVideosGrid videos={videos} />
          </div>
        </div>
      </div>
    </section>
  );
}

