// ============================================================
// CLIENT-SAFE QUESTIONS FILE
// This file contains ONLY question text and options.
// Correct answer keys are NEVER included here.
// Safe to import in client components and pages.
// ============================================================

export interface MCQQuestion {
  id: string;
  section: 'networks' | 'linux';
  questionNumber: number;
  question: string;
  options: string[];
}

export interface WrittenQuestion {
  id: string;
  section: 'written';
  questionNumber: number;
  question: string;
}

export type AnyQuestion = MCQQuestion | WrittenQuestion;

// ─── SECTION A: Computer Networks (10 MCQs) ──────────────────

export const networkQuestions: MCQQuestion[] = [
  {
    id: 'n01',
    section: 'networks',
    questionNumber: 1,
    question:
      'Which OSI layer is responsible for end-to-end error detection and flow control between two communicating hosts?',
    options: [
      'Network Layer (Layer 3)',
      'Data Link Layer (Layer 2)',
      'Transport Layer (Layer 4)',
      'Session Layer (Layer 5)',
    ],
  },
  {
    id: 'n02',
    section: 'networks',
    questionNumber: 2,
    question:
      'Which of the following is a correct characteristic of UDP compared to TCP?',
    options: [
      'UDP guarantees delivery of packets',
      'UDP establishes a connection before sending data',
      'UDP has lower overhead and is suitable for latency-sensitive applications',
      'UDP provides in-order delivery of segments',
    ],
  },
  {
    id: 'n03',
    section: 'networks',
    questionNumber: 3,
    question:
      'A host is configured with the IP address 192.168.10.50 and subnet mask 255.255.255.192. What is the broadcast address of the subnet this host belongs to?',
    options: [
      '192.168.10.127',
      '192.168.10.63',
      '192.168.10.255',
      '192.168.10.31',
    ],
  },
  {
    id: 'n04',
    section: 'networks',
    questionNumber: 4,
    question:
      'A user types https://example.com in their browser on a fresh machine with an empty DNS cache. Which is the correct order of DNS resolution steps?',
    options: [
      'Browser → Root → TLD → Authoritative → ISP Resolver',
      'Browser → ISP Resolver → Root → TLD → Authoritative',
      'Browser → Authoritative → TLD → Root → ISP Resolver',
      'Browser → TLD → Root → ISP Resolver → Authoritative',
    ],
  },
  {
    id: 'n05',
    section: 'networks',
    questionNumber: 5,
    question:
      'A host on 192.168.1.0/24 wants to send a packet to 10.0.0.5. Which of the following correctly describes what happens at Layer 2?',
    options: [
      'The host ARPs for the MAC address of 10.0.0.5 directly',
      'The host ARPs for the MAC address of its default gateway',
      'The host sends the packet with a broadcast MAC address',
      'The host uses DHCP to discover the destination MAC',
    ],
  },
  {
    id: 'n06',
    section: 'networks',
    questionNumber: 6,
    question:
      'During a TCP connection, a client sends a packet with the SYN flag set. The server responds with SYN-ACK. What does the client send next, and what state does the connection enter after this exchange?',
    options: [
      'FIN — the connection is terminated',
      'ACK — the connection enters the ESTABLISHED state',
      'RST — the connection is reset',
      'SYN — the handshake restarts',
    ],
  },
  {
    id: 'n07',
    section: 'networks',
    questionNumber: 7,
    question:
      'A private network uses NAT to share a single public IP. A packet leaving the network has its source IP rewritten from 192.168.1.10 to 203.0.113.5. When a response comes back to 203.0.113.5, which device is responsible for forwarding it to the correct internal host?',
    options: [
      'The destination web server',
      'The ISP\'s router',
      'The NAT device (router/firewall) using its translation table',
      'The DHCP server',
    ],
  },
  {
    id: 'n08',
    section: 'networks',
    questionNumber: 8,
    question:
      'A developer runs a web server on port 8080. From another machine on the same LAN, the command "curl http://192.168.1.20:8080" returns "Connection refused." However, "ping 192.168.1.20" succeeds. Which of the following is the MOST likely cause?',
    options: [
      'The firewall is blocking ICMP packets',
      'The web server process is not running or is bound to a different interface (e.g., 127.0.0.1 only)',
      'The subnet mask is misconfigured',
      'TCP is disabled on the target machine',
    ],
  },
  {
    id: 'n09',
    section: 'networks',
    questionNumber: 9,
    question:
      'An attacker on the same LAN sends a spoofed ARP reply claiming that the gateway\'s IP (192.168.1.1) maps to the attacker\'s MAC address. Legitimate hosts accept this reply. Which attack scenario does this describe, and what is the primary risk?',
    options: [
      'ARP poisoning (ARP spoofing) — the attacker can intercept or modify traffic intended for the gateway (man-in-the-middle)',
      'MAC flooding — the switch\'s CAM table is overflowed',
      'DNS hijacking — DNS responses are altered',
      'DHCP starvation — the DHCP pool is exhausted',
    ],
  },
  {
    id: 'n10',
    section: 'networks',
    questionNumber: 10,
    question:
      'A user visits http://bank.example.com. An attacker performs a downgrade attack. Which of the following BEST explains why HTTPS alone is insufficient protection against active downgrade attacks?',
    options: [
      'HTTP is slower than HTTPS, causing the attack to be detected',
      'Without HSTS (HTTP Strict Transport Security), a browser may accept an attacker-forced HTTP redirect even if the site supports HTTPS — allowing the attacker to intercept plaintext traffic',
      'HTTPS is always enforced automatically by the browser',
      'The attacker can only read traffic if they have the server\'s private key',
    ],
  },
];

