import Link from "next/link";
import { stats } from "@/lib/data";
import HeroBackground from "./HeroBackground";
import TrustStrip from "./TrustStrip";

export default function Hero() {
  return (
    <>
      <section
        id="home"
        className="relative flex min-h-[85vh] items-center justify-center overflow-hidden lg:min-h-[88vh]"
        style={{ backgroundColor: "#0B1020" }}
      >
        <HeroBackground />

        <div className="container-main relative z-10 flex w-full flex-col items-center px-5 pb-16 pt-28 text-center sm:px-6 lg:pb-20 lg:pt-24">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
            <span className="type-label uppercase tracking-[0.12em] text-white/55">
              SOC Operations Active
            </span>
          </div>

          <h1 className="type-hero mb-5 max-w-[850px]">
            Enterprise Cybersecurity{" "}
            <span className="text-cyber-400">Solutions</span>
          </h1>

          <p className="type-body mb-8 max-w-[700px] text-white/55">
            Delivering enterprise-grade cybersecurity services, security consulting, VAPT,
            SOC operations, and awareness programs for organizations across India.
          </p>

          <div className="mb-12 flex flex-row flex-wrap items-center justify-center gap-6">
            <Link href="/contact" className="btn-hero-primary">
              Request Consultation
            </Link>
            <Link href="/services" className="btn-hero-secondary">
              Explore Services
            </Link>
          </div>

          <div className="grid w-full max-w-4xl grid-cols-2 gap-8 border-t border-white/10 pt-10 sm:grid-cols-4 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="type-stat mb-2">{stat.value}</div>
                <div className="type-label text-white/45">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustStrip />
    </>
  );
}
