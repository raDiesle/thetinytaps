import { ChapterBook } from "@/components/ChapterBook";
import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { BED_STORY } from "./bedStory";
import { BED_STORY_TITLE } from "./names";

/** Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent. */
const VOICE = recordedVoice(voiceFiles);

/** Each page's picture by its file name without extension (`bett-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
const pictureOf = (id: string) => PICTURES.get(`bett-${id}`);

/** „Tapsi's Big Bed“, read in chapters like the books „Abstillen“, „Schnullerfee“, „Kita-Start“ and „Hair Washing“ (`ChapterBook`). */
export function BedStoryGame() {
  const t = useT();
  return (
    <GameShell
      title={t(BED_STORY_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ goes back to the page before it.
      startMode="story"
    >
      <ChapterBook chapters={BED_STORY} voice={VOICE} title={BED_STORY_TITLE} pictureOf={pictureOf} code="B" first="en" />
    </GameShell>
  );
}
