"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (pathname?.startsWith('/training/assessment')) {
    return null;
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "border-b border-white/10 bg-[#0B1020]/95 backdrop-blur-md"
          : "bg-[#0B1020]/70 backdrop-blur-sm"
      }`}
    >
      <nav className="container-main flex h-14 items-center justify-between lg:h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Aryan Cyber Solutions"
            width={36}
            height={36}
            className="rounded object-contain"
            priority
          />
          <span className="type-nav hidden font-semibold tracking-tight text-white sm:block">
            Aryan Cyber Solutions
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`type-nav relative py-1 transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {/* Active underline */}
                {isActive(link.href) && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-cyber-400" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="btn-sm hidden bg-cyber-500 text-white hover:bg-cyber-600 lg:inline-flex"
        >
          Contact Us
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded border border-white/10 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0B1020] lg:hidden">
          <ul className="container-main flex flex-col py-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`type-nav flex items-center gap-2 px-1 py-2.5 transition-colors ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {isActive(link.href) && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyber-400" />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                className="btn-sm inline-flex bg-cyber-500 text-white"
                onClick={() => setMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
