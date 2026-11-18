import { useEffect, useRef } from "react";

/**
 * Fireball shooting stars for the hero's night sky, drawn on a canvas.
 *
 * Each meteor is a teardrop: a white-hot head with a glow, trailing a thick
 * tail that tapers to a point and cools from white through yellow and orange
 * to red. As it flies it sheds embers — small sparks that drift, cool and fade
 * behind it — which is what makes the trail read as fire rather than a line.
 *
 * Meteors spawn every ~0.5–1.8s on the night side (the parent masks the canvas
 * so none cross the headline), and cross the sky in well under a second.
 *
 * Like the other hero ambience, this deliberately ignores the OS
 * reduced-motion setting — see HONOUR_REDUCED_MOTION in GlobeVisual.tsx for
 * why. It pauses whenever the hero is off-screen.
 */

/** Seconds between meteors: a random wait in this range. */
const SPAWN_MIN = 0.5;
const SPAWN_MAX = 1.8;
/** Flight speed, CSS px per second. */
const SPEED_MIN = 950;
const SPEED_MAX = 1500;
/** How long a meteor burns before it fades out, in seconds. */
const LIFE_MIN = 0.55;
const LIFE_MAX = 0.95;
/** Direction of travel: down and to the left, in degrees (0 = right, 90 = down). */
const ANGLE_MIN = 140;
const ANGLE_MAX = 158;

const TAU = Math.PI * 2;

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  /** Head radius, CSS px. */
  size: number;
  /** Full tail length, CSS px. */
  tail: number;
  /** Fractional embers owed, so emission is smooth at any frame rate. */
  emit: number;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** Ember colour by age (0 = just shed, 1 = dead): white → yellow → orange → red. */
function emberColor(t: number): string {
  if (t < 0.2) return "255, 245, 210";
  if (t < 0.45) return "255, 205, 90";
  if (t < 0.7) return "255, 135, 40";
  return "235, 70, 25";
}

