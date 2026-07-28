"use client";

import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Icon({ type }: { type: string }) {
  const cls = "h-5 w-5 text-cyber-400";
  const icons: Record<string, React.ReactNode> = {
    vapt: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    audit: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    soc: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    incident: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    awareness: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    training: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  };
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyber-500/20 bg-cyber-500/10">
      {icons[type] || icons.vapt}
    </div>
  );
}

const expertise = [
  {
    id: "vapt",
    title: "Vulnerability Assessment & Penetration Testing",
    description: "Identify and remediate security weaknesses before attackers can exploit them.",
  },
  {
    id: "audit",
    title: "Security Audit & Compliance",
    description: "Align controls with ISO 27001 and industry regulatory frameworks for lasting assurance.",
  },
  {
    id: "soc",
    title: "SOC Monitoring",
    description: "Detect and monitor threats continuously with security operations center expertise.",
  },
  {
    id: "incident",
    title: "Incident Response",
    description: "Contain, investigate, and recover quickly when security incidents affect your business.",
  },
  {
    id: "awareness",
    title: "Cyber Security Awareness Programs",
    description: "Build a security-first culture with practical training for employees and teams.",
  },
  {
    id: "training",
    title: "Internship & Professional Training",
    description: "Deliver industry-aligned programs with hands-on labs and mentor-guided learning.",
  },
];

const workflow = [
  {
    title: "Consultation",
    description: "Understanding business requirements",
    icon: "consultation",
  },
  {
    title: "Assessment",
    description: "Identify risks and security gaps",
    icon: "assessment",
  },
  {
    title: "Planning",
    description: "Design the security strategy",
    icon: "planning",
  },
  {
    title: "Implementation",
    description: "Deploy security solutions",
    icon: "implementation",
  },
  {
    title: "Support",
    description: "Continuous monitoring and improvement",
    icon: "support",
  },
];

function WorkflowIcon({ type }: { type: string }) {
  const cls = "h-5 w-5 text-cyber-400";
  const icons: Record<string, React.ReactNode> = {
    consultation: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    assessment: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    planning: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    implementation: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 01-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    support: (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  };
  return icons[type] || icons.consultation;
}

function WorkflowCard({
  step,
  index,
}: {
  step: (typeof workflow)[0];
  index: number;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-cyber-500/25 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyber-500 text-[13px] font-semibold text-white">
          {index + 1}
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-cyber-500/10">
          <WorkflowIcon type={step.icon} />
        </span>
      </div>
      <h4 className="card-title mb-1.5">{step.title}</h4>
      <p className="type-label leading-snug text-white/50">{step.description}</p>
    </article>
  );
}

export default function About() {
  const intro = useInView();
  const who = useInView();
  const expertiseRef = useInView();
  const workflowRef = useInView();

  return (
    <section id="about" className="section-padding bg-navy-900/35">
      <div className="container-main">
        {/* Intro — left-aligned content */}
        <div
          ref={intro.ref}
          className={`section-header mb-16 transition-all duration-700 ${
            intro.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <h2 className="section-heading">About Aryan Cyber Solutions</h2>
          <p className="type-body prose-width text-white/55">
            We help organizations strengthen their cybersecurity through consulting, VAPT,
            SOC services, awareness programs, and industry-focused internship training.
          </p>
        </div>

        {/* Who We Are */}
        <div
          ref={who.ref}
          className={`mb-20 transition-all duration-700 ${
            who.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <h3 className="sub-heading mb-5">Who We Are</h3>
          <p className="type-body prose-width text-white/55">
            Aryan Cyber Solutions is an enterprise cybersecurity company based in Visakhapatnam,
            India. We deliver practical security solutions that combine consulting expertise with
            hands-on training—helping organizations protect critical assets while building internal
            capability under one trusted partner.
          </p>
        </div>

        {/* Our Expertise */}
        <div
          ref={expertiseRef.ref}
          className={`mb-20 transition-all duration-700 ${
            expertiseRef.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <h3 className="sub-heading mb-8 lg:mb-10">Our Expertise</h3>
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item) => (
              <article key={item.id} className="enterprise-card">
                <div className="enterprise-card-icon">
                  <Icon type={item.id} />
                </div>
                <h4 className="enterprise-card-title">{item.title}</h4>
                <p className="enterprise-card-desc mb-0">{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Our Workflow */}
        <div
          ref={workflowRef.ref}
          className={`transition-all duration-700 ${
            workflowRef.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <h3 className="sub-heading mb-8 lg:mb-10">Our Workflow</h3>

          {/* Mobile / tablet: compact 2×2 grid, last card centered — no timeline */}
          <ol className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
            {workflow.map((step, index) => (
              <li
                key={step.title}
                className={
                  index === workflow.length - 1
                    ? "col-span-2 mx-auto w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)]"
                    : undefined
                }
              >
                <WorkflowCard step={step} index={index} />
              </li>
            ))}
          </ol>

          {/* Desktop: horizontal connected workflow cards */}
          <ol className="hidden items-stretch lg:grid lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:gap-x-3">
            {workflow.map((step, index) => (
              <li key={step.title} className="contents">
                <div className="min-w-0">
                  <WorkflowCard step={step} index={index} />
                </div>
                {index < workflow.length - 1 && (
                  <div className="flex items-center justify-center px-0.5" aria-hidden="true">
                    <svg className="h-4 w-4 text-cyber-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
