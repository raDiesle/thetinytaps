import { useState } from "react";
import { VideoChoice, VideoRecorder } from "@/components/VideoRecorder";
import { TARGET_LANGUAGES } from "@/content/targetLanguages";
import { useFigure } from "@/lib/common";
import { type Daytime, daytimeOf } from "@/lib/days";
import { useAppLanguage } from "@/lib/language";
import { HandwashPlay } from "./HandwashPlay";
import "./handwash.css";

/**
 * Hände waschen played for a YouTube video (ideas H-136, Y-36), reached from /management/: the whole washing once on the
 * shared 16 : 9 stage (`VideoRecorder`) with nothing but the picture (no bar, no buttons, no trophy) and nothing kept.
 * Until the song is made (H-142) it plays to the placeholder tune, so a video made now is only a test of the picture.
 * Language and child follow the shelf (🌐, the stickers); morning or evening (the sleeve: T-shirt or pyjama) is chosen here.
 */
export function HandwashVideo() {
  const language = useAppLanguage();
  const figure = useFigure();
  const [daytime, setDaytime] = useState<Daytime>(daytimeOf);
  const languageName = TARGET_LANGUAGES.find((l) => l.id === language.id)?.label ?? language.id;

  return (
    <VideoRecorder
      title="Hände waschen fürs Video"
      about="Spielt das ganze Händewaschen einmal durch – Ärmel hoch, Wasser, Seife, die fünf Reibe-Schritte mit den Schmutzmonstern, abspülen, abtrocknen, glänzen – nur das Bild im Format 16 : 9, ohne Leiste oder Knöpfe. Noch ohne Lied: Bis es mit Suno gemacht ist (H-142), spielt eine Platzhalter-Melodie, ein Video ist also nur ein Test des Bilds. Sprache und Kind stellt man im Regal um (🌐 und die Sticker)."
      facts={[
        ["Sprache", languageName],
        ["Kind", figure === "girl" ? "Mädchen" : "Junge"],
        ["Lied", "noch keins (Platzhalter-Melodie)"],
      ]}
      options={
        <VideoChoice
          label="Tageszeit"
          value={daytime}
          options={[
            ["morning", "☀️ Morgens (T-Shirt)"],
            ["evening", "🌙 Abends (Schlafanzug)"],
          ]}
          onChange={setDaytime}
        />
      }
      ready
      fileName={(extension) =>
        `haende-waschen-${language.id}-${daytime === "morning" ? "morgens" : "abends"}-${figure === "girl" ? "maedchen" : "junge"}.${extension}`
      }
      // The counter's colour, so the first frames are not black.
      stageStyle={{ background: "#f1e7da" }}
      play={(onFinished) => <HandwashPlay video={{ daytime, onFinished }} />}
    />
  );
}
