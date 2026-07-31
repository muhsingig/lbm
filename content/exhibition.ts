/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING HERE.
 *
 *  All exhibition copy, wall labels, palettes and media paths for the site live
 *  in this one file. Nothing in components/ needs touching to change text.
 *
 *  Sources: our own field notes and photographs from the visit, cross-checked
 *  against the written field-study report. Factual details on artists, titles,
 *  dates and curatorial intent verified against nmacc.com, teamlab.art,
 *  STIRworld (18 July 2026), ARTnews, Time Out Mumbai, The Nod Mag and the
 *  Free Press Journal. See `sources` at the bottom of this file.
 *
 *  Floor numbering follows NMACC's own signage — Hallway, then Levels 0–3.
 *  Press coverage counts the same floors as first to fourth.
 *
 *  Language rule from the course brief: three words are banned outright from
 *  every deliverable. `npm run check:words` holds the list and enforces it.
 *  Approved substitutes: considered, restrained, rarefied, deliberate,
 *  unhurried, singular, high-craft, held, quiet, slow.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* The credit line on the Exit page. `npm run check:shipped` fails the build if
   placeholder text ever finds its way back into these three values. */
export const authors = {
  names: [
    'Muhsin Gigani',
    'Pavitra Rajpal',
    'Hatim Sampalwala',
    'Hamza Chhatriwala',
    'Tanya Wadhwani',
  ],
  course: 'Luxury Brand Management · Internals · Jai Hind College',
  visitDate: '29 July 2026',
};

export type ChapterId =
  | 'hallway'
  | 'level-0'
  | 'level-1'
  | 'level-2'
  | 'level-3'
  | 'findings'
  | 'exit';

/** A chapter's full token set. These names are overridden on :root as you scroll. */
export interface Palette {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accent2?: string;
  accent3?: string;
  rule: string;
  /** Sets the browser chrome colour and the scrollbar to match the room. */
  scheme: 'dark' | 'light';
}

export interface Media {
  kind: 'image' | 'video';
  src: string;
  /** Poster frame for video; also the reduced-motion and no-JS fallback. */
  poster?: string;
  alt: string;
  width: number;
  height: number;
  /** True where the still was pulled from a phone clip and is only 480px wide. */
  lowRes?: boolean;
  /**
   * Art-direct a crop instead of showing the whole frame. Used where a phone
   * held in portrait has captured a landscape subject with a lot of dead
   * ceiling above it.
   */
  crop?: { aspect: string; position?: string };
}

/**
 * The recurring device. On Levels 0–3 this is a real museum wall label.
 * In the hallway the objects are not catalogued works, so the same component
 * renders a field plate instead — same voice, honest fields.
 */
export interface Label {
  kind: 'wall' | 'plate';
  /** Plate number in the field-study report, e.g. "PLATE 05". Optional. */
  plate?: string;
  attribution: string;
  title: string;
  year?: string;
  medium: string;
  floor: string;
  /** Small print under the rule — commissioning credits, or why we shot it. */
  note?: string;
}

export interface Moment {
  id: string;
  label: Label;
  body: string;
  media?: Media;
  /** How the block sits on the page. Levels vary this so the rhythm is not flat. */
  layout: 'full' | 'offset-left' | 'offset-right' | 'inset' | 'text-only';
  /** Marks the single iridescent moment on Level 2. Used exactly once. */
  iridescent?: boolean;
}

export interface Quote {
  text: string;
  speaker: string;
  role: string;
  source: string;
}

export interface Chapter {
  id: ChapterId;
  /** Shown in the level rail and the Esc index. */
  railLabel: string;
  levelNumber?: string;
  title: string;
  artist?: string;
  /** One sentence, second person, alone on screen. */
  threshold?: string;
  moments: Moment[];
  quote?: Quote;
  palette: Palette;
  /** Which motion vocabulary this chapter uses. */
  motion: 'architectural' | 'detected' | 'bloom' | 'dissolve' | 'drawn' | 'still';
}

