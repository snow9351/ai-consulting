import { useEffect, useRef } from "react";

import { isLand } from "~/content/land";

/**
 * A dotted world map that fills its container edge to edge, whatever its
 * shape: the map is scaled to the container's height and wraps around
 * horizontally, so there is never an empty band. Land only, from the
 * Natural Earth mask in ~/content/land. Decorative (aria-hidden).
 *
 * Drawn on a canvas (thousands of dots would be heavy as DOM/SVG), once per
 * resize; nothing animates.
 */

const LAT_MAX = 78;
const LAT_MIN = -58; // Antarctica left out
const DOT_GAP = 11; // px between dot centres
const DOT_RADIUS = 1.7; // px

export function DotMapBackground({
  className = "",
  centerLon = 10,
  color = "53, 106, 230",
  alpha = 0.34,
}: {
  className?: string;
  /** Longitude shown in the middle of the container. */
  centerLon?: number;
  /** "r, g, b" */
  color?: string;
  alpha?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = `rgba(${color}, ${alpha})`;

      // Pixels per degree: fit the latitude range to the height (or the
      // width, on very wide and short containers).
      const scale = Math.max(height / (LAT_MAX - LAT_MIN), width / 360);
      const midLat = (LAT_MAX + LAT_MIN) / 2;

      context.beginPath();
      for (let y = DOT_GAP / 2; y < height; y += DOT_GAP) {
        const lat = midLat - (y - height / 2) / scale;
        if (lat > LAT_MAX || lat < LAT_MIN) continue;
        for (let x = DOT_GAP / 2; x < width; x += DOT_GAP) {
          let lon = centerLon + (x - width / 2) / scale;
          lon = ((((lon + 180) % 360) + 360) % 360) - 180; // wrap around
          if (!isLand(lat, lon)) continue;
          context.moveTo(x + DOT_RADIUS, y);
          context.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
        }
      }
      context.fill();
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [centerLon, color, alpha]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none block ${className}`} />;
}
