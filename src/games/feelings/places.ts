// The first menu of the feelings game: where the stories happen. Each place has
// its own start screen at /gefuehle/<id>/ with its feelings or stories to pick.

/** A place, also the last part of its route. */
export type PlaceId = "zuhause" | "kindergarten";

/** One card on the first menu. */
export interface Place {
  id: PlaceId;
  emoji: string;
  title: string;
}

export const PLACES: Place[] = [
  { id: "zuhause", emoji: "🏠", title: "Zu Hause" },
  { id: "kindergarten", emoji: "🏫", title: "Im Kindergarten" },
];

/** The place with this route id, if there is one. */
export function findPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}
