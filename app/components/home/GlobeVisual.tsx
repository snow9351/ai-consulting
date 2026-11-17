import { useEffect, useRef, useState } from "react";

import { isLand } from "~/content/land";

/**
 * The Earth, drawn in dots, rotating on its polar axis and draggable.
 *
 * Dots are placed on a latitude/longitude grid and kept only where the
 * coordinate falls on land, so the shape that emerges is the real coastline
 * rather than a generic sphere. The mask comes from Natural Earth and is baked
 * into ~/content/land — a few kilobytes, nothing fetched, nothing installed.
 *
 * The globe is transparent: there is no sphere fill and the sea is empty, so
 * the land on the far side shows through at low opacity. That is what makes it
 * read as a globe rather than a disc, and it also means the visual has no
 * background of its own to clash with whatever sits behind it.
 *
 * Two renderers, deliberately:
 *
 *   SVG     server-rendered, and what a visitor keeps if JavaScript never
 *           runs. Coarser than the canvas on purpose: the full dot set is
 *           around 1800 circles, and that much markup is not worth shipping
 *           for a decorative fallback.
 *   Canvas  takes over once mounted. Rotation recomputes every dot's position,
 *           depth, radius and opacity each frame, which the SVG DOM could not
 *           keep up with at 60fps.
 *
 * See HONOUR_REDUCED_MOTION below for how the OS motion preference is handled,
 * and why it is not honoured by default here.
 */
const SIZE = 440; // design units; the canvas scales this to its real box
const CENTER = SIZE / 2;
const RADIUS = 150;
const TILT = -0.38; // radians — tips the north pole toward the viewer
const TAU = Math.PI * 2;

const SIN_T = Math.sin(TILT);
const COS_T = Math.cos(TILT);

/** Seconds per revolution. Slow enough to read as drift, not as a spin. */
const GLOBE_PERIOD = 60;
const RING_PERIOD = 48;
const AUTO_SPIN = TAU / GLOBE_PERIOD;

/**
 * Whether the operating system's "reduce motion" setting switches this globe's
 * own animation off.
 *
 * It would normally be true. It is false because Windows Server and many
 * managed Windows builds ship with interface animations disabled, which Chrome
 * reports as `prefers-reduced-motion: reduce` — so the globe sits frozen on
 * those machines and looks broken when nothing is wrong. The reference site
 * this was modelled on ignores the preference for the same reason.
 *
 * Set back to true to honour it strictly. Dragging works either way, and no
 * other animation on the site is affected: the scroll reveals still respect
 * the preference through the `.reveal` rules in app.css.
 */
const HONOUR_REDUCED_MOTION = false;

const GLIDE = 0.9;
const STILL = 0.01;
const MAX_FLING = TAU;
const TILT_DAMPING = 0.5;
const TILT_MIN = -0.95;
const TILT_MAX = 0.2;

/** Arc timings, in seconds: draw forward, then let the tail catch up. */
const HEAD_DUR = 0.55;
const TAIL_DELAY = 0.42;
const TAIL_DUR = 0.44;
/** How far an arc bows out of the surface, as a fraction of the radius. */
const ARC_LIFT = 0.17;
const ARC_STEPS = 44;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface Dot {
  /** Distance from the polar axis: cos(latitude). */
  ring: number;
  /** Height along the polar axis: sin(latitude). */
  height: number;
  /** Longitude at rest, in radians. */
  lon: number;
}

/**
 * @param latStep   degrees between rings
 * @param perRing   dots around the equator; higher rings scale by cos(latitude)
 */
function buildLand(latStep: number, perRing: number): Dot[] {
  const out: Dot[] = [];

  // Stops short of the Antarctic. Its rings are solid land at latitudes where
  // the projection crowds them together, which reads as a swirl of artefacts
  // across the bottom of the globe rather than as a continent.
  for (let lat = -58; lat <= 84; lat += latStep) {
    const latRad = (lat * Math.PI) / 180;
    const ring = Math.cos(latRad);
    const count = Math.max(6, Math.round(perRing * ring));

    for (let i = 0; i < count; i++) {
      const lonDeg = (i / count) * 360 - 180;
      if (!isLand(lat, lonDeg)) continue;

      out.push({
        ring,
        height: Math.sin(latRad),
        lon: (lonDeg * Math.PI) / 180,
      });
    }
  }

  return out;
}

const DOTS = buildLand(2.4, 162);
/** Coarser set for the no-JavaScript fallback; see the note above. */
const STATIC_SOURCE = buildLand(5.6, 70);

