import { useEffect, useState } from "react";
import { VideoChoice, VideoRecorder } from "@/components/VideoRecorder";
import { useFigure } from "@/lib/common";
import type { Daytime } from "@/lib/days";
import { daytimeOf } from "@/lib/days";
import { useAppLanguage } from "@/lib/language";
import { TARGET_LANGUAGES } from "@/content/targetLanguages";
import { preloadSong, SUNG_LANGUAGES, useSongLoad } from "./music";
import { DEFAULT_TEETH_SETTINGS, type TeethSettings } from "./settings";
import { sungLanguageFor } from "./sung";
import { preloadBrushing, TeethPlay } from "./TeethPlay";
import "./teeth.css";

/** A video shows the whole routine: the sweets story and the sink before, never the week chart. */
const VIDEO_SETTINGS: TeethSettings = { ...DEFAULT_TEETH_SETTINGS, origin: true, prep: true, week: false };

/**
 * Zähne putzen played for a YouTube video (user request, November 2026), reached from /management/: the whole routine
 * once – story, sink, the seven sung steps, the end – on the shared 16 : 9 stage (`VideoRecorder`) with nothing but the
 * picture (no controls, no corner, no week chart, no buttons, no trophy) and nothing kept (no star, no play time); the
 * recording ends when the song has rung out. Language and child follow the shelf (🌐, the stickers); morning or evening
 * is chosen here, since a video is made once for both.
 */
export function TeethVideo() {
  const language = useAppLanguage();
  const figure = useFigure();
  const sung = sungLanguageFor(language.id, SUNG_LANGUAGES);
  const song = useSongLoad(sung);
  const [daytime, setDaytime] = useState<Daytime>(daytimeOf);

  // Everything the brushing plays is fetched while the grown-up reads this page, so nothing comes late in the video.
  useEffect(() => {
    preloadSong(sung);
    preloadBrushing(language.id);
  }, [sung, language.id]);

  const languageName = TARGET_LANGUAGES.find((l) => l.id === language.id)?.label ?? language.id;
  const sungName = TARGET_LANGUAGES.find((l) => l.id === sung)?.label ?? sung;

  return (
    <VideoRecorder
      youtube="zaehne"
      title="Zähne putzen fürs Video"
      about="Spielt das ganze Zähneputzen einmal durch – Geschichte, Waschbecken, die sieben Strophen und das Ende – nur das Bild im Format 16 : 9, ohne Knöpfe, Wochenbild oder Pokal. Es zählt nichts: kein Stern, keine Spielzeit. Sprache und Kind stellt man im Regal um (🌐 und die Sticker)."
      facts={[
        ["Sprache", `${languageName}${sung !== language.id ? ` (Lied: ${sungName}, auf ${languageName} gibt es keins)` : ""}`],
        ["Kind", figure === "girl" ? "Mädchen" : "Junge"],
      ]}
      options={
        <VideoChoice
          label="Tageszeit"
          value={daytime}
          options={[
            ["morning", "☀️ Morgens"],
            ["evening", "🌙 Abends"],
          ]}
          onChange={setDaytime}
        />
      }
      ready={song.ready}
      loading={`Lied ${Math.round(song.progress * 100)} %`}
      fileName={(extension) =>
        `zaehne-putzen-${language.id}-${daytime === "morning" ? "morgens" : "abends"}-${figure === "girl" ? "maedchen" : "junge"}.${extension}`
      }
      // The brushing's own sky, so the first frames before the story are not black.
      stageStyle={{ background: "linear-gradient(#c4f1ff, #fff4d6)" }}
      play={(onFinished) => <TeethPlay settings={VIDEO_SETTINGS} video={{ daytime, onFinished }} />}
    />
  );
}
