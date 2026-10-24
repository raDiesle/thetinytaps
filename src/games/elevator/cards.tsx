import { STORIES } from "./content";
import { PICTURES } from "./kid";
import { Fitted, GOALS, type Picture } from "./trail/items";
import { TRAIL_LEVELS } from "./trail/levels";

/** A story or level to pick, with the picture on its card. */
export interface StoryCard {
  id: string;
  title: string;
  picture: Picture;
}

/** Every story of the game: the lift stories first, then the trail levels. */
export const CARDS: StoryCard[] = [
  ...STORIES.map((s) => ({ id: s.id, title: s.title, picture: PICTURES[s.icon] })),
  ...TRAIL_LEVELS.map((l) => ({ id: l.id, title: l.title, picture: GOALS[l.goal] })),
];

/** The picture cards at the end of a story: a tap starts the next one. */
export function StoryCards({ again, onPick }: { again: boolean; onPick: (id: string) => void }) {
  return (
    <div className={`el-picker${again ? " again" : ""}`}>
      {CARDS.map((card, i) => (
        <button
          key={card.id}
          type="button"
          className={`el-card el-card-${i}`}
          aria-label={card.title}
          onPointerDown={(e) => {
            e.stopPropagation();
            onPick(card.id);
          }}
        >
          <svg viewBox="-130 -100 260 200" aria-hidden>
            <Fitted picture={card.picture} width={200} height={150} />
          </svg>
        </button>
      ))}
    </div>
  );
}

/** The key 1, 2, 3 … picks that card; Enter or Space the first. */
export function cardForKey(key: string) {
  const digit = Number(key);
  if (Number.isInteger(digit) && digit >= 1 && digit <= CARDS.length) return CARDS[digit - 1];
  if (key === "Enter" || key === " ") return CARDS[0];
  return undefined;
}
