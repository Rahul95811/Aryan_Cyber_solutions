"use client";

import { useRef } from "react";

type VideoPlaceholderProps = {
  title: string;
  subtitle: string;
  /** When provided, renders the video. */
  src?: string;
  /** If true, video plays only on hover (paused/reset on mouse-leave). Default: false (autoplay loop). */
  hoverPlay?: boolean;
  className?: string;
};

export default function VideoPlaceholder({
  title,
  subtitle,
  src,
  hoverPlay = false,
  className = "",
}: VideoPlaceholderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => videoRef.current?.play();
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  /* ── Real video source provided ── */
  if (src) {
    return (
      <div
        className={`relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl ${className}`}
        onMouseEnter={hoverPlay ? handleMouseEnter : undefined}
        onMouseLeave={hoverPlay ? handleMouseLeave : undefined}
      >
        <video
          ref={videoRef}
          src={src}
          autoPlay={!hoverPlay}
          loop
          muted
          playsInline
          preload={hoverPlay ? "metadata" : "auto"}
          className="h-full w-full object-cover"
          aria-label={title}
        />
      </div>
    );
  }

  /* ── No src → animated "coming soon" placeholder ── */
  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-2xl border border-cyber-500/25 bg-navy-900 shadow-glow-sm ${className}`}
      role="img"
      aria-label={`${title}. ${subtitle}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(77, 166, 255, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(77, 166, 255, 0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(43,140,255,0.12)_0%,transparent_68%)]"
        aria-hidden="true"
      />
      <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center px-4 py-6 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyber-500/35 bg-cyber-500/15 sm:h-16 sm:w-16">
          <svg
            className="ml-0.5 h-6 w-6 text-cyber-400 sm:h-7 sm:w-7"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5.14v13.72L19.03 12 8 5.14z" />
          </svg>
        </span>
        <p className="type-label mb-1 font-semibold text-white">{title}</p>
        <p className="text-sm font-medium text-white/50 sm:text-base">{subtitle}</p>
      </div>
    </div>
  );
}
