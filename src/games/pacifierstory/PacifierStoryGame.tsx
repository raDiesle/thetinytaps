import { ChapterBook } from "@/components/ChapterBook";
import { GameShell } from "@/components/GameShell";
import { byLanguage } from "@/content/texts";
import { useT } from "@/lib/language";
import pictureFiles from "./bilder/*.webp?glob";
import { PACIFIER_STORY } from "./pacifierStory";
import { PACIFIER_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`fee-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
const pictureOf = (id: string) => PICTURES.get(`fee-${id}`);

/** The story in the other languages, filled as the app's language loads (`pacifierstory/<lang>.ts`). */
const TRANSLATIONS = byLanguage((texts) => texts.pacifierStory);

/** „Tapsi und die Schnullerfee“, read in chapters like the book „Abstillen“ (`ChapterBook`). */
export function PacifierStoryGame() {
  const t = useT();
  return (
    <GameShell
      title={t(PACIFIER_STORY_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ goes back to the page before it.
      startMode="story"
    >
      <ChapterBook chapters={PACIFIER_STORY} title={PACIFIER_STORY_TITLE} pictureOf={pictureOf} translations={TRANSLATIONS} code="S" />
    </GameShell>
  );
}
