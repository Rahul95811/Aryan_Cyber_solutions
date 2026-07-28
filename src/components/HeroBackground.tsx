"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  pulseSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface Connection {
  a: number;
  b: number;
  life: number;
  maxLife: number;
  growing: boolean;
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parallax = parallaxRef.current;
    if (!canvas || !parallax) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let particles: Particle[] = [];
    let connections: Connection[] = [];
    let startTime = performance.now();

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas!.parentElement?.clientWidth || window.innerWidth;
      height = canvas!.parentElement?.clientHeight || window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initScene();
    }

    function initScene() {
      const nodeCount = isMobile ? 14 : 28;
      const particleCount = isMobile ? 8 : 18;

      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.2 + Math.random() * 1.4,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.01,
      }));

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.05,
        size: 2 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.1,
      }));

      connections = [];
      rebuildConnections();
    }

    function rebuildConnections() {
      const maxDist = isMobile ? 140 : 180;
      const candidates: { a: number; b: number; d: number }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) candidates.push({ a: i, b: j, d });
        }
      }

      candidates.sort((a, b) => a.d - b.d);
      const keep = Math.min(candidates.length, isMobile ? 12 : 22);
      const next: Connection[] = [];

      for (let i = 0; i < keep; i++) {
        const existing = connections.find(
          (c) =>
            (c.a === candidates[i].a && c.b === candidates[i].b) ||
            (c.a === candidates[i].b && c.b === candidates[i].a)
        );
        if (existing) {
          next.push(existing);
        } else {
          next.push({
            a: candidates[i].a,
            b: candidates[i].b,
            life: 0,
            maxLife: 180 + Math.random() * 220,
            growing: true,
          });
        }
      }
      connections = next;
    }

    let frame = 0;

    function draw(now: number) {
      if (!ctx) return;
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, width, height);

      // Soft drifting radial glow
      if (!prefersReduced) {
        const gx = width * 0.5 + Math.sin(elapsed * 0.08) * width * 0.12;
        const gy = height * 0.38 + Math.cos(elapsed * 0.06) * height * 0.08;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(width, height) * 0.45);
        grad.addColorStop(0, "rgba(59, 130, 246, 0.07)");
        grad.addColorStop(0.5, "rgba(37, 99, 235, 0.03)");
        grad.addColorStop(1, "rgba(11, 16, 32, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Soft light sweep every ~13s
      if (!prefersReduced && !isMobile) {
        const sweepPeriod = 13;
        const t = (elapsed % sweepPeriod) / sweepPeriod;
        if (t < 0.35) {
          const sx = -width * 0.2 + t * width * 1.6;
          const sweep = ctx.createLinearGradient(sx, 0, sx + width * 0.35, height);
          sweep.addColorStop(0, "rgba(59, 130, 246, 0)");
          sweep.addColorStop(0.5, "rgba(59, 130, 246, 0.035)");
          sweep.addColorStop(1, "rgba(59, 130, 246, 0)");
          ctx.fillStyle = sweep;
          ctx.fillRect(0, 0, width, height);
        }
      }

      if (!prefersReduced) {
        // Update nodes
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          n.pulse += n.pulseSpeed;

          if (n.x < 40 || n.x > width - 40) n.vx *= -1;
          if (n.y < 40 || n.y > height - 40) n.vy *= -1;
        }

        // Rebuild connections periodically
        frame++;
        if (frame % 90 === 0) rebuildConnections();

        // Update connection life
        for (const c of connections) {
          if (c.growing) {
            c.life += 0.6;
            if (c.life >= c.maxLife) c.growing = false;
          } else {
            c.life -= 0.5;
            if (c.life <= 0) {
              c.growing = true;
              c.maxLife = 160 + Math.random() * 200;
            }
          }
        }

        // Draw connections
        for (const c of connections) {
          const a = nodes[c.a];
          const b = nodes[c.b];
          if (!a || !b) continue;

          const strength = Math.min(1, Math.max(0, c.life / 80));
          const alpha = 0.06 + strength * 0.12;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw nodes
        for (const n of nodes) {
          const pulse = 0.55 + Math.sin(n.pulse) * 0.25;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + pulse * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96, 165, 250, ${0.18 * pulse})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${0.35 + pulse * 0.2})`;
          ctx.fill();
        }

        // Draw particles
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
          ctx.fill();
        }
      } else {
        // Static reduced-motion fallback: faint nodes only
        for (const n of nodes) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(96, 165, 250, 0.2)";
          ctx.fill();
        }
      }

      // Smooth mouse parallax (desktop only)
      if (!isMobile && !prefersReduced && parallax) {
        mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.06;
        parallax.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      if (isMobile || prefersReduced) return;
      const rect = canvas!.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.tx = nx * 12;
      mouseRef.current.ty = ny * 10;
    }

    resize();
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Layer 1 — Dark navy gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #0B1020 0%, #111827 45%, #0B1020 100%)",
        }}
      />

      {/* Soft base radial */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(37, 99, 235, 0.08) 0%, transparent 70%)",
        }}
      />

      <div ref={parallaxRef} className="absolute inset-[-20px] opacity-[0.13] will-change-transform">
        {/* Layer 2 — Blueprint grid with slow drift */}
        <div className="hero-grid absolute inset-0" />

        {/* Layer 3 — Network canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Vignette to keep text readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 42%, rgba(11, 16, 32, 0.25) 0%, rgba(11, 16, 32, 0.72) 100%)",
        }}
      />
    </div>
  );
}
