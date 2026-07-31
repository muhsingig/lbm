/**
 * The route through the building.
 *
 * Each room is its own page. You do not scroll from one floor to the next —
 * you go through a door, and the palette changes while it opens. The empty
 * stairwell segments of a scrolling page become the doors themselves.
 *
 * Copy for the rooms lives in `exhibition.ts`. This file is only the plan.
 */

export type RoomId =
  | 'entrance'
  | 'hallway'
  | 'level-0'
  | 'level-1'
  | 'level-2'
  | 'level-3'
  | 'findings'
  | 'exit';

export interface Room {
  id: RoomId;
  /** URL segment. The entrance is the index. */
  path: string;
  /** Hand-lettered on the sign above the door. */
  sign: string;
  /** Short form for the floor map. */
  short: string;
  /** What the sign on the door into this room says as you approach it. */
  doorLine: string;
  /** Which floor of the drawn building section this room sits on. */
  storey: number;
}

export const rooms: Room[] = [
  {
    id: 'entrance',
    path: '/',
    sign: 'Second Nature',
    short: 'IN',
    doorLine: 'The way in',
    storey: -1,
  },
  {
    id: 'hallway',
    path: '/hallway',
    sign: 'The Hallway',
    short: 'HALL',
    doorLine: 'Before the ticket',
    storey: 0,
  },
  {
    id: 'level-0',
    path: '/level-0',
    sign: 'The Floor That Watches Back',
    short: 'L0',
    doorLine: 'Level 00 — Random International',
    storey: 1,
  },
  {
    id: 'level-1',
    path: '/level-1',
    sign: 'The Digital Garden',
    short: 'L1',
    doorLine: 'Level 01 — teamLab',
    storey: 2,
  },
  {
    id: 'level-2',
    path: '/level-2',
    sign: 'Weather, Indoors',
    short: 'L2',
    doorLine: 'Level 02 — Heijdens · Murakami',
    storey: 3,
  },
  {
    id: 'level-3',
    path: '/level-3',
    sign: 'The Page You Take Home',
    short: 'L3',
    doorLine: 'Level 03 — Es Devlin',
    storey: 4,
  },
  {
    id: 'findings',
    path: '/findings',
    sign: 'Three Answers',
    short: 'NOTE',
    doorLine: 'What we made of it',
    storey: 5,
  },
  {
    id: 'exit',
    path: '/exit',
    sign: 'The Way Out',
    short: 'OUT',
    doorLine: 'Back through the same door',
    storey: 6,
  },
];

export const roomById = (id: RoomId) => rooms.find((r) => r.id === id)!;

export const nextRoom = (id: RoomId) => {
  const i = rooms.findIndex((r) => r.id === id);
  return i >= 0 && i < rooms.length - 1 ? rooms[i + 1] : undefined;
};

export const prevRoom = (id: RoomId) => {
  const i = rooms.findIndex((r) => r.id === id);
  return i > 0 ? rooms[i - 1] : undefined;
};

/** The floor map reads bottom-up, like a building section. */
export const mapOrder = [...rooms].reverse();
