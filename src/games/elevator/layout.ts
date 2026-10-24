// The house in cross-section, in SVG units (viewBox from VIEW_L to VIEW_W, 0 to VIEW_H). Floor 0 is the ground floor.
// Rooms span ROOM_L–ROOM_R; the lift shaft is right of them and the big call buttons right of the house.
// The action button is left of the house, so the picture starts at VIEW_L (left of 0).

export const FLOORS = 4;
export const FLOOR_H = 220;
/** The ceiling slab under every floor. */
export const SLAB = 16;
/** Height of a room, from its floor to the slab above. */
export const ROOM_H = FLOOR_H - SLAB;
/** Top of the highest floor; the roof is above it. */
export const TOP = 170;
export const GROUND = TOP + FLOORS * FLOOR_H;

/** Left edge of the picture, with room for the action button. */
export const VIEW_L = -190;
export const VIEW_W = 1400;
export const VIEW_H = GROUND + 60;

export const HOUSE_L = 20;
export const HOUSE_R = 1280;
export const ROOM_L = 40;
export const ROOM_R = 1040;
export const SHAFT_L = ROOM_R;
export const SHAFT_R = 1260;
export const CABIN_L = 1062;
export const CABIN_R = 1238;
export const CABIN_H = 192;
export const BUTTON_X = 1340;
export const BUTTON_R = 50;
/** The big action button: always at the same place left of the house, in the middle of its height. */
export const ACTION_X = -86;
export const ACTION_Y = (TOP + GROUND) / 2;
export const ACTION_R = 82;

/** Where the children stand in the lift. */
export const IN_CABIN = { hero: 1186, buddy: 1116 };

/** The y of the floor the people of floor `f` stand on. */
export const floorLine = (f: number) => TOP + (FLOORS - f) * FLOOR_H - SLAB;
