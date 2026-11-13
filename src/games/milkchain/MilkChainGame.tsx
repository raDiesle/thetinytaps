import { ChapterBook } from "@/components/ChapterBook";
import { GameShell } from "@/components/GameShell";
import { byLanguage } from "@/content/texts";
import { useT } from "@/lib/language";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { MILK_CHAIN } from "./milkChain";
import { MILK_CHAIN_TITLE } from "./names";

/** Tapsi's voice reading the pages, from `stimme/` (German) and `stimme/<language>/`; a page not recorded yet stays silent. */
const VOICE = recordedVoice(voiceFiles);

/** Each page's picture by its file name without extension (`kette-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));
const pictureOf = (id: string) => PICTURES.get(`kette-${id}`);

/** The story in the other languages, filled as their texts load; German is in `milkChain.ts`. */
const TRANSLATIONS = byLanguage((texts) => texts.milkChain);

export function MilkChainGame() {
  const t = useT();
  return (
    <GameShell
      title={t(MILK_CHAIN_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ goes back to the page before it.
      startMode="story"
    >
      <ChapterBook chapters={MILK_CHAIN} voice={VOICE} title={MILK_CHAIN_TITLE} pictureOf={pictureOf} translations={TRANSLATIONS} />
    </GameShell>
  );
}
