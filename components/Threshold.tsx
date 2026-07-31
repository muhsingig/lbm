'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { rooms, type RoomId } from '@/content/rooms';

/**
 * Going through a door.
 *
 * Every move between rooms passes through a threshold: two leaves close over
 * the room you are leaving, a hairline of light shows in the seam — and that
 * light is the *next* floor's colour, so you glimpse the room before you are
 * in it — then they part and you are standing somewhere else.
 *
 * It is deliberately unhurried. About a second and a half door to door, which
 * is roughly how long a real threshold takes and is what stops the site
 * feeling like tabs.
 */

const CLOSE_MS = 560;
const HOLD_MS = 140;
const OPEN_MS = 820;

/** The light in the seam is the accent of the room you are about to enter. */
const ACCENT: Record<RoomId, string> = {
  entrance: '#C9A227',
  hallway: '#C9A227',
  'level-0': '#7FA6C0',
  'level-1': '#FF4E97',
  'level-2': '#A9CEAE',
  'level-3': '#2C4A7C',
  findings: '#2C4A7C',
  exit: '#C9A227',
};

const roomForPath = (path: string): RoomId => {
  const clean = path.replace(/\/+$/, '') || '/';
  return rooms.find((r) => r.path.replace(/\/+$/, '') === clean.replace(/\/+$/, ''))?.id ?? 'entrance';
};

type Phase = 'idle' | 'closing' | 'held' | 'opening';

const Ctx = createContext<{ go: (path: string) => void }>({ go: () => {} });

export const useThreshold = () => useContext(Ctx);

export function ThresholdProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>('idle');
  const [seam, setSeam] = useState(ACCENT.hallway);
  const pending = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const go = useCallback(
    (path: string) => {
      if (path.replace(/\/+$/, '') === pathname.replace(/\/+$/, '')) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        router.push(path);
        return;
      }

      clearTimers();
      setSeam(ACCENT[roomForPath(path)] ?? ACCENT.hallway);
      pending.current = path;
      setPhase('closing');

      timers.current.push(
        window.setTimeout(() => {
          setPhase('held');
          router.push(path);
        }, CLOSE_MS),
      );

      // Failsafe. The leaves wait for the next room to render, which is right —
      // but if that never happens the visitor must not be left staring at a
      // shut door. Open regardless.
      timers.current.push(
        window.setTimeout(() => {
          pending.current = null;
          setPhase((p) => (p === 'idle' ? p : 'opening'));
          timers.current.push(window.setTimeout(() => setPhase('idle'), OPEN_MS));
        }, CLOSE_MS + 2600),
      );
    },
    [pathname, router],
  );

  /* The leaves part once the new room has actually rendered. */
  useEffect(() => {
    if (phase !== 'held') return;
    if (pending.current && pathname.replace(/\/+$/, '') !== pending.current.replace(/\/+$/, '')) return;

    pending.current = null;
    const t = window.setTimeout(() => {
      setPhase('opening');
      timers.current.push(window.setTimeout(() => setPhase('idle'), OPEN_MS));
    }, HOLD_MS);
    timers.current.push(t);
  }, [phase, pathname]);

  const shut = phase === 'closing' || phase === 'held';
  const active = phase !== 'idle';

  return (
    <Ctx.Provider value={{ go }}>
      {children}

      <div
        aria-hidden="true"
        className="threshold"
        data-active={active ? 'true' : undefined}
        style={{ '--seam': seam } as React.CSSProperties}
      >
        <span
          className="threshold__leaf threshold__leaf--l"
          style={{
            transform: shut ? 'translate3d(0,0,0)' : 'translate3d(-100%,0,0)',
            transitionDuration: shut ? `${CLOSE_MS}ms` : `${OPEN_MS}ms`,
            transitionTimingFunction: shut
              ? 'cubic-bezier(0.7, 0, 0.3, 1)'
              : 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <span
          className="threshold__leaf threshold__leaf--r"
          style={{
            transform: shut ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)',
            transitionDuration: shut ? `${CLOSE_MS}ms` : `${OPEN_MS}ms`,
            transitionTimingFunction: shut
              ? 'cubic-bezier(0.7, 0, 0.3, 1)'
              : 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {/* The light in the crack, in the colour of the floor you are entering. */}
        <span
          className="threshold__seam"
          style={{
            opacity: shut ? 1 : 0,
            transitionDuration: shut ? `${CLOSE_MS}ms` : `${OPEN_MS * 0.4}ms`,
          }}
        />
      </div>
    </Ctx.Provider>
  );
}

/**
 * A link that goes through the threshold instead of cutting straight there.
 * Still a real anchor, so it is keyboard-reachable, focusable and crawlable.
 */
export function DoorLink({
  href,
  children,
  onClick,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { go } = useThreshold();
  return (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        // Anything the caller wanted to do — closing the floor map, say — still
        // runs, and still runs first.
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(href);
      }}
    >
      {children}
    </a>
  );
}
