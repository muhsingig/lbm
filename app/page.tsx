'use client';

import { useEffect, useState } from 'react';
import { preloader } from '@/content/exhibition';
import { Corridor } from '@/components/Corridor';

/**
 * The way in is the corridor itself. You arrive at the head of it, and the
 * doors to each floor come up on alternating walls as you walk.
 */
export default function Entrance() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.room = 'entrance';
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPct(100);
      setGone(true);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1500);
      setPct(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(step);
      else window.setTimeout(() => setGone(true), 460);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <Corridor />

      {!gone ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-8"
          style={{
            background: 'var(--bg)',
            opacity: pct === 100 ? 0 : 1,
            transition: 'opacity 440ms var(--ease)',
          }}
        >
          <p className="t-display t-display--italic text-[clamp(1.25rem,1rem+1vw,1.75rem)] text-[var(--muted)]">
            {preloader.line}
          </p>
          <div className="relative h-px w-[min(22rem,60vw)] overflow-hidden bg-[var(--hair)]">
            <span
              className="absolute inset-y-0 left-0 bg-[var(--accent)]"
              style={{ width: `${pct}%`, transition: 'width 120ms linear' }}
            />
          </div>
          <p className="t-label text-[var(--muted)]">{pct}%</p>
        </div>
      ) : null}
    </>
  );
}
