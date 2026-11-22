import { useEffect, useRef } from "react";

import { isLand } from "~/content/land";

/**
 * A faint, slowly turning globe drawn as dots — land only, from the baked
 * Natural Earth mask in ~/content/land. Decorative: aria-hidden, pointer
 * events off, and paused whenever it is scrolled out of view.
 */

/** Degrees between neighbouring dots. Smaller = denser globe. */
const DOT_SPACING = 2.2;
const TILT = 0.38; // radians the north pole leans towards the viewer
const SPEED = 0.09; // radians per second
const DOT_RGB = "53, 106, 230"; // brand-500

/** Unit vectors for every land dot, spaced evenly over the sphere. */
function landPoints(): Float32Array {
  const points: number[] = [];
  for (let lat = -82; lat <= 82; lat += DOT_SPACING) {
    const ring = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / DOT_SPACING));
    for (let i = 0; i < ring; i++) {
      const lon = -180 + (i * 360) / ring;
      if (!isLand(lat, lon)) continue;
      const phi = (lat * Math.PI) / 180;
      const lambda = (lon * Math.PI) / 180;
      points.push(Math.cos(phi) * Math.sin(lambda), Math.sin(phi), Math.cos(phi) * Math.cos(lambda));
    }
  }
  return new Float32Array(points);
}

export function DotGlobe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const points = landPoints();
    const cosT = Math.cos(TILT);
    const sinT = Math.sin(TILT);
    let size = 0;
    let dpr = 1;
    let angle = 2.2; // start with the Americas and Atlantic in view
    let last = performance.now();
    let frame = 0;
    let visible = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
    };

    const draw = () => {
      const s = size * dpr;
      const c = s / 2;
      const r = s * 0.46;
      context.clearRect(0, 0, s, s);

      // Soft body and rim, so the sphere reads even where there is ocean.
      const body = context.createRadialGradient(c - r * 0.3, c - r * 0.35, r * 0.1, c, c, r);
      body.addColorStop(0, `rgba(${DOT_RGB}, 0.07)`);
      body.addColorStop(1, `rgba(${DOT_RGB}, 0.015)`);
      context.fillStyle = body;
      context.beginPath();
      context.arc(c, c, r, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = `rgba(${DOT_RGB}, 0.14)`;
      context.lineWidth = 1 * dpr;
      context.stroke();

      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const dot = Math.max(1, s / 420);

      for (let i = 0; i < points.length; i += 3) {
        const x = points[i];
        const y = points[i + 1];
        const z = points[i + 2];
        // Spin about the polar axis, then tilt towards the viewer.
        const x1 = x * cosA + z * sinA;
        const z1 = -x * sinA + z * cosA;
        const y2 = y * cosT - z1 * sinT;
        const z2 = y * sinT + z1 * cosT;
        if (z2 <= 0) continue; // far side
        context.fillStyle = `rgba(${DOT_RGB}, ${(0.18 + 0.62 * z2).toFixed(3)})`;
        context.beginPath();
        context.arc(c + x1 * r, c - y2 * r, dot * (0.6 + 0.4 * z2), 0, Math.PI * 2);
        context.fill();
      }
    };

    const tick = (now: number) => {
      angle += ((now - last) / 1000) * SPEED;
      last = now;
      draw();
      frame = visible ? requestAnimationFrame(tick) : 0;
    };

    resize();
    draw();
    frame = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas);

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    visibility.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none aspect-square ${className}`}
    />
  );
}
