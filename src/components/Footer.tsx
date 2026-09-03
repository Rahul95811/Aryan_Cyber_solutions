'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, companyInfo } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname?.startsWith('/training/assessment')) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="container-main section-padding !py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Aryan Cyber Solutions"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="type-label font-semibold">Aryan Cyber Solutions</span>
            </Link>
            <p className="type-body max-w-xs text-white/50">
              Enterprise cybersecurity services, security consulting, and professional
              training programs for organizations across India.
            </p>
          </div>

          <div>
            <h3 className="type-label mb-4 font-semibold text-white">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="type-body text-white/50 transition-colors hover:text-cyber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="type-label mb-4 font-semibold text-white">Legal</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="#" className="type-body text-white/50 transition-colors hover:text-cyber-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="type-body text-white/50 transition-colors hover:text-cyber-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="type-body text-white/50 transition-colors hover:text-cyber-400">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="type-label mb-4 font-semibold text-white">Connect</h3>
            <a
              href={companyInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="type-body inline-flex items-center gap-2 text-white/50 transition-colors hover:text-cyber-400"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <p className="type-body mt-4 text-white/50">{companyInfo.contactEmail}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center">
          <p className="type-label text-white/40">
            &copy; {currentYear} Aryan Cyber Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