export function ShootingStars({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let onScreen = true;
    let nextSpawn = 0.3;

    const meteors: Meteor[] = [];
    const embers: Ember[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      const angle = (rand(ANGLE_MIN, ANGLE_MAX) * Math.PI) / 180;
      const speed = rand(SPEED_MIN, SPEED_MAX);
      // Start along the top edge or the right edge of the night side.
      const fromTop = Math.random() < 0.65;
      const x = fromTop ? rand(width * 0.6, width * 1.02) : width + 20;
      const y = fromTop ? -20 : rand(0, height * 0.55);
      meteors.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: rand(LIFE_MIN, LIFE_MAX),
        size: rand(2.8, 4.2),
        tail: rand(130, 210),
        emit: 0,
      });
    };

    const drawMeteor = (m: Meteor) => {
      // Fade in fast, burn, then fade out over the last third.
      const k = m.age / m.life;
      const alpha = Math.min(1, k / 0.12) * Math.min(1, (1 - k) / 0.35);
      if (alpha <= 0) return;

      const speed = Math.hypot(m.vx, m.vy);
      const dx = m.vx / speed;
      const dy = m.vy / speed;
      const nx = -dy;
      const ny = dx;
      // The tail grows in as the meteor ignites.
      const len = m.tail * Math.min(1, k / 0.25 + 0.3);
      const tx = m.x - dx * len;
      const ty = m.y - dy * len;
      const r = m.size;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = alpha;

      // Outer flame: wide, soft, orange-red.
      const outer = ctx.createLinearGradient(tx, ty, m.x, m.y);
      outer.addColorStop(0, "rgba(220, 50, 20, 0)");
      outer.addColorStop(0.45, "rgba(255, 90, 30, 0.28)");
      outer.addColorStop(0.8, "rgba(255, 150, 50, 0.5)");
      outer.addColorStop(1, "rgba(255, 200, 120, 0.7)");
      teardrop(ctx, m.x, m.y, tx, ty, nx, ny, r * 2.2);
      ctx.fillStyle = outer;
      ctx.fill();

      // Inner core: narrow, hot, white to yellow.
      const inner = ctx.createLinearGradient(tx, ty, m.x, m.y);
      inner.addColorStop(0, "rgba(255, 160, 60, 0)");
      inner.addColorStop(0.55, "rgba(255, 200, 100, 0.55)");
      inner.addColorStop(0.85, "rgba(255, 238, 180, 0.95)");
      inner.addColorStop(1, "rgba(255, 255, 245, 1)");
      teardrop(ctx, m.x, m.y, m.x - dx * len * 0.7, m.y - dy * len * 0.7, nx, ny, r);
      ctx.fillStyle = inner;
      ctx.fill();

      // Head glow.
      const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r * 5);
      glow.addColorStop(0, "rgba(255, 255, 250, 1)");
      glow.addColorStop(0.18, "rgba(255, 236, 170, 0.85)");
      glow.addColorStop(0.45, "rgba(255, 160, 70, 0.3)");
      glow.addColorStop(1, "rgba(255, 110, 40, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(m.x, m.y, r * 5, 0, TAU);
      ctx.fill();

      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      nextSpawn -= dt;
      if (nextSpawn <= 0) {
        spawn();
        nextSpawn = rand(SPAWN_MIN, SPAWN_MAX);
      }

      // Advance meteors and shed embers from the head.
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.age += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;

        const k = m.age / m.life;
        if (k < 0.9) {
          m.emit += dt * 140;
          while (m.emit >= 1) {
            m.emit -= 1;
            const back = Math.random() * 0.12;
            embers.push({
              x: m.x - m.vx * dt * back + rand(-1.5, 1.5),
              y: m.y - m.vy * dt * back + rand(-1.5, 1.5),
              // Embers keep a little of the meteor's motion, plus scatter.
              vx: m.vx * rand(0.04, 0.14) + rand(-40, 40),
              vy: m.vy * rand(0.04, 0.14) + rand(-40, 40),
              age: 0,
              life: rand(0.25, 0.6),
              size: rand(0.6, 1.6),
            });
          }
        }

        if (m.age >= m.life || m.x < -400 || m.y > height + 400) {
          meteors.splice(i, 1);
        }
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.age += dt;
        if (e.age >= e.life) {
          embers.splice(i, 1);
          continue;
        }
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        e.vx *= 0.94;
        e.vy *= 0.94;
      }

      ctx.clearRect(0, 0, width, height);

      // Embers under the meteors, additive so overlapping sparks glow.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        const t = e.age / e.life;
        ctx.globalAlpha = (1 - t) * 0.9;
        ctx.fillStyle = `rgb(${emberColor(t)})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - t * 0.5), 0, TAU);
        ctx.fill();
      }
      ctx.restore();

      for (const m of meteors) drawMeteor(m);

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

    const sized = new ResizeObserver(resize);
    sized.observe(canvas);
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) onScreen = entry.isIntersecting;
      if (onScreen) play();
      else pause();
    });
    seen.observe(canvas);

    resize();
    play();

    return () => {
      pause();
      sized.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
    />
  );
}

/**
 * A teardrop: a semicircular head of radius `r` at (hx, hy), its sides
 * tapering in smooth curves to a point at the tail (tx, ty).
 * (nx, ny) is the unit normal to the direction of travel.
 */
function teardrop(
  ctx: CanvasRenderingContext2D,
  hx: number,
  hy: number,
  tx: number,
  ty: number,
  nx: number,
  ny: number,
  r: number,
) {
  // Direction of travel, from tail to head.
  const angle = Math.atan2(hy - ty, hx - tx);
  // Control points a quarter of the way back, slightly narrower than the
  // head, so the body swells behind the head then thins to the point.
  const cx = hx + (tx - hx) * 0.25;
  const cy = hy + (ty - hy) * 0.25;

  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.quadraticCurveTo(cx + nx * r * 0.9, cy + ny * r * 0.9, hx + nx * r, hy + ny * r);
  // Round front: from one side, round the nose, to the other side.
  ctx.arc(hx, hy, r, angle + Math.PI / 2, angle - Math.PI / 2, true);
  ctx.quadraticCurveTo(cx - nx * r * 0.9, cy - ny * r * 0.9, tx, ty);
  ctx.closePath();
}
