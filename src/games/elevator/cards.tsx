import { GameEnd } from "@/components/GameEnd";
import { STORIES } from "./content";
import { PICTURES } from "./kid";
import { Fitted, GOALS, type Picture } from "./trail/items";
import { TRAIL_LEVELS } from "./trail/levels";

/** A story or level, with the picture on its „Weiter“ button. */
export interface StoryCard {
  id: string;
  title: string;
  picture: Picture;
}

/** Every story of the game in play order: the lift stories first, then the trail levels. */
export const CARDS: StoryCard[] = [
  ...STORIES.map((s) => ({ id: s.id, title: s.title, picture: PICTURES[s.icon] })),
  ...TRAIL_LEVELS.map((l) => ({ id: l.id, title: l.title, picture: GOALS[l.goal] })),
];

/** The story after this one; after the last comes the first again. */
export function nextCard(id: string) {
  const index = CARDS.findIndex((card) => card.id === id);
  return CARDS[(index + 1) % CARDS.length];
}

/** The end of a story: „Nochmal“ plays it again, „Weiter“ with the next story's picture starts that one. */
export function StoryEnd({ id, onPick }: { id: string; onPick: (id: string) => void }) {
  const next = nextCard(id);
  const picture = (
    <svg className="el-end-picture" viewBox="-130 -100 260 200" aria-hidden>
      <Fitted picture={next.picture} width={200} height={150} />
    </svg>
  );
  return <GameEnd onAgain={() => onPick(id)} next={{ emoji: picture, name: next.title, onNext: () => onPick(next.id) }} />;
}
