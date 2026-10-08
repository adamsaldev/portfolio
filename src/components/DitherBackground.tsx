"use client";

import { useEffect, useRef } from "react";

/**
 * Animated dithered-noise background (same look as React Bits "Dither"),
 * written as a single WebGL2 fragment shader — no three.js.
 *
 * Settings mirror the React Bits props:
 *   waveColor, waveSpeed, waveFrequency, waveAmplitude, colorNum, pixelSize
 *
 * Pauses offscreen and in background tabs; draws one still frame when the
 * user prefers reduced motion; renders nothing if WebGL2 is unavailable.
 */
const SETTINGS = {
  waveColor: [0.5, 0.5, 0.5] as const, // neutral grey
  waveSpeed: 0.02,
  waveFrequency: 3,
  waveAmplitude: 0.19,
  colorNum: 13.1,
  pixelSize: 4, // dither cell size in device pixels (original default: 2)
  fps: 30,
};

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;       // canvas size in render pixels
uniform float uTime;
uniform vec3 uWave;
uniform float uSpeed, uFreq, uAmp, uColorNum;
uniform float uLight;     // 1.0 on the light theme
out vec4 outColor;

// Classic 2D Perlin noise (Stefan Gustavson)
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz, iy = Pi.yyww, fx = Pf.xzxz, fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x), g10 = vec2(gx.y, gy.y), g01 = vec2(gx.z, gy.z), g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x)), n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z)), n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 f = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), f.x);
  return 2.3 * mix(n_x.x, n_x.y, f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 1.0;
  for (int i = 0; i < 4; i++) { v += a * abs(cnoise(p)); p *= uFreq; a *= uAmp; }
  return v;
}
float pattern(vec2 p) { vec2 p2 = p - uTime * uSpeed; return fbm(p + fbm(p2)); }

const float bayer[64] = float[64](
   0.0,48.0,12.0,60.0, 3.0,51.0,15.0,63.0,
  32.0,16.0,44.0,28.0,35.0,19.0,47.0,31.0,
   8.0,56.0, 4.0,52.0,11.0,59.0, 7.0,55.0,
  40.0,24.0,36.0,20.0,43.0,27.0,39.0,23.0,
   2.0,50.0,14.0,62.0, 1.0,49.0,13.0,61.0,
  34.0,18.0,46.0,30.0,33.0,17.0,45.0,29.0,
  10.0,58.0, 6.0,54.0, 9.0,57.0, 5.0,53.0,
  42.0,26.0,38.0,22.0,41.0,25.0,37.0,21.0);

void main() {
  // One render pixel = one dither cell (canvas is drawn at device-res / pixelSize).
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 uv = cell / uRes - 0.5;
  uv.x *= uRes.x / uRes.y;
  vec3 col = uWave * pattern(uv);

  int x = int(mod(cell.x, 8.0)), y = int(mod(cell.y, 8.0));
  float threshold = bayer[y * 8 + x] / 64.0 - 0.25;
  float stepSize = 1.0 / (uColorNum - 1.0);
  col += threshold * stepSize;
  col = clamp(col - 0.2, 0.0, 1.0);
  col = floor(col * (uColorNum - 1.0) + 0.5) / (uColorNum - 1.0);

  // Premultiplied alpha. Dark theme: exactly the original output over black.
  // Light theme: the per-channel bias above turns the wave pinkish on paper,
  // so tint with the true wave color at the same dithered intensity instead.
  float a = clamp(col.r / max(uWave.r, 1e-3), 0.0, 1.0);
  outColor = uLight > 0.5 ? vec4(uWave * a, a) : vec4(col, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("Dither shader:", gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export function DitherBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uTime = u("uTime"), uLight = u("uLight");
    // Follow the site theme (data-theme override, else system preference).
    const darkMQ = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      const t = document.documentElement.dataset.theme;
      const dark = t ? t === "dark" : darkMQ.matches;
      gl.uniform1f(uLight, dark ? 0 : 1);
    };
    syncTheme();
    const themeObs = new MutationObserver(() => {
      syncTheme();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) draw(start + 8000);
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    darkMQ.addEventListener("change", syncTheme);
    gl.uniform3f(u("uWave"), ...SETTINGS.waveColor);
    gl.uniform1f(u("uSpeed"), SETTINGS.waveSpeed);
    gl.uniform1f(u("uFreq"), SETTINGS.waveFrequency);
    gl.uniform1f(u("uAmp"), SETTINGS.waveAmplitude);
    gl.uniform1f(u("uColorNum"), SETTINGS.colorNum);

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2) / SETTINGS.pixelSize;
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    };

    const start = performance.now();
    const draw = (now: number) => {
      resize();
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let visible = true;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 1000 / SETTINGS.fps) return;
      last = now;
      draw(now);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (reduce.matches) {
        draw(start + 8000); // a single still frame
      } else if (visible && !document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce.matches) draw(start + 8000);
    });
    ro.observe(canvas);
    document.addEventListener("visibilitychange", run);
    reduce.addEventListener("change", run);
    run();

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      darkMQ.removeEventListener("change", syncTheme);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", run);
      reduce.removeEventListener("change", run);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`block h-full w-full [image-rendering:pixelated] ${className}`}
    />
  );
}
