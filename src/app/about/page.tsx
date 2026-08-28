import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About — Aryan Cyber Solutions",
  description:
    "Learn about Aryan Cyber Solutions — our mission, expertise, certified professionals, and workflow for delivering enterprise cybersecurity in India.",
};

export default function AboutPage() {
  return <About />;
}
