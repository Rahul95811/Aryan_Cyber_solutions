import type { Metadata } from "next";
import Internships from "@/components/Internships";

export const metadata: Metadata = {
  title: "Internships — Aryan Cyber Solutions",
  description:
    "Join our cybersecurity internship programs — hands-on training, mentorship, and real-world exposure to enterprise security for students and professionals.",
};

export default function InternshipsPage() {
  return <Internships />;
}
