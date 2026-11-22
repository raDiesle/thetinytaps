import { useState } from "react";
import { VideoChoice, VideoRecorder } from "@/components/VideoRecorder";
import { SEO_LANGUAGES, type SeoLanguage } from "@/content/seo";
import { OWN_NAMES, useAppLanguage } from "@/lib/language";
import { isRender, LivePlay, RenderPlay, usePicturesDecoded } from "../frames";
import "../intro/intro.css";
import { addressFor, CODE_TARGETS, type CodeTarget, shortAddress } from "./content";
import { GALLERY_SECONDS } from "./gallery";
import { GALLERY_PICTURES, GalleryScene } from "./GalleryScene";
import { OUTRO_PICTURES, OutroScene } from "./OutroScene";
import { scheduleGallerySound, scheduleOutroSound } from "./outroSound";
import { OUTRO_SECONDS } from "./timeline";
import "./outro.css";

/**
 * The outro's two ways (user request, November 2026): „bilder“, the games' pictures one after another big in the
 * middle after the two categories, and „regal“, the intro backwards with the shelf's picture books lighting up.
 */
const VARIANTS = [
  ["bilder", "Bilder aus den Spielen"],
  ["regal", "Regal"],
] as const;

/** One of the outro's ways. */
type Variant = (typeof VARIANTS)[number][0];

/** What each way is made of: its length, its frame at a second, the pictures it waits for, its sound. */
const CLIPS = {
  bilder: { seconds: GALLERY_SECONDS, Scene: GalleryScene, pictures: GALLERY_PICTURES, schedule: scheduleGallerySound },
  regal: { seconds: OUTRO_SECONDS, Scene: OutroScene, pictures: OUTRO_PICTURES, schedule: scheduleOutroSound },
} as const;

/** Every picture of both ways, so switching between them never shows one missing. */
const ALL_PICTURES = [...GALLERY_PICTURES, ...OUTRO_PICTURES];

/**
 * What `bun run video outro` asks for in the address: `ziel` (the code's page, `/zaehne/`), `sprache` (`en`) and
 * `variante` (`regal`), so a video of each game in each language is one command. Without them the home page in the
 * shelf's language, as pictures of the games.
 */
function renderChoice(fallback: SeoLanguage): { target: CodeTarget; language: SeoLanguage; variant: Variant } {
  const query = new URLSearchParams(location.search);
  const target = CODE_TARGETS.find(([path]) => path === query.get("ziel"))?.[0] ?? "/";
  const language = SEO_LANGUAGES.find((id) => id === query.get("sprache")) ?? fallback;
  const variant = VARIANTS.find(([id]) => id === query.get("variante"))?.[0] ?? "bilder";
  return { target, language, variant };
}

/**
 * The outro of the YouTube videos (ideas Y-04 and Y-05, user request, November 2026), reached from /management/ only, in
 * two ways (`VARIANTS`): the games' pictures big one after another, or the intro backwards with the shelf's picture
 * books lighting up – both ending on a card with the address, what the site is in five
 * small signs and a code to scan that leads to the video's game. YouTube shows no end screen links on videos made for
 * children, so everything has to be in the picture. Its words follow the shelf's language (🌐).
 */
export function OutroVideo() {
  // The shelf's language; every one of them has its pages on the site, so the code always finds its page.
  const appLanguage = useAppLanguage().id;
  const language = SEO_LANGUAGES.find((id) => id === appLanguage) ?? "en";
  const [target, setTarget] = useState<CodeTarget>("/");
  const [variant, setVariant] = useState<Variant>("bilder");
  const ready = usePicturesDecoded(ALL_PICTURES);
  if (isRender()) {
    const chosen = renderChoice(language);
    const { seconds, Scene, pictures, schedule } = CLIPS[chosen.variant];
    const scene = (t: number) => <Scene t={t} language={chosen.language} target={chosen.target} />;
    return <RenderPlay seconds={seconds} scene={scene} schedule={schedule} pictures={pictures} />;
  }
  const { seconds, Scene, schedule } = CLIPS[variant];
  const scene = (t: number) => <Scene t={t} language={language} target={target} />;
  return (
    <VideoRecorder
      title="Abspann für die Videos"
      about={
        <>
          „Bilder aus den Spielen“: erst die zwei Kategorien Alltagshelfer und Lernspiele nebeneinander, dann kommt ein Bild nach dem anderen aus der Tiefe groß
          in die Mitte, mit dem Namen des Spiels darunter, und fliegt weiter, wenn das nächste kommt. „Regal“: Das Buch klappt zu und geht zurück ins Regal, die
          anderen Bilderbücher leuchten nacheinander auf. Beide enden mit derselben Karte: funforboth.com, fünf kleine Zeichen und ein QR-Code zum Spiel aus dem
          Video. Weil YouTube bei Kindervideos keine Links im Abspann zeigt, steht alles im Bild. Gestochen scharf macht es{" "}
          <code>bun run video outro --ziel /zaehne/ --sprache en</code> im Projekt, Bild für Bild (<code>--variante regal</code> für das Regal).
        </>
      }
      facts={[
        ["Länge", `${seconds} Sekunden`],
        ["Sprache", `${OWN_NAMES[language]} (wie im Regal)`],
        ["Code führt zu", shortAddress(addressFor(target, language))],
        [
          "Ton",
          variant === "bilder"
            ? "eigener Klang (zwei Töne für die Kategorien, ein Luftzug und ein steigender Ton je Bild, die drei Glockentöne des Intros, Akkord), noch ohne Stimme"
            : "eigener Klang (Zuklappen, Klopfen, ein Ton je Buch, die drei Glockentöne des Intros, Akkord), noch ohne Stimme",
        ],
      ]}
      options={
        <>
          <VideoChoice label="Variante" value={variant} options={VARIANTS} onChange={setVariant} />
          <VideoChoice label="QR-Code zu" value={target} options={CODE_TARGETS} onChange={setTarget} />
        </>
      }
      ready={ready}
      loading="Bilder …"
      fileName={(extension) => `abspann-${variant}-${target === "/" ? "start" : target.replaceAll("/", "")}-${language}.${extension}`}
      // The paper the outro fades in from, so the lead-in before it is not black.
      stageStyle={{ background: "#fffaf0" }}
      play={(onFinished) => <LivePlay key={variant} seconds={seconds} scene={scene} schedule={schedule} onFinished={onFinished} />}
    />
  );
}
