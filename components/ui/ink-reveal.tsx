"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface InkRevealProps {
  /** RGB color of the vellum mask overlay. */
  maskColor?: [number, number, number];
  /** Maximum radius of each ink stamp in px. */
  brushSize?: number;
  /** How long each stamp lives before fading. */
  lifetime?: number;
  /** Initial radius before a stamp expands. */
  rStart?: number;
  /** Random variation factor for stamp radius. */
  rVary?: number;
  /** Minimum pixel distance between stamps along a pointer stroke. */
  stampStep?: number;
  /** Max stamps alive at once. */
  maxStamps?: number;
  /** Number of segments in each organic stamp. */
  segments?: number;
  /** Wobble amplitude weights. */
  wobble?: [number, number, number];
  /** Gradient inner-radius factor. */
  gradientInnerRadius?: number;
  /** Gradient opacity stops. */
  gradientStops?: [number, number, number];
  className?: string;
  style?: CSSProperties;
}

interface Stamp {
  x: number;
  y: number;
  born: number;
  seed: number;
  rmax: number;
}

export function InkReveal({
  maskColor = [242, 237, 225],
  brushSize = 132,
  lifetime = 720,
  rStart = 12,
  rVary = 0.42,
  stampStep = 12,
  maxStamps = 180,
  segments = 34,
  wobble = [0.12, 0.07, 0.04],
  gradientInnerRadius = 0.2,
  gradientStops = [0.98, 0.86, 0],
  className,
  style,
}: InkRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stampsRef = useRef<Stamp[]>([]);
  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const reduce = useReducedMotion();

  const [maskR, maskG, maskB] = maskColor;

  const paintMask = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgb(${maskR}, ${maskG}, ${maskB})`;
      ctx.fillRect(0, 0, w, h);
    },
    [maskB, maskG, maskR],
  );

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    dimsRef.current = { w, h };

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintMask(ctx, w, h);
  }, [paintMask]);

  const carveInk = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      seed: number,
      alpha: number,
    ) => {
      const g = ctx.createRadialGradient(
        x,
        y,
        r * gradientInnerRadius,
        x,
        y,
        r,
      );
      g.addColorStop(0, `rgba(0,0,0,${gradientStops[0] * alpha})`);
      g.addColorStop(0.5, `rgba(0,0,0,${gradientStops[1] * alpha})`);
      g.addColorStop(1, `rgba(0,0,0,${gradientStops[2] * alpha})`);
      ctx.fillStyle = g;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const organicRadius =
          0.78 +
          wobble[0] * Math.sin(a * 3 + seed) +
          wobble[1] * Math.sin(a * 5 + seed * 2.1) +
          wobble[2] * Math.sin(a * 7 + seed * 0.7);
        const px = x + Math.cos(a) * r * organicRadius;
        const py = y + Math.sin(a) * r * organicRadius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    },
    [gradientInnerRadius, gradientStops, segments, wobble],
  );

  const addStamp = useCallback(
    (x: number, y: number) => {
      const stamps = stampsRef.current;
      if (stamps.length >= maxStamps) stamps.shift();
      stamps.push({
        x,
        y,
        born: performance.now(),
        seed: Math.random() * Math.PI * 2,
        rmax: brushSize * (1 - rVary + Math.random() * rVary),
      });
    },
    [brushSize, maxStamps, rVary],
  );

  const stampAlong = useCallback(
    (x: number, y: number) => {
      const last = lastPosRef.current;
      if (!last) {
        addStamp(x, y);
      } else {
        const dx = x - last.x;
        const dy = y - last.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / stampStep));
        for (let i = 1; i <= steps; i++) {
          addStamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
        }
      }
      lastPosRef.current = { x, y };
    },
    [addStamp, stampStep],
  );

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { w, h } = dimsRef.current;
    const now = performance.now();
    const stamps = stampsRef.current;

    paintMask(ctx, w, h);
    ctx.globalCompositeOperation = "destination-out";

    for (let i = stamps.length - 1; i >= 0; i--) {
      const t = (now - stamps[i].born) / lifetime;
      if (t >= 1) {
        stamps.splice(i, 1);
        continue;
      }
      const ease = 1 - Math.pow(1 - t, 3);
      const r = rStart + (stamps[i].rmax - rStart) * ease;
      const alpha = 1 - t * t;
      carveInk(ctx, stamps[i].x, stamps[i].y, r, stamps[i].seed, alpha);
    }

    if (stamps.length) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      runningRef.current = false;
      rafRef.current = null;
    }
  }, [carveInk, lifetime, paintMask, rStart]);

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [loop]);

  useEffect(() => {
    if (reduce) return;
    resize();
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;
    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduce, resize]);

  if (reduce) return null;

  const getRelativePos = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointer = (e: PointerEvent<HTMLCanvasElement>) => {
    const pos = getRelativePos(e);
    stampAlong(pos.x, pos.y);
    startLoop();
  };

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0", className)}
      style={{
        zIndex: 1,
        touchAction: "pan-y",
        ...style,
      }}
      onPointerEnter={handlePointer}
      onPointerMove={handlePointer}
      onPointerLeave={() => {
        lastPosRef.current = null;
      }}
    />
  );
}
