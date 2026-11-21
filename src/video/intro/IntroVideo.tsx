import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { VideoRecorder } from "@/components/VideoRecorder";
import { audioContext, speaker } from "@/lib/sfx";
import { INTRO_PICTURES, IntroScene } from "./IntroScene";
import { renderIntroSound, scheduleIntroSound, wavBytes } from "./introSound";
import { CANVAS, INTRO_SECONDS } from "./timeline";
import "./intro.css";

/** How far ahead the sound is laid onto the audio context's clock, so its first note is never late against the picture. */
const SOUND_AHEAD_SECONDS = 0.05;

/** What `bun run video intro` drives in the page (only with `?render`). */
export interface IntroRenderApi {
  seconds: number;
  /** Shows the frame at second `t` and resolves once it is painted. */
  seek: (t: number) => Promise<void>;
  /** The intro's sound rendered without playing, as a WAV file in base64. */
  sound: () => Promise<string>;
}

/** Waits until every picture of the intro is decoded, so no frame shows one missing. */
const picturesDecoded = () =>
  Promise.all(
    INTRO_PICTURES.map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode().catch(() => undefined);
    }),
  );

const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

/** The canvas's scale on this screen: the stage's width against the canvas's 1920 pixels. */
function useFit(stage: React.RefObject<HTMLDivElement | null>) {
  const [fit, setFit] = useState(1);
  useLayoutEffect(() => {
    const element = stage.current;
    if (!element) return;
    const measure = () => setFit(element.getBoundingClientRect().width / CANVAS.width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [stage]);
  return fit;
}

/** The 1920 × 1080 canvas at second `t`, scaled to fill the box it lies in. */
function FittedScene({ t }: { t: number }) {
  const box = useRef<HTMLDivElement>(null);
  const fit = useFit(box);
  return (
    <div className="vi-box" ref={box}>
      <div className="vi-fit" style={{ transform: `scale(${fit})` }}>
        <IntroScene t={t} />
      </div>
    </div>
  );
}

/** The intro played live on the recorder's stage: the frame follows the clock, the sound was laid onto the same start. */
function IntroPlay({ onFinished }: { onFinished: () => void }) {
  const [t, setT] = useState(0);
  const finished = useRef(onFinished);
  finished.current = onFinished;
  useEffect(() => {
    const ac = audioContext();
    if (ac) scheduleIntroSound(ac, speaker(ac), ac.currentTime + SOUND_AHEAD_SECONDS);
    const start = performance.now() + SOUND_AHEAD_SECONDS * 1000;
    let frame = requestAnimationFrame(function tick(now) {
      const second = Math.max(0, (now - start) / 1000);
      setT(Math.min(second, INTRO_SECONDS));
      if (second >= INTRO_SECONDS) finished.current();
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <FittedScene t={t} />;
}

/** For `bun run video intro`: the window is the canvas, and the tool steps through it frame by frame. */
function IntroRender() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const api: IntroRenderApi = {
      seconds: INTRO_SECONDS,
      seek: async (second) => {
        await picturesDecoded();
        flushSync(() => setT(second));
        await nextPaint();
      },
      sound: async () => {
        const bytes = wavBytes(await renderIntroSound(INTRO_SECONDS));
        let text = "";
        for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        return btoa(text);
      },
    };
    (window as unknown as { __intro?: IntroRenderApi }).__intro = api;
  }, []);
  return (
    <div className="vi-render">
      <FittedScene t={t} />
    </div>
  );
}

/**
 * The intro of the YouTube videos (Y-01, user request, November 2026), reached from /management/ only: a shelf of
 * picture books, the Fun for Both book coming out and opening, and on its first page the name with Papa Fox and his
 * child sitting down on the o, with a sound of its own. It plays and records in the shared `VideoRecorder` like the
 * games' videos; `bun run video intro` makes the sharp file frame by frame through `?render`.
 */
export function IntroVideo() {
  const render = typeof location !== "undefined" && new URLSearchParams(location.search).has("render");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void picturesDecoded().then(() => setReady(true));
  }, []);
  if (render) return <IntroRender />;
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
      play={(onFinished) => <IntroPlay onFinished={onFinished} />}
    />
  );
}