interface Placed {
  x: number;
  y: number;
  /** Positive on the near side of the globe, negative on the far side. */
  depth: number;
}

/**
 * Orthographic projection of a point on the unit sphere. Spinning adds `theta`
 * to the longitude; the tilt is a rotation about the X axis, which leaves x
 * alone and is why only y and the depth term carry its sine and cosine.
 *
 * Writes into `out` rather than returning a fresh object: this runs thousands
 * of times per frame, and the garbage would be the most expensive thing about
 * it.
 */
function place(
  lon: number,
  ringR: number,
  height: number,
  theta: number,
  sinT: number,
  cosT: number,
  out: Placed,
): Placed {
  const a = lon + theta;
  const z = ringR * Math.cos(a);

  out.x = CENTER + ringR * Math.sin(a) * RADIUS;
  out.y = CENTER - (height * cosT - z * sinT) * RADIUS;
  out.depth = height * sinT + z * cosT;
  return out;
}

/** The same rotation for a free 3D vector, which an arc's lifted points are. */
function placeVec(
  v: readonly [number, number, number],
  theta: number,
  sinT: number,
  cosT: number,
  out: Placed,
): Placed {
  const cosA = Math.cos(theta);
  const sinA = Math.sin(theta);
  const x = v[0] * cosA + v[2] * sinA;
  const z = v[2] * cosA - v[0] * sinA;

  out.x = CENTER + x * RADIUS;
  out.y = CENTER - (v[1] * cosT - z * sinT) * RADIUS;
  out.depth = v[1] * sinT + z * cosT;
  return out;
}

/**
 * How strongly the land on the far side shows through — the whole point of a
 * transparent globe, so it is set high enough to actually read. Lower it and
 * the far hemisphere fades out until the globe looks like a flat disc; these
 * are also the only marks that ever fall over open water.
 */
const FAR_ALPHA = 0.4;
const FAR_RADIUS = 0.85;

const nearRadius = (depth: number) => 0.95 + depth * 0.85;
const nearOpacity = (depth: number) => 0.3 + depth * 0.65;

interface StaticDot {
  x: number;
  y: number;
  r: number;
  o: number;
}

const STATIC_DOTS: StaticDot[] = STATIC_SOURCE.flatMap((dot) => {
  const p = place(dot.lon, dot.ring, dot.height, 0, SIN_T, COS_T, {
    x: 0,
    y: 0,
    depth: 0,
  });
  if (p.depth < 0) return [];

  return [
    {
      x: Number(p.x.toFixed(2)),
      y: Number(p.y.toFixed(2)),
      r: Number(nearRadius(p.depth).toFixed(2)),
      o: Number(nearOpacity(p.depth).toFixed(2)),
    },
  ];
});

interface City {
  name: string;
  lat: number;
  lon: number;
}

/**
 * Real coordinates, so each marker sits where the city actually is and travels
 * round the back as the globe turns. Chosen to spread across longitudes, so
 * some are always in view, and to tell the story the page tells: the work comes
 * from one set of places, the people from another.
 */
const CITIES: City[] = [
  { name: "Tokyo", lat: 35.68, lon: 139.69 },
  { name: "Toronto", lat: 43.65, lon: -79.38 },
  { name: "New York", lat: 40.71, lon: -74.01 },
  { name: "London", lat: 51.51, lon: -0.13 },
  { name: "Frankfurt", lat: 50.11, lon: 8.68 },
  { name: "São Paulo", lat: -23.55, lon: -46.63 },
  { name: "Lagos", lat: 6.52, lon: 3.38 },
  { name: "Mumbai", lat: 19.08, lon: 72.88 },
  { name: "Manila", lat: 14.6, lon: 120.98 },
];

type Vec = [number, number, number];

function toVec(lat: number, lon: number): Vec {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  const ring = Math.cos(la);
  return [ring * Math.sin(lo), Math.sin(la), ring * Math.cos(lo)];
}

const CITY_POINTS = CITIES.map((city) => {
  const latRad = (city.lat * Math.PI) / 180;
  return {
    name: city.name,
    ring: Math.cos(latRad),
    height: Math.sin(latRad),
    lon: (city.lon * Math.PI) / 180,
  };
});

/**
 * Every route runs out of one hub and reaches every other marker on the globe.
 * Nothing connects the destinations to each other, so the picture reads as one
 * origin reaching outward rather than as a mesh.
 */
const HUB = "Tokyo";

const DESTINATIONS = CITIES.filter((c) => c.name !== HUB).map((c) => c.name);

const LINKS: [string, string][] = DESTINATIONS.map((to) => [HUB, to]);

