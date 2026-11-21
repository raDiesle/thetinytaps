import { ChapterBook } from "@/components/ChapterBook";
import { GameShell } from "@/components/GameShell";
import { byLanguage } from "@/content/texts";
import { useT } from "@/lib/language";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { BOTTLE_STORY } from "./bottleStory";
import { BOTTLE_STORY_TITLE } from "./names";

/** Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent. */
const VOICE = recordedVoice(voiceFiles);

/** The story in the other languages, German too, by language, as each language's texts load (`texts-<id>.ts`); none yet. */
const TRANSLATIONS = byLanguage((texts) => texts.bottleStory);

/** Each page's picture by its file name without extension (`flasche-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
const pictureOf = (id: string) => PICTURES.get(`flasche-${id}`);

/** „Bye-Bye, Bottle!“, read in chapters like the books „Abstillen“, „Schnullerfee“, „Kita-Start“ and „Haare waschen“ (`ChapterBook`). */
export function BottleStoryGame() {
  const t = useT();
  return (
    <GameShell
      title={t(BOTTLE_STORY_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ goes back to the page before it.
      startMode="story"
    >
      <ChapterBook chapters={BOTTLE_STORY} voice={VOICE} title={BOTTLE_STORY_TITLE} pictureOf={pictureOf} code="F" first="en" translations={TRANSLATIONS} />
    </GameShell>
  );
}
