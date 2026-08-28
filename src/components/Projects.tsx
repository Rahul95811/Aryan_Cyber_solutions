"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { projects, type Project } from "@/lib/data";
import VideoPlaceholder from "@/components/VideoPlaceholder";

function HoverVideo({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <div
      className="h-full w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        aria-label={label}
      />
    </div>
  );
}

function ProjectImage({ project }: { project: Project }) {
  const [imgError, setImgError] = useState(false);

  if (project.videoPlaceholder) {
    return (
      <VideoPlaceholder
        title={project.videoPlaceholder.title}
        subtitle={project.videoPlaceholder.subtitle}
        className="rounded-none border-0 shadow-none"
      />
    );
  }

  if (project.video) {
    return <HoverVideo src={project.video} label={`${project.name} preview`} />;
  }

  if (!imgError && project.image) {
    return (
      <Image
        src={project.image}
        alt={project.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-700 to-navy-800">
      <svg viewBox="0 0 80 80" className="h-20 w-20 opacity-40" fill="none">
        <rect x="10" y="10" width="60" height="60" rx="8" stroke="#4da6ff" strokeWidth="1.5" />
        <path d="M25 50 L40 30 L55 50" stroke="#4da6ff" strokeWidth="1.5" fill="none" />
        <circle cx="40" cy="25" r="5" stroke="#4da6ff" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = !!project.details;

  return (
    /* flex flex-col makes the card stretch to full row height */
    <article
      className={`glass-card-hover group flex flex-col overflow-hidden ${
        project.featured ? "border-cyber-500/25 shadow-glow-sm" : ""
      }`}
    >
      {/* Thumbnail — fixed 16:9, never stretches */}
      <div className="relative aspect-video shrink-0 overflow-hidden bg-navy-800">
        <ProjectImage project={project} />
      </div>

      {/* Body — flex col, grows to fill remaining card height */}
      <div className="flex flex-1 flex-col p-6 lg:p-7">

        {/* ── Top content ── */}
        <div>
          {project.badge && (
            <span className="mb-3 inline-flex max-w-full flex-wrap rounded-md border border-cyber-500/30 bg-cyber-500/10 px-2.5 py-1 type-label text-cyber-400">
              {project.badge}
            </span>
          )}
          <p className="type-label mb-2 text-cyber-400">{project.tagline}</p>
          <h3 className="card-title mb-3">{project.name}</h3>
          <p className="type-body mb-4 text-white/60">{project.description}</p>

          {project.milestone && (
            <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="mb-0.5 text-xs font-semibold tracking-wide text-white/45">
                {project.milestone.label}
              </p>
              <p className="type-label text-white/80">{project.milestone.value}</p>
            </div>
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="type-label rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Expandable details */}
          {hasDetails && (
            <>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mb-4 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-left transition-colors hover:border-cyber-500/30 hover:bg-white/[0.05]"
                aria-expanded={expanded}
              >
                <span className="type-label font-semibold text-white/70">
                  {expanded ? "Show less" : "Show more"}
                </span>
                <svg
                  className={`h-4 w-4 shrink-0 text-cyber-400 transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expanded ? "mb-4 max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wide text-white/45">Overview</p>
                    <p className="type-body text-white/55">{project.details!.overview}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wide text-white/45">Current Milestone</p>
                    <p className="type-body text-white/55">{project.details!.currentMilestone}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wide text-white/45">Development Status</p>
                      <p className="type-body text-white/55">{project.details!.developmentStatus}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wide text-white/45">Demo</p>
                      <p className="type-body text-white/55">{project.details!.demo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Bottom: "View Project" pinned to card bottom via mt-auto ── */}
        <div className="mt-auto border-t border-white/10 pt-5">
          <Link
            href="/contact"
            className="type-label inline-flex items-center gap-2 font-semibold text-cyber-400 transition-colors hover:text-cyber-500"
          >
            View Project
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section-padding page-top bg-navy-900/50">
      <div className="container-main">
        <div className="section-header">
          <h2 className="section-heading">Featured Projects</h2>
          <p className="section-subheading">
            Innovative security solutions built by our team to address real-world
            enterprise challenges across endpoint, vision, and IoT domains.
          </p>
        </div>

        {/* default stretch → all cards in a row are the same height */}
        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
