import { GameEnd } from "@/components/GameEnd";
import { useAppLanguage } from "@/lib/language";
import { STORIES } from "./content";
import { FILMS } from "./film/films";
import { titleIn } from "./phrases";
import { TRAIL_LEVELS } from "./trail/levels";

/** A story or level, named on its „Weiter“ button for screen readers. */
export interface StoryCard {
  id: string;
  /** German; shown through `titleIn` in the app language. */
  title: string;
}

/** Every story of the game in play order: the lift stories first, then the trail levels, then the films. */
export const CARDS: StoryCard[] = [
  ...STORIES.map((s) => ({ id: s.id, title: s.title })),
  ...TRAIL_LEVELS.map((l) => ({ id: l.id, title: l.title })),
  ...FILMS.map((f) => ({ id: f.id, title: f.title })),
];

/** The story after this one; after the last comes the first again. */
export function nextCard(id: string) {
  const index = CARDS.findIndex((card) => card.id === id);
  return CARDS[(index + 1) % CARDS.length];
}

/** The end of a story: „Nochmal“ plays it again, „Weiter“ starts the next one. */
export function StoryEnd({ id, onPick }: { id: string; onPick: (id: string) => void }) {
  const language = useAppLanguage();
  const next = nextCard(id);
  return <GameEnd onAgain={() => onPick(id)} next={{ name: titleIn(next.title, language.id), onNext: () => onPick(next.id) }} />;
}
