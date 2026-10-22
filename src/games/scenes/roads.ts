import { SCENES } from ".";
import { depthScale, float } from "./layout";
import { placeBox, type Placement, type SceneItem } from "./types";

// Idea B-19: some vehicles drive out of their picture into another one. Every
// second tap on them, after their own animation, they drive off; a sign at the
// edge of the picture follows them. In the other picture the very same drawing
// drives in and parks as a guest, and it can drive back home the same way. If
// nobody follows, the vehicle comes back after a while.

export interface Road {
  /** The picture the vehicle belongs to and its item there. */
  from: string;
  item: string;
  /** The picture it visits. */
  to: string;
  /** Where it parks there: foot point x and ground y. It is drawn at the depth of that y. */
  park: [number, number];
  /** The way the drawing faces: it drives off forwards and comes in from behind. */
  faces: "left" | "right";
}

export const ROADS: Road[] = [
  { from: "stadt", item: "feuerwehr", to: "feuerwache", park: [300, 800], faces: "right" },
  { from: "bauernhof", item: "traktor", to: "wald", park: [270, 780], faces: "right" },
  { from: "stadt", item: "bus", to: "zoo", park: [1240, 840], faces: "left" },
  { from: "baustelle", item: "kipper", to: "stadt", park: [560, 620], faces: "left" },
];

/** How the pictures are named in sentences: "fährt in die Stadt", "kommt aus der Stadt", "ist wieder in der Stadt". */
export const PLACES: Record<string, { to: string; from: string; at: string }> = {
  stadt: { to: "in die Stadt", from: "aus der Stadt", at: "in der Stadt" },
  feuerwache: { to: "zur Feuerwache", from: "von der Feuerwache", at: "an der Feuerwache" },
  bauernhof: { to: "auf den Bauernhof", from: "vom Bauernhof", at: "auf dem Bauernhof" },
  wald: { to: "in den Wald", from: "aus dem Wald", at: "im Wald" },
  zoo: { to: "in den Zoo", from: "aus dem Zoo", at: "im Zoo" },
  baustelle: { to: "zur Baustelle", from: "von der Baustelle", at: "auf der Baustelle" },
};

export const roadId = (road: Road) => `${road.from}.${road.item}`;

/** The vehicles of this picture that can drive somewhere, by item id. */
export function roadsFrom(sceneId: string) {
  return new Map(ROADS.filter((road) => road.from === sceneId).map((road) => [road.item, road]));
}

/** On the way: the road, and whether the vehicle is going home or visiting. */
export interface Trip {
  road: string;
  home: boolean;
}

/** A vehicle visiting from another picture. Its CSS still uses the item id of its own picture (`look`). */
export interface Guest {
  item: SceneItem;
  look: string;
  road: Road;
}

/** The id of a guest in the picture it visits; can't clash with the picture's own items. */
const GUEST_ID = "gast";

export function guestFor(road: Road): Guest | undefined {
  const item = SCENES.find((s) => s.id === road.from)?.items.find((i) => i.id === road.item);
  if (!item) return undefined;
  return { item: { ...item, id: GUEST_ID, place: parkAt(item, road.park) }, look: item.id, road };
}

/** The item's placement moved to (x, y) on the ground, as big as it would be at that depth in its own picture. */
function parkAt(item: SceneItem, [x, y]: [number, number]): Placement {
  const place = item.place ?? { x: 0, y: 0, scale: 1 };
  const [bx, by, bw, bh] = item.box;
  const footX = bx + bw / 2;
  const footY = by + bh;
  const homeY = place.y + footY * place.scale;
  return float(footX, footY, x, y, (place.scale * depthScale(y)) / depthScale(homeY));
}

/** Off the picture past this much. */
const MARGIN = 60;

/**
 * How far the item moves sideways until it is out of the picture: forwards
 * when it drives off, so coming in it starts that far behind itself.
 */
export function driveDistance(item: SceneItem, faces: Road["faces"], width: number, leaving: boolean) {
  const [x, , w] = placeBox(item.box, item.place);
  const right = (faces === "right") === leaving;
  return right ? width + MARGIN - x : -(x + w + MARGIN);
}

/** The picture's items with the guest among them, drawn in front of everything standing further back. */
export function withGuest(items: SceneItem[], guest: Guest) {
  const footY = (item: SceneItem) => {
    const [, y, , h] = placeBox(item.box, item.place);
    return y + h;
  };
  const at = items.findIndex((item) => footY(item) > guest.road.park[1]);
  return at < 0 ? [...items, guest.item] : [...items.slice(0, at), guest.item, ...items.slice(at)];
}

/** The trip a picture was opened with, if it is the right picture for it. */
export function tripTo(sceneId: string, state: unknown): { road: Road; home: boolean } | null {
  const trip = (state as { trip?: Trip } | null)?.trip;
  const road = trip && ROADS.find((r) => roadId(r) === trip.road);
  if (!road || (trip.home ? road.from : road.to) !== sceneId) return null;
  return { road, home: trip.home };
}
