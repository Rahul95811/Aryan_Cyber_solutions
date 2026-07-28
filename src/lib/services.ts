export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  id: string;
  name: string;
  shortName: string;
  cardDescription: string;
  overview: string;
  icon: string;
  banner: string;
  highlights?: string[];
  features: string[];
  process: { step: number; title: string; description: string }[];
  industries: string[];
  benefits: string[];
  faqs: ServiceFaq[];
  cta: string;
  /** Extra content for awareness programs */
  awareness?: {
    keyTopics: string[];
    programHighlights: string[];
    targetAudience: string[];
    deliveryModes: string[];
  };
}

export const cybersecurityServices: ServiceDetail[] = [
  {
    id: "vapt",
    name: "Vulnerability Assessment & Penetration Testing (VAPT)",
    shortName: "VAPT",
    icon: "shield-scan",
    banner: "from-blue-900/70 to-navy-800",
    cardDescription:
      "Identify and eliminate security vulnerabilities through comprehensive web, network, API, and infrastructure penetration testing.",
    overview:
      "Our VAPT engagements simulate real-world attack scenarios across web applications, networks, APIs, and infrastructure. We identify critical weaknesses before adversaries can exploit them, then deliver prioritized remediation guidance aligned with industry frameworks and your business risk profile.",
    features: [
      "Comprehensive Assessment",
      "Expert Security Team",
      "Industry Best Practices",
      "Detailed Reports",
      "Actionable Recommendations",
      "Ongoing Support",
    ],
    process: [
      { step: 1, title: "Consultation", description: "Define scope, assets, and testing objectives." },
      { step: 2, title: "Assessment", description: "Conduct vulnerability scanning and manual testing." },
      { step: 3, title: "Analysis", description: "Validate findings and assess business impact." },
      { step: 4, title: "Implementation", description: "Guide remediation and security hardening." },
      { step: 5, title: "Reporting & Support", description: "Deliver executive and technical reports with retest support." },
    ],
    industries: [
      "Corporate Enterprises",
      "Educational Institutions",
      "Government Organizations",
      "Healthcare",
      "Banking & Finance",
      "Manufacturing",
      "IT Companies",
      "Startups",
    ],
    benefits: [
      "Reduce breach risk before attackers exploit gaps",
      "Prioritize fixes with clear severity ratings",
      "Meet compliance and customer security requirements",
      "Strengthen overall security posture with evidence-based insights",
    ],
    faqs: [
      {
        question: "Why is this service important?",
        answer:
          "VAPT helps uncover exploitable weaknesses in applications and infrastructure before attackers do, reducing the likelihood of breaches and data loss.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "Typical engagements range from 1–4 weeks depending on scope, number of assets, and depth of testing required.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes. You receive executive summaries and detailed technical reports with evidence, risk ratings, and remediation guidance.",
      },
      {
        question: "What standards do you follow?",
        answer:
          "We follow OWASP, PTES, NIST, and CVSS scoring methodologies tailored to your environment.",
      },
      {
        question: "Do you provide post-assessment support?",
        answer:
          "Yes. We support remediation discussions and optional retesting to verify that critical findings are resolved.",
      },
    ],
    cta: "Request a VAPT Consultation",
  },
  {
    id: "audit",
    name: "Security Audit & Compliance",
    shortName: "Security Audit",
    icon: "audit",
    banner: "from-indigo-900/70 to-navy-800",
    cardDescription:
      "Assess your organization's security posture and ensure compliance with industry standards such as ISO 27001 and regulatory frameworks.",
    overview:
      "We evaluate policies, controls, and technical safeguards against leading standards including ISO 27001 and applicable regulatory frameworks. Our audits identify gaps, strengthen governance, and help you demonstrate compliance readiness to stakeholders and regulators.",
    features: [
      "Gap Analysis & Maturity Assessment",
      "ISO 27001 Alignment",
      "Policy & Control Review",
      "Evidence-Based Findings",
      "Remediation Roadmap",
      "Audit Support",
    ],
    process: [
      { step: 1, title: "Consultation", description: "Understand compliance goals and current controls." },
      { step: 2, title: "Assessment", description: "Review policies, processes, and technical safeguards." },
      { step: 3, title: "Analysis", description: "Map findings to standards and risk levels." },
      { step: 4, title: "Implementation", description: "Support control improvements and documentation." },
      { step: 5, title: "Reporting & Support", description: "Deliver audit reports and readiness guidance." },
    ],
    industries: [
      "Corporate Enterprises",
      "Educational Institutions",
      "Government Organizations",
      "Healthcare",
      "Banking & Finance",
      "Manufacturing",
      "IT Companies",
      "Startups",
    ],
    benefits: [
      "Demonstrate compliance readiness with confidence",
      "Identify governance and control gaps early",
      "Improve security maturity with a clear roadmap",
      "Reduce audit friction for customers and regulators",
    ],
    faqs: [
      {
        question: "Why is this service important?",
        answer:
          "Security audits ensure your controls meet industry standards and regulatory expectations, reducing compliance risk and strengthening trust.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "Most audits take 2–6 weeks depending on organization size, scope, and documentation readiness.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes. You receive gap analysis reports, control assessments, and prioritized remediation recommendations.",
      },
      {
        question: "What standards do you follow?",
        answer:
          "We align with ISO 27001, NIST CSF, and relevant sector-specific regulatory frameworks.",
      },
      {
        question: "Do you provide post-assessment support?",
        answer:
          "Yes. We assist with remediation planning, policy updates, and preparation for formal certification audits.",
      },
    ],
    cta: "Request a Security Audit",
  },
  {
    id: "awareness",
    name: "Cyber Security Awareness Programs",
    shortName: "Awareness Programs",
    icon: "awareness",
    banner: "from-cyan-900/60 to-navy-800",
    cardDescription:
      "Deliver practical cybersecurity awareness programs that educate employees, students, and professionals to recognize cyber threats and follow secure practices.",
    overview:
      "We conduct practical cybersecurity awareness programs that help employees, students, and organizations recognize cyber threats, prevent cyber attacks, and build a strong security culture through interactive sessions and real-world demonstrations.",
    highlights: ["50+ Awareness Programs Conducted", "5000+ Participants Trained"],
    features: [
      "Interactive Workshops",
      "Live Demonstrations",
      "Real-World Case Studies",
      "Customized Content",
      "Certificate of Participation",
      "Post-Program Support",
    ],
    process: [
      { step: 1, title: "Consultation", description: "Understand audience, goals, and delivery preferences." },
      { step: 2, title: "Assessment", description: "Identify awareness gaps and priority topics." },
      { step: 3, title: "Analysis", description: "Design a tailored program agenda and materials." },
      { step: 4, title: "Implementation", description: "Deliver offline, online, or hybrid sessions." },
      { step: 5, title: "Reporting & Support", description: "Share feedback insights and follow-up resources." },
    ],
    industries: [
      "Corporate Enterprises",
      "Educational Institutions",
      "Government Organizations",
      "Healthcare",
      "Banking & Finance",
      "Manufacturing",
      "IT Companies",
      "Startups",
    ],
    benefits: [
      "Reduce human-error related security incidents",
      "Build a lasting security-first culture",
      "Improve phishing and social engineering resilience",
      "Engage teams with practical, memorable learning",
    ],
    faqs: [
      {
        question: "Why is this service important?",
        answer:
          "Most breaches involve human factors. Awareness training equips people to recognize threats and respond securely.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "Programs can be delivered as half-day, full-day, or multi-session formats based on your requirements.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes. We provide participation summaries, feedback insights, and recommendations for continuous awareness.",
      },
      {
        question: "What standards do you follow?",
        answer:
          "Content is aligned with NIST awareness guidance, ISO security culture practices, and current threat trends.",
      },
      {
        question: "Do you provide post-assessment support?",
        answer:
          "Yes. We offer follow-up materials, refresher sessions, and phishing simulation support options.",
      },
    ],
    cta: "Book an Awareness Program",
    awareness: {
      keyTopics: [
        "Phishing Awareness",
        "Social Engineering",
        "Password Security",
        "Email Security",
        "Mobile Security",
        "Safe Internet Practices",
        "Ransomware Awareness",
        "Data Privacy",
        "Insider Threats",
        "Secure Remote Working",
      ],
      programHighlights: [
        "50+ Awareness Programs Conducted",
        "5000+ Participants Trained",
        "Live Demonstrations",
        "Interactive Workshops",
        "Case Studies",
        "Certificate of Participation",
      ],
      targetAudience: [
        "Corporate Organizations",
        "Colleges",
        "Universities",
        "Government Organizations",
        "IT Companies",
        "Manufacturing Industries",
        "Healthcare Organizations",
      ],
      deliveryModes: ["Offline", "Online", "Hybrid"],
    },
  },
  {
    id: "consulting",
    name: "Security Consulting",
    shortName: "Security Consulting",
    icon: "consulting",
    banner: "from-violet-900/60 to-navy-800",
    cardDescription:
      "Provide strategic cybersecurity consulting to help organizations design secure architectures, reduce risks, and improve cyber resilience.",
    overview:
      "Our consultants partner with leadership and technical teams to design secure architectures, prioritize risks, and build resilient security programs. We translate complex threats into clear strategies that align security investments with business outcomes.",
    features: [
      "Security Strategy & Roadmaps",
      "Architecture Reviews",
      "Risk Reduction Planning",
      "Policy Development",
      "Vendor & Technology Guidance",
      "Executive Advisory",
    ],
    process: [
      { step: 1, title: "Consultation", description: "Align on business goals and security challenges." },
      { step: 2, title: "Assessment", description: "Evaluate current architecture and risk exposure." },
      { step: 3, title: "Analysis", description: "Define priorities and strategic recommendations." },
      { step: 4, title: "Implementation", description: "Guide architecture and control improvements." },
      { step: 5, title: "Reporting & Support", description: "Deliver roadmaps with ongoing advisory support." },
    ],
    industries: [
      "Corporate Enterprises",
      "Educational Institutions",
      "Government Organizations",
      "Healthcare",
      "Banking & Finance",
      "Manufacturing",
      "IT Companies",
      "Startups",
    ],
    benefits: [
      "Make informed security investment decisions",
      "Reduce risk with prioritized initiatives",
      "Design secure systems from the ground up",
      "Accelerate maturity with expert guidance",
    ],
    faqs: [
      {
        question: "Why is this service important?",
        answer:
          "Strategic consulting ensures security initiatives are aligned with business risk, budgets, and long-term resilience goals.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "Engagements typically range from 2–8 weeks depending on scope and organizational complexity.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes. Deliverables include strategy documents, architecture recommendations, and actionable roadmaps.",
      },
      {
        question: "What standards do you follow?",
        answer:
          "We apply NIST CSF, ISO 27001, Zero Trust principles, and industry best practices.",
      },
      {
        question: "Do you provide post-assessment support?",
        answer:
          "Yes. Retainer and advisory options are available for ongoing implementation support.",
      },
    ],
    cta: "Talk to a Security Consultant",
  },
  {
    id: "incident",
    name: "Incident Response & Digital Forensics",
    shortName: "Incident Response",
    icon: "incident",
    banner: "from-orange-900/50 to-navy-800",
    cardDescription:
      "Rapidly detect, investigate, contain, and recover from cyber incidents while preserving digital evidence for forensic analysis.",
    overview:
      "When incidents occur, speed and precision matter. Our team helps detect, contain, eradicate, and recover from cyber attacks while preserving forensic evidence. We support root-cause analysis and strengthen defenses to prevent recurrence.",
    features: [
      "Rapid Incident Triage",
      "Containment & Recovery",
      "Digital Forensics",
      "Evidence Preservation",
      "Root Cause Analysis",
      "Post-Incident Hardening",
    ],
    process: [
      { step: 1, title: "Consultation", description: "Establish incident scope and response priorities." },
      { step: 2, title: "Assessment", description: "Triage alerts and identify compromised assets." },
      { step: 3, title: "Analysis", description: "Investigate root cause and attacker activity." },
      { step: 4, title: "Implementation", description: "Contain threats and restore operations." },
      { step: 5, title: "Reporting & Support", description: "Deliver IR reports and hardening recommendations." },
    ],
    industries: [
      "Corporate Enterprises",
      "Educational Institutions",
      "Government Organizations",
      "Healthcare",
      "Banking & Finance",
      "Manufacturing",
      "IT Companies",
      "Startups",
    ],
    benefits: [
      "Minimize downtime and business impact",
      "Preserve evidence for legal and compliance needs",
      "Understand how the attack happened",
      "Strengthen defenses after recovery",
    ],
    faqs: [
      {
        question: "Why is this service important?",
        answer:
          "Effective incident response limits damage, accelerates recovery, and provides forensic clarity for leadership and regulators.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "Initial containment can begin immediately. Full investigation timelines vary based on incident complexity.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes. You receive timeline reconstructions, forensic findings, and post-incident recommendations.",
      },
      {
        question: "What standards do you follow?",
        answer:
          "We follow NIST incident response lifecycle practices and industry forensic evidence-handling guidelines.",
      },
      {
        question: "Do you provide post-assessment support?",
        answer:
          "Yes. We support recovery validation, lessons-learned workshops, and security control improvements.",
      },
    ],
    cta: "Request Incident Response Support",
  },
  {
    id: "soc",
    name: "Managed Security & SOC Services",
    shortName: "SOC Services",
    icon: "soc",
    banner: "from-emerald-900/50 to-navy-800",
    cardDescription:
      "24×7 security monitoring, threat detection, log analysis, incident response, and continuous protection through Security Operations Center (SOC) services.",
    overview:
      "Our Managed Security and SOC services provide continuous monitoring, threat detection, log analysis, and coordinated incident response. We help organizations maintain around-the-clock visibility and protection without building a full in-house SOC from scratch.",
    features: [
      "24×7 Security Monitoring",
      "Threat Detection & Alerting",
      "Log Analysis & Correlation",
      "Incident Escalation Support",
      "SIEM Integration",
      "Continuous Improvement",
    ],
    process: [
      { step: 1, title: "Consultation", description: "Define monitoring scope and critical assets." },
      { step: 2, title: "Assessment", description: "Onboard log sources and detection use cases." },
      { step: 3, title: "Analysis", description: "Tune detections and reduce false positives." },
      { step: 4, title: "Implementation", description: "Operate continuous monitoring and response." },
      { step: 5, title: "Reporting & Support", description: "Provide dashboards, reports, and advisory reviews." },
    ],
    industries: [
      "Corporate Enterprises",
      "Educational Institutions",
      "Government Organizations",
      "Healthcare",
      "Banking & Finance",
      "Manufacturing",
      "IT Companies",
      "Startups",
    ],
    benefits: [
      "Gain 24×7 visibility into security events",
      "Detect threats earlier with continuous monitoring",
      "Reduce operational burden on internal teams",
      "Improve response readiness with expert SOC support",
    ],
    faqs: [
      {
        question: "Why is this service important?",
        answer:
          "Continuous monitoring is essential for detecting threats in real time and responding before damage escalates.",
      },
      {
        question: "How long does the assessment take?",
        answer:
          "Initial onboarding typically takes 2–4 weeks depending on log sources and environment complexity.",
      },
      {
        question: "Do you provide reports?",
        answer:
          "Yes. Clients receive regular monitoring summaries, incident reports, and executive dashboards.",
      },
      {
        question: "What standards do you follow?",
        answer:
          "We align SOC operations with NIST, MITRE ATT&CK detection mapping, and industry SIEM best practices.",
      },
      {
        question: "Do you provide post-assessment support?",
        answer:
          "Yes. Managed SOC is an ongoing service with continuous detection tuning and advisory support.",
      },
    ],
    cta: "Explore SOC Services",
  },
];
