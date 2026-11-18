import { useEffect, useRef, useState } from "react";

/**
 * A photographic Earth at night, rotating on its polar axis and draggable,
 * with glowing laptop nodes linked by travelling routes.
 *
 * The planet is two real textures (see CREDITS.md beside them): a night map
 * with city lights, and NASA's true-colour Blue Marble for the sunlit side,
 * crossfaded across a soft terminator. They are mapped onto a sphere by hand
 * on a 2D canvas. No WebGL and no 3D library: for each
 * pixel of the disc we precompute which latitude/longitude it shows (that only
 * changes when the tilt does), and per frame we just shift the longitude by
 * the spin angle and copy texels. That is a few hundred thousand array reads a
 * frame, a couple of milliseconds.
 *
 * Until the texture arrives — and for visitors without JavaScript — a plain
 * glowing blue sphere stands in, drawn by the server-rendered SVG.
 *
 * See HONOUR_REDUCED_MOTION below for how the OS motion preference is handled.
 */
const SIZE = 440; // design units; the canvas scales this to its real box
const CENTER = SIZE / 2;
const RADIUS = 172;
const TILT = 0.4; // radians — tips the north pole toward the viewer
const TAU = Math.PI * 2;

const TEXTURE_URL = "/images/earth/earth-night-blue.jpg";
/** True-colour daytime map, shown where the sun is up. Same size as the night map. */
const DAY_TEXTURE_URL = "/images/earth/earth-day.jpg";
/** Width of the soft fade at the planet's edge, as a fraction of the radius. */
const EDGE_FEATHER = 0.06;

/** Upper bound on the disc's backing resolution, in device pixels. */
const MAX_DISC_PX = 600;

/** Seconds per revolution. Slow enough to read as drift, not as a spin. */
const GLOBE_PERIOD = 70;
const AUTO_SPIN = TAU / GLOBE_PERIOD;

/**
 * Whether the operating system's "reduce motion" setting switches this globe's
 * own animation off.
 *
 * It would normally be true. It is false because many Windows builds ship with
 * interface animations disabled, which Chrome reports as
 * `prefers-reduced-motion: reduce` — so the globe sits frozen on those machines
 * and looks broken when nothing is wrong.
 *
 * Set back to true to honour it strictly. Dragging works either way.
 */
const HONOUR_REDUCED_MOTION = false;

const GLIDE = 0.9;
const STILL = 0.01;
const MAX_FLING = TAU;

/** Arc timings, in seconds: draw forward, then let the tail catch up. */
const HEAD_DUR = 0.9;
const TAIL_DELAY = 0.75;
const TAIL_DUR = 0.7;
/** How far an arc bows out of the surface, as a fraction of the radius. */
const ARC_LIFT = 0.16;
const ARC_STEPS = 44;

/**
 * Direction of the sun (view space: x right, y up, z toward the viewer).
 *
 * Up and to the left, and slightly behind the planet, so the face we see is
 * mostly night — where the city lights show — with a daylit crescent along
 * the upper-left limb, right where the sunrise flare sits.
 */
const SUN = (() => {
  const v = [-0.56, 0.64, -0.53];
  const m = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / m, v[1] / m, v[2] / m] as const;
})();

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

interface Placed {
  x: number;
  y: number;
  /** Positive on the near side of the globe, negative on the far side. */
  depth: number;
}

/**
 * Orthographic projection of a point on the unit sphere. Spinning adds `theta`
 * to the longitude; the tilt is a rotation about the X axis.
 *
 * Writes into `out` rather than returning a fresh object: this runs many times
 * per frame and the garbage would add up.
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

interface City {
  name: string;
  lat: number;
  lon: number;
}

/**
 * Real coordinates, so each node sits where the city actually is and travels
 * round the back as the globe turns. Spread across longitudes so several are
 * always in view.
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
  { name: "Los Angeles", lat: 34.05, lon: -118.24 },
  { name: "Mexico City", lat: 19.43, lon: -99.13 },
  { name: "Bogotá", lat: 4.71, lon: -74.07 },
  { name: "Buenos Aires", lat: -34.6, lon: -58.38 },
  { name: "Nairobi", lat: -1.29, lon: 36.82 },
  { name: "Sydney", lat: -33.87, lon: 151.21 },
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
    ring: Math.cos(latRad),
    height: Math.sin(latRad),
    lon: (city.lon * Math.PI) / 180,
  };
});

/**
 * A network rather than a hub: cities sorted west to east, each linked to its
 * next two neighbours (wrapping round the date line), so whatever face of the
 * globe is turned toward the viewer shows a web of nearby routes.
 */
