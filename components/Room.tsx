'use client';

import { useState } from 'react';
import { chapters, type ChapterId, type Moment } from '@/content/exhibition';
import { roomById, type RoomId } from '@/content/rooms';
import { Media } from './Media';
import { Overlay } from './Overlay';
import { Stage } from './Stage';
import { Doorway } from './Doorway';
import { WallLabel } from './WallLabel';

/**
 * The template every floor uses.
 *
 * You stand in the room. The works hang on the wall at a distance, numbered.
 * The curator's line is painted large and low-contrast across the back wall,
 * which is what a gallery does with it. Approach a work and it comes forward
 * in an overlay with its label, its description and, where it matters, the
 * clip running. Nothing on this page scrolls.
 */
export function Room({
  room,
  chapterId,
  theme,
  extraPlates = [],
  onOpenPlate,
  children,
}: {
  room: RoomId;
  chapterId: ChapterId;
  theme?: RoomId;
  /** Anything else hanging in this room — the field note, the take-home page. */
  extraPlates?: Plate[];
  /** Fires when a plate is approached. Level 3 uses it to turn the room to paper. */
  onOpenPlate?: (id: string) => void;
  children?: React.ReactNode;
}) {
  const chapter = chapters.find((c) => c.id === chapterId)!;
  const here = roomById(room);
  const [openId, setOpenId] = useState<string | null>(null);

  const plates: Plate[] = [
    ...chapter.moments.map((m) => ({ id: m.id, kind: 'work' as const, moment: m })),
    ...extraPlates,
  ];
  const open = plates.find((p) => p.id === openId) ?? null;

  return (
    <Stage room={room} theme={theme}>
      {/* ── The room's own text, upper left ─────────────────────────────── */}
      <header className="pointer-events-none px-[var(--gutter)] pt-[clamp(4rem,11svh,7rem)]">
        <div className="rise mx-auto w-full max-w-[86rem]">
          {chapter.artist ? (
            <p className="t-label mb-[clamp(0.75rem,1.6svh,1.25rem)] text-[var(--muted)]">
              {chapter.artist}
            </p>
          ) : null}
          <h1 className="t-display max-w-[16ch] text-[clamp(2.5rem,1.6rem+4.4vw,5.5rem)] text-[var(--ink)]">
            {here.sign}
          </h1>
          {chapter.threshold ? (
            <p className="t-display t-display--italic mt-[clamp(1rem,2.4svh,2rem)] max-w-[38ch] text-[clamp(1.125rem,0.95rem+0.9vw,1.75rem)] text-[var(--muted)]">
              {chapter.threshold}
            </p>
          ) : null}
        </div>
      </header>

      {/* ── Wall text: the curator's line, painted on the back wall ──────
          Kept to the right half so it never runs into the room's own title
          and threshold line, which sit on the left. */}
      {chapter.quote ? (
        <p
          aria-hidden="true"
          className="wall-text t-display t-display--italic pointer-events-none absolute right-[var(--gutter)] top-[22%] hidden w-[min(34rem,38vw)] text-right text-[clamp(1.125rem,1.6vw,1.875rem)] xl:block"
        >
          “{chapter.quote.text}”
        </p>
      ) : null}

      {/* ── The works, hung ─────────────────────────────────────────────── */}
      <div className="relative z-10 mt-auto pb-[clamp(5rem,13svh,8rem)]">
        {/* No `justify-content` here on purpose — the auto margins in `.rail`
            centre the hang when it fits and keep it scrollable when it does
            not. `justify-center` would strand the first work off-screen. */}
        <div className="rail mx-auto w-full max-w-[86rem] items-end">
          {plates.map((plate) => (
            <PlateButton
              key={plate.id}
              plate={plate}
              /* Only the works are numbered; our note is not a work. */
              index={plate.kind === 'work' ? chapter.moments.findIndex((m) => m.id === plate.id) + 1 : null}
              onOpen={() => {
                setOpenId(plate.id);
                onOpenPlate?.(plate.id);
              }}
            />
          ))}

          {/* The way on, standing at the end of the hang. */}
          <Doorway from={room} />
        </div>
      </div>

      {children}

      {/* ── Approaching a work ──────────────────────────────────────────── */}
      <Overlay open={Boolean(open)} onClose={() => setOpenId(null)} labelledBy="overlay-title">
        {open ? <PlateDetail plate={open} chapterQuote={chapter.quote} /> : null}
      </Overlay>
    </Stage>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export type Plate =
  | { id: string; kind: 'work'; moment: Moment }
  | { id: string; kind: 'note'; eyebrow: string; title: string; body: string }
  | { id: string; kind: 'page'; eyebrow: string; title: string; body: string; todo?: string };

function PlateButton({ plate, index, onOpen }: { plate: Plate; index: number | null; onOpen: () => void }) {
  const isWork = plate.kind === 'work';
  const media = isWork ? plate.moment.media : undefined;
  const title = isWork ? plate.moment.label.title : plate.title;
  const empty = !media;

  /* Three different reasons a frame can be empty, and they must not read the
     same. A work we did not photograph is a gap in the evidence; our own note
     and the take-home page are not works at all. */
  const caption = isWork
    ? `${String(index).padStart(2, '0')}${media ? '' : ' · not photographed'}`
    : plate.eyebrow;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`plate shrink-0 ${empty ? 'plate--absent' : ''}`}
      aria-label={
        isWork
          ? `${title} — approach this work${media ? '' : ' (described but not photographed)'}`
          : `${plate.eyebrow}: ${title} — read this`
      }
    >
      <span
        className="plate__frame block"
        style={{
          width: 'clamp(8rem, 15vw, 13rem)',
          height: empty ? 'clamp(9rem, 17svh, 12rem)' : 'clamp(11rem, 24svh, 17rem)',
        }}
      >
        {media ? (
          <img
            src={media.kind === 'video' ? media.poster! : media.src}
            alt=""
            loading="lazy"
            decoding="async"
            width={media.width}
            height={media.height}
            /* Honour the art-directed crop from the content file. The
               sketchbook wall was shot in portrait with a lot of dead dark
               ceiling above it; without this the thumbnail is all ceiling. */
            style={media.crop?.position ? { objectPosition: media.crop.position } : undefined}
          />
        ) : null}
      </span>

      <span className="mt-4 block max-w-[13rem]">
        <span
          className="t-label plate__index block"
          style={!isWork ? { color: 'var(--accent)' } : undefined}
        >
          {caption}
        </span>
        <span className="t-display mt-1 block text-[clamp(0.95rem,0.85rem+0.4vw,1.25rem)] text-[var(--ink)]">
          {title}
        </span>
      </span>
    </button>
  );
}

