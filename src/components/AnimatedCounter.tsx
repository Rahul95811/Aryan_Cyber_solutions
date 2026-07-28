"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  target: string;
  duration?: number;
}

export function AnimatedCounter({ target, duration = 2000 }: CounterProps) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounter();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();

    function animateCounter() {
      const match = target.match(/^(\d+)(.*)$/);
      if (!match) {
        setDisplay(target);
        return;
      }

      const num = parseInt(match[1], 10);
      const suffix = match[2];
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(num * eased);
        setDisplay(`${current}${suffix}`);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setDisplay(target);
        }
      }

      requestAnimationFrame(tick);
    }
  }, [target, duration]);

  return <span ref={ref}>{display}</span>;
}