const BY_LONGITUDE = [...CITIES].sort((a, b) => a.lon - b.lon);

const LINKS: [City, City][] = BY_LONGITUDE.flatMap((city, i) => [
  [city, BY_LONGITUDE[(i + 1) % BY_LONGITUDE.length]],
  [city, BY_LONGITUDE[(i + 2) % BY_LONGITUDE.length]],
]) as [City, City][];

/**
 * Each arc precomputed as a great circle between its endpoints, bowed out of
 * the surface so it reads as a route rather than a chord.
 */
const ARCS: Vec[][] = LINKS.map(([from, to]) => {
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
  return points;
});

/** Visible span of one arc: tail and head both run 0 to 1 along the path. */
interface Span {
  tail: number;
  head: number;
}

/* ------------------------------------------------------------------------ */
/* Texture-mapped sphere                                                     */
/* ------------------------------------------------------------------------ */

interface Texture {
  /** Night surface with the city lights removed (RGBA, little-endian). */
  data: Uint32Array;
  /**
   * True-colour daytime surface (NASA Blue Marble), same size and layout, used
   * where the sun is up. Null if it failed to load — the night map is then
   * used everywhere and the globe still works.
   */
  day: Uint32Array | null;
  /** City-light strength per texel, 0–255, already grown and softened. */
  lights: Uint8Array;
  width: number;
  height: number;
}

/**
 * Per-pixel lookup for the disc at one size and tilt. Only pixels inside the
 * disc are listed, so the frame loop never tests for the edge.
 *
 * Everything that depends on where a pixel sits on the sphere relative to the
 * sun and the viewer is baked here, so the frame loop is just texture reads
 * and integer blends.
 */