function PlateDetail({
  plate,
  chapterQuote,
}: {
  plate: Plate;
  chapterQuote?: { text: string; speaker: string; role: string; source: string };
}) {
  if (plate.kind !== 'work') {
    return (
      <div className="mx-auto w-full max-w-[52rem]">
        <p className="t-label text-[var(--accent)]">{plate.eyebrow}</p>
        <h2 id="overlay-title" className="t-display mt-5 text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] text-[var(--ink)]">
          {plate.title}
        </h2>
        <p className="t-display t-display--italic field-note mt-10 text-[clamp(1.25rem,1rem+1.2vw,2rem)]">
          {plate.body}
        </p>

        {/* An honest hole in the evidence, kept clearly separate from the copy
            a visitor reads. */}
        {plate.kind === 'page' && plate.todo ? (
          <aside
            className="mt-12 border border-dashed p-6"
            style={{ borderColor: 'var(--hair)' }}
          >
            <p className="t-label text-[var(--accent)]">Image still to come</p>
            <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-[1.75] text-[var(--muted)]">
              {plate.todo}
            </p>
          </aside>
        ) : null}
      </div>
    );
  }

  const { moment } = plate;

  return (
    <div className="grid w-full gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-[clamp(2rem,5svh,3.5rem)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div>
        {moment.media ? (
          <div className="relative">
            {moment.iridescent ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 -z-10 opacity-25 blur-[70px]"
                style={{
                  background:
                    'linear-gradient(118deg,#F6C6D8 0%,#C8E8D6 38%,#BFC8F0 68%,#F0D9E8 100%)',
                }}
              />
            ) : null}
            <Media media={moment.media} />
          </div>
        ) : (
          <div
            className="flex items-center justify-center border border-dashed p-[clamp(2rem,6vw,4rem)]"
            style={{ borderColor: 'var(--hair)', minHeight: 'clamp(12rem,30svh,20rem)' }}
          >
            <p className="t-label max-w-[24ch] text-center text-[var(--muted)]">
              Described but not photographed. The gap is ours, and we have left it visible.
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 id="overlay-title" className="t-display text-[clamp(1.75rem,1.3rem+2vw,3rem)] text-[var(--ink)]">
          {moment.label.title}
        </h2>

        <div className="hair-top mt-8 pt-6">
          <WallLabel label={moment.label} />
        </div>

        <p className="t-body mt-8 text-[var(--muted)]">{moment.body}</p>

        {chapterQuote ? (
          <blockquote className="hair-top mt-10 pt-8">
            <p className="t-display t-display--italic text-[clamp(1.125rem,1rem+0.7vw,1.5rem)] text-[var(--ink)]">
              “{chapterQuote.text}”
            </p>
            <footer className="t-label mt-5 text-[var(--muted)]">
              <span className="text-[var(--accent)]">{chapterQuote.speaker}</span> — {chapterQuote.role},{' '}
              {chapterQuote.source}
            </footer>
          </blockquote>
        ) : null}
      </div>
    </div>
  );
}
