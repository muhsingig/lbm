'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { hero } from '@/content/exhibition';
import { rooms } from '@/content/rooms';
import { useThreshold } from './Threshold';

/**
 * The corridor — the walk through the building.
 *
 * Scrolling does not move a page. It moves *you*: the wheel drives a camera
 * forward along a real perspective corridor, and the doors to each floor come
 * up on alternating walls as you pass them, each under its own sign. Click one
 * and you go through it.
 *
 * Built with CSS 3D transforms rather than a render engine — four planes and a
 * camera on the Z axis. Everything animated is a transform.
 */

/* Corridor dimensions, in the world's own px. Width and height are derived
   from the viewport at runtime — the mouth of the corridor has to be bigger
   than the screen or you can see past the walls. */
const GAP = 1500; // distance between doors
const LEAD = 1700; // how far you walk before the first door
const NEAR = 1100; // how much corridor sits behind the camera
const DEPTH = LEAD + GAP * (rooms.length - 1) + 900;

/* The entrance is where you are standing — it is not a door off its own
   corridor. Everything else gets one, alternating sides as you walk. */
const walkable = rooms.filter((r) => r.id !== 'entrance');

const doors = walkable.map((room, i) => ({
  room,
  z: LEAD + i * GAP,
  side: (i % 2 === 0 ? 'left' : 'right') as 'left' | 'right',
}));

const END = DEPTH - 1100;

export function Corridor() {
  const { go } = useThreshold();
  const target = useRef(0);
  const current = useRef(0);
  const world = useRef<HTMLDivElement>(null);
  const [walk, setWalk] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [dims, setDims] = useState({ w: 1400, h: 900 });

  /* The corridor must be wider and taller than the screen, or its mouth shows
     as a rectangle floating in the dark. */
  useEffect(() => {
    const measure = () =>
      setDims({
        w: Math.max(1150, Math.round(window.innerWidth * 1.05)),
        h: Math.max(780, Math.round(window.innerHeight * 1.18)),
      });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const nudge = useCallback((delta: number) => {
    target.current = Math.min(END, Math.max(0, target.current + delta));
  }, []);


  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    if (mq.matches) return;

    let raf = 0;
    const loop = () => {
      // Ease toward the target so the walk has weight and never snaps.
      current.current += (target.current - current.current) * 0.075;
      if (world.current) {
        world.current.style.transform = `translateZ(${current.current}px)`;
      }
      setWalk(current.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onWheel = (e: WheelEvent) => {
      if (document.querySelector('.overlay')) return;
      e.preventDefault();
      nudge(e.deltaY * 1.35);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0]!.clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (document.querySelector('.overlay')) return;
      const y = e.touches[0]!.clientY;
      nudge((touchY - y) * 3.2);
      touchY = y;
    };

    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('.overlay')) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nudge(700);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        nudge(-700);
      } else if (e.key === 'Home') {
        e.preventDefault();
        target.current = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        target.current = END;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [nudge]);

  const progress = Math.min(1, walk / END);

  return (
    <div className="corridor-viewport">
      <div
        ref={world}
        className="corridor"
        style={
          {
            '--w': `${dims.w}px`,
            '--h': `${dims.h}px`,
            '--d': `${DEPTH}px`,
            /* Planes run from behind the camera to the far end, so the walls
               always reach past the edges of the screen. */
            '--len': `${DEPTH + NEAR}px`,
            '--cz': `${(NEAR - DEPTH) / 2}px`,
            transform: reduced ? undefined : `translateZ(${walk}px)`,
          } as React.CSSProperties
        }
      >
        <div className="plane plane--floor" aria-hidden="true" />
        <div className="plane plane--ceiling" aria-hidden="true" />
        <div className="plane plane--left" aria-hidden="true" />
        <div className="plane plane--right" aria-hidden="true" />

        {/* The end of the corridor, glowing. */}
        <div className="plane plane--end" aria-hidden="true" />

        {doors.map(({ room, z, side }) => (
          <a
            key={room.id}
            href={room.path}
            className={`door3d door3d--${side}`}
            style={{ '--z': `${z}px` } as React.CSSProperties}
            data-accent={room.id}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey) return;
              e.preventDefault();
              go(room.path);
            }}
          >
            <span className="door3d__sign">
              <span className="t-label door3d__short">{room.short}</span>
              <span className="t-display door3d__name">{room.sign}</span>
            </span>
            <span className="door3d__leaf" aria-hidden="true">
              <span className="door3d__light" />
            </span>
            <span className="t-label door3d__hint">{room.doorLine}</span>
          </a>
        ))}
      </div>

      {/* ── Fixed overlay: the title at the start, then the walk ─────────── */}
      <div className="corridor-ui">
        <div
          className="corridor-ui__intro"
          style={{ opacity: Math.max(0, 1 - walk / 900), pointerEvents: walk > 400 ? 'none' : 'auto' }}
        >
          <p className="t-label text-[var(--accent)]">{hero.eyebrow}</p>
          <h1 className="t-display mt-6 text-[clamp(3rem,1.6rem+8vw,8rem)] text-[var(--ink)]">
            Second Nature
          </h1>
          <p className="t-display t-display--italic mx-auto mt-6 max-w-[28ch] text-[clamp(1.125rem,1rem+1vw,1.75rem)] text-[var(--muted)]">
            {hero.premise}
          </p>
          <p className="t-label mt-12 text-[var(--muted)]">
            {reduced ? 'Choose a floor below' : 'Scroll to walk'}
          </p>
        </div>

        {/* How far along the building you are. */}
        <div className="corridor-ui__progress" aria-hidden="true">
          <span className="corridor-ui__bar" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <p className="corridor-ui__status t-label">
          <span className="text-[var(--muted)]">Art House, NMACC</span>
          <span className="text-[var(--accent)]">
            {progress >= 0.98 ? 'End of the corridor' : `${Math.round(progress * 100)}% along`}
          </span>
        </p>
      </div>

      {/* Reduced motion, and anyone who would rather not walk: the doors as a
          plain list. Same destinations, no camera. */}
      <nav className="corridor-fallback" aria-label="Floors">
        <ul>
          {walkable.map((r) => (
            <li key={r.id}>
              <a
                href={r.path}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  go(r.path);
                }}
              >
                <span className="t-label">{r.short}</span>
                <span className="t-display">{r.sign}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