interface DiscMap {
  size: number;
  tilt: number;
  count: number;
  /** Index into the disc's ImageData, as a Uint32 offset. */
  pixel: Int32Array;
  /** Texture row start (v × width). */
  row: Int32Array;
  /** Texture column at theta = 0, in texels (fractional). */
  u: Float32Array;
  /** Night-side fill light × 256 (brighter toward the centre of the disc). */
  ambient: Uint16Array;
  /** Blend from the night map (0) to the daytime map (255). */
  day: Uint8Array;
  /** Direct sunlight on the daytime map (Lambert, × 256). */
  sunlit: Uint16Array;
  /** How dark it is here — city lights are multiplied by this, 0–255. */
  night: Uint8Array;
  /** Sun glint on water, 0–255. */
  spec: Uint8Array;
  /** Atmospheric haze at the limb, stronger on the sun's side, 0–255. */
  rim: Uint8Array;
  /** Edge anti-aliasing / feathering, 0–255. */
  alpha: Uint8Array;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function buildDiscMap(size: number, tilt: number, tex: Texture): DiscMap {
  const sinT = Math.sin(tilt);
  const cosT = Math.cos(tilt);
  const half = size / 2;
  const max = size * size;

  const pixel = new Int32Array(max);
  const row = new Int32Array(max);
  const u = new Float32Array(max);
  const ambient = new Uint16Array(max);
  const day = new Uint8Array(max);
  const night = new Uint8Array(max);
  const sunlit = new Uint16Array(max);
  const spec = new Uint8Array(max);
  const rim = new Uint8Array(max);
  const alpha = new Uint8Array(max);
  let n = 0;

  // Half-vector between the sun and the viewer (0, 0, 1), for the glint.
  const hx = SUN[0];
  const hy = SUN[1];
  const hz = SUN[2] + 1;
  const hm = Math.hypot(hx, hy, hz);
  // The sun's direction across the face of the disc, for the haze bias.
  const sm = Math.hypot(SUN[0], SUN[1]) || 1;

  for (let j = 0; j < size; j++) {
    const Y = 1 - (j + 0.5) / half;
    for (let i = 0; i < size; i++) {
      const X = (i + 0.5) / half - 1;
      const d = Math.sqrt(X * X + Y * Y);
      // Feathered edge: alpha ramps up over EDGE_FEATHER of the radius, so
      // the limb melts into the atmosphere instead of ending on a hard line.
      const edge = (1 - d) / EDGE_FEATHER;
      if (edge <= 0) continue;

      const Z = Math.sqrt(Math.max(0, 1 - d * d));

      // Undo the tilt to get the point back in globe coordinates.
      const height = Y * cosT + Z * sinT;
      const zc = Z * cosT - Y * sinT;
      const lat = Math.asin(clamp(height, -1, 1));
      const a = Math.atan2(X, zc);

      const v = clamp(
        Math.floor(((Math.PI / 2 - lat) / Math.PI) * tex.height),
        0,
        tex.height - 1,
      );

      // Sun angle at this point: > 0 is daylight, < 0 is night.
      const sun = X * SUN[0] + Y * SUN[1] + Z * SUN[2];
      const nh = Math.max(0, (X * hx + Y * hy + Z * hz) / hm);
      const haze = Math.pow(1 - Z, 3.2);
      const sunSide = clamp(0.5 + 0.5 * ((X * SUN[0] + Y * SUN[1]) / sm / Math.max(d, 1e-3)), 0, 1);

      pixel[n] = j * size + i;
      row[n] = v * tex.width;
      u[n] = ((a + Math.PI) / TAU) * tex.width;
      ambient[n] = Math.round((0.68 + 0.42 * Z) * 256);
      // Night → day crossfade across a soft twilight zone around the
      // terminator. Neutral, no tint: on the real Earth the twilight band is
      // just a gradual dimming, seen from orbit.
      day[n] = Math.round(smoothstep(-0.08, 0.14, sun) * 255);
      // Lambert: the ground is lit by the cosine of the sun's angle, so it
      // is dim near the terminator and full strength where the sun is high.
      // A small floor keeps twilight from going to pure black.
      sunlit[n] = Math.round((0.12 + 1.08 * Math.pow(Math.max(0, sun), 0.8)) * 256);
      // Lights fade out a little before daylight starts, as they do at dusk.
      night[n] = Math.round((1 - smoothstep(-0.14, 0.04, sun)) * 255);
      spec[n] = Math.round(Math.pow(nh, 70) * 255);
      rim[n] = Math.round(Math.min(1, haze * (0.25 + 1.5 * sunSide * sunSide)) * 200);
      // Smoothstep, so the fade has no visible start or end.
      const e = clamp(edge, 0, 1);
      alpha[n] = Math.round(e * e * (3 - 2 * e) * 255);
      n++;
    }
  }

  return {
    size, tilt, count: n, pixel, row, u,
    ambient, day, sunlit, night, spec, rim, alpha,
  };
}

/** Paint the textured disc for this spin angle into `out` (the disc's pixels). */
function paintDisc(map: DiscMap, tex: Texture, theta: number, out: Uint32Array) {
  const width = tex.width;
  const shift = (theta / TAU) * width;
  const { count, pixel, row, u, ambient, day, sunlit, night, spec, rim, alpha } = map;
  const data = tex.data;
  const dayData = tex.day;
  const lights = tex.lights;

  for (let k = 0; k < count; k++) {
    let col = (u[k] - shift) % width;
    if (col < 0) col += width;

    const idx = row[k] + (col | 0);
    const t = data[idx];

    // Little-endian RGBA: R in the low byte.
    const br = t & 0xff;
    const bg = (t >> 8) & 0xff;
    const bb = (t >> 16) & 0xff;

    // Night side: the blue night map under a soft fill light.
    const am = ambient[k];
    let r = (br * am) >> 8;
    let g = (bg * am) >> 8;
    let b = (bb * am) >> 8;

    // Day side: the true-colour daytime map under direct sunlight,
    // crossfaded in across the twilight zone.
    const w = day[k];
    if (w > 0) {
      let dr = br;
      let dg = bg;
      let db = bb;
      if (dayData) {
        const dt = dayData[idx];
        dr = dt & 0xff;
        dg = (dt >> 8) & 0xff;
        db = (dt >> 16) & 0xff;
      }
      const sl = sunlit[k];
      let lr = (dr * sl) >> 8;
      let lg = (dg * sl) >> 8;
      let lb = (db * sl) >> 8;

      // Sun glint, on open water only (blue clearly beats red and green).
      const s = spec[k];
      if (s > 0 && db > dr + 18 && db > dg) {
        lr += (s * 235) >> 8;
        lg += (s * 230) >> 8;
        lb += (s * 215) >> 8;
      }

      r += ((lr - r) * w) >> 8;
      g += ((lg - g) * w) >> 8;
      b += ((lb - b) * w) >> 8;
    }

    // Atmospheric haze at the limb.
    const h = rim[k];
    r += (h * 90) >> 8;
    g += (h * 165) >> 8;
    b += h;

    // City lights, night side only: blended toward gold — deep amber at the
    // soft edges, pale hot gold in the brightest cores.
    const lt = lights[idx];
    if (lt > 0) {
      const ln = (lt * night[k]) >> 8;
      if (ln > 0) {
        const gr = 255;
        const gg = 170 + ((lt * 66) >> 8);
        const gb = 40 + ((lt * 120) >> 8);
        r += ((gr - r) * ln) >> 8;
        g += ((gg - g) * ln) >> 8;
        b += ((gb - b) * ln) >> 8;
      }
    }

    if (r > 255) r = 255;
    if (g > 255) g = 255;
    if (b > 255) b = 255;
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;

    out[pixel[k]] = (alpha[k] << 24) | (b << 16) | (g << 8) | r;
  }
}

/** How far each city light is grown, in dilation passes (each ≈ 1 texel). */
const LIGHT_GROW_PASSES = 2;
/** Brightness kept per pass as a light spreads, so grown edges fall off softly. */
const LIGHT_GROW_FALLOFF = 0.72;
/** Night-land colour put back where a city light is lifted out of the texture. */
const LAND_UNDER_LIGHTS: readonly [number, number, number] = [16, 36, 82];

/**
 * Split the city lights out of the texture into their own strength map, so
 * they can be lit independently — gold, and only on the night side.
 *
 * The lights are warm — the only texels where red beats blue, since land and
 * sea are both blue-tinted — so their strength is that excess. The map is
 * dilated a couple of texels (a separable 3×3 max, with a falloff so the grown
 * rim is dimmer than the core). Where a light was, the surface underneath is
 * repainted as plain night land. Done once on load, not per frame.
 */
function extractLights(
  px: Uint8ClampedArray,
  width: number,
  height: number,
): Uint8Array {
  const n = width * height;
  const strength = new Float32Array(n);
  for (let k = 0, i = 0; k < n; k++, i += 4) {
    const excess = px[i] - px[i + 2];
    if (excess > 0) {
      strength[k] = Math.min(1, excess / 70);
      px[i] = LAND_UNDER_LIGHTS[0];
      px[i + 1] = LAND_UNDER_LIGHTS[1];
      px[i + 2] = LAND_UNDER_LIGHTS[2];
    }
  }

  const tmp = new Float32Array(n);
  for (let pass = 0; pass < LIGHT_GROW_PASSES; pass++) {
    const f = LIGHT_GROW_FALLOFF;
    // Horizontal (wrapping, since the map is a full 360° of longitude)…
    for (let y = 0; y < height; y++) {
      const row = y * width;
      for (let x = 0; x < width; x++) {
        const l = strength[row + (x === 0 ? width - 1 : x - 1)];
        const r = strength[row + (x === width - 1 ? 0 : x + 1)];
        tmp[row + x] = Math.max(strength[row + x], l * f, r * f);
      }
    }
    // …then vertical.
    for (let y = 0; y < height; y++) {
      const up = y > 0 ? (y - 1) * width : y * width;
      const down = y < height - 1 ? (y + 1) * width : y * width;
      const row = y * width;
      for (let x = 0; x < width; x++) {
        strength[row + x] = Math.max(tmp[row + x], tmp[up + x] * f, tmp[down + x] * f);
      }
    }
  }

  const out = new Uint8Array(n);
  for (let k = 0; k < n; k++) out[k] = Math.round(strength[k] * 255);
  return out;
}

/** Decode an image into raw pixels, optionally resampled to a given size. */
function loadPixels(url: string, width?: number, height?: number): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = width ?? img.naturalWidth;
      c.height = height ?? img.naturalHeight;
      const cx = c.getContext("2d", { willReadFrequently: true });
      if (!cx) return reject(new Error("no 2d context"));
      cx.drawImage(img, 0, 0, c.width, c.height);
      resolve(cx.getImageData(0, 0, c.width, c.height));
    };
    img.onerror = () => reject(new Error(`failed to load ${url}`));
    img.src = url;
  });
}

