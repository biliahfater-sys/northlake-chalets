"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface Ember {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
}

/**
 * Drifting fire sparks on a 2D canvas — cheap, GPU-friendly, paused when
 * off-screen. Layered over the firepit chapter for warmth.
 */
export function Embers({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const COUNT = 36;
    const embers: Ember[] = [];
    const spawn = (e?: Ember): Ember => {
      const n: Ember = e ?? ({} as Ember);
      n.x = Math.random() * canvas.width;
      n.y = canvas.height * (0.6 + Math.random() * 0.4);
      n.r = (0.6 + Math.random() * 1.6) * dpr;
      n.vx = (Math.random() - 0.5) * 0.22 * dpr;
      n.vy = -(0.25 + Math.random() * 0.55) * dpr;
      n.max = 360 + Math.random() * 320;
      n.life = Math.random() * n.max;
      return n;
    };
    for (let i = 0; i < COUNT; i++) embers.push(spawn());

    let raf = 0;
    let running = false;
    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const e of embers) {
        e.life += 1;
        if (e.life > e.max || e.y < -10) spawn(e);
        e.x += e.vx + Math.sin((e.life + e.y) * 0.02) * 0.18 * dpr;
        e.y += e.vy;
        const t = e.life / e.max;
        const alpha = Math.sin(Math.PI * t) * 0.7;
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3);
        grad.addColorStop(0, `rgba(255, 196, 110, ${alpha})`);
        grad.addColorStop(1, "rgba(255, 150, 60, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full mix-blend-screen",
        className,
      )}
    />
  );
}
