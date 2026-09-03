// ============================================================
// ⚠️  SERVER-ONLY FILE — DO NOT IMPORT IN CLIENT COMPONENTS
// This file contains the MCQ answer keys.
// It must ONLY be imported in Next.js API routes (route.ts files).
// Never import this in page.tsx, layout.tsx, or any component.
// ============================================================

/**
 * Maps questionId → index of the correct option (0-based).
 * Index 0 = Option A, 1 = B, 2 = C, 3 = D.
 */
export const MCQ_ANSWER_KEYS: Record<string, number> = {
  // ── Section A: Computer Networks ──
  n01: 2, // C — Transport Layer (Layer 4)
  n02: 2, // C — UDP has lower overhead
  n03: 1, // B — broadcast 192.168.10.63 (/26 block 0–63)
  n04: 1, // B — Browser → ISP Resolver → Root → TLD → Authoritative
  n05: 1, // B — ARPs for the default gateway MAC
  n06: 1, // B — ACK → ESTABLISHED state
  n07: 2, // C — NAT device using its translation table
  n08: 1, // B — server not running or bound to 127.0.0.1
  n09: 0, // A — ARP poisoning / MITM
  n10: 1, // B — without HSTS, downgrade attack possible

  // ── Section B: Linux ──
  l01: 2, // C — pwd
  l02: 1, // B — owner rw, group r, others r
  l03: 2, // C — grep "Failed" /var/log/auth.log
  l04: 2, // C — find /home/student/ -name "*.sh"
  l05: 2, // C — filters nginx lines, removes grep process from output
  l06: 1, // B — owner rwx, group rx, others rx (755)
  l07: 2, // C — top
  l08: 2, // C — "not found" (stderr silenced, cat exits non-zero, || fires)
  l09: 1, // B — chmod o+x scan.sh
  l10: 1, // B — rm -rf deletes without prompt, no output on success
};

/**
 * Score a candidate's MCQ submission.
 * Returns { score, total, percentageRounded }.
 */
export function scoreMCQ(answers: Record<string, number>): {
  score: number;
  total: number;
  percentageRounded: number;
} {
  const total = Object.keys(MCQ_ANSWER_KEYS).length; // 20
  let score = 0;

  for (const [questionId, selectedIndex] of Object.entries(answers)) {
    if (MCQ_ANSWER_KEYS[questionId] === selectedIndex) {
      score++;
    }
  }

  return {
    score,
    total,
    percentageRounded: Math.round((score / total) * 100),
  };
}