/**
 * Load the night map (required) and the day map (optional), downloading both
 * at once. The day map is resampled to the night map's size so a single texel
 * index addresses both.
 */
async function loadTexture(nightUrl: string, dayUrl: string): Promise<Texture> {
  const dayPromise = loadPixels(dayUrl).catch(() => null);
  const night = await loadPixels(nightUrl);
  const lights = extractLights(night.data, night.width, night.height);

  let day = await dayPromise;
  if (day && (day.width !== night.width || day.height !== night.height)) {
    day = await loadPixels(dayUrl, night.width, night.height).catch(() => null);
  }

  return {
    data: new Uint32Array(night.data.buffer),
    day: day ? new Uint32Array(day.data.buffer) : null,
    lights,
    width: night.width,
    height: night.height,
  };
}

/* ------------------------------------------------------------------------ */
/* Frame                                                                     */
/* ------------------------------------------------------------------------ */

const scratch: Placed = { x: 0, y: 0, depth: 0 };
const scratchB: Placed = { x: 0, y: 0, depth: 0 };

function drawAtmosphere(ctx: CanvasRenderingContext2D) {
  const halo = ctx.createRadialGradient(
    CENTER, CENTER, RADIUS * 0.94,
    CENTER, CENTER, RADIUS * 1.22,
  );
  halo.addColorStop(0, "rgba(110, 170, 255, 0.32)");
  halo.addColorStop(0.35, "rgba(80, 140, 255, 0.12)");
  halo.addColorStop(1, "rgba(40, 100, 255, 0)");
  ctx.globalAlpha = 1;
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS * 1.22, 0, TAU);
  ctx.fill();

  // Sunlit atmosphere: a brighter glow behind the limb on the sun's side.
  // Drawn before the planet, so only the part outside the disc shows.
  const [sx, sy] = sunOnLimb(0.62);
  const lit = ctx.createRadialGradient(sx, sy, 0, sx, sy, RADIUS * 0.95);
  lit.addColorStop(0, "rgba(170, 210, 255, 0.4)");
  lit.addColorStop(0.5, "rgba(110, 165, 255, 0.14)");
  lit.addColorStop(1, "rgba(80, 140, 255, 0)");
  ctx.fillStyle = lit;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS * 1.22, 0, TAU);
  ctx.fill();
}