/**
 * Each arc precomputed as a great circle between its endpoints, bowed out of
 * the surface so it reads as a route rather than a chord. Spherical linear
 * interpolation, because interpolating the raw vectors would cut through the
 * planet.
 */
const ARCS: Vec[][] = LINKS.flatMap(([fromName, toName]) => {
  const from = CITIES.find((c) => c.name === fromName);
  const to = CITIES.find((c) => c.name === toName);
  if (!from || !to) return [];

  const a = toVec(from.lat, from.lon);
  const b = toVec(to.lat, to.lon);
  const dot = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1);
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);

  const points: Vec[] = [];
  for (let i = 0; i <= ARC_STEPS; i++) {
    const t = i / ARC_STEPS;

    let x: number;
    let y: number;
    let z: number;

    if (sinOmega < 1e-6) {
      [x, y, z] = a;
    } else {
      const wa = Math.sin((1 - t) * omega) / sinOmega;
      const wb = Math.sin(t * omega) / sinOmega;
      x = a[0] * wa + b[0] * wb;
      y = a[1] * wa + b[1] * wb;
      z = a[2] * wa + b[2] * wb;
    }

    const lift = 1 + ARC_LIFT * Math.sin(Math.PI * t);
    points.push([x * lift, y * lift, z * lift]);
  }

  return [points];
});

interface Palette {
  near: string;
  far: string;
  marker: string;
  label: string;
  arc: string;
  ring: string;
}

/**
 * Canvas cannot use Tailwind classes, so the theme tokens are read back off the
 * cascade. The fallbacks are the values `@theme` declares, so the globe stays
 * correct even if a build prunes an unreferenced custom property.
 */
function readPalette(el: Element): Palette {
  const styles = getComputedStyle(el);
  const read = (token: string, fallback: string) =>
    styles.getPropertyValue(token).trim() || fallback;

  return {
    near: read("--color-ink-800", "#1e3250"),
    // A step darker than the lightest grey: at the alpha the far side is drawn
    // at, ink-400 washes out to near-white on a light page.
    far: read("--color-ink-500", "#6b7c96"),
    marker: read("--color-brand-500", "#356ae6"),
    label: read("--color-ink-900", "#14243b"),
    arc: read("--color-brand-500", "#356ae6"),
    ring: read("--color-ink-200", "#d6dce5"),
  };
}

interface View {
  /** Label size in design units, so rendered text stays a constant CSS size. */
  labelSize: number;
  showLabels: boolean;
}

/** Visible span of one arc: tail and head both run 0 to 1 along the path. */
interface Span {
  tail: number;
  head: number;
}

const scratch: Placed = { x: 0, y: 0, depth: 0 };
const scratchB: Placed = { x: 0, y: 0, depth: 0 };
/** Flattened x1,y1,x2,y2 of labels already placed this frame. */
const labelBoxes: number[] = [];

