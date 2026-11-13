import { ChapterBook } from "@/components/ChapterBook";
import { GameShell } from "@/components/GameShell";
import { byLanguage } from "@/content/texts";
import { useT } from "@/lib/language";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { HAIR_STORY } from "./hairStory";
import { HAIR_STORY_TITLE } from "./names";

/** Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent. */
const VOICE = recordedVoice(voiceFiles);

/** The story in the other languages, German too, by language, as each language's texts load (`texts-<id>.ts`). */
const TRANSLATIONS = byLanguage((texts) => texts.hairStory);

/** Each page's picture by its file name without extension (`haare-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
const pictureOf = (id: string) => PICTURES.get(`haare-${id}`);

/** „Tapsi and the Foam Crown“, read in chapters like the books „Abstillen“, „Schnullerfee“ and „Kita-Start“ (`ChapterBook`). */
export function HairStoryGame() {
  const t = useT();
  return (
    <GameShell
      title={t(HAIR_STORY_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ goes back to the page before it.
      startMode="story"
    >
      <ChapterBook chapters={HAIR_STORY} voice={VOICE} title={HAIR_STORY_TITLE} pictureOf={pictureOf} code="H" first="en" translations={TRANSLATIONS} />
    </GameShell>
  );
}
