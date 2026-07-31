import { ImageResponse } from 'next/og';
import { chapters, palettes, type ChapterId } from '@/content/exhibition';
import { roomById, type RoomId } from '@/content/rooms';

/**
 * The share card, one per floor.
 *
 * A single shared card that reads the room's own palette, so Level 1 shares as
 * bioluminescent navy and Level 3 shares as paper — the inversion is legible in
 * a Twitter timeline before anyone has opened the site. Generated at build time
 * and written into ./out, so this survives `output: 'export'`.
 *
 * Satori (which renders these) supports a subset of CSS: flexbox only, no grid,
 * and every element holding more than one child needs an explicit display:flex.
 * It also has no access to the site's webfonts, so the card leans on scale,
 * colour and space rather than on Cormorant.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/** The strip along the top of every card, so the set reads as one series. */
function Rule({ accent }: { accent: string }) {
  return <div style={{ display: 'flex', width: '100%', height: 6, background: accent }} />;
}

export function ogCard(id: ChapterId) {
  const p = palettes[id];
  const chapter = chapters.find((c) => c.id === id)!;
  const room = roomById(id as RoomId);

  /* The floors say "LEVEL 02"; the hallway and the two end rooms have no
     number and fall back to their own short form. The artist rides in the
     eyebrow so the body of the card is free for the threshold line — which is
     the writing worth showing in a timeline, and the reason to click. */
  const floor = chapter.levelNumber ? `LEVEL ${chapter.levelNumber}` : room.short;
  const eyebrow = chapter.artist ? `${floor} · ${chapter.artist.toUpperCase()}` : floor;
  const sub = chapter.threshold ?? room.doorLine;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: p.bg,
          color: p.ink,
        }}
      >
        <Rule accent={p.accent} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
            padding: '68px 76px 60px 76px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                letterSpacing: 8,
                color: p.accent,
                fontWeight: 500,
              }}
            >
              {eyebrow}
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 34,
                fontSize: room.sign.length > 18 ? 86 : 108,
                lineHeight: 1.04,
                letterSpacing: -2,
                color: p.ink,
              }}
            >
              {room.sign}
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 32,
                maxWidth: 950,
                fontSize: sub.length > 90 ? 36 : 42,
                lineHeight: 1.32,
                color: p.muted,
              }}
            >
              {sub}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: `1px solid ${p.rule}`,
              paddingTop: 28,
            }}
          >
            <div style={{ display: 'flex', fontSize: 27, color: p.ink }}>
              Second Nature — a walkthrough
            </div>
            <div style={{ display: 'flex', fontSize: 22, letterSpacing: 4, color: p.muted }}>
              ART HOUSE, NMACC
            </div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/** The entrance card. No floor, so it carries the premise instead. */
export function ogEntrance() {
  const p = palettes.hallway;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: p.bg,
          color: p.ink,
        }}
      >
        <Rule accent={p.accent} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            padding: '0 76px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, letterSpacing: 8, color: p.accent }}>
            SUPERBLUE · ART HOUSE, NMACC, MUMBAI
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 36,
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            Second Nature
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 34,
              maxWidth: 940,
              fontSize: 34,
              lineHeight: 1.4,
              color: p.muted,
            }}
          >
            One room at a time, from the hallway to Level 3. A field study for Luxury Brand
            Management.
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
