import { useEffect } from "react";
import { GameEnd } from "@/components/GameEnd";
import { useAppLanguage } from "@/lib/language";
import { savesData } from "@/lib/pwa";
import { CARDS, type CardEntry, prefetchCard } from "./catalog";
import { titleIn } from "./phrases";
import { useFigurePictures } from "@/lib/figurePictures";
import previews from "./vorschau/*.webp?glob";
import girlPreviews from "./vorschau-maedchen/*.webp?glob";

/** The story after this one; after the last comes the first again. */
export function nextCard(id: string): CardEntry {
  const index = CARDS.findIndex((card) => card.id === id);
  return CARDS[(index + 1) % CARDS.length];
}

/** The end of a story: „Nochmal“ plays it again, „Weiter“ starts the next one. */
export function StoryEnd({ id, onPick }: { id: string; onPick: (id: string) => void }) {
  const language = useAppLanguage();
  const next = nextCard(id);
  // „Weiter“ shows the next story's card picture, with the child as chosen on the home page.
  const pictures = useFigurePictures(previews, girlPreviews);
  // „Weiter“ is what comes next for certain: its code is fetched while the end shows, so it starts at once – nothing else ahead.
  useEffect(() => {
    if (!savesData()) prefetchCard(next);
  }, [next]);
  return (
    <GameEnd
      level={id}
      onAgain={() => onPick(id)}
      next={{ name: titleIn(next.title, language.id, next.first), onNext: () => onPick(next.id), picture: pictures[`${next.id}.webp`] }}
    />
  );
}
