'use client';

import { useEffect, useRef } from 'react';

/**
 * Approaching a work. The room stays behind, blurred back, and the piece comes
 * forward — which is the one interaction a gallery actually has. Nothing in
 * this site scrolls except the inside of this panel.
 */
export function Overlay({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;

    const node = panel.current;
    const focusables = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      );

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      restoreTo.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <button
        type="button"
        className="overlay__scrim"
        aria-label="Step back from this work"
        onClick={onClose}
      />

      <div
        ref={panel}
        className="overlay__panel relative mx-auto flex w-full max-w-[86rem] flex-col px-[var(--gutter)] py-[clamp(3rem,8svh,6rem)]"
      >
        <div className="hair-bottom mb-[clamp(2rem,5svh,3.5rem)] flex items-center justify-between gap-6 pb-5">
          <span className="t-label text-[var(--muted)]">On the wall</span>
          <button type="button" onClick={onClose} className="chrome-btn t-label">
            Step back — Esc
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
