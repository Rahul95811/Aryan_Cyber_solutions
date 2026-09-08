"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { internshipPrograms, type InternshipProgram } from "@/lib/internships";

function InternshipIcon({ type }: { type: string }) {
  const cls = "h-5 w-5 text-cyber-400";
  const icons: Record<string, React.ReactNode> = {
    monitor: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    shield: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    terminal: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    search: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    radar: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    chart: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    bug: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    alert: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5.203M9 19v2m6-2v2M9 9h.01M15 9h.01" />
      </svg>
    ),
    cloud: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    network: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
    globe: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
      </svg>
    ),
    scan: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    compliance: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    code: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    ai: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    chip: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  };

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyber-500/20 bg-cyber-500/10">
      {icons[type] || icons.shield}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CurriculumAccordion({ program }: { program: InternshipProgram }) {
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
      {program.curriculum.map((module, index) => {
        const isOpen = openModuleId === module.id;
        return (
          <div key={module.id} className={index !== 0 ? "border-t border-white/10" : undefined}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
              onClick={() => setOpenModuleId(isOpen ? null : module.id)}
              aria-expanded={isOpen}
            >
              <span className="type-label text-white/85">
                Module {module.id}. {module.title}
              </span>
              <svg
                className={`h-3.5 w-3.5 shrink-0 text-white/40 transition-transform duration-[250ms] ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`grid transition-all duration-[250ms] ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="bg-navy-900/50 px-3.5 pb-2">
                  {module.lessons.map((lesson) => (
                    <li key={lesson} className="type-label border-t border-white/5 py-2 text-white/55">
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OverlayContent({
  program,
  onClose,
  isMobile = false,
}: {
  program: InternshipProgram;
  onClose: () => void;
  isMobile?: boolean;
}) {
  const [showCurriculum, setShowCurriculum] = useState(false);

  const highlights = [
    { label: "Duration", value: program.duration },
    { label: "Industry Certificate", value: program.certificate },
    { label: "Hands-on Labs", value: program.labs },
    { label: "Real-world Projects", value: program.industryProjects },
    { label: "Mentor Support", value: "Expert Mentorship Included" },
  ];

  return (
    <div className={`flex flex-col ${isMobile ? "min-h-0 flex-1 overflow-hidden" : "max-h-full"}`}>
      <div className={`relative h-24 shrink-0 overflow-hidden rounded-t-[18px] bg-gradient-to-br sm:h-28 ${program.banner}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1326] via-[#0d1326]/40 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/30 text-white/70 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div
        className={`p-5 pb-8 sm:p-6 ${
          isMobile
            ? "flex-1 min-h-0 overflow-y-auto overscroll-contain"
            : "flex-1 overflow-y-auto"
        }`}
        style={{
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        <div className="mb-3 flex items-center gap-3">
          <InternshipIcon type={program.icon} />
          <h3 className="card-title">{program.title}</h3>
        </div>

        <p className="type-body mb-5 line-clamp-5 text-white/60">
          {program.description}
        </p>

        <p className="type-label mb-3 font-semibold text-white/85">Key Highlights</p>
        <ul className="mb-5 space-y-2">
          {highlights.map((item) => (
            <li key={item.label} className="type-body flex items-start gap-2 text-white/65">
              <CheckIcon />
              <span>
                <span className="text-white/40">{item.label}:</span> {item.value}
              </span>
            </li>
          ))}
        </ul>

        <p className="type-label mb-3 font-semibold text-white/85">Technologies Covered</p>
        <div className="mb-6 flex flex-wrap gap-2">
          {program.technologies.map((tech) => (
            <span
              key={tech}
              className="type-label rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowCurriculum((v) => !v)}
            className="btn-secondary"
            aria-expanded={showCurriculum}
          >
            {showCurriculum ? "Hide Curriculum" : "View Curriculum"}
          </button>
          <Link
            href="/contact"
            onClick={onClose}
            className="btn-primary"
          >
            Apply for Internship
          </Link>
        </div>

        {showCurriculum && <CurriculumAccordion program={program} />}
      </div>
    </div>
  );
}

export default function Internships() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [panelPos, setPanelPos] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionRootRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  const INITIAL_COUNT = 4;
  const initialPrograms = internshipPrograms.slice(0, INITIAL_COUNT);
  const extraPrograms = internshipPrograms.slice(INITIAL_COUNT);
  const hasMore = extraPrograms.length > 0;

  const selected = internshipPrograms.find((p) => p.id === selectedId) || null;

  const updateMobile = useCallback(() => {
    setIsMobile(window.matchMedia("(max-width: 639px)").matches);
  }, []);

  const updatePanelPosition = useCallback(() => {
    if (!selectedId || !sectionRef.current) return;
    const card = cardRefs.current[selectedId];
    if (!card) return;

    const containerRect = sectionRef.current.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const gap = 12;
    const containerWidth = sectionRef.current.clientWidth;

    const preferredWidth = Math.min(Math.max(cardRect.width, 420), Math.min(560, containerWidth));
    const spaceBelow = window.innerHeight - cardRect.bottom - 24;
    const spaceRight = containerRect.right - cardRect.right - gap;
    const spaceLeft = cardRect.left - containerRect.left - gap;

    let top: number;
    let left: number;
    let width = preferredWidth;
    let maxHeight: number;

    const canPlaceRight = spaceRight >= preferredWidth;
    const canPlaceLeft = spaceLeft >= preferredWidth;
    const besideSpace = Math.max(
      canPlaceRight ? spaceRight : 0,
      canPlaceLeft ? spaceLeft : 0
    );
    const placeBeside = besideSpace > 0 && besideSpace >= spaceBelow;

    if (placeBeside) {
      width = preferredWidth;
      if (canPlaceRight && (!canPlaceLeft || spaceRight >= spaceLeft)) {
        left = cardRect.right - containerRect.left + gap;
      } else {
        left = cardRect.left - containerRect.left - width - gap;
      }
      top = cardRect.top - containerRect.top;
      maxHeight = Math.max(280, Math.min(window.innerHeight - Math.max(cardRect.top, 16) - 24, 640));
    } else {
      // Anchor directly below the clicked card
      width = Math.min(Math.max(cardRect.width, 420), Math.min(640, containerWidth));
      left = cardRect.left - containerRect.left + (cardRect.width - width) / 2;
      left = Math.max(0, Math.min(left, containerWidth - width));
      top = cardRect.bottom - containerRect.top + gap;
      maxHeight = Math.max(280, Math.min(Math.max(spaceBelow, 320), 640));
    }

    setPanelPos({ top, left, width, maxHeight });
  }, [selectedId]);

  useEffect(() => {
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, [updateMobile]);

  useEffect(() => {
    if (!selectedId) {
      setVisible(false);
      setPanelPos(null);
      return;
    }

    const card = cardRefs.current[selectedId];
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });

    if (isMobile) {
      setVisible(true);
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }

    updatePanelPosition();
    requestAnimationFrame(() => {
      updatePanelPosition();
      setVisible(true);
    });

    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedId, isMobile, updatePanelPosition]);

  useEffect(() => {
    if (!selectedId) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  function openProgram(id: string) {
    if (selectedId === id) {
      closePanel();
      return;
    }
    setVisible(false);
    setPanelPos(null);
    setSelectedId(id);
  }

  function closePanel() {
    setVisible(false);
    setTimeout(() => {
      setSelectedId(null);
      setPanelPos(null);
    }, 250);
  }

  function toggleExpanded() {
    if (expanded) {
      const selectedIsExtra = extraPrograms.some((p) => p.id === selectedId);
      if (selectedIsExtra) {
        closePanel();
      }
      setExpanded(false);
      requestAnimationFrame(() => {
        sectionRootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      setExpanded(true);
    }
  }

  function renderCard(program: (typeof internshipPrograms)[0]) {
    const isSelected = selectedId === program.id;
    const isDimmed = selectedId !== null && !isSelected;

    return (
      <article
        key={program.id}
        ref={(el) => {
          cardRefs.current[program.id] = el;
        }}
        className={`enterprise-card relative z-10 ${
          isSelected ? "is-selected z-30" : ""
        } ${isDimmed ? "is-dimmed" : ""}`}
      >
        <div className="enterprise-card-icon">
          <InternshipIcon type={program.icon} />
        </div>
        <h3 className="enterprise-card-title">{program.title}</h3>
        <p className="enterprise-card-desc">{program.description}</p>
        <p className="enterprise-card-meta">{program.duration}</p>
        <button
          type="button"
          onClick={() => openProgram(program.id)}
          className="enterprise-card-cta"
          aria-expanded={isSelected}
        >
          Learn More
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </article>
    );
  }

  return (
    <section
      id="internships"
      ref={sectionRootRef}
      className="section-padding page-top scroll-mt-20 bg-navy-900/30"
    >
      <div className="container-main">
        <div className="section-header">
          <h2 className="section-heading">Cybersecurity Internship Programs</h2>
          <p className="section-subheading">
            Explore our full catalog of industry-aligned internship programs.
            Select any program for a quick overview and curriculum.
          </p>
        </div>

        <div ref={sectionRef} className="relative">
          {selectedId && !isMobile && (
            <button
              type="button"
              className="absolute inset-0 z-20 cursor-default bg-navy-950/40 backdrop-blur-[2px]"
              aria-label="Close internship details"
              onClick={closePanel}
            />
          )}

          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {initialPrograms.map(renderCard)}
          </div>

          {hasMore && (
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
              aria-hidden={!expanded}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={`mt-6 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4 transition-all duration-300 ease-in-out ${
                    expanded
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  {extraPrograms.map(renderCard)}
                </div>
              </div>
            </div>
          )}

          {/* Desktop / tablet — anchored to clicked card */}
          {selected && !isMobile && panelPos && (
            <div
              ref={panelRef}
              className={`absolute z-40 origin-top overflow-hidden rounded-[18px] border border-cyber-500/50 bg-[#0d1326]/95 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-[12px] transition-all duration-[280ms] ease-in-out ${
                visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
              style={{
                top: panelPos.top,
                left: panelPos.left,
                width: panelPos.width,
                maxHeight: panelPos.maxHeight,
              }}
              role="dialog"
              aria-modal="false"
              aria-label={selected.title}
            >
              <div
                className="max-h-[inherit] overflow-y-auto overscroll-contain"
                style={{
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                }}
              >
                <OverlayContent key={selected.id} program={selected} onClose={closePanel} isMobile={false} />
              </div>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={toggleExpanded}
              className="btn-secondary"
              aria-expanded={expanded}
            >
              {expanded ? "Show Less" : "View More Internships"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {selected && isMobile && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <button
            type="button"
            className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-[280ms] ease-in-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close"
            onClick={closePanel}
          />
          <div
            className={`absolute inset-x-0 bottom-0 flex max-h-[calc(100dvh-1.5rem)] flex-col rounded-t-[18px] border border-cyber-500/40 border-b-0 bg-[#0d1326]/98 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur-[12px] transition-transform duration-[280ms] ease-in-out ${
              visible ? "translate-y-0" : "translate-y-full"
            }`}
            style={{
              maxHeight: "calc(100dvh - 1.5rem)",
              touchAction: "pan-y",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
          >
            <div className="mx-auto my-2.5 h-1 w-10 shrink-0 rounded-full bg-white/20" aria-hidden="true" />
            <OverlayContent key={selected.id} program={selected} onClose={closePanel} isMobile={true} />
          </div>
        </div>
      )}
    </section>
  );
}
