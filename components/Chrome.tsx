'use client';

import { useCallback, useEffect, useState } from 'react';
import { mapOrder, nextRoom, prevRoom, roomById, type RoomId } from '@/content/rooms';
import { DoorLink, useThreshold } from './Threshold';

/**
 * The chrome: a floor mark top left, two quiet controls top right, and a
 * status line along the bottom. Thin, always in the same place, and never
 * competing with the room.
 */
export function Chrome({ room }: { room: RoomId }) {
  const [mapOpen, setMapOpen] = useState(false);
  const { go: through } = useThreshold();
  const here = roomById(room);
  const up = nextRoom(room);
  const down = prevRoom(room);

  /* Arrow keys go through the door too, not around it. */
  const go = useCallback(
    (dir: 1 | -1) => {
      const target = dir === 1 ? up : down;
      if (target) through(target.path);
    },
    [up, down, through],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // An overlay is open and owns the keyboard.
      if (document.querySelector('.overlay')) return;

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setMapOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape' && mapOpen) {
        e.preventDefault();
        setMapOpen(false);
        return;
      }
      if (mapOpen) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, mapOpen]);

  return (
    <>
      {/* The same fade at the top, so nothing scrolls up into the chrome. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[clamp(4rem,11svh,7rem)]"
        style={{
          background:
            'linear-gradient(to bottom, var(--bg), color-mix(in srgb, var(--bg) 80%, transparent) 55%, transparent)',
        }}
        aria-hidden="true"
      />

      {/* Where you are. */}
      <div className="pointer-events-none absolute left-[var(--gutter)] top-[clamp(1.25rem,3.5svh,2.25rem)] z-30">
        <p className="t-label text-[var(--accent)]">{here.short}</p>
      </div>

      {/* Controls. */}
      <div className="absolute right-[var(--gutter)] top-[clamp(1.25rem,3.5svh,2.25rem)] z-30 flex items-center gap-[clamp(1rem,2.5vw,2rem)]">
        <button type="button" onClick={() => setMapOpen(true)} className="chrome-btn t-label">
          Floors — M
        </button>
      </div>

      {/* Status line, along the bottom, on a hairline. The fade behind it means
          a room whose text scrolls internally passes out of view rather than
          colliding with the chrome. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-[var(--gutter)] pb-[clamp(1rem,3svh,1.75rem)] pt-[clamp(2rem,6svh,4rem)]"
        style={{
          background:
            'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--bg) 88%, transparent) 45%, var(--bg) 100%)',
        }}
      >
        <div className="hair-top flex items-center justify-between gap-6 pt-4">
          <p className="t-label text-[var(--muted)]">
            <span className="hidden sm:inline">Art House, NMACC · </span>
            {here.doorLine}
          </p>
          <p className="t-label pointer-events-auto flex items-center gap-[clamp(0.75rem,2vw,1.5rem)] text-[var(--muted)]">
            {down ? (
              <DoorLink href={down.path} className="chrome-btn no-underline">
                ← {down.short}
              </DoorLink>
            ) : null}
            {up ? (
              <DoorLink href={up.path} className="chrome-btn no-underline">
                {up.short} →
              </DoorLink>
            ) : null}
          </p>
        </div>
      </div>

      {mapOpen ? <FloorMap current={room} onClose={() => setMapOpen(false)} /> : null}
    </>
  );
}

/** A section through the building. Reads bottom-up, the way a section does. */
function FloorMap({ current, onClose }: { current: RoomId; onClose: () => void }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Floors">
      <button type="button" className="overlay__scrim" aria-label="Close" onClick={onClose} />

      <div className="overlay__panel relative mx-auto flex w-full max-w-[64rem] flex-col justify-center px-[var(--gutter)] py-[clamp(3rem,8svh,6rem)]">
        <div className="hair-bottom mb-10 flex items-center justify-between gap-6 pb-5">
          <span className="t-label text-[var(--muted)]">The building</span>
          <button type="button" onClick={onClose} className="chrome-btn t-label">
            Close — Esc
          </button>
        </div>

        <ol>
          {mapOrder.map((r) => {
            const here = r.id === current;
            return (
              <li key={r.id}>
                <DoorLink
                  href={r.path}
                  onClick={onClose}
                  aria-current={here ? 'page' : undefined}
                  className="hair-bottom group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-6 py-[clamp(0.75rem,1.8svh,1.4rem)] no-underline sm:grid-cols-[4.5rem_1fr_auto] sm:gap-x-10"
                >
                  <span
                    className="t-label"
                    style={{ color: here ? 'var(--accent)' : 'var(--muted)' }}
                  >
                    {r.short}
                  </span>
                  <span
                    className="t-display text-[clamp(1.5rem,1.1rem+2vw,2.75rem)] transition-colors duration-500"
                    style={{ color: here ? 'var(--accent)' : 'var(--ink)' }}
                  >
                    {r.sign}
                  </span>
                  <span className="t-label hidden text-[var(--muted)] sm:block">{r.doorLine}</span>
                </DoorLink>
              </li>
            );
          })}
        </ol>

        <p className="t-label mt-10 text-[var(--muted)]">← → move floor to floor · M closes</p>
      </div>
    </div>
  );
}
