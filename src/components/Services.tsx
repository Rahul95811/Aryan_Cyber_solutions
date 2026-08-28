"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cybersecurityServices, type ServiceDetail } from "@/lib/services";

function ServiceIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    "shield-scan": (
      <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
        <rect x="8" y="8" width="48" height="48" rx="12" fill="rgba(43,140,255,0.1)" stroke="rgba(43,140,255,0.3)" strokeWidth="1" />
        <path d="M32 18 L44 24 V34 C44 42 38 48 32 50 C26 48 20 42 20 34 V24 Z" stroke="#4da6ff" strokeWidth="1.5" fill="rgba(43,140,255,0.15)" />
        <circle cx="32" cy="34" r="6" stroke="#4da6ff" strokeWidth="1.5" fill="none" />
        <line x1="36" y1="38" x2="40" y2="42" stroke="#4da6ff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    audit: (
      <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
        <rect x="8" y="8" width="48" height="48" rx="12" fill="rgba(43,140,255,0.1)" stroke="rgba(43,140,255,0.3)" strokeWidth="1" />
        <rect x="20" y="18" width="24" height="30" rx="2" stroke="#4da6ff" strokeWidth="1.5" fill="rgba(43,140,255,0.1)" />
        <line x1="26" y1="26" x2="38" y2="26" stroke="#4da6ff" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="26" y1="32" x2="38" y2="32" stroke="#4da6ff" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="26" y1="38" x2="34" y2="38" stroke="#4da6ff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    awareness: (
      <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
        <rect x="8" y="8" width="48" height="48" rx="12" fill="rgba(43,140,255,0.1)" stroke="rgba(43,140,255,0.3)" strokeWidth="1" />
        <circle cx="32" cy="26" r="8" stroke="#4da6ff" strokeWidth="1.5" fill="rgba(43,140,255,0.15)" />
        <path d="M18 46 C18 38 24 34 32 34 C40 34 46 38 46 46" stroke="#4da6ff" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    consulting: (
      <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
        <rect x="8" y="8" width="48" height="48" rx="12" fill="rgba(43,140,255,0.1)" stroke="rgba(43,140,255,0.3)" strokeWidth="1" />
        <path d="M20 40 L32 22 L44 40 Z" stroke="#4da6ff" strokeWidth="1.5" fill="rgba(43,140,255,0.1)" strokeLinejoin="round" />
      </svg>
    ),
    incident: (
      <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
        <rect x="8" y="8" width="48" height="48" rx="12" fill="rgba(43,140,255,0.1)" stroke="rgba(43,140,255,0.3)" strokeWidth="1" />
        <path d="M32 18 L34 28 H44 L36 34 L38 44 L32 38 L26 44 L28 34 L20 28 H30 Z" stroke="#4da6ff" strokeWidth="1.5" fill="rgba(43,140,255,0.15)" strokeLinejoin="round" />
      </svg>
    ),
    soc: (
      <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
        <rect x="8" y="8" width="48" height="48" rx="12" fill="rgba(43,140,255,0.1)" stroke="rgba(43,140,255,0.3)" strokeWidth="1" />
        <rect x="16" y="18" width="32" height="20" rx="2" stroke="#4da6ff" strokeWidth="1.5" fill="rgba(43,140,255,0.1)" />
        <circle cx="24" cy="28" r="2" fill="#4da6ff" />
        <circle cx="32" cy="28" r="2" fill="#4da6ff" />
        <circle cx="40" cy="28" r="2" fill="#4da6ff" />
      </svg>
    ),
  };
  return icons[type] || icons["shield-scan"];
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function DetailContent({
  service,
  onClose,
}: {
  service: ServiceDetail;
  onClose: () => void;
}) {
  const offers = service.features.slice(0, 4);

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="card-title">{service.name}</h3>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="type-body mb-5 line-clamp-5 text-white/60">
        {service.overview}
      </p>

      <p className="type-label mb-3 font-semibold text-white/85">What We Offer</p>
      <ul className="mb-6 space-y-2">
        {offers.map((item) => (
          <li key={item} className="type-body flex items-center gap-2 text-white/65">
            <CheckIcon />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        onClick={onClose}
        className="btn-primary inline-flex"
      >
        Request Consultation
      </Link>
    </>
  );
}

export default function Services() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [visible, setVisible] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const selected = cybersecurityServices.find((s) => s.id === selectedId) || null;

  const updateMobile = useCallback(() => {
    setIsMobile(window.matchMedia("(max-width: 639px)").matches);
  }, []);

  const updatePanelPosition = useCallback(() => {
    if (!selectedId || !gridRef.current) return;
    const card = cardRefs.current[selectedId];
    if (!card) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    setPanelPos({
      top: cardRect.bottom - gridRect.top + 12,
      left: cardRect.left - gridRect.left,
      width: cardRect.width,
    });
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

    if (isMobile) {
      setVisible(true);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    updatePanelPosition();
    requestAnimationFrame(() => setVisible(true));

    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, { passive: true });

    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition);
      document.body.style.overflow = "";
    };
  }, [selectedId, isMobile, updatePanelPosition]);

  function openService(id: string) {
    if (selectedId === id) {
      closePanel();
      return;
    }
    setVisible(false);
    setSelectedId(id);
  }

  function closePanel() {
    setVisible(false);
    setTimeout(() => setSelectedId(null), 220);
  }

  return (
    <section id="services" className="section-padding page-top">
      <div className="container-main">
        <div className="section-header">
          <h2 className="section-heading">Our Cybersecurity Services</h2>
          <p className="section-subheading">
            We provide end-to-end cybersecurity solutions that help organizations protect their
            digital assets, strengthen security posture, and build cyber resilience through expert
            consulting, assessments, awareness programs, and managed security services.
          </p>
        </div>

        <div ref={gridRef} className="relative">
          {/* Desktop overlay backdrop click-away */}
          {selectedId && !isMobile && (
            <button
              type="button"
              className="absolute inset-0 z-20 cursor-default"
              aria-label="Close service details"
              onClick={closePanel}
            />
          )}

          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cybersecurityServices.map((service) => {
              const isSelected = selectedId === service.id;
              const isDimmed = selectedId !== null && !isSelected;

              return (
                <article
                  key={service.id}
                  ref={(el) => {
                    cardRefs.current[service.id] = el;
                  }}
                  className={`enterprise-card relative z-10 ${
                    isSelected ? "is-selected z-30" : ""
                  } ${isDimmed ? "is-dimmed" : ""}`}
                >
                  <div className="enterprise-card-icon">
                    <ServiceIcon type={service.icon} />
                  </div>
                  <h3 className="enterprise-card-title">{service.name}</h3>
                  <p className="enterprise-card-desc">{service.cardDescription}</p>
                  <button
                    type="button"
                    onClick={() => openService(service.id)}
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
            })}
          </div>

          {/* Desktop / tablet floating panel */}
          {selected && !isMobile && panelPos && (
            <div
              className={`absolute z-40 origin-top rounded-[18px] border border-cyber-500/50 bg-[#0d1326]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-[12px] transition-all duration-[250ms] ease-out ${
                visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
              style={{
                top: panelPos.top,
                left: panelPos.left,
                width: panelPos.width,
              }}
              role="dialog"
              aria-modal="false"
              aria-label={selected.name}
            >
              <DetailContent service={selected} onClose={closePanel} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {selected && isMobile && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <button
            type="button"
            className={`absolute inset-0 bg-black/60 transition-opacity duration-[250ms] ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close"
            onClick={closePanel}
          />
          <div
            className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[18px] border border-cyber-500/40 border-b-0 bg-[#0d1326]/98 p-6 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] backdrop-blur-[12px] transition-transform duration-[250ms] ease-out ${
              visible ? "translate-y-0" : "translate-y-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" aria-hidden="true" />
            <DetailContent service={selected} onClose={closePanel} />
          </div>
        </div>
      )}
    </section>
  );
}
