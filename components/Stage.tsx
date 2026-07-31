'use client';

import { useEffect } from 'react';
import type { RoomId } from '@/content/rooms';
import { Chrome } from './Chrome';
import { Particles } from './Particles';

/**
 * A room. Fixed to the viewport, never scrolled.
 *
 * The volume is built from light rather than drawn: a wall washed from above,
 * a floor catching the same light, one hairline horizon where they meet, and a
 * vignette so the edges fall away. That is what makes a gallery feel considered
 * — the lighting plan, not the outline of the walls.
 */
export function Stage({
  room,
  theme,
  children,
}: {
  room: RoomId;
  /** Palette override. Level 3 arrives still dark and inverts to paper later. */
  theme?: RoomId;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.dataset.room = theme ?? room;
  }, [room, theme]);

  /* Level 0 only: the room tracks where you are, with a deliberate lag. */
  useEffect(() => {
    if (room !== 'level-0') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = { x: 0.5, y: 0.5 };
    const eased = { x: 0.5, y: 0.5 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };
    const loop = () => {
      eased.x += (target.x - eased.x) * 0.035;
      eased.y += (target.y - eased.y) * 0.035;
      const root = document.documentElement;
      root.style.setProperty('--mx', `${eased.x * 100}%`);
      root.style.setProperty('--my', `${eased.y * 100}%`);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [room]);

  return (
    <div className="stage">
      <div className="stage__wall" aria-hidden="true" />
      <div className="stage__floor" aria-hidden="true" />
      <div className="stage__light" aria-hidden="true" />
      <div className="stage__horizon" aria-hidden="true" />
      <Particles active={room === 'level-1'} />
      <div className="stage__watch" aria-hidden="true" />
      <div className="stage__vignette" aria-hidden="true" />
      <div className="stage__grain" aria-hidden="true" />

      <Chrome room={room} />

      <main className="enter absolute inset-0 flex flex-col">{children}</main>
    </div>
  );
}
