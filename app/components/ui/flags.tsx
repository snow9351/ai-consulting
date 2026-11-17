/**
 * Inline SVG flags.
 *
 * Deliberately not emoji: flag emoji do not render on Windows, where they
 * degrade to the bare two-letter country code. Deliberately not an icon
 * package either — a handful of flags does not justify a dependency.
 *
 * All drawn in one 3:2 box so a row of them lines up. Several of these are 2:1
 * in real life; normalising the aspect is what flag icon sets do, because a
 * ragged row reads as a bug rather than as accuracy.
 *
 * Geometry is computed at module scope and rounded, so server and client
 * markup are identical and hydration cannot drift.
 */

const W = 60;
const H = 40;
const BOX = `0 0 ${W} ${H}`;

export interface FlagProps {
  className?: string;
}

/** Points for a five-pointed star. 0.382 is the standard inner/outer ratio. */
function star(cx: number, cy: number, outer: number, rotationDeg = -90): string {
  const inner = outer * 0.382;
  const points: string[] = [];

  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((rotationDeg + i * 36) * Math.PI) / 180;
    points.push(
      `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`,
    );
  }

  return points.join(" ");
}

/* --------------------------------- United States ------------------------- */

const STRIPE = H / 13;
const CANTON_W = W * 0.4;
const CANTON_H = STRIPE * 7;

/** 9 rows alternating 6 and 5 stars: 5x6 + 4x5 = 50. */
const US_STARS: string[] = (() => {
  const out: string[] = [];

  for (let row = 0; row < 9; row++) {
    const count = row % 2 === 0 ? 6 : 5;
    const y = ((row + 1) * CANTON_H) / 10;

    for (let i = 0; i < count; i++) {
      const col = row % 2 === 0 ? 1 + i * 2 : 2 + i * 2;
      out.push(star((col * CANTON_W) / 12, y, 0.95));
    }
  }

  return out;
})();

export function FlagUS({ className = "" }: FlagProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden="true">
      <rect width={W} height={H} fill="#ffffff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect
          key={i}
          y={Number((i * 2 * STRIPE).toFixed(2))}
          width={W}
          height={Number(STRIPE.toFixed(2))}
          fill="#b22234"
        />
      ))}
      <rect
        width={CANTON_W}
        height={Number(CANTON_H.toFixed(2))}
        fill="#3c3b6e"
      />
      {US_STARS.map((points, i) => (
        <polygon key={i} points={points} fill="#ffffff" />
      ))}
    </svg>
  );
}

/* ------------------------------------ Canada ----------------------------- */

/**
 * Right half of the eleven-point maple leaf, apex first, mirrored for the
 * left. Coordinates are relative to the centre of the flag.
 */
const MAPLE_HALF: [number, number][] = [
  [0, -13], //    apex
  [1.2, -8.6], // notch
  [4.6, -9.3], // upper lobe
  [3.6, -5.6], // notch
  [9.0, -3.0], // middle lobe
  [7.8, -1.4], // notch
  [11.4, 1.6], // widest lobe
  [5.4, 2.4], //  deep notch back toward the midrib
  [6.8, 6.8], //  lower lobe
  [1.6, 6.2], //  shoulder of the stem
  [1.6, 13], //   stem
];

const MAPLE_PATH = (() => {
  const at = (x: number, y: number) =>
    `${(W / 2 + x).toFixed(2)},${(H / 2 + y).toFixed(2)}`;

  const right = MAPLE_HALF.map(([x, y]) => at(x, y));
  // Drop the apex off the mirrored run; the path closes back onto it.
  const left = [...MAPLE_HALF]
    .reverse()
    .slice(0, -1)
    .map(([x, y]) => at(-x, y));

  return `M${right.join(" L")} L${left.join(" L")} Z`;
})();

export function FlagCA({ className = "" }: FlagProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden="true">
      <rect width={W} height={H} fill="#ffffff" />
      <rect width={W / 4} height={H} fill="#d80621" />
      <rect x={(W * 3) / 4} width={W / 4} height={H} fill="#d80621" />
      <path d={MAPLE_PATH} fill="#d80621" />
    </svg>
  );
}

/* ------------------------------------ Europe ----------------------------- */

const EU_STARS: string[] = Array.from({ length: 12 }, (_, i) => {
  const a = ((i * 30 - 90) * Math.PI) / 180;
  return star(W / 2 + 11 * Math.cos(a), H / 2 + 11 * Math.sin(a), 2.5);
});

export function FlagEU({ className = "" }: FlagProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden="true">
      <rect width={W} height={H} fill="#003399" />
      {EU_STARS.map((points, i) => (
        <polygon key={i} points={points} fill="#ffcc00" />
      ))}
    </svg>
  );
}

/* -------------------------------- United Kingdom ------------------------- */

const DIAGONALS = `M0,0 L${W},${H} M${W},0 L0,${H}`;
const CROSS = `M${W / 2},0 V${H} M0,${H / 2} H${W}`;

export function FlagUK({ className = "" }: FlagProps) {
  return (
    <svg viewBox={BOX} className={className} aria-hidden="true">
      {/* The diagonals run corner to corner, so they need clipping to the
          field or they overshoot the rounded corners of the chip. */}
      <clipPath id="humnova-flag-uk">
        <rect width={W} height={H} />
      </clipPath>
      <g clipPath="url(#humnova-flag-uk)">
        <rect width={W} height={H} fill="#012169" />
        <path d={DIAGONALS} stroke="#ffffff" strokeWidth="8" />
        <path d={DIAGONALS} stroke="#c8102e" strokeWidth="3.6" />
        <path d={CROSS} stroke="#ffffff" strokeWidth="13" />
        <path d={CROSS} stroke="#c8102e" strokeWidth="7.5" />
      </g>
    </svg>
  );
}
