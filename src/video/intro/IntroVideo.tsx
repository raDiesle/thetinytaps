import { VideoRecorder } from "@/components/VideoRecorder";
import { isRender, LivePlay, RenderPlay, usePicturesDecoded } from "../frames";
import { INTRO_PICTURES, IntroScene } from "./IntroScene";
import { scheduleIntroSound } from "./introSound";
import { INTRO_SECONDS } from "./timeline";
import "./intro.css";

const scene = (t: number) => <IntroScene t={t} />;

/**
 * The intro of the YouTube videos (Y-01, user request, November 2026), reached from /management/ only: a shelf of
 * picture books, the Fun for Both book coming out and opening, and on its first page the name with Papa Fox and his
 * child sitting down on the o, with a sound of its own. It plays and records in the shared `VideoRecorder` like the
 * games' videos; `bun run video intro` makes the sharp file frame by frame through `?render`.
 */
export function IntroVideo() {
  const ready = usePicturesDecoded(INTRO_PICTURES);
  if (isRender()) return <RenderPlay seconds={INTRO_SECONDS} scene={scene} schedule={scheduleIntroSound} pictures={INTRO_PICTURES} />;
  return (
    <VideoRecorder
      title="Intro für die Videos"
      about={
        <>
          Das Bücherregal, das Fun-for-Both-Buch kommt heraus und schlägt auf, auf seiner ersten Seite der Name mit Papa Fuchs und seinem Kind auf dem o. Noch
          nirgends auf der Seite zu sehen, nur hier. Gestochen scharf in 1920 × 1080 bei 60 Bildern pro Sekunde macht es <code>bun run video intro</code> im
          Projekt, Bild für Bild.
        </>
      }
      facts={[
        ["Länge", `${INTRO_SECONDS.toLocaleString("de")} Sekunden`],
        ["Ton", "eigener Klang (Klopfen, Umblättern, drei Glockentöne, Pfoten, Akkord), noch ohne Stimme"],
      ]}
      ready={ready}
      loading="Bilder …"
      fileName={(extension) => `intro-fun-for-both.${extension}`}
      // The paper the intro fades in from, so the lead-in before it is not black.
      stageStyle={{ background: "#fffaf0" }}
      play={(onFinished) => <LivePlay seconds={INTRO_SECONDS} scene={scene} schedule={scheduleIntroSound} onFinished={onFinished} />}
    />
  );
}
