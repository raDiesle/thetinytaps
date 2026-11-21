import { ChapterBook } from "@/components/ChapterBook";
import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { NIGHT_MILK } from "./nightMilk";
import { NIGHT_MILK_TITLE } from "./names";

/** Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent. */
const VOICE = recordedVoice(voiceFiles);

/** Each page's picture by its file name without extension (`nacht-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
const pictureOf = (id: string) => PICTURES.get(`nacht-${id}`);

/**
 * „The Milk Sleeps at Night“, read in chapters like the other books of the Alltagshelfer (`ChapterBook`), at its own
 * address below „Abstillen“: its trophy is a level of that game of its own (`level`), never Tapsis Milchkette's.
 */
export function NightMilkGame() {
  const t = useT();
  return (
    <GameShell
      title={t(NIGHT_MILK_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ goes back to the page before it.
      startMode="story"
    >
      <ChapterBook chapters={NIGHT_MILK} voice={VOICE} title={NIGHT_MILK_TITLE} pictureOf={pictureOf} code="N" first="en" level="nachts" />
    </GameShell>
  );
}
