import type { CSSProperties } from 'react';

/* ------------------------------------------------------------------ */
/* Decorative background layers. All aria-hidden and pointer-events   */
/* none; the styles live in index.css under "Ambient motion".          */
/* ------------------------------------------------------------------ */

type Light = { c: string; s: string; top: string; left: string; t: string; d?: string; x1?: string; y1?: string; x2?: string; y2?: string };

const PRESETS: Record<string, Light[]> = {
  hero: [
    { c: 'rgb(99 102 241 / 0.30)', s: '62vmax', top: '-34vmax', left: '18%', t: '26s', x1: '-8vmax', y1: '4vmax', x2: '6vmax', y2: '2vmax' },
    { c: 'rgb(56 189 248 / 0.22)', s: '44vmax', top: '-6vmax', left: '-14vmax', t: '22s', d: '-6s', x1: '10vmax', y1: '6vmax', x2: '4vmax', y2: '-3vmax' },
    { c: 'rgb(139 92 246 / 0.24)', s: '46vmax', top: '-10vmax', left: '62%', t: '24s', d: '-12s', x1: '-10vmax', y1: '8vmax', x2: '-2vmax', y2: '3vmax' },
  ],
  stage: [
    { c: 'rgb(99 102 241 / 0.55)', s: '46vmax', top: '-18vmax', left: '-10vmax', t: '20s', x1: '8vmax', y1: '6vmax', x2: '14vmax', y2: '-2vmax' },
    { c: 'rgb(139 92 246 / 0.45)', s: '40vmax', top: '10%', left: '60%', t: '23s', d: '-8s', x1: '-12vmax', y1: '-4vmax', x2: '-4vmax', y2: '6vmax' },
  ],
  night: [
    { c: 'rgb(99 102 241 / 0.42)', s: '60vmax', top: '-30vmax', left: '-12vmax', t: '28s', x1: '12vmax', y1: '6vmax', x2: '20vmax', y2: '-2vmax' },
    { c: 'rgb(139 92 246 / 0.30)', s: '50vmax', top: '-16vmax', left: '58%', t: '25s', d: '-9s', x1: '-14vmax', y1: '8vmax', x2: '-6vmax', y2: '2vmax' },
  ],
  cta: [
    { c: 'rgb(125 211 252 / 0.45)', s: '42vmax', top: '-20vmax', left: '-8vmax', t: '18s', x1: '14vmax', y1: '6vmax', x2: '22vmax', y2: '10vmax' },
    { c: 'rgb(244 114 182 / 0.28)', s: '38vmax', top: '30%', left: '62%', t: '21s', d: '-7s', x1: '-16vmax', y1: '-6vmax', x2: '-8vmax', y2: '4vmax' },
    { c: 'rgb(255 255 255 / 0.20)', s: '30vmax', top: '40%', left: '20%', t: '24s', d: '-14s', x1: '10vmax', y1: '-8vmax', x2: '-6vmax', y2: '-2vmax' },
  ],
};

export function Aurora({ preset, className = '' }: { preset: keyof typeof PRESETS; className?: string }) {
  return (
    <div aria-hidden="true" className={`aurora ${className}`}>
      {PRESETS[preset].map((l, i) => (
        <i
          key={i}
          style={
            {
              '--c': l.c,
              '--s': l.s,
              '--t': l.t,
              '--d': l.d ?? '0s',
              '--x1': l.x1,
              '--y1': l.y1,
              '--x2': l.x2,
              '--y2': l.y2,
              top: l.top,
              left: l.left,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Light pulses on grid lines. Positions are in grid cells (72px by default). */
type Beam = { axis: 'x' | 'y'; at: number; t: number; d: number; color?: string };

export function Beams({ beams, cell = 72, className = '' }: { beams: Beam[]; cell?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {beams.map((b, i) => (
        <span
          key={i}
          className={b.axis === 'x' ? 'beam-x' : 'beam-y'}
          style={
            {
              [b.axis === 'x' ? 'top' : 'left']: `${b.at * cell}px`,
              '--t': `${b.t}s`,
              '--d': `${b.d}s`,
              '--bc': b.color ?? '99 102 241',
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Deterministic scatter of twinkling stars across a box. */
export function Stars({ count = 34, className = '' }: { count?: number; className?: string }) {
  const stars = Array.from({ length: count }, (_, i) => {
    const r = (n: number) => {
      const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      left: `${(r(1) * 100).toFixed(2)}%`,
      top: `${(r(2) * 100).toFixed(2)}%`,
      t: `${(3 + r(3) * 5).toFixed(2)}s`,
      d: `${(-r(4) * 6).toFixed(2)}s`,
      o: (0.35 + r(5) * 0.55).toFixed(2),
      big: r(6) > 0.82,
    };
  });
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              left: s.left,
              top: s.top,
              width: s.big ? 3 : 2,
              height: s.big ? 3 : 2,
              '--t': s.t,
              '--d': s.d,
              '--o': s.o,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
