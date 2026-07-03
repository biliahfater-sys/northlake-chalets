"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_warmth;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time * 0.018;

  // layered valley fog, denser toward the bottom, drifting sideways
  float f1 = fbm(p * 1.9 + vec2(t * 3.0, -t * 0.8));
  float f2 = fbm(p * 3.4 - vec2(t * 1.6, t * 0.5));
  float fog = smoothstep(0.42, 0.98, f1 * 0.72 + f2 * 0.38);
  fog *= smoothstep(0.95, 0.18, uv.y);

  // soft light shafts breathing from the upper-left sun
  vec2 lightPos = vec2(0.1, 1.05);
  vec2 d = uv - lightPos;
  float ang = atan(d.y, d.x);
  float rays = pow(max(0.0, sin(ang * 7.0 + t * 6.0) * 0.5 + 0.5), 3.0);
  rays += 0.6 * pow(max(0.0, sin(ang * 13.0 - t * 4.0) * 0.5 + 0.5), 4.0);
  float fall = exp(-length(d) * 2.1);
  float shaft = rays * fall * 0.5;

  vec3 warm = vec3(1.0, 0.84, 0.58);
  vec3 cool = vec3(0.72, 0.8, 0.82);
  vec3 col = warm * shaft * u_warmth + cool * fog * 0.55;
  float alpha = clamp(shaft * u_warmth + fog * 0.5, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha * 0.5);
}
`;

interface AtmosphereShaderProps {
  className?: string;
  /** 0..1 — how much warm light-shaft to mix in. */
  warmth?: number;
}

/**
 * A WebGL atmosphere pass: fbm valley fog + breathing light shafts, blended
 * with `screen` over the cinematic imagery. Renders at capped DPR, pauses
 * when off-screen, and sits out entirely under prefers-reduced-motion or
 * when WebGL is unavailable.
 */
export function AtmosphereShader({
  className,
  warmth = 1,
}: AtmosphereShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uWarmth = gl.getUniformLocation(prog, "u_warmth");
    gl.uniform1f(uWarmth, warmth);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let running = false;
    const start = performance.now();
    const frame = (now: number) => {
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
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
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduce, warmth]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full mix-blend-screen",
        className,
      )}
    />
  );
}
