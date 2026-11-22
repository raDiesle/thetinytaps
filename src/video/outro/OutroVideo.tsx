import { useState } from "react";
import { VideoChoice, VideoRecorder } from "@/components/VideoRecorder";
import { SEO_LANGUAGES, type SeoLanguage } from "@/content/seo";
import { OWN_NAMES, useAppLanguage } from "@/lib/language";
import { isRender, LivePlay, RenderPlay, usePicturesDecoded } from "../frames";
import "../intro/intro.css";
import { addressFor, CODE_TARGETS, type CodeTarget, shortAddress } from "./content";
import { OUTRO_PICTURES, OutroScene } from "./OutroScene";
import { scheduleOutroSound } from "./outroSound";
import { OUTRO_SECONDS } from "./timeline";
import "./outro.css";

/**
 * What `bun run video outro` asks for in the address: `ziel` (the code's page, `/zaehne/`) and `sprache` (`en`), so a
 * video of each game in each language is one command. Without them the home page in the shelf's language.
 */
function renderChoice(fallback: SeoLanguage): { target: CodeTarget; language: SeoLanguage } {
  const query = new URLSearchParams(location.search);
  const target = CODE_TARGETS.find(([path]) => path === query.get("ziel"))?.[0] ?? "/";
  const language = SEO_LANGUAGES.find((id) => id === query.get("sprache")) ?? fallback;
  return { target, language };
}

/**
 * The outro of the YouTube videos (ideas Y-04 and Y-05, user request, November 2026), reached from /management/ only:
 * the intro backwards – the first page with the name, the book closing and going back into the shelf – then the other
 * picture books lighting up in turn with a picture of their games, and a card with the address, what the site is in five
 * small signs and a code to scan that leads to the video's game. YouTube shows no end screen links on videos made for
 * children, so everything has to be in the picture. Its words follow the shelf's language (🌐).
 */
export function OutroVideo() {
  // The shelf's language; every one of them has its pages on the site, so the code always finds its page.
  const appLanguage = useAppLanguage().id;
  const language = SEO_LANGUAGES.find((id) => id === appLanguage) ?? "en";
  const [target, setTarget] = useState<CodeTarget>("/");
  const ready = usePicturesDecoded(OUTRO_PICTURES);
  if (isRender()) {
    const chosen = renderChoice(language);
    const scene = (t: number) => <OutroScene t={t} language={chosen.language} target={chosen.target} />;
    return <RenderPlay seconds={OUTRO_SECONDS} scene={scene} schedule={scheduleOutroSound} pictures={OUTRO_PICTURES} />;
  }
  const scene = (t: number) => <OutroScene t={t} language={language} target={target} />;
  return (
    <VideoRecorder
      title="Abspann für die Videos"
      about={
        <>
          Das Buch klappt zu und geht zurück ins Regal, die anderen Bilderbücher leuchten nacheinander auf und zeigen je ein Spiel, dann eine Karte mit
          funforboth.com, fünf kleinen Zeichen und einem QR-Code zum Spiel aus dem Video. Weil YouTube bei Kindervideos keine Links im Abspann zeigt, steht
          alles im Bild. Gestochen scharf macht es <code>bun run video outro --ziel /zaehne/ --sprache en</code> im Projekt, Bild für Bild.
        </>
      }
      facts={[
        ["Länge", `${OUTRO_SECONDS} Sekunden`],
        ["Sprache", `${OWN_NAMES[language]} (wie im Regal)`],
        ["Code führt zu", shortAddress(addressFor(target, language))],
        ["Ton", "eigener Klang (Zuklappen, Klopfen, ein Ton je Buch, die drei Glockentöne des Intros, Akkord), noch ohne Stimme"],
      ]}
      options={<VideoChoice label="QR-Code zu" value={target} options={CODE_TARGETS} onChange={setTarget} />}
      ready={ready}
      loading="Bilder …"
      fileName={(extension) => `abspann-${target === "/" ? "start" : target.replaceAll("/", "")}-${language}.${extension}`}
      // The paper the outro fades in from, so the lead-in before it is not black.
      stageStyle={{ background: "#fffaf0" }}
      play={(onFinished) => <LivePlay seconds={OUTRO_SECONDS} scene={scene} schedule={scheduleOutroSound} onFinished={onFinished} />}
    />
  );
}
