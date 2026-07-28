"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/lib/data";

function ProjectImage({ project }: { project: (typeof projects)[0] }) {
  const [imgError, setImgError] = useState(false);

  if (project.id === "linkshield" && project.video) {
    return (
      <video
        src={project.video}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
        aria-label={`${project.name} preview`}
      />
    );
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

export default function Projects() {
  return (
    <section id="projects" className="section-padding bg-navy-900/50">
      <div className="container-main">
        <div className="mb-12 max-w-2xl">
          <h2 className="section-heading">Featured Projects</h2>
          <p className="section-subheading">
            Innovative security solutions built by our team to address real-world
            enterprise challenges across endpoint, vision, and IoT domains.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="glass-card-hover group overflow-hidden">
              <div className="relative aspect-video overflow-hidden bg-navy-800">
                <ProjectImage project={project} />
              </div>
              <div className="p-6">
                <p className="type-label mb-2 text-cyber-400">{project.tagline}</p>
                <h3 className="card-title mb-3">{project.name}</h3>
                <p className="type-body mb-5 text-white/60">{project.description}</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="type-label rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href="#contact"
                  className="type-label inline-flex items-center gap-2 font-semibold text-cyber-400 transition-colors hover:text-cyber-500"
                >
                  View Project
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
