import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Aryan Cyber Solutions",
  description:
    "Get in touch with Aryan Cyber Solutions for enterprise cybersecurity consultations, VAPT, SOC services, or internship enquiries.",
};

export default function ContactPage() {
  return <Contact />;
}
