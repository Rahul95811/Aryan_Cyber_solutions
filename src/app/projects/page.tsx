import type { Metadata } from "next";
import Projects from "@/components/Projects";

export const metadata: Metadata = {
  title: "Projects — Aryan Cyber Solutions",
  description:
    "Explore our featured cybersecurity projects including LinkShield AV, AI CCTV Exam Monitoring, and IoT Cyber Attack Detection Platform.",
};

export default function ProjectsPage() {
  return <Projects />;
}
