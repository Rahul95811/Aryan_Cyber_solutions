export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Internships", href: "/internships" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: "50+", label: "Cyber Awareness Programs" },
  { value: "5000+", label: "Professionals & Students Trained" },
  { value: "24/7", label: "Security Monitoring" },
  { value: "6+", label: "Enterprise Cybersecurity Services" },
];

export const services = [
  {
    id: "vapt",
    name: "Vulnerability Assessment & Penetration Testing",
    description:
      "Identify and eliminate security vulnerabilities through comprehensive web, network, API, and infrastructure penetration testing.",
    icon: "shield-scan",
  },
  {
    id: "audit",
    name: "Security Audit & Compliance",
    description:
      "Assess your organization's security posture and ensure compliance with industry standards such as ISO 27001 and regulatory frameworks.",
    icon: "audit",
  },
  {
    id: "awareness",
    name: "Cyber Security Awareness Programs",
    description:
      "Deliver practical cybersecurity awareness programs that educate employees, students, and professionals to recognize cyber threats.",
    icon: "awareness",
  },
  {
    id: "consulting",
    name: "Security Consulting",
    description:
      "Provide strategic cybersecurity consulting to help organizations design secure architectures and improve cyber resilience.",
    icon: "consulting",
  },
  {
    id: "incident",
    name: "Incident Response & Digital Forensics",
    description:
      "Rapidly detect, investigate, contain, and recover from cyber incidents while preserving digital evidence.",
    icon: "incident",
  },
  {
    id: "soc",
    name: "Managed Security & SOC Services",
    description:
      "24×7 security monitoring, threat detection, log analysis, and continuous protection through SOC services.",
    icon: "soc",
  },
];

export type Project = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  technologies: string[];
  image?: string;
  video?: string;
  videoPlaceholder?: {
    title: string;
    subtitle: string;
  };
  badge?: string;
  featured?: boolean;
  milestone?: {
    label: string;
    value: string;
  };
  details?: {
    overview: string;
    currentMilestone: string;
    developmentStatus: string;
    demo: string;
  };
};

export const projects: Project[] = [
  {
    id: "ai-cctv-exam-monitoring",
    name: "AI CCTV Exam Monitoring",
    tagline: "AI / Computer Vision / Cybersecurity",
    description:
      "An AI-powered CCTV-based exam monitoring solution designed to support secure and observant examination environments through intelligent video analysis.",
    technologies: ["AI", "Computer Vision", "Cybersecurity"],
    badge: "MSME — First Round Selected",
    featured: true,
    video: "/exammonitor.mp4",
    milestone: {
      label: "PROJECT STATUS",
      value: "First Round MSME Selection",
    },
    details: {
      overview:
        "An AI-powered CCTV-based examination monitoring concept focused on improving observation and maintaining secure examination environments through intelligent video analysis.",
      currentMilestone: "Selected for the first round of MSME selection/evaluation.",
      developmentStatus: "Prototype / Development",
      demo: "Coming Soon",
    },
  },
  {
    id: "linkshield",
    name: "LinkShield AV",
    tagline: "Enterprise Endpoint Protection",
    description:
      "A next-generation endpoint protection platform designed to detect, prevent, and respond to advanced malware threats across enterprise environments with real-time threat intelligence.",
    technologies: ["C++", "Windows API", "Threat Intelligence", "Real-time Scanning"],
    video: "/linkshield.mp4",
    milestone: {
      label: "PROJECT STATUS",
      value: "Active Development",
    },
    details: {
      overview:
        "LinkShield AV is an enterprise-grade endpoint protection solution built for Windows environments. It focuses on real-time detection and response to malware threats using low-level system APIs and threat intelligence feeds.",
      currentMilestone: "Core detection engine built and functional. Demo preview available.",
      developmentStatus: "Active Development",
      demo: "Preview Available",
    },
  },

  {
    id: "iot-detection",
    name: "IoT Cyber Attack Detection Platform",
    tagline: "Smart Device Security",
    description:
      "Advanced platform for monitoring IoT device traffic and detecting anomalous behavior patterns indicative of cyber attacks on connected infrastructure.",
    technologies: ["Machine Learning", "Network Analysis", "IoT Protocols", "Cloud"],
    image: "/iot.png",
    milestone: {
      label: "PROJECT STATUS",
      value: "Research & Development",
    },
    details: {
      overview:
        "A research-driven platform focused on analysing IoT network traffic to identify anomalous patterns and flag potential cyber threats targeting connected devices and smart infrastructure.",
      currentMilestone: "Initial research phase complete. Traffic analysis module in development.",
      developmentStatus: "Research / Development",
      demo: "Coming Soon",
    },
  },
];

export const serviceOptions = [
  "Vulnerability Assessment & Penetration Testing",
  "Security Audit & Compliance",
  "Cyber Security Awareness Programs",
  "Security Consulting",
  "Incident Response & Digital Forensics",
  "Managed Security & SOC Services",
];

export const companyInfo = {
  contactEmail: "contact@sriaryan.com",
  supportEmail: "support@sriaryan.com",
  location: "Visakhapatnam, India",
  linkedin: "https://linkedin.com/company/aryan-cyber-solutions",
};