function draw(
  ctx: CanvasRenderingContext2D,
  palette: Palette,
  view: View,
  spans: Span[],
  theta: number,
  tilt: number,
  ringAngle: number,
) {
  ctx.clearRect(0, 0, SIZE, SIZE);

  const sinT = Math.sin(tilt);
  const cosT = Math.cos(tilt);

  // Far side first, as one path at a single low alpha. Thousands of separate
  // fills would dominate the frame, and at this opacity a depth cue would not
  // be visible anyway. These are what make the globe read as transparent, and
  // they are the only thing that ever appears over open sea — so FAR_ALPHA is
  // the dial for how clear the water looks.
  ctx.globalAlpha = FAR_ALPHA;
  ctx.fillStyle = palette.far;
  ctx.beginPath();
  for (const dot of DOTS) {
    const p = place(dot.lon, dot.ring, dot.height, theta, sinT, cosT, scratch);
    if (p.depth >= 0) continue;

    ctx.moveTo(p.x + FAR_RADIUS, p.y);
    ctx.arc(p.x, p.y, FAR_RADIUS, 0, TAU);
  }
  ctx.fill();

  ctx.fillStyle = palette.near;
  for (const dot of DOTS) {
    const p = place(dot.lon, dot.ring, dot.height, theta, sinT, cosT, scratch);
    if (p.depth < 0) continue;

    ctx.globalAlpha = nearOpacity(p.depth);
    ctx.beginPath();
    ctx.arc(p.x, p.y, nearRadius(p.depth), 0, TAU);
    ctx.fill();
  }

  // Routes. Stroked as two paths rather than per segment: one for the part in
  // front of the globe and one for the part behind it, so the whole arc stays
  // visible through the transparent sphere without 40 separate strokes.
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = palette.arc;

  for (let pass = 0; pass < 2; pass++) {
    const front = pass === 1;
    ctx.globalAlpha = front ? 0.85 : 0.18;
    ctx.beginPath();

    for (let i = 0; i < ARCS.length; i++) {
      const points = ARCS[i];
      const span = spans[i];
      if (!span || span.head <= span.tail) continue;

      let drawing = false;

      for (let s = 0; s <= ARC_STEPS; s++) {
        const t = s / ARC_STEPS;
        if (t < span.tail || t > span.head) {
          drawing = false;
          continue;
        }

        const p = placeVec(points[s], theta, sinT, cosT, scratchB);
        if (p.depth >= 0 !== front) {
          drawing = false;
          continue;
        }

        if (drawing) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
        drawing = true;
      }
    }

    ctx.stroke();
  }

  // City markers and labels, near side only.
  ctx.font = `600 ${view.labelSize.toFixed(2)}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.textBaseline = "middle";
  labelBoxes.length = 0;

  for (const city of CITY_POINTS) {
    const p = place(city.lon, city.ring, city.height, theta, sinT, cosT, scratch);
    if (p.depth < 0.1) continue;

    const fade = Math.min(1, (p.depth - 0.1) / 0.2);

    ctx.globalAlpha = fade;
    ctx.fillStyle = palette.marker;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.1, 0, TAU);
    ctx.fill();

    if (!view.showLabels) continue;

    const gap = 5.5;
    const width = ctx.measureText(city.name).width;
    // Flip the label inward rather than let it run off the canvas.
    const right = p.x + gap + width < SIZE - 6;

    const x1 = right ? p.x + gap : p.x - gap - width;
    const x2 = x1 + width;
    const h = view.labelSize * 1.2;

    // Cities that are near neighbours on the map — Toronto and New York, or
    // any pair that drifts together mid-rotation — would otherwise print on
    // top of each other. Nudge downward until the box is clear.
    let ly = p.y;
    for (let attempt = 0; attempt < 3; attempt++) {
      let collides = false;

      for (let b = 0; b < labelBoxes.length; b += 4) {
        if (
          x1 < labelBoxes[b + 2] &&
          x2 > labelBoxes[b] &&
          ly - h / 2 < labelBoxes[b + 3] &&
          ly + h / 2 > labelBoxes[b + 1]
        ) {
          collides = true;
          break;
        }
      }

      if (!collides) break;
      ly += h;
    }

    labelBoxes.push(x1, ly - h / 2, x2, ly + h / 2);

    ctx.globalAlpha = fade * 0.92;
    ctx.fillStyle = palette.label;
    ctx.textAlign = right ? "left" : "right";
    ctx.fillText(city.name, p.x + (right ? gap : -gap), ly);
  }

  ctx.textAlign = "left";

  // Outer dashed ring. Rotating it makes the dashes travel — motion without
  // anything lurching around the screen.
  ctx.save();
  ctx.translate(CENTER, CENTER);
  ctx.rotate(ringAngle);
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 1;
  ctx.strokeStyle = palette.ring;
  ctx.setLineDash([2, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, RADIUS + 16, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

export function GlobeVisual() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // no 2d context: the static SVG stays, which is fine

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const palette = readPalette(container);
    const view: View = { labelSize: 12, showLabels: true };

    let frame = 0;
    let last = 0;
    let onScreen = true;
    let backingWidth = -1;

    let theta = 0;
    let tilt = TILT;
    let ringAngle = 0;
    let spin = 0;
    let autoSpin = false;
    let seeded = false;
    let perPixel = 0.009;

    let dragging = false;
    let pointer = -1;
    let lastX = 0;
    let lastY = 0;
    let lastMove = 0;

    // Each arc runs its own clock, staggered so they never fire in unison.
    const clocks = ARCS.map(() => -Math.random() * 2.5);
    const spans: Span[] = ARCS.map(() => ({ tail: 0, head: 0 }));

    const advanceArcs = (dt: number) => {
      for (let i = 0; i < clocks.length; i++) {
        clocks[i] += dt;
        const t = clocks[i];

        if (t < 0) {
          spans[i].tail = 0;
          spans[i].head = 0;
          continue;
        }

        const head = clamp(t / HEAD_DUR, 0, 1);
        const tail = clamp((t - TAIL_DELAY) / TAIL_DUR, 0, 1);

        if (tail >= 1) {
          // Rest, then run again. Short enough that with every marker fed
          // from the hub a few routes are always in flight, long enough that
          // they do not all light up together and read as a static web.
          clocks[i] = -(0.4 + Math.random() * 1.8);
          spans[i].tail = 0;
          spans[i].head = 0;
          continue;
        }

        spans[i].tail = tail;
        spans[i].head = head;
      }
    };

    const render = () =>
      draw(ctx, palette, view, spans, theta, tilt, ringAngle);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const css = Math.max(1, container.clientWidth);
      const px = Math.max(1, Math.round(css * dpr));

      perPixel = Math.PI / Math.max(1, (css * 2 * RADIUS) / SIZE);

      // Labels are specified in design units but should land at a constant
      // size on screen, so the figure is converted back through the scale.
      view.labelSize = clamp((12 * SIZE) / css, 9, 17);
      // Below this the globe is small enough that nine labels is clutter.
      view.showLabels = css >= 380;

      if (px === backingWidth) {
        render();
        return;
      }

      backingWidth = px;
      canvas.width = px;
      canvas.height = px;
      const scale = px / SIZE;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      render();
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      if (!dragging) {
        // One formula covers both jobs: a flick decays, and what it decays
        // towards is the idle spin, so a throw eases back into the drift
        // instead of stopping dead and restarting.
        const target = autoSpin ? AUTO_SPIN : 0;
        spin += (target - spin) * (1 - Math.pow(GLIDE, dt * 60));
        theta += spin * dt;
      }

      if (autoSpin) {
        ringAngle = (ringAngle + (TAU / RING_PERIOD) * dt) % TAU;
        advanceArcs(dt);
      }

      render();

      if (!dragging && !autoSpin && Math.abs(spin) < STILL) {
        frame = 0; // nothing left to animate; park until something wakes it
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      if (frame || !onScreen) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const pause = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      dragging = true;
      pointer = event.pointerId;
      canvas.setPointerCapture(pointer);
      lastX = event.clientX;
      lastY = event.clientY;
      lastMove = event.timeStamp;
      spin = 0;
      play();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointer) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const dt = Math.max((event.timeStamp - lastMove) / 1000, 1 / 240);

      const turn = dx * perPixel;
      theta += turn;
      tilt = clamp(tilt + dy * perPixel * TILT_DAMPING, TILT_MIN, TILT_MAX);
      spin = turn / dt;

      lastX = event.clientX;
      lastY = event.clientY;
      lastMove = event.timeStamp;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointer) return;
      dragging = false;
      pointer = -1;

      // Held still before releasing? That is a place, not a throw.
      if (event.timeStamp - lastMove > 120) spin = 0;
      spin = clamp(spin, -MAX_FLING, MAX_FLING);
      play();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onScreen = entry.isIntersecting;
        if (onScreen) play();
        else pause();
      },
      { rootMargin: "120px" },
    );
    seen.observe(container);

    const sized = new ResizeObserver(resize);
    sized.observe(container);

    const sync = () => {
      autoSpin = HONOUR_REDUCED_MOTION ? !media.matches : true;

      if (!autoSpin) {
        // Reduced motion: show the routes drawn in full, just not travelling.
        for (const span of spans) {
          span.tail = 0;
          span.head = 1;
        }
      }

      if (!seeded) {
        seeded = true;
        spin = autoSpin ? AUTO_SPIN : 0;
      }
      play();
    };

    media.addEventListener("change", sync);

    resize();
    sync();
    setLive(true);

    return () => {
      pause();
      seen.disconnect();
      sized.disconnect();
      media.removeEventListener("change", sync);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full min-w-0 max-w-[30rem]"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={`relative block h-full w-full ${live ? "opacity-0" : ""}`}
        role="img"
        aria-label="A rotating globe showing the continents, marked with cities around the world"
      >
        <g className="text-ink-800">
          {STATIC_DOTS.map((dot, index) => (
            <circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="currentColor"
              opacity={dot.o}
            />
          ))}
        </g>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS + 16}
          fill="none"
          strokeWidth="1"
          strokeDasharray="2 8"
          strokeLinecap="round"
          className={
            live ? "text-ink-200" : "orbit-spin animate-orbit text-ink-200"
          }
          stroke="currentColor"
          opacity="0.9"
        />
      </svg>

      {/*
        touch-action: pan-y, not none — a horizontal drag spins the globe, but a
        vertical swipe must still scroll the page. On a phone this thing is most
        of the viewport, and trapping the scroll would strand the visitor.
      */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full touch-pan-y select-none ${
          live
            ? "cursor-grab active:cursor-grabbing"
            : "pointer-events-none opacity-0"
        }`}
      />
    </div>
  );
}
