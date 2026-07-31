'use client';

import { useState } from 'react';
import { findings } from '@/content/exhibition';
import { Doorway } from '@/components/Doorway';
import { Overlay } from '@/components/Overlay';
import { Stage } from '@/components/Stage';

export default function Page() {
  const [open, setOpen] = useState<number | null>(null);
  const section = open === null ? null : findings.sections[open]!;

  return (
    <Stage room="findings">
      {/* The page never scrolls, but this room carries more text than a short
          viewport can hold — so the room's own content scrolls inside the
          stage rather than being cut off. */}
      <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-[var(--gutter)] pb-[clamp(5rem,13svh,7rem)] pt-[clamp(4rem,10svh,6rem)]">
        <div className="rise mx-auto my-auto w-full max-w-[86rem]">
          <p className="t-label text-[var(--accent)]">The brief</p>
          <h1 className="t-display mt-6 max-w-[18ch] text-[clamp(2.5rem,1.6rem+4.4vw,5.5rem)] text-[var(--ink)]">
            {findings.intro}
          </h1>

          {/* The three answers, standing in the room like panels. */}
          <div className="mt-[clamp(2.5rem,7svh,5rem)] grid gap-px md:grid-cols-3" style={{ background: 'var(--hair)' }}>
            {findings.sections.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setOpen(i)}
                className="plate group px-[clamp(1.25rem,2.5vw,2.25rem)] py-[clamp(1.75rem,4svh,2.75rem)] text-left"
                style={{ background: 'var(--bg)' }}
              >
                <span className="t-label plate__index block">{s.n}</span>
                <span className="t-display mt-4 block text-[clamp(1.25rem,1rem+1.2vw,2rem)] text-[var(--ink)]">
                  {s.q}
                </span>
                <span className="t-label mt-6 block text-[var(--accent)]">Read — {s.points.length} points</span>
              </button>
            ))}
          </div>

          <div className="mt-[clamp(2.5rem,7svh,4.5rem)] flex flex-wrap items-end justify-between gap-x-[clamp(2rem,6vw,5rem)] gap-y-10">
            <p className="t-display t-display--italic field-note max-w-[46ch] text-[clamp(1.125rem,0.95rem+0.9vw,1.75rem)]">
              {findings.closing}
            </p>
            {/* The way out, in the same place it is in every other room. */}
            <Doorway from="findings" />
          </div>
        </div>
      </div>

      <Overlay open={open !== null} onClose={() => setOpen(null)} labelledBy="overlay-title">
        {section ? (
          <div className="mx-auto w-full max-w-[62rem]">
            <p className="t-label text-[var(--accent)]">{section.n}</p>
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
