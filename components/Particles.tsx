'use client';

import { useEffect, useState } from 'react';

interface Speck {
  left: string;
  top: string;
  size: number;
  colour: string;
  dx: string;
  dy: string;
  dur: string;
  delay: string;
}

/**
 * Level 1 only. Slow drifting light, the way the ovoids leave the room feeling
 * lit by whoever was in it. Generated after mount so the markup stays
 * deterministic, and animated purely on transform and opacity.
 *
 * Hidden entirely under reduced motion and on small screens, where the cost is
 * real and the effect is not.
 */
export function Particles({ active }: { active: boolean }) {
  const [specks, setSpecks] = useState<Speck[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 767px)').matches) return;

    const palette = ['#2ED9E6', '#FF3D8B', '#FFC24B'];
    const next: Speck[] = Array.from({ length: 26 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      colour: palette[Math.floor(Math.random() * palette.length)]!,
      dx: `${(Math.random() - 0.5) * 160}px`,
      dy: `${-60 - Math.random() * 220}px`,
      dur: `${16 + Math.random() * 20}s`,
      delay: `${-Math.random() * 24}s`,
    }));
    setSpecks(next);
  }, []);

  if (!specks.length) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 900ms ease',
      }}
    >
      {specks.map((s, i) => (
        <span
          key={i}
          className="particle"
          style={
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: s.colour,
              boxShadow: `0 0 ${s.size * 4}px ${s.colour}`,
              '--dx': s.dx,
              '--dy': s.dy,
              '--dur': s.dur,
              '--delay': s.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
