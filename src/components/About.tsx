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
  return icons[type] || icons.vapt;
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
    description: "Align your controls with ISO 27001 and industry regulatory frameworks.",
  },
  {
    id: "soc",
    title: "SOC Monitoring",
    description: "Continuous threat detection and monitoring through security operations expertise.",
  },
  {
    id: "incident",
    title: "Incident Response",
    description: "Rapid containment, investigation, and recovery when security incidents occur.",
  },
  {
    id: "awareness",
    title: "Cyber Security Awareness Programs",
    description: "Practical training that builds a security-first culture across your workforce.",
  },
  {
    id: "training",
    title: "Internship & Professional Training",
    description: "Industry-aligned programs with hands-on labs and mentor-guided learning.",
  },
];

const workflow = [
  "Consultation",
  "Assessment",
  "Planning",
  "Implementation",
  "Support",
];

export default function About() {
  const intro = useInView();
  const who = useInView();
  const expertiseRef = useInView();
  const workflowRef = useInView();

  return (
    <section id="about" className="section-padding bg-navy-900/35">
      <div className="container-main">
        {/* Intro */}
        <div
          ref={intro.ref}
          className={`mx-auto mb-16 max-w-3xl text-center transition-all duration-700 ${
            intro.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <h2 className="section-heading">About Aryan Cyber Solutions</h2>
          <p className="type-body mx-auto max-w-prose text-white/55">
            We help organizations strengthen their cybersecurity through consulting, VAPT,
            SOC services, awareness programs, and industry-focused internship training.
          </p>
        </div>

        {/* Who We Are */}
        <div
          ref={who.ref}
          className={`mx-auto mb-20 max-w-3xl transition-all duration-700 ${
            who.visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <h3 className="sub-heading mb-5 text-center">Who We Are</h3>
          <p className="type-body mx-auto max-w-prose text-center text-white/55">
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
          <h3 className="sub-heading mb-10 text-center">Our Expertise</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-white/15"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-500/10">
                  <Icon type={item.id} />
                </div>
                <h4 className="card-title mb-2">{item.title}</h4>
                <p className="type-body text-white/50">{item.description}</p>
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
          <h3 className="sub-heading mb-10 text-center">Our Workflow</h3>
          <div className="relative mx-auto max-w-5xl">
            <div
              className="absolute left-0 right-0 top-3 hidden h-px bg-white/10 lg:block"
              aria-hidden="true"
            />
            <ol className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {workflow.map((step, index) => (
                <li key={step} className="relative flex flex-col items-center text-center">
                  <div className="type-label relative z-10 mb-4 flex h-7 w-7 items-center justify-center rounded-full border-2 border-cyber-400/50 bg-navy-950 font-semibold text-cyber-400">
                    {index + 1}
                  </div>
                  <span className="type-label text-white/75">{step}</span>
                  {index < workflow.length - 1 && (
                    <span className="mt-3 text-white/25 lg:hidden" aria-hidden="true">
                      ↓
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
