"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { companyInfo } from "@/lib/data";

type Tab = "contact" | "internship";

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

const initialFormState: FormState = { status: "idle", message: "" };

const internshipOptions = [
  "SOC Analyst Internship",
  "Penetration Testing Internship",
  "Metasploit Framework Internship",
  "Web Application Security Internship",
  "Network Security Internship",
  "Cloud Security Internship",
  "Digital Forensics Internship",
  "Threat Intelligence Internship",
  "Malware Analysis Internship",
  "SIEM & Splunk Internship",
  "Incident Response Internship",
  "Vulnerability Assessment Internship",
  "Governance, Risk & Compliance (GRC) Internship",
  "Python for Cyber Security Internship",
  "Linux for Cyber Security Internship",
  "AI Security Internship",
  "IoT Security Internship",
  "Cyber Security Awareness Internship",
];

const inputClass =
  "type-body w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-cyber-500/50";

export default function Contact() {
  const [tab, setTab] = useState<Tab>("contact");
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedInternship, setSelectedInternship] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    if (tab === "internship" && !selectedInternship) {
      setErrors({ internship: "Please select an internship program." });
      setFormState({ status: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setFormState({ status: "loading", message: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("type", tab);
    if (tab === "internship") {
      formData.set("internship", selectedInternship);
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setFormState({
          status: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
        return;
      }

      setFormState({
        status: "success",
        message:
          tab === "contact"
            ? "Thank you for reaching out. We have received your message and will respond shortly."
            : "Your internship application has been received. Please allow 3–5 business days for review.",
      });
      form.reset();
      setSelectedInternship("");
    } catch {
      setFormState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }

  function switchTab(next: Tab) {
    setTab(next);
    setFormState(initialFormState);
    setErrors({});
    setSelectedInternship("");
  }

  return (
    <section id="contact" className="section-padding page-top bg-navy-900/50">
      <div className="container-main">
        <div className="section-header">
          <h2 className="section-heading">Contact Us</h2>
          <p className="section-subheading">
            Ready to strengthen your security posture or join our internship programs?
            Get in touch with our team today.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-8 flex flex-col gap-6">
              <a
                href={`mailto:${companyInfo.contactEmail}`}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyber-500/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-500/10">
                  <svg className="h-5 w-5 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="type-label text-white/50">Business Email</p>
                  <p className="type-body font-medium text-white">{companyInfo.contactEmail}</p>
                </div>
              </a>

              <a
                href={`mailto:${companyInfo.supportEmail}`}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyber-500/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-500/10">
                  <svg className="h-5 w-5 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <p className="type-label text-white/50">Support Email</p>
                  <p className="type-body font-medium text-white">{companyInfo.supportEmail}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-500/10">
                  <svg className="h-5 w-5 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="type-label text-white/50">Location</p>
                  <p className="type-body font-medium text-white">{companyInfo.location}</p>
                </div>
              </div>

              <a
                href={companyInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-cyber-500/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyber-500/10">
                  <svg className="h-5 w-5 text-cyber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <p className="type-label text-white/50">LinkedIn</p>
                  <p className="type-body font-medium text-white">Aryan Cyber Solutions</p>
                </div>
              </a>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <iframe
                title="Aryan Cyber Solutions Location"
                src="https://maps.google.com/maps?q=Visakhapatnam,+India&output=embed"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8">
            <div className="mb-6 flex rounded-lg border border-white/10 p-1">
              <button
                type="button"
                className={`type-label flex-1 rounded-md py-2.5 font-semibold transition-all ${
                  tab === "contact" ? "bg-cyber-500 text-white" : "text-white/60 hover:text-white"
                }`}
                onClick={() => switchTab("contact")}
              >
                Contact
              </button>
              <button
                type="button"
                className={`type-label flex-1 rounded-md py-2.5 font-semibold transition-all ${
                  tab === "internship" ? "bg-cyber-500 text-white" : "text-white/60 hover:text-white"
                }`}
                onClick={() => switchTab("internship")}
              >
                Internship
              </button>
            </div>

            {formState.status === "success" ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="card-title mb-2">Message Sent Successfully</h3>
                <p className="type-body mb-6 max-w-sm text-white/60">{formState.message}</p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setFormState(initialFormState)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                {tab === "contact" ? (
                  <div className="flex flex-col gap-5">
                    <Field label="Name" name="fullName" error={errors.fullName} required />
                    <Field label="Email" name="email" type="email" error={errors.email} required />
                    <Field label="Phone" name="phone" type="tel" error={errors.phone} required />
                    <Field label="Company" name="company" error={errors.company} required />
                    <Field label="Subject" name="subject" error={errors.subject} required />
                    <Field label="Message" name="message" error={errors.message} required textarea />
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    <Field label="Name" name="fullName" error={errors.fullName} required />
                    <Field label="Email" name="email" type="email" error={errors.email} required />
                    <Field label="Phone Number" name="phone" type="tel" error={errors.phone} required />
                    <Field label="College" name="college" error={errors.college} required />

                    <InternshipSelect
                      value={selectedInternship}
                      error={errors.internship}
                      onChange={(value) => {
                        setSelectedInternship(value);
                        if (errors.internship) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.internship;
                            return next;
                          });
                        }
                      }}
                    />

                    <Field label="Message" name="message" error={errors.message} required textarea />

                    <div>
                      <label htmlFor="resume" className="type-label mb-2 block font-medium text-white/80">
                        Resume (PDF)
                      </label>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        accept="application/pdf,.pdf"
                        required
                        className="type-label w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/70 file:mr-4 file:rounded-md file:border-0 file:bg-cyber-500/20 file:px-4 file:py-1.5 file:text-base file:font-medium file:text-cyber-400"
                      />
                      {errors.resume && <p className="type-label mt-1 text-red-400">{errors.resume}</p>}
                    </div>
                  </div>
                )}

                {formState.status === "error" && (
                  <p className="type-label mt-4 text-red-400" role="alert">
                    {formState.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={formState.status === "loading"}
                  className="btn-primary mt-6 w-full disabled:opacity-60"
                >
                  {formState.status === "loading" ? "Sending..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InternshipSelect({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = "internship-options";

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor="internship-trigger" className="type-label mb-2 block font-medium text-white/80">
        Selected Internship
      </label>
      <input type="hidden" name="internship" value={value} />
      <button
        id="internship-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`${inputClass} flex items-center justify-between gap-3 text-left transition-all duration-200 ${
          open ? "border-cyber-500/50" : ""
        } ${error ? "border-red-400/50" : ""}`}
      >
        <span className={value ? "text-white" : "text-white/40"}>
          {value || "Select Internship Program"}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`absolute left-0 right-0 z-30 mt-2 origin-top overflow-hidden rounded-lg border border-white/10 bg-[#0d1326] shadow-[0_16px_40px_rgba(0,0,0,0.45)] transition-all duration-200 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <ul
          id={listId}
          role="listbox"
          aria-label="Internship programs"
          className="max-h-60 overflow-y-auto py-1"
        >
          {internshipOptions.map((option) => {
            const selected = value === option;
            return (
              <li key={option} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`type-label w-full px-4 py-2.5 text-left transition-colors duration-150 ${
                    selected
                      ? "bg-cyber-500/20 text-white"
                      : "text-white/80 hover:bg-white/[0.06] hover:text-white"
                  }`}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {error && <p className="type-label mt-1 text-red-400">{error}</p>}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const id = name;

  return (
    <div>
      <label htmlFor={id} className="type-label mb-2 block font-medium text-white/80">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={4}
          className={`${inputClass} resize-none placeholder-white/30`}
          suppressHydrationWarning
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          className={`${inputClass} placeholder-white/30`}
          suppressHydrationWarning
          autoComplete={
            type === "email"
              ? "email"
              : type === "tel"
                ? "tel"
                : name === "fullName"
                  ? "name"
                  : undefined
          }
        />
      )}
      {error && <p className="type-label mt-1 text-red-400">{error}</p>}
    </div>
  );
}