/** The point on the disc, toward the sun, at `reach` × the radius. */
function sunOnLimb(reach: number): [number, number] {
  const m = Math.hypot(SUN[0], SUN[1]) || 1;
  return [
    CENTER + (SUN[0] / m) * RADIUS * reach,
    CENTER - (SUN[1] / m) * RADIUS * reach,
  ];
}

function drawPlainSphere(ctx: CanvasRenderingContext2D) {
  const sea = ctx.createRadialGradient(
    CENTER - RADIUS * 0.35, CENTER - RADIUS * 0.4, RADIUS * 0.05,
    CENTER, CENTER, RADIUS * 1.05,
  );
  sea.addColorStop(0, "#2a63c4");
  sea.addColorStop(0.45, "#0d2c72");
  sea.addColorStop(1, "#040c2a");
  ctx.fillStyle = sea;
  ctx.beginPath();
  ctx.arc(CENTER, CENTER, RADIUS, 0, TAU);
  ctx.fill();
}

function drawRimAndFlare(ctx: CanvasRenderingContext2D) {
  // No outline stroke: the feathered limb plus the faint halo carry the
  // edge, so there is no ring for the eye to pick out.

  // Sunrise flare where the sun peeks over the limb.
  const [fx, fy] = sunOnLimb(1);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const flare = ctx.createRadialGradient(fx, fy, 0, fx, fy, 46);
  flare.addColorStop(0, "rgba(255, 244, 220, 0.95)");
  flare.addColorStop(0.15, "rgba(255, 210, 150, 0.55)");
  flare.addColorStop(0.5, "rgba(120, 170, 255, 0.18)");
  flare.addColorStop(1, "rgba(80, 140, 255, 0)");
  ctx.fillStyle = flare;
  ctx.beginPath();
  ctx.arc(fx, fy, 46, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawRoutes(
  ctx: CanvasRenderingContext2D,
  spans: Span[],
  theta: number,
  sinT: number,
  cosT: number,
) {
  ctx.lineWidth = 1.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#a6ccff";

  // Front side only, in one glowing stroke. Any part of a route on the far
  // hemisphere — whether behind the disc or arcing out past its edge from
  // behind — is simply not drawn, so only routes facing the viewer show.
  {
    ctx.globalAlpha = 0.9;
    ctx.shadowColor = "rgba(140, 195, 255, 0.95)";
    ctx.shadowBlur = 7;
    ctx.beginPath();

    for (let i = 0; i < ARCS.length; i++) {
      const span = spans[i];
      if (!span || span.head <= span.tail) continue;

      const points = ARCS[i];
      let drawing = false;

      for (let s = 0; s <= ARC_STEPS; s++) {
        const t = s / ARC_STEPS;
        if (t < span.tail || t > span.head) {
          drawing = false;
          continue;
        }

        const p = placeVec(points[s], theta, sinT, cosT, scratchB);
        if (p.depth < 0) {
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

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

function drawNodes(
  ctx: CanvasRenderingContext2D,
  theta: number,
  sinT: number,
  cosT: number,
) {
  for (const city of CITY_POINTS) {
    const p = place(city.lon, city.ring, city.height, theta, sinT, cosT, scratch);
    if (p.depth < 0.08) continue;

    const fade = Math.min(1, (p.depth - 0.08) / 0.2);
    const r = 8.5 * (0.7 + 0.3 * p.depth);

    const glow = ctx.createRadialGradient(p.x, p.y, r * 0.6, p.x, p.y, r * 2.4);
    glow.addColorStop(0, "rgba(130, 190, 255, 0.65)");
    glow.addColorStop(1, "rgba(130, 190, 255, 0)");
    ctx.globalAlpha = fade;
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 2.4, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "rgba(14, 47, 122, 0.92)";
    ctx.strokeStyle = "#dbe8ff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Laptop glyph: screen, then base.
    const w = r * 0.95;
    const sh = r * 0.62;
    ctx.fillStyle = "#d6e6ff";
    ctx.fillRect(p.x - w / 2, p.y - sh * 0.85, w, sh);
    ctx.fillStyle = "#3d7bff";
    ctx.fillRect(p.x - w / 2 + 0.7, p.y - sh * 0.85 + 0.7, w - 1.4, sh - 1.4);
    ctx.fillStyle = "#eef4ff";
    ctx.fillRect(p.x - w * 0.68, p.y + sh * 0.25, w * 1.36, r * 0.14);
  }
  ctx.globalAlpha = 1;
}

/* ------------------------------------------------------------------------ */
/* Component                                                                 */
/* ------------------------------------------------------------------------ */

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

    // Offscreen disc the texture is painted into each frame.
    const disc = document.createElement("canvas");
    const discCtx = disc.getContext("2d");
    let discImage: ImageData | null = null;
    let discPixels: Uint32Array | null = null;
    let discMap: DiscMap | null = null;
    let texture: Texture | null = null;
    let disposed = false;

    let frame = 0;
    let last = 0;
    let onScreen = true;
    let backingWidth = -1;

    let theta = 1.3; // start with the Americas facing us (lon ≈ -75°)
    // Fixed: dragging spins the globe about its axis but never tips it.
    const tilt = TILT;
    let spin = 0;
    let autoSpin = false;
    let seeded = false;
    let perPixel = 0.009;

    let dragging = false;
    let pointer = -1;
    let lastX = 0;
    let lastMove = 0;

    // A third of the routes start mid-flight so the very first frame already
    // shows a network; the rest join in at staggered times.
    const clocks = ARCS.map((_, i) =>
      i % 3 === 0 ? HEAD_DUR * 0.95 : -Math.random() * 3,
    );
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
          clocks[i] = -(0.3 + Math.random() * 1.6);
          spans[i].tail = 0;
          spans[i].head = 0;
          continue;
        }

        spans[i].tail = tail;
        spans[i].head = head;
      }
    };

    advanceArcs(0);

    /** Disc resolution follows the canvas's real pixel size, capped. */
    const discSize = () =>
      Math.min(MAX_DISC_PX, Math.max(64, Math.round((backingWidth * 2 * RADIUS) / SIZE)));

    const ensureDisc = () => {
      if (!texture || !discCtx) return false;
      const size = discSize();
      if (discMap && discMap.size === size && discMap.tilt === tilt) return true;

      if (!discMap || discMap.size !== size) {
        disc.width = size;
        disc.height = size;
        discImage = discCtx.createImageData(size, size);
        discPixels = new Uint32Array(discImage.data.buffer);
      }
      discMap = buildDiscMap(size, tilt, texture);
      return true;
    };

    const render = () => {
      const sinT = Math.sin(tilt);
      const cosT = Math.cos(tilt);

      ctx.clearRect(0, 0, SIZE, SIZE);
      drawAtmosphere(ctx);

      if (ensureDisc() && discMap && discImage && discPixels && discCtx && texture) {
        paintDisc(discMap, texture, theta, discPixels);
        discCtx.putImageData(discImage, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(disc, CENTER - RADIUS, CENTER - RADIUS, RADIUS * 2, RADIUS * 2);
      } else {
        drawPlainSphere(ctx);
      }

      drawRimAndFlare(ctx);
      drawRoutes(ctx, spans, theta, sinT, cosT);
      drawNodes(ctx, theta, sinT, cosT);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const css = Math.max(1, container.clientWidth);
      const px = Math.max(1, Math.round(css * dpr));

      perPixel = Math.PI / Math.max(1, (css * 2 * RADIUS) / SIZE);

      if (px !== backingWidth) {
        backingWidth = px;
        canvas.width = px;
        canvas.height = px;
        const scale = px / SIZE;
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
      }
      render();
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      if (!dragging) {
        const target = autoSpin ? AUTO_SPIN : 0;
        spin += (target - spin) * (1 - Math.pow(GLIDE, dt * 60));
        theta += spin * dt;
      }

      if (autoSpin) advanceArcs(dt);

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
      lastMove = event.timeStamp;
      spin = 0;
      play();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointer) return;

      // Only horizontal movement counts: the globe turns about its polar
      // axis, like the real Earth, and its tilt never changes.
      const dx = event.clientX - lastX;
      const dt = Math.max((event.timeStamp - lastMove) / 1000, 1 / 240);

      const turn = dx * perPixel;
      theta += turn;
      spin = turn / dt;

      lastX = event.clientX;
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

    loadTexture(TEXTURE_URL, DAY_TEXTURE_URL)
      .then((tex) => {
        if (disposed) return;
        texture = tex;
        render();
      })
      .catch(() => {
        // Keep the plain sphere; the globe still works without the photo.
      });

    return () => {
      disposed = true;
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
      className="relative mx-auto aspect-square w-full min-w-0 max-w-[40rem]"
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={`relative block h-full w-full ${live ? "opacity-0" : ""}`}
        role="img"
        aria-label="The Earth at night, with glowing cities connected by routes"
      >
        <defs>
          <radialGradient id="globe-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0.77" stopColor="#6ea5ff" stopOpacity="0.32" />
            <stop offset="1" stopColor="#2864ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="globe-sea" cx="38%" cy="35%" r="70%">
            <stop offset="0" stopColor="#2a63c4" />
            <stop offset="0.45" stopColor="#0d2c72" />
            <stop offset="1" stopColor="#040c2a" />
          </radialGradient>
        </defs>
        <circle cx={CENTER} cy={CENTER} r={RADIUS * 1.22} fill="url(#globe-halo)" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="url(#globe-sea)"
        />
      </svg>

      {/*
        touch-action: pan-y, not none — a horizontal drag spins the globe, but a
        vertical swipe must still scroll the page.
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