export interface Stairwell {
  from: ChapterId;
  to: ChapterId;
  line: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PALETTES
   Each chapter re-declares the same token names. The swap happens on scroll,
   interpolated over 600ms in the stairwell. See app/globals.css.
   ═══════════════════════════════════════════════════════════════════════════ */

export const palettes: Record<ChapterId, Palette> = {
  // Concrete and brass. Warm, architectural, hard light from one side.
  hallway: {
    bg: '#0C0C0E',
    surface: '#17171A',
    ink: '#EDEAE3',
    muted: '#8A8781',
    accent: '#B08D57',
    rule: 'rgba(176,141,87,0.32)',
    scheme: 'dark',
  },
  // Mercury and cold steel. Near-monochrome on purpose; the only warmth is you.
  'level-0': {
    bg: '#060708',
    surface: '#141619',
    ink: '#F4F6F8',
    muted: '#8D97A2',
    accent: '#6E8FA8',
    accent2: '#FFFFFF',
    rule: 'rgba(141,151,162,0.28)',
    scheme: 'dark',
  },
  // Bioluminescent bloom. The most saturated chapter in the site.
  // Cyan carries the structure because the one teamLab photograph we have is
  // cyan-green; magenta carries the type and the glow.
  'level-1': {
    bg: '#070B24',
    surface: '#0F1740',
    ink: '#F6F1FF',
    muted: '#9A93C4',
    accent: '#FF3D8B',
    accent2: '#2ED9E6',
    accent3: '#FFC24B',
    rule: 'rgba(46,217,230,0.30)',
    scheme: 'dark',
  },
  // Mist. Charcoal ground rather than the green one first sketched — our own
  // footage of this floor is charcoal and pale grey-blue, not sage.
  // Sage survives as the accent.
  'level-2': {
    bg: '#12161A',
    surface: '#1B2126',
    ink: '#E9E2D2',
    muted: '#8FA394',
    accent: '#9CC5A1',
    accent2: '#BFD8E8',
    rule: 'rgba(156,197,161,0.24)',
    scheme: 'dark',
  },
  // Paper and ink. The inversion, and the payoff of the climb.
  'level-3': {
    bg: '#EFE9DA',
    surface: '#E4DCC9',
    ink: '#14110F',
    muted: '#6B6255',
    accent: '#2C4A7C',
    // Vermilion measures 4.00:1 on this ground, so it is reserved for drawn
    // marks and display sizes and never used for body copy.
    accent2: '#C8452B',
    rule: 'rgba(107,98,85,0.34)',
    scheme: 'light',
  },
  findings: {
    bg: '#EFE9DA',
    surface: '#E4DCC9',
    ink: '#14110F',
    muted: '#6B6255',
    accent: '#2C4A7C',
    accent2: '#C8452B',
    rule: 'rgba(107,98,85,0.34)',
    scheme: 'light',
  },
  // You walk back out through the same door you came in.
  exit: {
    bg: '#0C0C0E',
    surface: '#17171A',
    ink: '#EDEAE3',
    muted: '#8A8781',
    accent: '#B08D57',
    rule: 'rgba(176,141,87,0.32)',
    scheme: 'dark',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   THE PRELOADER AND THE THRESHOLD
   ═══════════════════════════════════════════════════════════════════════════ */

export const preloader = {
  label: 'ART HOUSE · NMACC',
  line: 'Building the hallway.',
};

export const hero = {
  eyebrow: 'A FIELD STUDY · OBSERVING LUXURY BEYOND THE PRODUCT',
  title: 'Second Nature',
  standfirst:
    'Superblue at the Art House, Nita Mukesh Ambani Cultural Centre. Jio World Centre, G Block, Bandra Kurla Complex, Mumbai. 3 July 2026 to 10 January 2027.',
  premise:
    'You have not bought a ticket yet. The building has already started.',
  facts: [
    { k: 'NINE', v: 'installations' },
    { k: 'FIVE', v: 'artists' },
    { k: 'FOUR', v: 'floors' },
    { k: '₹100', v: 'entry' },
  ],
  scrollCue: 'Start climbing',
};

/* ═══════════════════════════════════════════════════════════════════════════
   THE WALKTHROUGH
   ═══════════════════════════════════════════════════════════════════════════ */

export const chapters: Chapter[] = [
  /* ───────────────────────────── HALLWAY ────────────────────────────────── */
  {
    id: 'hallway',
    railLabel: 'HALL',
    title: 'The Hallway',
    artist: 'Jio World Centre · Swadesh',
    threshold: 'A mosaic of Indian culture and heritage.',
    palette: palettes.hallway,
    motion: 'architectural',
    moments: [
      {
        id: 'floral-elephant',
        layout: 'offset-left',
        label: {
          kind: 'plate',
          plate: 'PLATE 01',
          attribution: 'Jio World Centre atrium',
          title: 'Floral elephant',
          medium: 'Fabric flowers, roughly life scale, in a flower bed',
          floor: 'HALLWAY',
          note: 'Photographed because the brand starts working before the ticket is scanned.',
        },
        media: {
          kind: 'image',
          src: '/media/hallway/01-floral-elephant.jpg',
          alt: 'A life-size caparisoned temple elephant made entirely from fabric flowers — dark green body, red and white flower blankets, a marigold sunburst on its side — standing in a dense bed of orange, pink and purple flowers behind a rope barrier. The lit shopfront of the Swadesh craft store is visible behind it.',
          width: 960,
          height: 1280,
        },
        body:
          'A caparisoned temple elephant, rendered entirely in fabric flowers, at roughly life scale, roped off inside a flower bed. It is placed where the crowd is thickest, so you do not seek it out — you arrive at it. It does two things at once. It is the photograph everybody takes, and it announces at the door that the reference point for this building is Indian rather than imported.',
      },
      {
        id: 'swadesh-marquetry',
        layout: 'offset-right',
        label: {
          kind: 'plate',
          plate: 'PLATE 02',
          attribution: 'Swadesh, Jio World Centre',
          title: 'Marquetry wall',
          medium: 'Framed wood-inlay panels on individual track heads',
          floor: 'HALLWAY',
          note: 'The classical display language, forty metres from a gallery that refuses it.',
        },
        media: {
          kind: 'image',
          src: '/media/hallway/02-swadesh-marquetry.jpg',
          alt: 'A cream gallery wall inside the Swadesh store hung with large framed wood-inlay marquetry panels — a tiger under trees, a receding temple corridor, figures walking a path — each lit by its own white track spotlight beneath a brass SWADESH sign. Carved dark furniture and a laid dining table sit below.',
          width: 960,
          height: 1280,
        },
        body:
          'The wall is hung like a gallery, not like a shop. Each marquetry panel is framed, spaced generously, hung at gallery height and given its own track head. From where we stood there were no visible prices. Underneath, the carved furniture is arranged as a room rather than as stock. The craft is being presented as art first and merchandise second, and the lighting is doing the persuading.',
      },
      {
        id: 'blue-pottery',
        layout: 'inset',
        label: {
          kind: 'plate',
          plate: 'PLATE 03',
          attribution: 'Swadesh, Jio World Centre',
          title: 'Blue Pottery on brass easels',
          medium: 'Two hand-painted plates, raised, backlit by a continuous strip',
          floor: 'HALLWAY',
          note: 'A utensil stood upright becomes an artefact. Value signalled purely by separation.',
        },
        media: {
          kind: 'image',
          src: '/media/hallway/03-blue-pottery-easels.jpg',
          alt: 'Two hand-painted Blue Pottery plates standing upright on small brass easels in a dark recess, lit from above by a continuous white LED strip. The left plate shows figures in a lotus pond in cobalt on white; the right shows a woman in yellow and gold inside a turquoise floral border.',
          width: 1280,
          height: 960,
        },
        body:
          'The same logic in miniature. Two plates are lifted off the horizontal, stood upright on brass easels, isolated against a dark recess and washed by a single strip of light, with a deep shadow gap above them. This is the oldest display trick there is for turning something you eat off into something you look at. Nothing here is stacked.',
      },
      {
        id: 'swadesh-loom',
        layout: 'full',
        label: {
          kind: 'plate',
          plate: 'PLATE 04',
          attribution: 'Swadesh, Jio World Centre',
          title: 'Working handloom',
          medium: 'Loom, warped and threaded, on the retail floor',
          floor: 'HALLWAY',
          note: 'The strongest object in the hallway, and the argument the top floor repeats.',
        },
        media: {
          kind: 'video',
          src: '/media/hallway/04-swadesh-handloom.mp4',
          poster: '/media/hallway/04-swadesh-handloom.jpg',
          alt: 'Close view along a working handloom on the Swadesh shop floor: hundreds of teal and dark red warp threads running taut through the frame, wooden shuttles and bobbins wrapped in teal yarn in the foreground, the lit retail floor visible beyond the threads.',
          width: 480,
          height: 848,
          lowRes: true,
        },
        body:
          'Swadesh keeps a live loom on the shop floor, warped and threaded, so you watch cloth being made in the room where cloth is sold. The making is put on display instead of the made thing. Hold on to this — it is the same move the top floor makes with twenty-five years of an artist’s sketchbooks, and the pairing turned out to be the most useful thing we carried out of the building.',
      },
    ],
  },

  /* ───────────────────────────── LEVEL 0 ────────────────────────────────── */
  {
    id: 'level-0',
    railLabel: 'L0',
    levelNumber: '00',
    title: 'The Floor That Watches Back',
    artist: 'Random International',
    threshold: 'The room reads you before you have decided to look at it.',
    palette: palettes['level-0'],
    motion: 'detected',
    moments: [
      {
        id: 'our-future-selves',
        layout: 'offset-left',
        label: {
          kind: 'wall',
          plate: 'PLATE 05',
          attribution: 'Random International',
          title: 'Our Future Selves',
          year: '2019',
          medium: 'Suspended matrix of rods, LEDs, motion tracking',
          floor: 'LEVEL 00',
        },
        media: {
          kind: 'image',
          src: '/media/level-0/01-our-future-selves.jpg',
          alt: 'Two visitors stand close together facing a tall curtain of fine vertical rods hanging from a black ceiling beam in a pale gallery. A human figure is rendered inside the rods as a dense column of warm points of light. A dark security dome is fixed to the ceiling directly above the work, and a white line is taped across the wooden floor.',
          width: 960,
          height: 1280,
        },
        body:
          'A human figure rendered in thousands of points of light, suspended inside a hanging grid of fine rods, mirroring the posture of whoever stands in front of it. It does not snap to you. It resolves, slowly, the way a slow eye would. Two things in our photograph are worth staying with: the visitors have stopped and closed in rather than walking past, and there is a real security dome on the ceiling directly above the work. On a floor about being watched, the camera and the artwork share a ceiling.',
      },
      {
        id: 'audience',
        layout: 'offset-right',
        label: {
          kind: 'wall',
          plate: 'PLATE 06',
          attribution: 'Random International',
          title: 'Audience',
          year: '2008',
          medium: 'Sixty-four motorised mirrors, cameras, motion sensors',
          floor: 'LEVEL 00',
          note: 'Created with Chris O’Shea. Originally commissioned by choreographer Wayne McGregor for Deloitte Ignite at the Royal Opera House, London.',
        },
        media: {
          kind: 'image',
          src: '/media/level-0/02-audience.jpg',
          alt: 'Dozens of small rectangular mirrors, each mounted on its own low metal stand and trailing a pale cable, arranged across a curved white plinth barely above a wooden floor. Every mirror is angled slightly differently. Behind them a wall of tall pale grey fabric panels rises to the ceiling.',
          width: 960,
          height: 1280,
        },
        body:
          'Sixty-four small mirrors, each on its own motorised base, cabled together and driven by cameras and motion sensors. They turn to track whoever is in the room. Photographed empty, the piece reads as a crowd waiting — every mirror angled slightly differently. It sits on a plinth barely above the floor so that it meets a standing adult at chest height. It is deliberately not raised and not framed, because it has to share your eye level to do its job.',
      },
      {
        id: 'presence-and-erasure',
        layout: 'full',
        label: {
          kind: 'wall',
          attribution: 'Random International',
          title: 'Presence and Erasure',
          year: '2019',
          medium: 'Camera, ultraviolet light, photosensitive plywood',
          floor: 'LEVEL 00',
          note: 'Filmed on the floor, with somebody’s face still holding on the panel.',
        },
        media: {
          kind: 'video',
          src: '/media/level-0/03-presence-and-erasure.mp4',
          poster: '/media/level-0/03-presence-and-erasure.jpg',
          alt: 'A pale gallery with track lighting overhead and a wooden floor. On the grey wall hangs a large panel the colour of raw plywood, carrying a portrait of a face in violet, burned into it by ultraviolet light. One visitor stands close in front of it, watching. Another, in the foreground, holds a phone up to film it.',
          width: 576,
          height: 1024,
          lowRes: true,
        },
        body:
          'A camera you do not notice takes your face and burns it by ultraviolet light onto photosensitive plywood. It glows for a while. Then it fades, and there is nothing, and the wood is ready for the next person. In our notes we called this the printing machine — the imprint other people leave on you. In the clip somebody’s face is still holding on the panel while the next visitor lines a phone up at it.',
      },
    ],
    quote: {
      text:
        'We imagine that people would get creeped out by the focus on them and being followed. What actually happened is that people get irritated if the work shifts its focus away from them. They start to really perform for the installation, which was a complete role reversal.',
      speaker: 'Hannes Koch',
      role: 'co-founder, Random International',
      source: 'to STIRworld, 18 July 2026',
    },
  },

  /* ───────────────────────────── LEVEL 1 ────────────────────────────────── */
  {
    id: 'level-1',
    railLabel: 'L1',
    levelNumber: '01',
    title: 'The Digital Garden',
    artist: 'teamLab',
    threshold: 'You push through a black curtain and the floor begins to bloom.',
    palette: palettes['level-1'],
    motion: 'bloom',
    moments: [
      {
        id: 'resonating-microcosms',
        layout: 'full',
        label: {
          kind: 'wall',
          plate: 'PLATE 07',
          attribution: 'teamLab',
          title: 'Resonating Microcosms — Solidified Light',
          year: '2022 – present',
          medium: 'Interactive installation, sound, light',
          floor: 'LEVEL 01',
        },
        media: {
          kind: 'video',
          src: '/media/level-1/01-resonating-microcosms.mp4',
          poster: '/media/level-1/01-resonating-microcosms.jpg',
          alt: 'A large ovoid glowing from within in cyan, green and deep blue, its surface reading like a membrane with light moving under it. The room around it is entirely black — no floor, wall or ceiling is visible.',
          width: 480,
          height: 848,
          lowRes: true,
        },
        body:
          'An ovoid stands lit from inside, and the room around it gives you no floor, no wall and no ceiling. Push it and it sounds a note as it rights itself, and the one beside it answers, and the one beside that. The colour in this frame was made by somebody who was standing here before you. Possibly by us. The dreaminess is not ambient design — it is generated live by whoever is in the room.',
      },
      {
        id: 'flowers-and-people',
        layout: 'offset-left',
        label: {
          kind: 'wall',
          attribution: 'teamLab',
          title: 'Flowers and People, Cannot be Controlled but Live Together',
          year: '2014 – present',
          medium: 'Interactive digital installation, floor and wall projection, rendered in real time',
          floor: 'LEVEL 01',
          note: 'Our own photograph — the five of us standing inside the work.',
        },
        media: {
          kind: 'image',
          src: '/media/level-1/02-flowers-and-people.jpg',
          alt: 'Five students standing shoulder to shoulder in a dark room, lit from behind and below by a wall-sized projection of flowers in magenta, blue and yellow. The projection spills across the floor and over their clothes and faces. One of them holds a phone up to take the photograph.',
          width: 960,
          height: 1280,
        },
        body:
          'Floor and walls. Stand still and flowers gather around your feet. Walk through them, or reach down and touch them, and they scatter and die. None of it is recorded. It is rendered as you stand in it, which means the image you are inside has never existed before and will not exist again. The only photograph we have of this work is a photograph of ourselves inside it — which, on a work that does not exist until somebody is standing in it, is the more accurate record.',
      },
      {
        id: 'nirvana',
        layout: 'offset-right',
        label: {
          kind: 'wall',
          attribution: 'teamLab',
          title: 'Nirvana: Fleeting Flowers, Radiance Within',
          year: '2013',
          medium: 'Digital work projected onto rhinestone wallpaper, four walls',
          floor: 'LEVEL 01',
          note: 'After Itō Jakuchū (1716–1800).',
        },
        media: {
          kind: 'image',
          src: '/media/level-1/03-nirvana.jpg',
          alt: 'Two walls meeting in a corner of a dark room, both covered in rhinestone wallpaper that throws back the light as a fine glitter. Projected across them is a field of flowers built from countless coloured specks — rust red, cornflower blue, ochre and violet — which resolves into blossom at a distance and breaks into grains up close. A projector is visible on the black ceiling and the polished floor holds the reflection.',
          width: 1200,
          height: 1600,
        },
        body:
          'Projected across four walls onto rhinestone wallpaper, built on the logic of the mid-Edo painter Itō Jakuchū, who assembled birds and flowers out of grids of tiny coloured squares. Stand close and it shatters into squares. Step back and the flowers re-form. The whole floor works this way: get near enough to anything here and it turns into its parts.',
      },
    ],
    quote: {
      text:
        'There is no boundary between the artworks and us — you are a part of it. This is a lot like a garden. Any garden is artificial, but there is still an essence of nature.',
      speaker: 'Takashi Kudo',
      role: 'teamLab',
      source: 'to STIRworld, 18 July 2026',
    },
  },

  /* ───────────────────────────── LEVEL 2 ────────────────────────────────── */
  {
    id: 'level-2',
    railLabel: 'L2',
    levelNumber: '02',
    title: 'Weather, Indoors',
    artist: 'Simon Heijdens · A.A. Murakami',
    threshold: 'The ceiling lifts away, and the scent changes to something fresh.',
    palette: palettes['level-2'],
    motion: 'dissolve',
    moments: [
      {
        id: 'lightweeds',
        layout: 'offset-left',
        label: {
          kind: 'wall',
          plate: 'PLATE 08',
          attribution: 'Simon Heijdens',
          title: 'Lightweeds',
          year: '2005 – present',
          medium: 'Live generative projection driven by external light, rain and wind sensors',
          floor: 'LEVEL 02',
        },
        media: {
          kind: 'video',
          src: '/media/level-2/01-lightweeds.mp4',
          poster: '/media/level-2/01-lightweeds.jpg',
          alt: 'Tall, delicate plants drawn in fine white line projected across a dark charcoal wall, their heads breaking into clusters of small white blossoms. One stem toward the right has begun to shift from white to pale green.',
          width: 480,
          height: 848,
          lowRes: true,
        },
        body:
          'Plants drawn in white line across a dark wall, driven by live sensors reading the sunlight, rainfall and wind outside the building. They grow, sway, pollinate and die according to the actual weather over Mumbai that hour, and footfall inside carries their seeds in the direction people walk. One stem turned green while we were standing in front of it. Everything else in the frame was still white. Nothing here will be in the same position tomorrow.',
      },
      {
        id: 'new-spring',
        layout: 'full',
        iridescent: true,
        label: {
          kind: 'wall',
          plate: 'PLATE 09',
          attribution: 'A.A. Murakami',
          title: 'New Spring',
          year: '2017 – present',
          medium: 'Fabricated tree, mist-filled bubbles, scent',
          floor: 'LEVEL 02',
          note: 'Studio Swine. The artists call the medium ephemeral tech.',
        },
        media: {
          kind: 'video',
          src: '/media/level-2/02-new-spring.mp4',
          poster: '/media/level-2/02-new-spring.jpg',
          alt: 'A tall white sculptural tree with curved tubular branches ending in nozzles, releasing pale mist-filled bubbles that drift down through a dim, high room with full-height window bays. A mixed group of visitors stands underneath in silhouette, a small child in a pink dress at the front, one person holding up a lit phone.',
          width: 480,
          height: 848,
          lowRes: true,
        },
        body:
          'A fabricated white tree with nozzles at the ends of its branches, dropping mist-filled blossoms that burst when they touch skin. It is built on hanami, the practice of gathering to watch cherry blossom precisely because it will not last. Our photograph catches the behaviour better than the object: a mixed group pressed in underneath, a small child at the front, one adult filming. Nobody is looking at the sculpture. Everybody is looking at what falls out of it.',
      },
    ],
    quote: {
      text:
        'Our material is existence. You’re watching these bubbles come into and dissolve out of existence, and it makes you aware, just like Hanami, that you’re watching a fleeting moment that you can’t hold forever.',
      speaker: 'Alexander Groves',
      role: 'A.A. Murakami',
      source: 'to STIRworld, 18 July 2026',
    },
  },

  /* ───────────────────────────── LEVEL 3 ────────────────────────────────── */
  {
    id: 'level-3',
    railLabel: 'L3',
    levelNumber: '03',
    title: 'The Page You Take Home',
    artist: 'Es Devlin',
    threshold: 'There are benches. For the first time in four floors, the building lets you sit.',
    palette: palettes['level-3'],
    motion: 'drawn',
    moments: [
      {
        id: 'screenshare',
        layout: 'full',
        label: {
          kind: 'wall',
          plate: 'PLATE 10',
          attribution: 'Es Devlin',
          title: 'Screenshare',
          year: '2025',
          medium: '365 sketchbooks, projected film, benches',
          floor: 'LEVEL 03',
          note: 'Reworked for NMACC. Film with the dancer Dam Van Huynh.',
        },
        media: {
          kind: 'video',
          src: '/media/level-3/01-screenshare.mp4',
          poster: '/media/level-3/01-screenshare.jpg',
          alt: 'A wide, low wall built from hundreds of open sketchbooks glowing pale in an otherwise dark room, every page covered in drawings and handwritten notes. A brilliant white shape moves across the wall as the projected film plays over it, throwing its reflection down the polished floor in the foreground.',
          width: 464,
          height: 832,
          lowRes: true,
        },
        body:
          'The screen is not a screen. It is a wall built from 365 sketchbooks holding around twenty-five years of Devlin’s drawings and notes. Across it plays a film of the Vietnamese dancer Dam Van Huynh performing beside a recording of himself made nearly two decades earlier — the same body, moving next to the memory of itself. Look closely at the wall in this photograph and the drawings are legible. A great many of them are birds.',
      },

      /* The pages we took. Two moments rather than one because a Moment holds a
         single Media — read together they are one beat: the page at the wall,
         then the same kind of page once it is out of the building. */
      {
        id: 'take-home-stage',
        layout: 'offset-left',
        label: {
          kind: 'wall',
          plate: 'PLATE 11',
          attribution: 'Es Devlin',
          title: 'The page we took',
          medium: 'Pen on paper; one sheet, taken off the wall',
          floor: 'LEVEL 03',
          note: 'Photographed against the wall it came from, before we left the floor.',
        },
        media: {
          kind: 'image',
          src: '/media/level-3/02-take-home-page.jpg',
          alt: 'A large sheet of paper held up in front of the sketchbook wall, the pinned drawings of the wall itself visible behind it. On the sheet, drawn in pen: an open-sided cube in perspective, two faces the height of the structure filling its inner walls, and one small figure standing alone at its centre while a dense crowd of quickly drawn heads masses across the ground outside it. Long ruled lines flare outward to the left and right.',
          width: 960,
          height: 1280,
          // Phone held in portrait; the sheet is a wide band across the middle.
          crop: { aspect: '16 / 9', position: 'center 43%' },
        },
        body:
          'The page one of us pulled off the wall was not a bird. It was a stage — an open-sided cube drawn in perspective, two faces the height of the structure filling its inner walls, one small figure alone at the centre, and a crowd put in last as a field of hurried strokes across the floor outside. Devlin’s other working life is designing stages for stadium tours, and the sketchbooks do not separate that work from the rest of the drawing. Held up against the wall it came from, it is still legible as a thought rather than a finished thing: ruled construction lines left in, a face redrawn twice, the crowd added afterwards.',
      },
    ],
    quote: {
      text:
        'You don’t need to know anything about the artists or the technology; you just experience it firsthand. Then it layers.',
      speaker: 'Mollie Dent-Brocklehurst',
      role: 'co-curator; co-founder, Superblue',
      source: 'to STIRworld, 18 July 2026',
    },
  },

  /* ───────────────────────── THE THREE ANSWERS ──────────────────────────── */
  {
    id: 'findings',
    railLabel: 'NOTE',
    title: 'Three Answers',
    palette: palettes.findings,
    motion: 'still',
    moments: [],
  },

  /* ─────────────────────────────── EXIT ─────────────────────────────────── */
  {
    id: 'exit',
    railLabel: 'OUT',
    title: 'Exit',
    palette: palettes.exit,
    motion: 'still',
    moments: [],
  },
];

/**
 * The inversion. Level 3 arrives still dark — the sketchbook wall is a lit
 * object in a dark room — and the palette flips to paper on this beat, because
 * what you carry out of that dark room is a piece of white paper. The flip is
 * motivated by the artwork rather than by the calendar of chapters.
 */
export const inversion = {
  line: 'At the end of the film you are invited to walk up, pull a page off the wall, and keep it.',
  after: {
    heading: 'It costs nothing. It is not for sale anywhere.',
    body:
      'The archive disperses over the run of the exhibition. The work is designed to be diminished by the people who come to see it — every visitor leaves with a piece of it, and the wall gets smaller. A brand willingly letting its own asset be carried away in pieces is the opposite of how this category normally behaves.',
    /* The `todo` that used to sit here pointed at a missing scan of the page.
       PLATE 11 now carries that page directly, so the note has nowhere left
       to point. */
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   STAIRWELLS
   Short, deliberately empty scroll segments. The palette crossfades and one
   line lands. The gaps between rooms are part of the walkthrough.
   ═══════════════════════════════════════════════════════════════════════════ */

export const stairwells: Stairwell[] = [
  { from: 'hallway', to: 'level-0', line: 'You take the stairs. The welcome stops at the top of them.' },
  { from: 'level-0', to: 'level-1', line: 'A black curtain, and then nothing to see for a moment.' },
  { from: 'level-1', to: 'level-2', line: 'The corridor cools. Somewhere ahead, the ceiling gives way.' },
  { from: 'level-2', to: 'level-3', line: 'One more staircase. This is the last one.' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   THE THREE REQUIRED ANSWERS
   The course brief asks for these three explicitly, so the walkthrough carries
   them rather than leaving them to the written report alone.
   ═══════════════════════════════════════════════════════════════════════════ */

export const findings = {
  sections: [
    {
      n: '01',
      q: 'What did we observe',
      points: [
        'The visit does not begin at the ticket desk. The hallway has its own scent, its own scale and its own display strategy, and it has already made the argument before Level 0 opens.',
        'Two display languages sit forty metres apart. Swadesh frames, raises and lights each object individually. Art House removes the frame, the plinth and the label entirely.',
        'The route is sequenced as an emotional arc across five stages: welcome, unease, wonder, release, reflection. Scent and light move with it.',
        'Nobody sells anything. Staff stand at the edges of rooms and every instruction widens what you are allowed to do rather than narrowing it.',
        'The visitor is a required component. None of the works run properly without a body in the room, and the instruction not to touch has been removed.',
        'The building ends by giving something away rather than by selling something.',
      ],
    },
    {
      n: '02',
      q: 'Why we think the brand designed it this way',
      points: [
        'With no object to sell, the brand has to manufacture the feeling an object would normally carry. It does that with three instruments.',
        'SEQUENCE. Discomfort first, wonder second, release third, stillness last. Opening with the least comfortable floor only makes sense if the goal is a shaped journey rather than immediate delight. Every transition is physical: a curtain, a staircase, a change of ceiling height, a change of smell.',
        'PERMISSION. No price barrier, no salesperson, no instruction not to touch. Every signal that usually tells a visitor they are being assessed has been taken out.',
        'GENEROSITY. The building ends by handing over a piece of the artwork.',
        'The loom at Swadesh and the sketchbook wall on Level 3 are the same idea in two registers. Both put the labour on display instead of the outcome. One does it with a working weaver on a retail floor; the other does it by using twenty-five years of drawings as a projection surface and then letting visitors take it apart.',
      ],
    },
    {
      n: '03',
      q: 'What this visit changed about our understanding of luxury',
      points: [
        'We went in assuming this category is defined by what most people cannot have. Entry cost ₹100. A child under seven walks in free. And the space still felt rare — so whatever produced that feeling was not the money, because the money was not there.',
        'Scarcity is not the same as cost. The rarest thing in the building was ninety uninterrupted minutes, and no amount of money adds to it.',
        'The visitor is not the audience. The visitor is the material. Every work here was incomplete until a person stood inside it — the reverse of a boutique, where the object is finished and the person is a risk.',
        'Generosity reads as standing more convincingly than restriction does. The two moments that most convinced us were both moments of being given something: permission to touch, and a page to take home.',
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   EXIT
   ═══════════════════════════════════════════════════════════════════════════ */

export const exitContent = {
  price: '₹100',
  priceNote: 'And it still felt rare.',
  visitor: [
    { k: 'VENUE', v: 'Art House, Nita Mukesh Ambani Cultural Centre, Jio World Centre, G Block, Bandra Kurla Complex, Mumbai' },
    { k: 'DATES', v: '3 July 2026 – 10 January 2027' },
    { k: 'TICKETS', v: 'From ₹100. Free under seven. Bundle available with Yayoi Kusama’s Infinity Mirror Room. Entry includes access to select workshops.' },
    { k: 'CURATED BY', v: 'Mollie Dent-Brocklehurst and Margot Mottaz' },
    { k: 'PRESENTED BY', v: 'Superblue in partnership with NMACC. Superblue’s Asia debut; all five artists showing in India for the first time.' },
    { k: 'ARTISTS', v: 'Random International · teamLab · Simon Heijdens · A.A. Murakami · Es Devlin' },
  ],
  projectNote: {
    heading: 'Project note',
    body:
      'This is an academic documentation project, not a ticket page and not a gallery. Every photograph is our own, taken on site with the venue’s permission. Two floors are represented by clips rather than stills, because Lightweeds runs on live weather and Resonating Microcosms is a chain reaction — a still of either would be a lie about the work. Three works are described but not pictured, and we have said so where that happens rather than filling the gap.',
  },
  numbering:
    'Floor numbering follows NMACC’s own signage: Hallway, then Levels 0–3. Press coverage counts the same floors as first to fourth. The artist sequence is identical everywhere; only the labels differ.',
  sources: [
    'NMACC — Second Nature, official exhibition page (nmacc.com/visual-arts/second-nature)',
    'teamLab — Second Nature, exhibition and artwork descriptions (teamlab.art/e/nmacc)',
    'STIRworld — “Second Nature at NMACC: The democratic future of exhibitions comes to India”, Srishti Ojha, 18 July 2026 — source of the Koch, Kudo, Groves and Dent-Brocklehurst quotations',
    'The Nod Mag — “Blooming flowers, giant eggs and technicoloured pixels animate the Art House at NMACC”, Anjali Patel, 3 July 2026',
    'Free Press Journal — floor-by-floor guide to Second Nature, 3 July 2026',
    'Time Out Mumbai — “Second Nature at NMACC fuses art and technology over 4 floors”, 6 July 2026',
    'ARTnews — “Superblue Opens Second Nature at NMACC in Mumbai, India”',
  ],
  colophon: 'Built as a walkthrough rather than a report. Scroll is the climb.',
};

/** Chapter order for the rail, keyboard navigation and the Esc index. */
export const chapterOrder: ChapterId[] = [
  'hallway',
  'level-0',
  'level-1',
  'level-2',
  'level-3',
  'findings',
  'exit',
];

/** The rail reads as a building section: L3 at the top, hallway at the bottom. */
export const railOrder: ChapterId[] = [...chapterOrder].reverse();