// ─── SECTION B: Linux Fundamentals (10 MCQs) ─────────────────

export const linuxQuestions: MCQQuestion[] = [
  {
    id: 'l01',
    section: 'linux',
    questionNumber: 1,
    question:
      'You are in the directory /home/student/projects. Which command will show the full path of your current working directory?',
    options: ['ls -la', 'cd .', 'pwd', 'dir'],
  },
  {
    id: 'l02',
    section: 'linux',
    questionNumber: 2,
    question:
      'A file has permissions -rw-r--r--. Which of the following correctly describes these permissions?',
    options: [
      'Owner can read and write; group can write; others can read',
      'Owner can read and write; group can only read; others can only read',
      'Owner can read, write, and execute; group and others can read',
      'Everyone can read and write the file',
    ],
  },
  {
    id: 'l03',
    section: 'linux',
    questionNumber: 3,
    question:
      'A log file /var/log/auth.log contains thousands of lines. Which command will display only lines that contain the word "Failed" (case-sensitive)?',
    options: [
      'cat /var/log/auth.log | find "Failed"',
      'grep -v "Failed" /var/log/auth.log',
      'grep "Failed" /var/log/auth.log',
      'ls -l /var/log/auth.log | grep "Failed"',
    ],
  },
  {
    id: 'l04',
    section: 'linux',
    questionNumber: 4,
    question:
      'You need to find all files with a .sh extension anywhere under /home/student/. Which command is correct?',
    options: [
      'ls -R /home/student/*.sh',
      'grep -r ".sh" /home/student/',
      'find /home/student/ -name "*.sh"',
      'cat /home/student/ -type f -name "*.sh"',
    ],
  },
  {
    id: 'l05',
    section: 'linux',
    questionNumber: 5,
    question:
      'What does the following command do?\n\nps aux | grep nginx | grep -v grep',
    options: [
      'Stops all nginx processes',
      'Lists all running processes and removes the grep binary',
      'Lists running processes, filters for lines containing "nginx", and removes the grep process itself from the output',
      'Sends a signal to the nginx process',
    ],
  },
  {
    id: 'l06',
    section: 'linux',
    questionNumber: 6,
    question:
      'A script file currently has permissions 644. A developer runs "chmod 755 deploy.sh". What does the resulting permission set allow?',
    options: [
      'Owner: read/write; Group: read/write; Others: read/write',
      'Owner: read/write/execute; Group: read/execute; Others: read/execute',
      'Owner: read/execute; Group: read; Others: none',
      'Only the owner can access the file',
    ],
  },
  {
    id: 'l07',
    section: 'linux',
    questionNumber: 7,
    question:
      'A service seems to be consuming too much CPU. Which command shows a real-time, continuously updating view of running processes sorted by CPU usage?',
    options: [
      'ps aux --sort cpu',
      'ls -l /proc/',
      'top',
      'cat /var/log/syslog | grep cpu',
    ],
  },
  {
    id: 'l08',
    section: 'linux',
    questionNumber: 8,
    question:
      'What is the output of the following command if the file data.txt does not exist?\n\ncat data.txt 2>/dev/null && echo "found" || echo "not found"',
    options: [
      'An error message from cat, then "not found"',
      '"found"',
      '"not found"',
      'Nothing — all output is redirected to /dev/null',
    ],
  },
  {
    id: 'l09',
    section: 'linux',
    questionNumber: 9,
    question:
      'A user (uid=1001) is trying to execute a script scan.sh and receives "Permission denied". The file permissions are -rwxr--r-- and the file is owned by root:root. What is the most likely reason, and what is the minimum change needed to fix it?',
    options: [
      'The script has no content — add content to the file',
      'The "others" execute bit is not set — run chmod o+x scan.sh',
      'The user must use sudo for any file owned by root',
      'The file is in the wrong directory',
    ],
  },
  {
    id: 'l10',
    section: 'linux',
    questionNumber: 10,
    question:
      'A security analyst runs:\n\nsudo rm -rf /tmp/malware_dump/\n\nThe shell returns immediately without output. The analyst checks: ls /tmp/malware_dump/ and receives "No such file or directory." Which BEST explains this behaviour?',
    options: [
      'The rm command requires a confirmation prompt that was skipped',
      'rm -rf recursively and forcefully deletes the directory and all its contents without prompting, and produces no output on success — this is expected behaviour',
      'The directory was empty so nothing was deleted',
      'sudo prevented the deletion and the directory still exists under root\'s home',
    ],
  },
];

