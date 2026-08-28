import Hero from "@/components/Hero";
import VideoPlaceholder from "@/components/VideoPlaceholder";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* LinkShield AV — featured project video */}
      <section className="section-padding bg-navy-900/50">
        <div className="container-main">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Ongoing Project
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              LinkShield AV
            </h2>
            <p className="max-w-xl text-sm text-white/50 sm:text-base">
              Next-generation endpoint protection — actively in development by Aryan Cyber Solutions.
            </p>
          </div>

          <VideoPlaceholder
            title="LinkShield AV — Company Introduction"
            subtitle="Aryan Cyber Solutions"
            src="/linkshield.mp4"
            hoverPlay
            className="mx-auto max-w-4xl"
          />
        </div>
      </section>
    </>
  );
}
