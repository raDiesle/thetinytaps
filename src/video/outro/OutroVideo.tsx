import { useState } from "react";
import { VideoChoice, VideoRecorder } from "@/components/VideoRecorder";
import { SEO_LANGUAGES, type SeoLanguage } from "@/content/seo";
import { OWN_NAMES, useAppLanguage } from "@/lib/language";
import { isRender, LivePlay, RenderPlay, usePicturesDecoded } from "../frames";
import "../intro/intro.css";
import { codeAddress, shortAddress } from "./content";
import { GALLERY_SECONDS } from "./gallery";
import { GALLERY_PICTURES, GalleryScene } from "./GalleryScene";
import { OUTRO_PICTURES, OutroScene } from "./OutroScene";
import { scheduleGallerySound, scheduleOutroSound, schedulePinboardSound } from "./outroSound";
import { PINBOARD_PICTURES, PinboardScene } from "./PinboardScene";
import { PINBOARD_SECONDS } from "./pinboard";
import { OUTRO_SECONDS } from "./timeline";
import "./outro.css";

/**
 * The outro's ways (user requests, November 2026): „pinnwand“, the games' photos pinned on a cork board round the
 * address, all of them seen at once (the default since 27 November 2026: one after another they went by too fast);
 * „bilder“, the games' pictures one after another big in the middle after the two categories; and „regal“, the intro
 * backwards with the shelf's picture books lighting up.
 */
const VARIANTS = [
  ["pinnwand", "Pinnwand"],
  ["bilder", "Bilder aus den Spielen"],
  ["regal", "Regal"],
] as const;

/** One of the outro's ways. */
type Variant = (typeof VARIANTS)[number][0];

/** What each way is made of: its length, its frame at a second, the pictures it waits for, its sound. */
const CLIPS = {
  pinnwand: { seconds: PINBOARD_SECONDS, Scene: PinboardScene, pictures: PINBOARD_PICTURES, schedule: schedulePinboardSound },
  bilder: { seconds: GALLERY_SECONDS, Scene: GalleryScene, pictures: GALLERY_PICTURES, schedule: scheduleGallerySound },
  regal: { seconds: OUTRO_SECONDS, Scene: OutroScene, pictures: OUTRO_PICTURES, schedule: scheduleOutroSound },
} as const;

/** Every picture of both ways, so switching between them never shows one missing. */
const ALL_PICTURES = [...PINBOARD_PICTURES, ...GALLERY_PICTURES, ...OUTRO_PICTURES];

/**
 * What `bun run video outro` asks for in the address: `sprache` (`en`) and `variante` (`regal`), so the outro of each
 * language is one command. Without them the shelf's language, as the pin board.
 */
function renderChoice(fallback: SeoLanguage): { language: SeoLanguage; variant: Variant } {
  const query = new URLSearchParams(location.search);
  const language = SEO_LANGUAGES.find((id) => id === query.get("sprache")) ?? fallback;
  const variant = VARIANTS.find(([id]) => id === query.get("variante"))?.[0] ?? "pinnwand";
  return { language, variant };
}

/**
 * The outro of the YouTube videos (ideas Y-04 and Y-05, user request, November 2026), reached from /management/ only, in
 * two ways (`VARIANTS`): the games' pictures big one after another, or the intro backwards with the shelf's picture
 * books lighting up – both ending on a card with the address, what the site is in five
 * small signs and a code to scan that leads to the home page. YouTube shows no end screen links on videos made for
 * children, so everything has to be in the picture. Its words follow the shelf's language (🌐).
 */
export function OutroVideo() {
  // The shelf's language; every one of them has its pages on the site, so the code always finds its page.
  const appLanguage = useAppLanguage().id;
  const language = SEO_LANGUAGES.find((id) => id === appLanguage) ?? "en";
  const [variant, setVariant] = useState<Variant>("pinnwand");
  const ready = usePicturesDecoded(ALL_PICTURES);
  if (isRender()) {
    const chosen = renderChoice(language);
    const { seconds, Scene, pictures, schedule } = CLIPS[chosen.variant];
    const scene = (t: number) => <Scene t={t} language={chosen.language} />;
    return <RenderPlay seconds={seconds} scene={scene} schedule={schedule} pictures={pictures} />;
  }
  const { seconds, Scene, schedule } = CLIPS[variant];
  const scene = (t: number) => <Scene t={t} language={language} />;
  return (
    <VideoRecorder
      title="Abspann für die Videos"
      about={
        <>
          „Pinnwand“: Ein Korkbrett mit zwölf Fotos aus den Spielen, alle von Anfang an da, jedes im weißen Rahmen mit einem Wort, was es zeigt; dann wird in
          die Mitte ein Blatt vom Spiralblock gepinnt mit dem Namen „Little Steps to Grow“ (Papa Fuchs mit Kind auf dem o), darunter gelb markiert
          www.littlestepstogrow.com und „Alltagshelfer & Lernspiele“ – ein einziges Bild, ohne Karte danach. Leertaste oder Klick ins Bild hält an und spielt
          weiter. „Bilder aus den Spielen“: erst die zwei Kategorien Alltagshelfer und Lernspiele nebeneinander, dann kommt ein Bild nach dem anderen aus der
          Tiefe groß in die Mitte, mit dem Namen des Spiels darunter, und fliegt weiter, wenn das nächste kommt. „Regal“: Das Buch klappt zu und geht zurück ins
          Regal, die anderen Bilderbücher leuchten nacheinander auf. Diese beiden enden mit derselben Karte: littlestepstogrow.com, fünf kleine Zeichen und ein
          QR-Code zur Startseite – in jedem Video derselbe Abspann, nur in seiner Sprache. Weil YouTube bei Kindervideos keine Links im Abspann zeigt, steht
          alles im Bild. Gestochen scharf macht es <code>bun run video outro --sprache en</code> im Projekt, Bild für Bild (<code>--variante bilder</code> oder{" "}
          <code>--variante regal</code> für die anderen).
        </>
      }
      facts={[
        ["Länge", `${seconds} Sekunden`],
        ["Sprache", `${OWN_NAMES[language]} (wie im Regal)`],
        ["Code führt zu", variant === "pinnwand" ? "kein Code, nur die Adresse" : shortAddress(codeAddress(language))],
        [
          "Ton",
          variant === "pinnwand"
            ? "eigener Klang (Rascheln und zwei Reißnägel für das Blatt in der Mitte, die drei Glockentöne des Intros, Akkord), noch ohne Stimme"
            : variant === "bilder"
              ? "eigener Klang (zwei Töne für die Kategorien, ein Luftzug und ein steigender Ton je Bild, die drei Glockentöne des Intros, Akkord), noch ohne Stimme"
              : "eigener Klang (Zuklappen, Klopfen, ein Ton je Buch, die drei Glockentöne des Intros, Akkord), noch ohne Stimme",
        ],
      ]}
      options={
        <>
          <VideoChoice label="Variante" value={variant} options={VARIANTS} onChange={setVariant} />
        </>
      }
      ready={ready}
      loading="Bilder …"
      fileName={(extension) => `abspann-${variant}-${language}.${extension}`}
      // The paper the outro fades in from, so the lead-in before it is not black.
      stageStyle={{ background: "#fffaf0" }}
      play={(onFinished) => <LivePlay key={variant} seconds={seconds} scene={scene} schedule={schedule} onFinished={onFinished} />}
    />
  );
}