// ─── SECTION C: Written Responses (10 questions) ─────────────

export const writtenQuestions: WrittenQuestion[] = [
  {
    id: 'w01',
    section: 'written',
    questionNumber: 1,
    question:
      'Describe your current level of technical knowledge honestly. What topics in computer science, networking, or operating systems do you feel reasonably confident about, and where do you know you have gaps? Give specific examples — this is not a test of perfection.',
  },
  {
    id: 'w02',
    section: 'written',
    questionNumber: 2,
    question:
      'Describe one specific technical thing you have done on your own — not for a class assignment — that you found genuinely interesting. It could be setting up a home network, exploring a tool, writing a script, building something, or even breaking something accidentally. What did you do, and what did you learn from it?',
  },
  {
    id: 'w03',
    section: 'written',
    questionNumber: 3,
    question:
      'Name one topic in cybersecurity, networking, or computing that you have heard about but do not fully understand yet. What specifically confuses you about it, and what have you done (if anything) so far to try to understand it better?',
  },
  {
    id: 'w04',
    section: 'written',
    questionNumber: 4,
    question:
      'Describe a situation — technical or non-technical — where you faced a problem and did not immediately know how to solve it. How did you approach it? What did you try? Did it work? What would you do differently now?',
  },
  {
    id: 'w05',
    section: 'written',
    questionNumber: 5,
    question:
      'Have you ever used a Linux terminal or command line for anything? If yes, describe what you were doing and which commands or tools you used. If no, describe what you know about it from reading or videos, and how comfortable you think you would be learning it.',
  },
  {
    id: 'w06',
    section: 'written',
    questionNumber: 6,
    question:
      'What specifically drew you to cybersecurity — not the field in general, but the specific aspect of it that interests you most? When did that interest begin, and what made it feel concrete rather than just "it sounds interesting"?',
  },
  {
    id: 'w07',
    section: 'written',
    questionNumber: 7,
    question:
      'Describe something technical that you tried to learn or do that was harder than expected. What made it difficult? Did you push through, give up, or come back to it later? What does that experience tell you about how you learn?',
  },
  {
    id: 'w08',
    section: 'written',
    questionNumber: 8,
    question:
      'If you joined our training and were asked to study a topic you had never heard of before — something completely outside your current knowledge — how would you approach it? Describe your actual process, not an idealized one.',
  },
  {
    id: 'w09',
    section: 'written',
    questionNumber: 9,
    question:
      'If you had one month of free time, a laptop, and access to online resources, what cybersecurity-related topic or project would you explore or build? Why that specific one?',
  },
  {
    id: 'w10',
    section: 'written',
    questionNumber: 10,
    question:
      'What is one honest weakness or limitation you currently have that might make this training challenging for you? What are you prepared to do about it?',
  },
];

export const allQuestions: AnyQuestion[] = [
  ...networkQuestions,
  ...linuxQuestions,
  ...writtenQuestions,
];

export const TOTAL_MCQ = networkQuestions.length + linuxQuestions.length;
export const TOTAL_WRITTEN = writtenQuestions.length;
export const TOTAL_QUESTIONS = allQuestions.length;
export const ASSESSMENT_DURATION_SECONDS = 45 * 60; // 45 minutes
