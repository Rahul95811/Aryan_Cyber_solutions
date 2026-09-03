import type { Metadata } from 'next';
import Link from 'next/link';
import RegisterForm from '@/components/training/RegisterForm';

export const metadata: Metadata = {
  title: 'Register — Training Entry Assessment · Aryan Cyber Solutions',
  description: 'Register as a candidate for the Aryan Cyber Solutions cybersecurity training entry assessment.',
};

export default function RegisterPage() {
  return (
    <div className="page-top section-padding bg-navy-950">
      <div className="container-main">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            href="/training"
            className="type-label mb-8 inline-flex items-center gap-1.5 text-white/40 transition-colors hover:text-cyber-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Training
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="type-label mb-3 inline-block font-semibold uppercase tracking-widest text-cyber-400">
              Step 1 of 3
            </span>
            <h1 className="type-section mb-3 text-white">Candidate Registration</h1>
            <p className="type-body text-white/55">
              Fill in your details below. Upon successful registration, you will receive a unique
              Candidate ID at your personal email address — save it for your records.
            </p>
          </div>

          {/* Form card */}
          <div className="glass-card p-6 sm:p-8">
            <RegisterForm />
          </div>

          {/* Footer note */}
          <p className="type-label mt-6 text-center text-white/30">
            Already registered?{' '}
            <Link href="/training/rules" className="text-cyber-400 hover:underline">
              Proceed to Rules
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
