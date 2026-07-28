import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aryan Cyber Solutions | Enterprise Cybersecurity Services",
  description:
    "Aryan Cyber Solutions delivers enterprise-grade cybersecurity services, vulnerability assessments, security consulting, and professional internship programs. Trusted security partner in Visakhapatnam, India.",
  keywords: [
    "cybersecurity",
    "enterprise security",
    "penetration testing",
    "SOC operations",
    "security consulting",
    "cybersecurity internship",
    "Visakhapatnam",
  ],
  openGraph: {
    title: "Aryan Cyber Solutions | Enterprise Cybersecurity Services",
    description:
      "Enterprise-grade cybersecurity services, security consulting, and professional training programs.",
    type: "website",
    locale: "en_IN",
  },
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`} suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cyber-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
