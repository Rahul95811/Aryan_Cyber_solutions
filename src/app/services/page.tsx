import type { Metadata } from "next";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Services — Aryan Cyber Solutions",
  description:
    "Enterprise cybersecurity services including VAPT, Security Audits, SOC Operations, Incident Response, Cyber Awareness Programs, and Security Consulting.",
};

export default function ServicesPage() {
  return <Services />;
}
