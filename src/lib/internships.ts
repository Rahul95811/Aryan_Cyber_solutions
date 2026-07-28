export interface CurriculumModule {
  id: number;
  title: string;
  lessons: string[];
}

export interface InternshipProgram {
  id: string;
  title: string;
  icon: string;
  banner: string;
  description: string;
  duration: string;
  certificate: string;
  trainingMode: string;
  eligibility: string;
  careerOpportunities: string;
  labs: string;
  industryProjects: string;
  technologies: string[];
  curriculum: CurriculumModule[];
}

function mod(id: number, title: string, lessons: string[]): CurriculumModule {
  return { id, title, lessons };
}

const defaultLessons = (topic: string) => [
  `${topic} — Core Concepts`,
  `${topic} — Practical Lab`,
  `${topic} — Assessment`,
];

const defaultMeta = {
  trainingMode: "Hybrid — Online Labs & Instructor-Led Sessions",
  eligibility: "Students, graduates, and IT professionals with basic computer knowledge",
};

const allPrograms: InternshipProgram[] = [
  {
    id: "soc-analyst",
    title: "SOC Analyst",
    icon: "monitor",
    banner: "from-blue-900/60 to-navy-800",
    description:
      "Build expertise in Security Operations Center workflows, threat detection, log analysis, and incident triage using industry-standard SIEM platforms and real-world SOC scenarios.",
    duration: "12 Weeks",
    certificate: "Industry-Recognized SOC Analyst Certificate",
    ...defaultMeta,
    labs: "Hands-on Splunk & SIEM Labs",
    industryProjects: "Live SOC Alert Triage & Incident Simulation",
    technologies: ["SIEM","Splunk","Linux","Python","Threat Detection"],
    careerOpportunities: "SOC Analyst, Security Analyst, Threat Monitoring Engineer",
    curriculum: [
      mod(1, "Introduction", ["Welcome to the SOC Analyst Program", "Cybersecurity Career Landscape", "SOC Roles & Responsibilities"]),
      mod(2, "Linux & Python Fundamentals", ["Linux Command Line Essentials", "Python Scripting for Security", "Automating Security Tasks"]),
      mod(3, "Information Security", ["CIA Triad & Security Principles", "Asset Classification", "Security Policies & Standards"]),
      mod(4, "Application Security", ["OWASP Top 10 Overview", "Web Vulnerability Basics", "Secure Coding Principles"]),
      mod(5, "Network Security", ["Network Protocols & Security", "Firewall & IDS/IPS", "Network Traffic Analysis"]),
      mod(6, "Cryptography", ["Encryption Fundamentals", "Hashing & Digital Signatures", "PKI & Certificate Management"]),
      mod(7, "Governance & Compliance", ["ISO 27001 Overview", "Risk Assessment Frameworks", "Audit & Compliance Basics"]),
      mod(8, "Threat Intelligence", ["Threat Actor Profiles", "IOC Analysis", "Intelligence Feed Integration"]),
      mod(9, "Security Operations Center", ["SOC Architecture & Workflow", "Alert Triage Process", "Escalation Procedures"]),
      mod(10, "Incident Response", ["Incident Response Lifecycle", "Root Cause Analysis", "Breach Investigation Case Study"]),
      mod(11, "SIEM & Splunk", ["SIEM Architecture Overview", "Splunk Search & Reporting", "Custom Dashboards & Alerts"]),
      mod(12, "Job Preparation", ["Resume & Portfolio Building", "SOC Interview Preparation", "Capstone SOC Project"]),
    ],
  },
  {
    id: "pentest",
    title: "Penetration Testing",
    icon: "shield",
    banner: "from-indigo-900/60 to-navy-800",
    description:
      "Master ethical hacking methodologies, vulnerability assessment, and penetration testing frameworks through structured labs, controlled environments, and real-world attack simulations.",
    duration: "10 Weeks",
    certificate: "Penetration Testing Professional Certificate",
    ...defaultMeta,
    labs: "Live Penetration Testing Labs",
    industryProjects: "Full-Scope Penetration Test Engagement",
    technologies: ["Nmap","Burp Suite","Metasploit","OWASP","Kali Linux"],
    careerOpportunities: "Penetration Tester, Ethical Hacker, VAPT Consultant",
    curriculum: [
      mod(1, "Introduction to Ethical Hacking", ["Penetration Testing Overview", "Legal & Ethical Framework", "Lab Environment Setup"]),
      mod(2, "Reconnaissance & Footprinting", ["Passive Information Gathering", "Active Reconnaissance", "OSINT Techniques"]),
      mod(3, "Scanning & Enumeration", ["Network Scanning with Nmap", "Service Enumeration", "Vulnerability Scanning"]),
      mod(4, "Vulnerability Assessment", ["CVSS Scoring", "Vulnerability Reporting", "Risk Prioritization"]),
      mod(5, "Web Application Testing", ["Burp Suite Fundamentals", "SQL Injection & XSS", "Authentication Bypass"]),
      mod(6, "Network Penetration Testing", ["Network Exploitation", "Privilege Escalation", "Lateral Movement"]),
      mod(7, "Wireless & Mobile Security", ["Wi-Fi Security Testing", "Mobile App Assessment", "Bluetooth Security"]),
      mod(8, "Post-Exploitation", ["Persistence Mechanisms", "Data Exfiltration", "Covering Tracks"]),
      mod(9, "Report Writing", ["Executive Summary Writing", "Technical Finding Documentation", "Remediation Recommendations"]),
      mod(10, "Capstone Project", ["Scope Definition", "Full Penetration Test", "Final Report Presentation"]),
    ],
  },
  {
    id: "metasploit",
    title: "Metasploit Framework",
    icon: "terminal",
    banner: "from-cyan-900/60 to-navy-800",
    description:
      "Gain deep proficiency in the Metasploit Framework for exploitation, payload delivery, post-exploitation, and integration with professional penetration testing workflows.",
    duration: "8 Weeks",
    certificate: "Metasploit Framework Specialist Certificate",
    ...defaultMeta,
    labs: "Metasploit Hands-on Labs",
    industryProjects: "Multi-Stage Exploitation Scenario",
    technologies: ["Metasploit","Meterpreter","Exploit Dev","Kali Linux"],
    careerOpportunities: "Penetration Tester, Exploit Developer, Red Team Operator",
    curriculum: [
      mod(1, "Metasploit Overview", ["Framework Architecture", "Msfconsole Basics", "Module Types"]),
      mod(2, "Environment Setup", ["Kali Linux Configuration", "Target Lab Setup", "Network Configuration"]),
      mod(3, "Exploit Modules & Payloads", ["Exploit Selection", "Payload Configuration", "Handler Setup"]),
      mod(4, "Auxiliary & Post Modules", ["Auxiliary Module Usage", "Post-Exploitation Modules", "Credential Harvesting"]),
      mod(5, "Meterpreter Deep Dive", ["Meterpreter Commands", "File System Operations", "Pivoting Techniques"]),
      mod(6, "Custom Exploit Development", ["Writing Custom Modules", "Exploit Modification", "Testing & Validation"]),
      mod(7, "Evasion Techniques", ["AV Evasion Basics", "Encoding Payloads", "Obfuscation Methods"]),
      mod(8, "Tool Integration", ["Nmap & Metasploit", "Burp Suite Integration", "Reporting Tools"]),
      mod(9, "Scenario Labs", ["Enterprise Network Scenario", "Web Server Compromise", "Domain Controller Attack"]),
      mod(10, "Final Assessment", ["Timed Exploitation Challenge", "Report Submission", "Certification Review"]),
    ],
  },
  {
    id: "digital-forensics",
    title: "Digital Forensics",
    icon: "search",
    banner: "from-purple-900/60 to-navy-800",
    description:
      "Learn digital evidence collection, forensic analysis, chain of custody, and investigation techniques used by law enforcement and enterprise incident response teams.",
    duration: "10 Weeks",
    certificate: "Digital Forensics Analyst Certificate",
    ...defaultMeta,
    labs: "Forensic Imaging & Analysis Labs",
    industryProjects: "End-to-End Forensic Investigation Case",
    technologies: ["Autopsy","Volatility","FTK","Wireshark"],
    careerOpportunities: "Digital Forensics Analyst, Incident Responder, eDiscovery Specialist",
    curriculum: [
      mod(1, "Introduction to Digital Forensics", defaultLessons("Forensics Fundamentals")),
      mod(2, "Evidence Collection", ["Chain of Custody", "Disk Imaging", "Live Forensics"]),
      mod(3, "File System Analysis", ["NTFS & EXT Analysis", "Deleted File Recovery", "Timeline Analysis"]),
      mod(4, "Memory Forensics", ["Memory Acquisition", "Process Analysis", "Malware in Memory"]),
      mod(5, "Network Forensics", ["Packet Capture Analysis", "Network Artifact Recovery", "Intrusion Timeline"]),
      mod(6, "Mobile Forensics", ["Mobile Device Acquisition", "App Data Analysis", "Cloud Evidence"]),
      mod(7, "Forensic Tools", ["Autopsy & FTK", "Volatility Framework", "Wireshark for Forensics"]),
      mod(8, "Report & Legal", ["Forensic Report Writing", "Expert Testimony Basics", "Legal Considerations"]),
    ],
  },
  {
    id: "threat-intelligence",
    title: "Threat Intelligence",
    icon: "radar",
    banner: "from-teal-900/60 to-navy-800",
    description:
      "Develop skills in collecting, analyzing, and operationalizing threat intelligence to proactively defend organizations against advanced persistent threats and emerging attack campaigns.",
    duration: "8 Weeks",
    certificate: "Threat Intelligence Analyst Certificate",
    ...defaultMeta,
    labs: "Threat Intel Platform Labs",
    industryProjects: "Threat Actor Profiling & IOC Report",
    technologies: ["MITRE ATT&CK","STIX/TAXII","OSINT","IOC Analysis"],
    careerOpportunities: "Threat Intelligence Analyst, CTI Researcher, Security Researcher",
    curriculum: [
      mod(1, "Introduction to Threat Intelligence", defaultLessons("Threat Intelligence")),
      mod(2, "Intelligence Collection", ["OSINT for CTI", "Dark Web Monitoring", "Feed Aggregation"]),
      mod(3, "IOC Analysis", ["Indicator Types", "IOC Validation", "STIX/TAXII Framework"]),
      mod(4, "Threat Actor Tracking", ["APT Group Profiles", "TTP Mapping", "MITRE ATT&CK"]),
      mod(5, "Operationalizing Intel", ["Intel-Driven Detection", "Alert Enrichment", "Threat Hunting"]),
      mod(6, "Reporting & Sharing", ["Intelligence Reports", "ISAC Participation", "Executive Briefings"]),
    ],
  },
  {
    id: "siem-splunk",
    title: "SIEM & Splunk",
    icon: "chart",
    banner: "from-sky-900/60 to-navy-800",
    description:
      "Master SIEM architecture, log management, correlation rules, and Splunk administration to detect, investigate, and respond to security events at enterprise scale.",
    duration: "10 Weeks",
    certificate: "SIEM & Splunk Specialist Certificate",
    ...defaultMeta,
    labs: "Splunk Enterprise Labs",
    industryProjects: "Custom SIEM Dashboard & Detection Rules",
    technologies: ["Splunk","SIEM","Log Analysis","Detection Rules"],
    careerOpportunities: "SIEM Engineer, Splunk Administrator, Detection Engineer",
    curriculum: [
      mod(1, "SIEM Fundamentals", defaultLessons("SIEM Architecture")),
      mod(2, "Log Management", ["Log Sources & Parsing", "Normalization", "Retention Policies"]),
      mod(3, "Splunk Basics", ["Splunk Architecture", "Search Processing Language", "Field Extraction"]),
      mod(4, "Correlation Rules", ["Detection Rule Design", "Alert Tuning", "False Positive Reduction"]),
      mod(5, "Dashboards & Reporting", ["Dashboard Creation", "Scheduled Reports", "Executive Metrics"]),
      mod(6, "Advanced Splunk", ["Custom Apps", "Enterprise Security", "Machine Learning Toolkit"]),
    ],
  },
  {
    id: "malware-analysis",
    title: "Malware Analysis",
    icon: "bug",
    banner: "from-red-900/50 to-navy-800",
    description:
      "Analyze malicious software through static and dynamic techniques, reverse engineering, and sandbox analysis to understand threat behavior and develop effective countermeasures.",
    duration: "10 Weeks",
    certificate: "Malware Analysis Professional Certificate",
    ...defaultMeta,
    labs: "Reverse Engineering & Sandbox Labs",
    industryProjects: "Full Malware Analysis Report",
    technologies: ["x64dbg","Sandbox","Reverse Engineering","PE Analysis"],
    careerOpportunities: "Malware Analyst, Reverse Engineer, Threat Researcher",
    curriculum: [
      mod(1, "Introduction to Malware", defaultLessons("Malware Types")),
      mod(2, "Static Analysis", ["PE File Structure", "String Analysis", "Disassembly Basics"]),
      mod(3, "Dynamic Analysis", ["Sandbox Setup", "Behavior Monitoring", "Network Callback Analysis"]),
      mod(4, "Reverse Engineering", ["x86 Assembly Basics", "Debugging with x64dbg", "Deobfuscation"]),
      mod(5, "Advanced Threats", ["Ransomware Analysis", "Rootkit Detection", "Fileless Malware"]),
      mod(6, "Reporting", ["Analysis Report Template", "IOC Extraction", "Signature Development"]),
    ],
  },
  {
    id: "incident-response",
    title: "Incident Response",
    icon: "alert",
    banner: "from-orange-900/50 to-navy-800",
    description:
      "Train in the complete incident response lifecycle — from detection and containment through eradication, recovery, and post-incident review for enterprise security teams.",
    duration: "8 Weeks",
    certificate: "Incident Response Specialist Certificate",
    ...defaultMeta,
    labs: "Simulated Breach Response Labs",
    industryProjects: "Full Incident Response Tabletop Exercise",
    technologies: ["NIST IR","Forensics","Containment","RCA"],
    careerOpportunities: "Incident Responder, CSIRT Analyst, Security Operations Lead",
    curriculum: [
      mod(1, "IR Framework", defaultLessons("NIST IR Lifecycle")),
      mod(2, "Detection & Triage", ["Alert Validation", "Severity Classification", "Initial Scoping"]),
      mod(3, "Containment", ["Network Isolation", "Account Disabling", "Evidence Preservation"]),
      mod(4, "Eradication & Recovery", ["Threat Removal", "System Restoration", "Validation Testing"]),
      mod(5, "Post-Incident", ["Root Cause Analysis", "Lessons Learned", "Process Improvement"]),
    ],
  },
  {
    id: "cloud-security",
    title: "Cloud Security",
    icon: "cloud",
    banner: "from-blue-800/60 to-navy-800",
    description:
      "Secure cloud environments across AWS, Azure, and GCP with identity management, configuration hardening, cloud-native security tools, and compliance frameworks.",
    duration: "10 Weeks",
    certificate: "Cloud Security Professional Certificate",
    ...defaultMeta,
    labs: "Multi-Cloud Security Labs",
    industryProjects: "Cloud Security Posture Assessment",
    technologies: ["AWS","Azure","GCP","IAM","DevSecOps"],
    careerOpportunities: "Cloud Security Engineer, Cloud Architect, DevSecOps Engineer",
    curriculum: [
      mod(1, "Cloud Security Fundamentals", defaultLessons("Shared Responsibility Model")),
      mod(2, "Identity & Access", ["IAM Best Practices", "MFA & SSO", "Privilege Management"]),
      mod(3, "AWS Security", ["VPC Security", "S3 Bucket Policies", "CloudTrail & GuardDuty"]),
      mod(4, "Azure Security", ["Azure AD Security", "Defender for Cloud", "Key Vault"]),
      mod(5, "GCP Security", ["IAM Policies", "Security Command Center", "VPC Service Controls"]),
      mod(6, "DevSecOps", ["CI/CD Security", "Container Security", "Infrastructure as Code"]),
    ],
  },
  {
    id: "network-security",
    title: "Network Security",
    icon: "network",
    banner: "from-emerald-900/50 to-navy-800",
    description:
      "Design and implement enterprise network security with firewalls, IDS/IPS, segmentation, VPNs, and network monitoring to protect critical infrastructure from threats.",
    duration: "10 Weeks",
    certificate: "Network Security Specialist Certificate",
    ...defaultMeta,
    labs: "Network Defense Simulation Labs",
    industryProjects: "Enterprise Network Security Architecture",
    technologies: ["Firewalls","IDS/IPS","VPN","NetFlow"],
    careerOpportunities: "Network Security Engineer, Firewall Administrator, NOC Analyst",
    curriculum: [
      mod(1, "Network Security Basics", defaultLessons("OSI & Security")),
      mod(2, "Firewalls & ACLs", ["Firewall Configuration", "Access Control Lists", "Rule Optimization"]),
      mod(3, "IDS/IPS", ["Signature-Based Detection", "Anomaly Detection", "Inline vs Passive"]),
      mod(4, "VPN & Remote Access", ["IPSec VPN", "SSL VPN", "Zero Trust Access"]),
      mod(5, "Network Monitoring", ["NetFlow Analysis", "Packet Capture", "Anomaly Detection"]),
    ],
  },
  {
    id: "web-app-security",
    title: "Web Application Security",
    icon: "globe",
    banner: "from-violet-900/50 to-navy-800",
    description:
      "Identify and remediate web application vulnerabilities using OWASP standards, secure development practices, and hands-on testing with industry-standard tools.",
    duration: "8 Weeks",
    certificate: "Web Application Security Certificate",
    ...defaultMeta,
    labs: "OWASP WebGoat & DVWA Labs",
    industryProjects: "Full Web Application Security Assessment",
    technologies: ["OWASP","Burp Suite","API Security","XSS/SQLi"],
    careerOpportunities: "AppSec Engineer, Web Penetration Tester, Secure Developer",
    curriculum: [
      mod(1, "OWASP Top 10", defaultLessons("Web Vulnerabilities")),
      mod(2, "Injection Attacks", ["SQL Injection", "Command Injection", "LDAP Injection"]),
      mod(3, "Authentication & Session", ["Broken Authentication", "Session Management", "OAuth Security"]),
      mod(4, "Client-Side Security", ["XSS Types & Prevention", "CSRF Protection", "CSP Headers"]),
      mod(5, "API Security", ["REST API Testing", "GraphQL Security", "Rate Limiting"]),
    ],
  },
  {
    id: "vulnerability-assessment",
    title: "Vulnerability Assessment",
    icon: "scan",
    banner: "from-amber-900/40 to-navy-800",
    description:
      "Conduct systematic vulnerability assessments using automated scanning tools, manual validation, risk scoring, and remediation planning for enterprise environments.",
    duration: "8 Weeks",
    certificate: "Vulnerability Assessment Professional Certificate",
    ...defaultMeta,
    labs: "Nessus, OpenVAS & Nmap Labs",
    industryProjects: "Enterprise Vulnerability Assessment Report",
    technologies: ["Nessus","OpenVAS","Nmap","CVSS"],
    careerOpportunities: "Vulnerability Analyst, Security Assessor, Risk Analyst",
    curriculum: [
      mod(1, "VA Methodology", defaultLessons("Assessment Process")),
      mod(2, "Scanning Tools", ["Nessus Configuration", "OpenVAS Setup", "Scan Policies"]),
      mod(3, "Manual Validation", ["False Positive Analysis", "Proof of Concept", "Impact Assessment"]),
      mod(4, "Risk Scoring", ["CVSS v3.1", "Risk Matrices", "Prioritization Frameworks"]),
      mod(5, "Remediation Planning", ["Patch Management", "Compensating Controls", "Retesting"]),
    ],
  },
  {
    id: "grc",
    title: "Governance Risk & Compliance",
    icon: "compliance",
    banner: "from-slate-800/80 to-navy-800",
    description:
      "Understand governance, risk, and compliance frameworks with hands-on ISO 27001 implementation, audit preparation, policy development, and risk management processes.",
    duration: "10 Weeks",
    certificate: "GRC & ISO 27001 Foundation Certificate",
    ...defaultMeta,
    labs: "ISO 27001 Gap Analysis Labs",
    industryProjects: "ISMS Documentation & Risk Register",
    technologies: ["ISO 27001","Risk Management","ISMS","Audit"],
    careerOpportunities: "GRC Analyst, Compliance Manager, ISO 27001 Lead Implementer",
    curriculum: [
      mod(1, "GRC Fundamentals", defaultLessons("Governance Frameworks")),
      mod(2, "ISO 27001 Standard", ["ISMS Requirements", "Annex A Controls", "Statement of Applicability"]),
      mod(3, "Risk Management", ["Risk Assessment Methodology", "Risk Treatment Plans", "Risk Register"]),
      mod(4, "Policy Development", ["Security Policy Writing", "Procedure Documentation", "Awareness Programs"]),
      mod(5, "Audit Preparation", ["Internal Audit Process", "Evidence Collection", "Non-Conformity Management"]),
    ],
  },
  {
    id: "python-cyber",
    title: "Python for Cyber Security",
    icon: "code",
    banner: "from-green-900/40 to-navy-800",
    description:
      "Build security automation tools, scanners, log parsers, and threat detection scripts using Python libraries essential for modern cybersecurity professionals.",
    duration: "8 Weeks",
    certificate: "Python for Cybersecurity Certificate",
    ...defaultMeta,
    labs: "Security Scripting Labs",
    industryProjects: "Custom Security Automation Tool",
    technologies: ["Python","Socket Programming","Automation","Regex"],
    careerOpportunities: "Security Automation Engineer, SOC Developer, Threat Hunter",
    curriculum: [
      mod(1, "Python Basics", defaultLessons("Python Syntax")),
      mod(2, "Network Scripting", ["Socket Programming", "Port Scanner Development", "Packet Crafting"]),
      mod(3, "Web Security Scripts", ["Web Crawler", "Vulnerability Scanner", "API Testing Tool"]),
      mod(4, "Log Analysis", ["Log Parser Development", "Regex for Security", "Splunk API Integration"]),
      mod(5, "Automation", ["Scheduled Tasks", "Alert Automation", "Report Generation"]),
    ],
  },
  {
    id: "ai-cyber",
    title: "AI Security",
    icon: "ai",
    banner: "from-fuchsia-900/40 to-navy-800",
    description:
      "Explore the intersection of artificial intelligence and cybersecurity — ML-based threat detection, adversarial AI, automated analysis, and AI-powered security tools.",
    duration: "10 Weeks",
    certificate: "AI in Cybersecurity Certificate",
    ...defaultMeta,
    labs: "ML Threat Detection Labs",
    industryProjects: "AI-Based Anomaly Detection Model",
    technologies: ["Machine Learning","Anomaly Detection","NLP","Python"],
    careerOpportunities: "AI Security Researcher, ML Security Engineer, Threat Detection Developer",
    curriculum: [
      mod(1, "AI & Security Overview", defaultLessons("AI in Cybersecurity")),
      mod(2, "ML for Threat Detection", ["Feature Engineering", "Classification Models", "Anomaly Detection"]),
      mod(3, "Adversarial AI", ["Adversarial Attacks", "Model Poisoning", "Defense Strategies"]),
      mod(4, "AI Security Tools", ["Automated Triage", "NLP for Threat Intel", "Computer Vision for Security"]),
      mod(5, "Ethics & Governance", ["AI Ethics in Security", "Bias in ML Models", "Responsible AI"]),
    ],
  },
  {
    id: "iot-security",
    title: "IoT Security",
    icon: "chip",
    banner: "from-cyan-800/50 to-navy-800",
    description:
      "Secure IoT ecosystems through device hardening, protocol analysis, firmware assessment, and network segmentation strategies for connected infrastructure.",
    duration: "8 Weeks",
    certificate: "IoT Security Specialist Certificate",
    ...defaultMeta,
    labs: "IoT Device & Firmware Labs",
    industryProjects: "IoT Security Assessment & Hardening Plan",
    technologies: ["Firmware","MQTT","IoT Protocols","Segmentation"],
    careerOpportunities: "IoT Security Engineer, Embedded Security Analyst, OT Security Specialist",
    curriculum: [
      mod(1, "IoT Security Landscape", defaultLessons("IoT Threats")),
      mod(2, "Device Security", ["Firmware Analysis", "Hardware Hacking Basics", "Secure Boot"]),
      mod(3, "Protocol Security", ["MQTT Security", "Zigbee & BLE", "Modbus & ICS Protocols"]),
      mod(4, "Network Segmentation", ["IoT Network Design", "Micro-Segmentation", "Zero Trust for IoT"]),
      mod(5, "Monitoring & Response", ["IoT Anomaly Detection", "Device Inventory", "Incident Response for IoT"]),
    ],
  },
];

const PROGRAM_ORDER = ["soc-analyst","pentest","metasploit","digital-forensics","threat-intelligence","cloud-security","network-security","siem-splunk","malware-analysis","incident-response","grc","python-cyber","web-app-security","vulnerability-assessment","iot-security","ai-cyber"];

export const internshipPrograms: InternshipProgram[] = PROGRAM_ORDER.map(
  (id) => allPrograms.find((p) => p.id === id)!
);

export function getInternshipById(id: string): InternshipProgram | undefined {
  return internshipPrograms.find((p) => p.id === id);
}
