'use client';

import { authors } from '@/content/exhibition';
import { Stage } from '@/components/Stage';
import { DoorLink } from '@/components/Threshold';

/**
 * The way out.
 *
 * Two columns that hold each other up: the thanks and the credit on the left,
 * the five of us on the right, standing inside the one work on this floor that
 * did not exist until somebody walked into it. The names are set one to a line
 * because a credit is a list of people, not a sentence.
 */
export default function Page() {
  return (
    <Stage room="exit">
      <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-[var(--gutter)] pb-[clamp(2.5rem,7svh,4rem)] pt-[clamp(2.5rem,7svh,4rem)]">
        <div className="rise mx-auto my-auto grid w-full max-w-[86rem] items-center gap-x-[clamp(2rem,6vw,6rem)] gap-y-[clamp(2.5rem,6svh,4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* ── Left: the thanks, then the credit ─────────────────────────── */}
          <div>
            <p className="t-label text-[var(--accent)]">The way out</p>

            <h1 className="t-display mt-[clamp(0.75rem,2.5svh,1.5rem)] text-[clamp(3.5rem,2.4rem+6vw,7rem)] leading-[0.92] text-[var(--ink)]">
              Thank you
            </h1>

            <div className="hair-top mt-[clamp(2rem,5svh,3rem)] pt-[clamp(1.5rem,4svh,2.25rem)]">
              <p className="t-label text-[var(--accent)]">Group No. 1</p>

              {/* One name to a line. */}
              <ul className="mt-[clamp(1rem,2.5svh,1.5rem)] m-0 list-none p-0">
                {authors.names.map((name) => (
                  <li
                    key={name}
                    className="t-display text-[clamp(1.25rem,1.05rem+0.85vw,1.75rem)] leading-[1.75] text-[var(--ink)]"
                  >
                    {name}
                  </li>
                ))}
              </ul>

              <p className="t-label mt-[clamp(1.25rem,3svh,2rem)] leading-[2] text-[var(--muted)]">
                {authors.course}
                <br />
                Visited {authors.visitDate}
              </p>
            </div>

            <DoorLink
              href="/"
              className="chrome-btn t-label mt-[clamp(1.75rem,4.5svh,2.75rem)] inline-block no-underline"
            >
              Walk it again
            </DoorLink>
          </div>

          {/* ── Right: the five of us, on Level 1 ─────────────────────────── */}
          <figure className="m-0">
            <img
              src="/media/level-1/02-flowers-and-people.jpg"
              alt="The five of us standing shoulder to shoulder in a dark room on Level 1, lit from behind and below by a wall-sized projection of flowers in magenta, blue and yellow that spills across the floor and over our clothes."
              width={960}
              height={1280}
              loading="lazy"
              decoding="async"
              className="w-full"
              style={{
                aspectRatio: '4 / 5',
                objectFit: 'cover',
                objectPosition: 'center 38%',
                maxHeight: '74svh',
                boxShadow: '0 40px 90px -40px rgba(0,0,0,0.95), 0 0 0 1px var(--hair)',
              }}
            />
            <figcaption className="t-label mt-5 text-[var(--muted)]">
              Level 01 · teamLab · Flowers and People
            </figcaption>
          </figure>
        </div>
      </div>
    </Stage>
  );
}
