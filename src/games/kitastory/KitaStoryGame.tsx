import { ChapterBook } from "@/components/ChapterBook";
import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { KITA_STORY } from "./kitaStory";
import { KITA_STORY_TITLE } from "./names";

/** Tapsi's voice reading the pages, from `stimme/` (German) and `stimme/<language>/`; a page not recorded yet stays silent. */
const VOICE = recordedVoice(voiceFiles);

/** Each page's picture by its file name without extension (`kita-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
const pictureOf = (id: string) => PICTURES.get(`kita-${id}`);

/** „Tapsi geht in die Kita“, read in chapters like the books „Abstillen“ and „Schnullerfee“ (`ChapterBook`). */
export function KitaStoryGame() {
  const t = useT();
  return (
    <GameShell
      title={t(KITA_STORY_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ goes back to the page before it.
      startMode="story"
    >
      <ChapterBook chapters={KITA_STORY} voice={VOICE} title={KITA_STORY_TITLE} pictureOf={pictureOf} code="E" />
    </GameShell>
  );
}
