'use client';

import { useState } from 'react';
import { authors, exitContent } from '@/content/exhibition';
import { Overlay } from '@/components/Overlay';
import { Stage } from '@/components/Stage';
import { DoorLink } from '@/components/Threshold';

/**
 * You walk back out through the door you came in by. The hallway's brass
 * returns, and the ₹100 stands very large, because the price is the whole
 * argument of the floor below.
 */
export default function Page() {
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <Stage room="exit">
      <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-[var(--gutter)] pb-[clamp(5rem,13svh,7rem)] pt-[clamp(4rem,10svh,6rem)]">
        <div className="rise mx-auto my-auto w-full max-w-[86rem]">
          <p className="t-label text-[var(--accent)]">The way out</p>

          <p className="t-display rupee mt-[clamp(1.5rem,4svh,3rem)] text-[clamp(5rem,3rem+12vw,14rem)] leading-[0.85] text-[var(--accent)]">
            {exitContent.price}
          </p>

          <p className="t-display t-display--italic mt-[clamp(1rem,3svh,2rem)] max-w-[24ch] text-[clamp(1.5rem,1.1rem+2vw,3rem)] text-[var(--ink)]">
            {exitContent.priceNote}
          </p>

          <div className="mt-[clamp(2.5rem,7svh,4.5rem)] flex flex-wrap items-center gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-4">
            <button type="button" onClick={() => setCreditsOpen(true)} className="doorway no-underline">
              <span className="doorway__slot block h-px w-[clamp(2.5rem,6vw,5rem)]" aria-hidden="true" />
              <span className="t-label">Credits, visitor information, sources</span>
            </button>

            <DoorLink href="/" className="chrome-btn t-label no-underline">
              Walk it again
            </DoorLink>
          </div>

          <p className="t-label mt-[clamp(2.5rem,7svh,4rem)] max-w-[40ch] leading-[2] text-[var(--muted)]">
            {authors.names.join(' · ')}
            <br />
            {authors.course}
            <br />
            Visited {authors.visitDate}
          </p>
        </div>
      </div>

      <Overlay open={creditsOpen} onClose={() => setCreditsOpen(false)} labelledBy="overlay-title">
        <div className="mx-auto w-full max-w-[74rem]">
          <h2 id="overlay-title" className="t-display text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-[var(--ink)]">
            Credits and visitor information
          </h2>

          <dl className="mt-12 grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-8 md:grid-cols-2">
            {exitContent.visitor.map((row) => (
              <div key={row.k} className="hair-top pt-6">
                <dt className="t-label text-[var(--accent)]">{row.k}</dt>
                <dd className="mt-3 max-w-[52ch] text-[0.9375rem] leading-[1.75] text-[var(--muted)]">
                  {row.v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="hair-top mt-14 grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-8 pt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <p className="t-label text-[var(--accent)]">{exitContent.projectNote.heading}</p>
            <div>
              <p className="t-body text-[var(--muted)]">{exitContent.projectNote.body}</p>
              <p className="t-body mt-6 text-[0.875rem] leading-[1.75] text-[var(--muted)] opacity-80">
                {exitContent.numbering}
              </p>
            </div>
          </div>

          <div className="hair-top mt-14 pt-8">
            <p className="t-label text-[var(--muted)]">Sources</p>
            <ul className="mt-6 grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-4 md:grid-cols-2">
              {exitContent.sources.map((s) => (
                <li
                  key={s}
                  className="max-w-[58ch] text-[0.8125rem] leading-[1.8] text-[var(--muted)]"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <p className="t-label mt-14 text-[var(--muted)] opacity-70">{exitContent.colophon}</p>
        </div>
      </Overlay>
    </Stage>
  );
}
