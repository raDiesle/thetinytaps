import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { MenuTop } from "@/components/MenuTop";
import { audioContext, speaker, unlockAudio } from "@/lib/sfx";
import { canRecord, download, type Recording, recordTab, type Saved, useStagePixels } from "../tabRecording";
import { INTRO_PICTURES, IntroScene } from "./IntroScene";
import { renderIntroSound, scheduleIntroSound, wavBytes } from "./introSound";
import { CANVAS, INTRO_SECONDS } from "./timeline";
import "./intro.css";

/** A still first frame before the motion, to cut at, and time for the card over the stage to be gone. */
const LEAD_SECONDS = 0.5;

/** What the page shows: the card before, the intro playing (recorded or not), or the video made. */
type Phase = { kind: "setup"; note?: string } | { kind: "play"; recording: boolean } | { kind: "saving" } | { kind: "done"; saved?: Saved };

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

/**
 * The intro of the YouTube videos (Y-01, user request, November 2026), reached from /management/ only: a shelf of
 * picture books, the Fun for Both book coming out and opening, and on its first page the name with Papa Fox and his
 * child sitting down on the o, with a sound of its own. It plays here and, in Chrome, records itself like the brushing's
 * video page; `bun run video intro` makes the sharp file frame by frame through `?render`.
 */
export function IntroVideo() {
  const render = typeof location !== "undefined" && new URLSearchParams(location.search).has("render");
  const [t, setT] = useState(render ? 0 : INTRO_SECONDS);
  const [phase, setPhase] = useState<Phase>({ kind: "setup" });
  const stage = useRef<HTMLDivElement>(null);
  const recording = useRef<Recording | null>(null);
  const fit = useFit(stage);
  const pixels = useStagePixels(stage);

  useEffect(() => {
    void picturesDecoded();
  }, []);

  // The tool's handle: frames on demand, and the sound as a file.
  useEffect(() => {
    if (!render) return;
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
  }, [render]);

  const onSaved = useCallback((blob: Blob, sound: boolean) => {
    recording.current = null;
    const saved = { url: URL.createObjectURL(blob), name: `intro-fun-for-both.${blob.type.includes("mp4") ? "mp4" : "webm"}`, bytes: blob.size, sound };
    download(saved);
    setPhase({ kind: "done", saved });
  }, []);

  const savedUrl = phase.kind === "done" ? phase.saved?.url : undefined;
  useEffect(() => (savedUrl ? () => URL.revokeObjectURL(savedUrl) : undefined), [savedUrl]);

  /** The intro has rung out: the recording ends and is saved, or the playing simply stops. */
  const finish = useCallback(() => {
    if (recording.current) {
      setPhase({ kind: "saving" });
      recording.current.stop();
    } else setPhase({ kind: "setup" });
  }, []);

  // Playing: the frame follows the clock, and the sound was laid onto the audio context's clock at the same start.
  const playing = phase.kind === "play";
  useEffect(() => {
    if (!playing) return;
    const ac = audioContext();
    if (ac) scheduleIntroSound(ac, speaker(ac), ac.currentTime + LEAD_SECONDS);
    const start = performance.now() + LEAD_SECONDS * 1000;
    let frame = requestAnimationFrame(function tick(now) {
      const second = Math.max(0, (now - start) / 1000);
      setT(Math.min(second, INTRO_SECONDS));
      if (second >= INTRO_SECONDS) finish();
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, finish]);

  const play = async (record: boolean) => {
    unlockAudio();
    await picturesDecoded();
    setT(0);
    if (record) {
      const element = stage.current;
      if (!element) return;
      try {
        setPhase({ kind: "saving" });
        await nextPaint();
        recording.current = await recordTab(element, onSaved);
      } catch {
        recording.current = null;
        setPhase({ kind: "setup", note: "Keine Aufnahme: Das Teilen des Tabs wurde abgebrochen oder ist hier nicht möglich." });
        return;
      }
    }
    setPhase({ kind: "play", recording: record });
  };

  // Esc ends a recording early (keeping what is there) or stops the playing.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase.kind === "play") finish();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase.kind, finish]);

  useEffect(() => () => recording.current?.stop(), []);

  const sharp = pixels && pixels.height >= 1080;
  return (
    <div className={`vi-video${render ? " vi-render" : ""}${playing ? " running" : ""}`}>
      <div className="vi-stage" ref={stage}>
        <div className="vi-fit" style={{ transform: `scale(${fit})` }}>
          <IntroScene t={t} />
        </div>
      </div>

      {!render && phase.kind === "setup" && (
        <div className="vi-card">
          <MenuTop to="/management/" back="Management" />
          <h1>Intro für die Videos</h1>
          <p>
            Das Bücherregal, das Fun-for-Both-Buch kommt heraus und schlägt auf, auf seiner ersten Seite der Name mit Papa Fuchs und seinem Kind auf dem o –{" "}
            {INTRO_SECONDS.toLocaleString("de")} Sekunden mit eigenem Klang, im Format 16 : 9. Noch nirgends auf der Seite zu sehen, nur hier.
          </p>
          <p className={sharp ? "vi-small" : "vi-small vi-warn"}>
            Bild: {pixels ? `${pixels.width} × ${pixels.height} Pixel` : "…"}
            {pixels && !sharp && " – für 1080p das Fenster größer ziehen"}
          </p>
          {phase.note && <p className="vi-warn">{phase.note}</p>}
          <div className="vi-actions">
            <button type="button" className="vi-go" onClick={() => void play(false)}>
              ▶ Abspielen
            </button>
            {canRecord() && (
              <button type="button" onClick={() => void play(true)}>
                🎬 Aufnehmen
              </button>
            )}
          </div>
          <p className="vi-small">
            🎬 nimmt den Tab mit Ton auf („Tab-Audio teilen“ angehakt lassen) und speichert das Video in den Downloads. Gestochen scharf in 1920 × 1080 bei 60
            Bildern pro Sekunde macht es <code>bun run video intro</code> im Projekt, Bild für Bild.
          </p>
        </div>
      )}

      {!render && phase.kind === "done" && phase.saved && (
        <div className="vi-card">
          <MenuTop to="/management/" back="Management" />
          <h1>Video gespeichert</h1>
          <p>
            {phase.saved.name} ({(phase.saved.bytes / 1e6).toFixed(1)} MB) liegt in den Downloads.
          </p>
          {!phase.saved.sound && <p className="vi-warn">Ohne Ton aufgenommen: beim Teilen „Tab-Audio teilen“ anhaken.</p>}
          {/* biome-ignore lint/a11y/useMediaCaption: the intro has no words, only its sound. */}
          <video className="vi-preview" src={phase.saved.url} controls />
          <div className="vi-actions">
            <button type="button" onClick={() => phase.saved && download(phase.saved)}>
              Nochmal speichern
            </button>
            <button type="button" className="vi-go" onClick={() => setPhase({ kind: "setup" })}>
              Zurück
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
