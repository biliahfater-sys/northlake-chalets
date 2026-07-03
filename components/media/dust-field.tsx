"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const COUNT = 220;

interface Mote {
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  z: number; // depth 0..1 — drives size, speed, parallax
  seed: number;
}

/**
 * Warm dust motes drifting through the hero light — plain Canvas 2D, no
 * three.js. A pre-rendered glow sprite is stamped per mote, the field leans
 * gently toward the cursor by depth. Pauses off-screen; sits out under
 * prefers-reduced-motion. Replaces the former R3F particle layer (~600 kB
 * of three.js gone from the bundle, plus the THREE.Clock deprecation).
 */
export function DustField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // glow sprite
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255, 232, 190, 0.9)");
      g.addColorStop(0.4, "rgba(238, 205, 140, 0.45)");
      g.addColorStop(1, "rgba(238, 205, 140, 0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 64, 64);
    }

    const motes: Mote[] = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      seed: Math.random() * Math.PI * 2,
    }));

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // pointer parallax (lerped)
    let targetX = 0;
    let leanX = 0;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = false;
    let t = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      leanX += (targetX - leanX) * 0.02;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        // slow updraft with sideways sway, wrapping at the top
        m.y -= dt * (0.012 + m.z * 0.02);
        m.x += Math.sin(t * 0.18 + m.seed) * dt * 0.006;
        if (m.y < -0.05) {
          m.y = 1.05;
          m.x = Math.random();
        }
        const px = (m.x + leanX * 0.03 * (m.z - 0.5)) * w;
        const py = m.y * h;
        const size = 2.5 + m.z * 5.5;
        const flicker = 0.35 + 0.3 * Math.sin(t * 0.7 + m.seed * 3);
        ctx.globalAlpha = flicker * (0.3 + m.z * 0.5);
        ctx.drawImage(sprite, px - size / 2, py - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
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
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
