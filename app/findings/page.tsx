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
        <div className="rise mx-auto my-auto w-full max-w-[52rem]">
          {/* The visible heading is gone by request; the document still needs
              one, so it stays for screen readers and the outline. */}
          <h1 className="sr-only">Three Answers</h1>

          {/* Q1, Q2, Q3 — one under the other, centred, each with room to
              breathe. `textAlign` is set inline because `.plate` declares
              text-align: left after Tailwind's utilities layer and would
              otherwise win. */}
          {/* Padding is floored in rem rather than left to svh alone, so the
              questions keep their air on a short window instead of collapsing
              together. */}
          <ol className="m-0 flex list-none flex-col gap-[clamp(1.75rem,4svh,3rem)] p-0">
            {findings.sections.map((s, i) => (
              <li key={s.n} className={i > 0 ? 'hair-top pt-[clamp(1.75rem,4svh,3rem)]' : undefined}>
                {/* `.plate` declares `display: block` and `text-align: left`
                    after Tailwind's utilities layer, so `flex`/`text-center`
                    lose to it and the spans would run inline on one line.
                    Both are forced inline here. */}
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                  className="plate group w-full px-[clamp(1rem,3vw,2rem)] py-[clamp(1.25rem,2.5svh,2rem)]"
                >
                  <span className="t-label plate__index block">Q{i + 1}</span>
                  <span className="t-display mt-[clamp(1.125rem,2.5svh,1.75rem)] block max-w-[24ch] text-[clamp(1.375rem,1.1rem+1.5vw,2.5rem)] leading-[1.25] text-[var(--ink)]">
                    {s.q}
                  </span>
                  <span className="t-label mt-[clamp(1.25rem,3svh,2rem)] block text-[var(--accent)]">
                    Read — {s.points.length} points
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {/* The way out, in the same place it is in every other room. */}
          <div className="hair-top mt-[clamp(2rem,6svh,3.5rem)] flex justify-center pt-[clamp(1.75rem,4.5svh,2.75rem)]">
            <Doorway from="findings" />
          </div>
        </div>
      </div>

      <Overlay open={open !== null} onClose={() => setOpen(null)} labelledBy="overlay-title">
        {section ? (
          <div className="mx-auto w-full max-w-[62rem]">
            {/* Header centred to match the room it opened from. The points
                below stay ranged left — centring running text that wraps over
                several lines makes it markedly harder to read. */}
            <p className="t-label text-center text-[var(--accent)]">Q{(open ?? 0) + 1}</p>
            <h2
              id="overlay-title"
              className="t-display mx-auto mt-5 max-w-[26ch] text-center text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-[var(--ink)]"
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
