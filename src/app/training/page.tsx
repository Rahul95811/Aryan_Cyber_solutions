import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Training Programme — Aryan Cyber Solutions',
  description:
    'Apply for the Aryan Cyber Solutions cybersecurity training programme. Complete the entry assessment to be considered for course admission.',
};

const steps = [
  {
    num: '01',
    title: 'Register',
    desc: 'Provide your candidate information to receive a unique Candidate ID.',
  },
  {
    num: '02',
    title: 'Read Rules',
    desc: 'Review the assessment guidelines and sign the integrity declaration.',
  },
  {
    num: '03',
    title: '45-Min Assessment',
    desc: '30 questions across Computer Networks, Linux, and Written Responses.',
  },
  {
    num: '04',
    title: 'Evaluation',
    desc: 'MCQ answers are scored automatically. Written responses are reviewed manually.',
  },
  {
    num: '05',
    title: 'Decision',
    desc: 'Candidates are notified of their admission status within 7–10 business days.',
  },
];

const sections = [
  {
    label: 'A',
    title: 'Computer Networks',
    questions: '10 MCQs',
    topics: 'OSI model, TCP/IP, subnetting, DNS, ARP, NAT, HTTP/HTTPS, routing, network security',
    color: 'from-blue-900/40 to-navy-900',
    accent: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
  },
  {
    label: 'B',
    title: 'Linux Fundamentals',
    questions: '10 MCQs',
    topics: 'File system, permissions, processes, grep, find, pipes, redirection, shell behaviour',
    color: 'from-emerald-900/40 to-navy-900',
    accent: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  },
  {
    label: 'C',
    title: 'Written Responses',
    questions: '10 Open Questions',
    topics: 'Motivation, technical curiosity, problem-solving approach, self-awareness, learning mindset',
    color: 'from-violet-900/40 to-navy-900',
    accent: 'border-violet-500/20 bg-violet-500/10 text-violet-400',
  },
];

export default function TrainingPage() {
  return (
    <div className="page-top bg-navy-950">
      {/* ── Hero ───────────────────────────────────── */}
      <section className="section-padding relative overflow-hidden">
        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(147,197,253,1) 1px, transparent 1px), linear-gradient(90deg, rgba(147,197,253,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="container-main relative z-10">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyber-500/30 bg-cyber-500/10 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-400" />
            </span>
            <span className="type-label font-semibold uppercase tracking-widest text-cyber-400">
              2026 Cohort · Entry Assessment Open
            </span>
          </div>

          <h1 className="type-hero mb-5 max-w-3xl">
            Cybersecurity{' '}
            <span className="text-cyber-400">Training Programme</span>
          </h1>

          <p className="type-body mb-8 max-w-2xl text-white/55">
            The entry assessment is the first step for candidates applying to our cybersecurity training
            course. It evaluates your current knowledge, reasoning, and learning mindset — not just
            what you have memorised.
          </p>

          {/* Quick stats */}
          <div className="mb-10 flex flex-wrap gap-4">
            {[
              { val: '45', unit: 'Minutes', icon: '⏱' },
              { val: '30', unit: 'Questions', icon: '📋' },
              { val: '3', unit: 'Sections', icon: '📂' },
            ].map((s) => (
              <div key={s.unit} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className="type-stat leading-none text-white">{s.val}</div>
                  <div className="type-label text-white/40">{s.unit}</div>
                </div>
              </div>
            ))}
          </div>

          <Link href="/training/register" className="btn-primary">
            Begin Assessment Registration
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Assessment Sections ─────────────────────── */}
      <section className="section-padding border-t border-white/8">
        <div className="container-main">
          <div className="section-header">
            <h2 className="section-heading">Assessment Structure</h2>
            <p className="section-subheading">
              The assessment is divided into three sections, each testing a different dimension of
              your knowledge and thinking.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {sections.map((s) => (
              <div key={s.label} className={`overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${s.color}`}>
                <div className="p-6">
                  <span className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold ${s.accent}`}>
                    {s.label}
                  </span>
                  <h3 className="card-title mb-1 text-white">{s.title}</h3>
                  <p className="type-label mb-4 text-cyber-400">{s.questions}</p>
                  <p className="type-body text-white/55">{s.topics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Steps ───────────────────────────── */}
      <section className="section-padding border-t border-white/8 bg-navy-900/30">
        <div className="container-main">
          <div className="section-header">
            <h2 className="section-heading">The Process</h2>
            <p className="section-subheading">
              From registration to admission — here is what to expect.
            </p>
          </div>

          <div className="relative">
            {/* Connector line on desktop */}
            <div className="absolute left-[18px] top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-cyber-500/40 to-transparent lg:block" />

            <div className="flex flex-col gap-5">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-start gap-5">
                  {/* Step number */}
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyber-500/40 bg-cyber-500/10">
                    <span className="font-mono text-xs font-bold text-cyber-400">{i + 1}</span>
                  </div>

                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 flex-1 hover:border-cyber-500/20 transition-colors">
                    <p className="type-label font-semibold text-white">{step.title}</p>
                    <p className="type-body mt-0.5 text-white/50">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Important Notes ──────────────────────────── */}
      <section className="section-padding border-t border-white/8">
        <div className="container-main">
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h3 className="type-sub mb-4 text-white">Before You Begin</h3>
            <ul className="flex flex-col gap-3">
              {[
                'The assessment must be completed in a single uninterrupted session of 45 minutes.',
                'Use of AI tools (ChatGPT, Gemini, Claude, Copilot) is strictly not permitted.',
                'Ensure a stable internet connection before starting.',
                'Have your student ID or roll number ready for registration.',
                'Written responses are reviewed manually — write in your own voice and be honest.',
                'Seats in the training programme are limited. All applications are evaluated thoroughly.',
              ].map((note) => (
                <li key={note} className="flex items-start gap-3">
                  <svg className="mt-1 h-4 w-4 shrink-0 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span className="type-body text-white/60">{note}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row">
              <Link href="/training/register" className="btn-primary">
                Register Now
              </Link>
              <Link href="/internships" className="btn-secondary">
                View Internship Programmes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
