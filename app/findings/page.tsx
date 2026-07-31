'use client';

import { useState } from 'react';
import { findings } from '@/content/exhibition';
import { Doorway } from '@/components/Doorway';
import { Overlay } from '@/components/Overlay';
import { Stage } from '@/components/Stage';

/**
 * The three answers, standing in the room as panels.
 *
 * The room is centred rather than ranged left, because there is nothing else
 * on this floor — three questions, and the way out. Approach one and it opens
 * like any other work in the building.
 */
export default function Page() {
  const [open, setOpen] = useState<number | null>(null);
  const section = open === null ? null : findings.sections[open]!;

  return (
    <Stage room="findings">
      {/* The page never scrolls, but this room carries more text than a short
          viewport can hold — so the room's own content scrolls inside the
          stage rather than being cut off. */}
      <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-[var(--gutter)] pb-[clamp(3rem,9svh,5rem)] pt-[clamp(3rem,9svh,5rem)]">
        <div className="rise mx-auto my-auto w-full max-w-[64rem]">
          {/* The visible heading is gone by request; the document still needs
              one, so it stays for screen readers and the outline. */}
          <h1 className="sr-only">Three Answers</h1>

          {/* Q1, Q2, Q3 — one under the other, each its own row. The number
              sits in a fixed column so the questions all start on one line. */}
          <ol className="m-0 list-none p-0">
            {findings.sections.map((s, i) => (
              <li key={s.n} className={i > 0 ? 'hair-top' : undefined}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="plate group grid w-full grid-cols-[3rem_1fr] items-baseline gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-3 py-[clamp(1.75rem,4.5svh,3rem)] text-left sm:grid-cols-[5rem_1fr_auto]"
                >
                  <span className="t-label plate__index">Q{i + 1}</span>
                  <span className="t-display text-[clamp(1.375rem,1.1rem+1.5vw,2.5rem)] leading-[1.15] text-[var(--ink)]">
                    {s.q}
                  </span>
                  <span className="t-label col-start-2 text-[var(--accent)] sm:col-start-3 sm:justify-self-end">
                    Read — {s.points.length} points
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {/* The way out, in the same place it is in every other room. */}
          <div className="hair-top mt-[clamp(2rem,6svh,3.5rem)] flex justify-end pt-[clamp(1.5rem,4svh,2.5rem)]">
            <Doorway from="findings" />
          </div>
        </div>
      </div>

      <Overlay open={open !== null} onClose={() => setOpen(null)} labelledBy="overlay-title">
        {section ? (
          <div className="mx-auto w-full max-w-[62rem]">
            <p className="t-label text-[var(--accent)]">Q{(open ?? 0) + 1}</p>
            <h2
              id="overlay-title"
              className="t-display mt-5 text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-[var(--ink)]"
            >
              {section.q}
            </h2>
            <ul className="mt-12 space-y-8">
              {section.points.map((p, i) => (
                <li key={i} className="hair-top t-body pt-8 text-[var(--muted)]">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Overlay>
    </Stage>
  );
}
