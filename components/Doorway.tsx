'use client';

import { nextRoom, type RoomId } from '@/content/rooms';
import { DoorLink } from './Threshold';

/**
 * The way on: a lit slot at the edge of the room, standing where a door would.
 * Every room has one in the same place, so the walk keeps its rhythm.
 */
export function Doorway({ from, className = '' }: { from: RoomId; className?: string }) {
  const up = nextRoom(from);
  if (!up) return null;

  return (
    <DoorLink
      href={up.path}
      className={`doorway shrink-0 no-underline ${className}`}
      aria-label={`Go to ${up.sign}`}
    >
      <span
        className="doorway__slot block w-[clamp(2.5rem,4vw,3.5rem)]"
        style={{ height: 'clamp(9rem, 22svh, 15rem)' }}
        aria-hidden="true"
      />
      <span className="t-label whitespace-nowrap [writing-mode:vertical-rl]">
        {up.short} — {up.sign}
      </span>
    </DoorLink>
  );
}
