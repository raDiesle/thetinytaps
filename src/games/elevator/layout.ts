import { createContext, useContext } from "react";

// The house in cross-section, in SVG units. Floor 0 is the ground floor. The chimney's top is the picture's top (y 0),
// and the house is as wide as the screen's shape allows: the rooms stretch, so the house fills the screen with no sky
// beside it (user request, November 2026). Rooms are drawn in design units, ROOM_L to ROOM_L + DESIGN_ROOM_W, and
// `rx` spreads a thing's design x over the real width – the things keep their size and only stand further apart.
// The lift shaft is right of the rooms and the big call buttons right of the house. The children's x is kept in design
// units too, so a turned screen moves them along with their room: past the rooms' design edge (in the lift) it is the
// same distance past the real edge.

export const FLOORS = 4;
export const FLOOR_H = 220;
/** The ceiling slab under every floor. */
export const SLAB = 16;
/** Height of a room, from its floor to the slab above. */
export const ROOM_H = FLOOR_H - SLAB;
/** Top of the highest floor; the roof is above it, the chimney on it reaches up to y 0. */
export const TOP = 120;
/** The roof's flat top. */
export const ROOF_TOP = 44;
export const GROUND = TOP + FLOORS * FLOOR_H;

/** Left edge of the picture, just past the roof. */
export const VIEW_L = -24;
export const VIEW_H = GROUND + 36;

export const HOUSE_L = 20;
export const ROOM_L = 40;
/** The width the rooms are drawn for; on a narrower screen they keep it. */
export const DESIGN_ROOM_W = 1000;
/** The widest the rooms grow, on a very wide screen. */
const MAX_ROOM_W = 2100;
/** The rooms' right edge as drawn; design x past it lies in the lift. */
export const DESIGN_ROOM_R = ROOM_L + DESIGN_ROOM_W;
export const CABIN_H = 192;
/** The cabin's left edge in design units: a child standing past it rides along. */
export const CABIN_L = DESIGN_ROOM_R + 22;
/** Where the children stand in the lift, in design units. */
export const IN_CABIN = { hero: DESIGN_ROOM_R + 146, buddy: DESIGN_ROOM_R + 76 };
export const BUTTON_R = 50;

/** Everything that depends on how wide the rooms are. */
export interface HouseLayout {
  /** The rooms' real width. */
  roomW: number;
  roomR: number;
  shaftL: number;
  shaftR: number;
  houseR: number;
  cabinL: number;
  cabinR: number;
  /** The middle of the call buttons' column. */
  buttonX: number;
  /** Right edge of the picture. */
  viewR: number;
  /** How many times wider than drawn the rooms are. */
  stretch: number;
  /** A design x in a room (ROOM_L to DESIGN_ROOM_R) spread over the real width; past the rooms it keeps its distance to their edge. */
  rx: (x: number) => number;
}

/** The house for rooms `roomW` wide. */
export function houseLayout(roomW = DESIGN_ROOM_W): HouseLayout {
  const roomR = ROOM_L + roomW;
  const stretch = roomW / DESIGN_ROOM_W;
  return {
    roomW,
    roomR,
    shaftL: roomR,
    shaftR: roomR + 220,
    houseR: roomR + 240,
    cabinL: roomR + 22,
    cabinR: roomR + 198,
    buttonX: roomR + 300,
    viewR: roomR + 376,
    stretch,
    rx: (x) => (x <= DESIGN_ROOM_R ? ROOM_L + (x - ROOM_L) * stretch : roomR + x - DESIGN_ROOM_R),
  };
}

/** How wide the rooms are so the whole picture has the shape `aspect` (width / height) – never narrower than drawn. */
export function roomWidthFor(aspect: number): number {
  const fixed = houseLayout(0).viewR - VIEW_L;
  const wide = aspect * VIEW_H - fixed;
  return Math.round(Math.min(MAX_ROOM_W, Math.max(DESIGN_ROOM_W, wide)) / 10) * 10;
}

/** The house's layout for the picture being drawn; `ElevatorPlay` provides it from the screen's shape. */
export const LayoutContext = createContext(houseLayout());

/** The house's layout of the picture this is drawn in. */
export const useLayout = () => useContext(LayoutContext);

/** The y of the floor the people of floor `f` stand on. */
export const floorLine = (f: number) => TOP + (FLOORS - f) * FLOOR_H - SLAB;
