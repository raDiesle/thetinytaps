import { type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { MenuTop } from "@/components/MenuTop";
import { useFigure } from "@/lib/common";
import type { Daytime } from "@/lib/days";
import { daytimeOf } from "@/lib/days";
import { useAppLanguage } from "@/lib/language";
import { unlockAudio } from "@/lib/sfx";
import { useTimers } from "@/lib/timers";
import { TARGET_LANGUAGES } from "@/content/targetLanguages";
import { preloadSong, SUNG_LANGUAGES, useSongLoad } from "./music";
import { DEFAULT_TEETH_SETTINGS, type TeethSettings } from "./settings";
import { sungLanguageFor } from "./sung";
import { preloadBrushing, TeethPlay } from "./TeethPlay";
import "./teeth.css";
import "./video.css";

/** A video shows the whole routine: the sweets story and the sink before, never the week chart. */
const VIDEO_SETTINGS: TeethSettings = { ...DEFAULT_TEETH_SETTINGS, origin: true, prep: true, week: false };

/** Between the recording's start and the story: a still first frame to cut at, and time for the setup card to be gone. */
const LEAD_IN_MS = 600;

/** The formats tried in turn: MP4 (H.264 + AAC, which YouTube and every editor take as it is), else WebM. */
const VIDEO_TYPES = ["video/mp4;codecs=avc1.640033,mp4a.40.2", "video/mp4;codecs=avc1,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"];

/** Sharp enough for 1080p and more, without files of gigabytes for two and a half minutes. */
const VIDEO_BITS_PER_SECOND = 16_000_000;
const AUDIO_BITS_PER_SECOND = 192_000;

/** Chrome's options for capturing the tab itself, newer than TypeScript's types. */
type TabCaptureOptions = DisplayMediaStreamOptions & {
  preferCurrentTab?: boolean;
  selfBrowserSurface?: "include" | "exclude";
  surfaceSwitching?: "include" | "exclude";
  systemAudio?: "include" | "exclude";
};

/** Chrome's Region Capture: cuts the captured tab down to one element (the 16 : 9 stage). */
interface CropTargetApi {
  fromElement: (element: Element) => Promise<unknown>;
}
type CroppableTrack = MediaStreamTrack & { cropTo?: (target: unknown) => Promise<void> };

/** A recording that runs; `stop` ends it, and the finished file comes to `onSaved`. */
interface Recording {
  stop: () => void;
  /** Whether the tab's sound is in it (Chrome's „Tab-Audio teilen“ was left on). */
  sound: boolean;
}

/** The finished video, to save and to look at. */
interface Saved {
  url: string;
  name: string;
  bytes: number;
  sound: boolean;
}

/** What the page shows: the choices before, the brushing (recorded or only played), or the video made. */
type Phase = { kind: "setup"; note?: string } | { kind: "lead" } | { kind: "play"; recording: boolean } | { kind: "saving" } | { kind: "done"; saved?: Saved };

/** Whether this browser can record its own tab (Chrome, Edge); elsewhere only playing for another recorder is offered. */
const canRecord = () => typeof navigator !== "undefined" && !!navigator.mediaDevices?.getDisplayMedia && typeof MediaRecorder !== "undefined";

/**
 * Asks to capture this very tab with its sound, cuts it to `stage` where the browser can, and records it; the file comes
 * to `onSaved` once `stop` is called or the grown-up ends the sharing in the browser's bar.
 */
async function recordTab(stage: HTMLElement, onSaved: (blob: Blob, sound: boolean) => void): Promise<Recording> {
  const options: TabCaptureOptions = {
    video: { frameRate: 30 },
    // The tab's sound is captured and still heard while recording.
    audio: { suppressLocalAudioPlayback: false } as MediaTrackConstraints,
    preferCurrentTab: true,
    selfBrowserSurface: "include",
    surfaceSwitching: "exclude",
    systemAudio: "exclude",
  };
  const stream = await navigator.mediaDevices.getDisplayMedia(options);
  const [track] = stream.getVideoTracks() as CroppableTrack[];
  const crop = (window as unknown as { CropTarget?: CropTargetApi }).CropTarget;
  if (crop && track?.cropTo) await track.cropTo(await crop.fromElement(stage));
  const sound = stream.getAudioTracks().length > 0;
  const mimeType = VIDEO_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: VIDEO_BITS_PER_SECOND, audioBitsPerSecond: AUDIO_BITS_PER_SECOND });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  recorder.onstop = () => {
    for (const each of stream.getTracks()) each.stop();
    onSaved(new Blob(chunks, { type: recorder.mimeType }), sound);
  };
  const stop = () => {
    if (recorder.state !== "inactive") recorder.stop();
  };
  // „Freigabe beenden“ in the browser's bar ends the recording too, and keeps what was recorded.
  track?.addEventListener("ended", stop);
  recorder.start(1000);
  return { stop, sound };
}

/** Offers the file as a download, as if a link to it were clicked. */
function download(saved: Saved) {
  const link = document.createElement("a");
  link.href = saved.url;
  link.download = saved.name;
  link.click();
}

/** How many pixels the stage gives the video: its size on the screen times the screen's pixel density. */
function useStagePixels(stage: RefObject<HTMLDivElement | null>) {
  const [pixels, setPixels] = useState<{ width: number; height: number } | null>(null);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      setPixels({ width: Math.round(width * devicePixelRatio), height: Math.round(height * devicePixelRatio) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [stage]);
  return pixels;
}

/**
 * Zähne putzen played for a YouTube video (user request, November 2026), reached from /management/: the whole routine
 * once – story, sink, the seven sung steps, the end – on a 16 : 9 stage with nothing but the picture (no controls, no
 * corner, no week chart, no buttons, no trophy) and nothing kept (no star, no play time). In Chrome the page records its
 * own tab with its sound, cut to the stage, and saves the file when the song has rung out; elsewhere it only plays, in
 * fullscreen, for a recorder of one's own. Language and child follow the shelf (🌐, the stickers); morning or evening is
 * chosen here, since a video is made once for both.
 */
export function TeethVideo() {
  const language = useAppLanguage();
  const figure = useFigure();
  const sung = sungLanguageFor(language.id, SUNG_LANGUAGES);
  const song = useSongLoad(sung);
  const [daytime, setDaytime] = useState<Daytime>(daytimeOf);
  const [phase, setPhase] = useState<Phase>({ kind: "setup" });
  const stage = useRef<HTMLDivElement>(null);
  const recording = useRef<Recording | null>(null);
  const pixels = useStagePixels(stage);
  const { later } = useTimers();

  // Everything the brushing plays is fetched while the grown-up reads this page, so nothing comes late in the video.
  useEffect(() => {
    preloadSong(sung);
    preloadBrushing(language.id);
  }, [sung, language.id]);

  const fileName = (type: string) =>
    `zaehne-putzen-${language.id}-${daytime === "morning" ? "morgens" : "abends"}-${figure === "girl" ? "maedchen" : "junge"}.${type.includes("mp4") ? "mp4" : "webm"}`;

  const onSaved = useCallback(
    (blob: Blob, sound: boolean) => {
      recording.current = null;
      const saved = { url: URL.createObjectURL(blob), name: fileName(blob.type), bytes: blob.size, sound };
      download(saved);
      setPhase({ kind: "done", saved });
    },
    [language.id, daytime, figure],
  );

  // The old video's file is let go when a new one is made or the page is left.
  const savedUrl = phase.kind === "done" ? phase.saved?.url : undefined;
  useEffect(() => (savedUrl ? () => URL.revokeObjectURL(savedUrl) : undefined), [savedUrl]);

  /** The brush is away and the song has rung out: the recording ends and is saved, or the playing simply stops. */
  const finish = useCallback(() => {
    if (recording.current) {
      setPhase({ kind: "saving" });
      recording.current.stop();
    } else setPhase({ kind: "done" });
  }, []);

  const record = async () => {
    unlockAudio();
    const element = stage.current;
    if (!element) return;
    try {
      // The setup card goes first: the stage is recorded with whatever lies over it.
      setPhase({ kind: "lead" });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      recording.current = await recordTab(element, onSaved);
      later(() => setPhase({ kind: "play", recording: true }), LEAD_IN_MS);
    } catch {
      // The grown-up said no to sharing the tab, or the browser can't.
      recording.current = null;
      setPhase({ kind: "setup", note: "Keine Aufnahme: Das Teilen des Tabs wurde abgebrochen oder ist hier nicht möglich." });
    }
  };

  const playOnly = () => {
    unlockAudio();
    void document.documentElement.requestFullscreen?.().catch(() => undefined);
    setPhase({ kind: "lead" });
    later(() => setPhase({ kind: "play", recording: false }), LEAD_IN_MS);
  };

  // Esc ends a recording early (keeping what is there) or stops the playing.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || (phase.kind !== "play" && phase.kind !== "lead")) return;
      if (recording.current) finish();
      else setPhase({ kind: "setup" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase.kind, finish]);

  // Left in the middle: the capture ends with the page.
  useEffect(() => () => recording.current?.stop(), []);

  const languageName = TARGET_LANGUAGES.find((l) => l.id === language.id)?.label ?? language.id;
  const sungName = TARGET_LANGUAGES.find((l) => l.id === sung)?.label ?? sung;
  const running = phase.kind === "lead" || phase.kind === "play" || phase.kind === "saving";
  const sharp = pixels && pixels.height >= 1080;

  return (
    <div className={`teeth-video${running ? " running" : ""}`}>
      <div className="teeth-video-stage" ref={stage}>
        {phase.kind === "play" && <TeethPlay settings={VIDEO_SETTINGS} video={{ daytime, onFinished: finish }} />}
      </div>

      {phase.kind === "setup" && (
        <div className="teeth-video-card">
          <MenuTop to="/management/" back="Management" />
          <h1>Zähne putzen fürs Video</h1>
          <p>
            Spielt das ganze Zähneputzen einmal durch – Geschichte, Waschbecken, die sieben Strophen und das Ende – nur das Bild im Format 16 : 9, ohne Knöpfe,
            Wochenbild oder Pokal. Es zählt nichts: kein Stern, keine Spielzeit.
          </p>
          <dl className="teeth-video-facts">
            <dt>Sprache</dt>
            <dd>
              {languageName}
              {sung !== language.id && ` (Lied: ${sungName}, auf ${languageName} gibt es keins)`}
            </dd>
            <dt>Kind</dt>
            <dd>{figure === "girl" ? "Mädchen" : "Junge"}</dd>
            <dt>Video</dt>
            <dd className={sharp ? undefined : "teeth-video-warn"}>
              {pixels ? `${pixels.width} × ${pixels.height} Pixel` : "…"}
              {pixels && !sharp && " – für 1080p das Fenster größer ziehen"}
            </dd>
            <dt>Lied</dt>
            <dd>{song.ready ? "geladen" : `lädt … ${Math.round(song.progress * 100)} %`}</dd>
          </dl>
          <p className="teeth-video-small">Sprache und Kind stellt man im Regal um (🌐 und die Sticker).</p>
          <div className="teeth-video-choice" role="radiogroup" aria-label="Tageszeit">
            {(
              [
                ["morning", "☀️ Morgens"],
                ["evening", "🌙 Abends"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={daytime === value}
                className={daytime === value ? "chosen" : undefined}
                onClick={() => setDaytime(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {phase.note && <p className="teeth-video-warn">{phase.note}</p>}
          <div className="teeth-video-actions">
            {canRecord() && (
              <button type="button" className="teeth-video-go" disabled={!song.ready} onClick={() => void record()}>
                🎬 Aufnehmen
              </button>
            )}
            <button type="button" disabled={!song.ready} onClick={playOnly}>
              ▶ Nur abspielen
            </button>
          </div>
          <p className="teeth-video-small">
            {canRecord()
              ? "🎬 Der Browser fragt, ob er diesen Tab teilen darf: „Tab-Audio teilen“ angehakt lassen. Aufgenommen wird nur das Bild; am Ende speichert er das Video in den Downloads. "
              : "Dieser Browser kann den Tab nicht selbst aufnehmen (das kann Chrome). "}
            ▶ spielt im Vollbild, für ein eigenes Aufnahmeprogramm. Esc bricht ab.
          </p>
        </div>
      )}

      {phase.kind === "saving" && <p className="teeth-video-card teeth-video-small">Video wird gespeichert …</p>}

      {phase.kind === "done" && (
        <div className="teeth-video-card">
          <MenuTop to="/management/" back="Management" />
          {phase.saved ? (
            <>
              <h1>Video gespeichert</h1>
              <p>
                {phase.saved.name} ({(phase.saved.bytes / 1e6).toFixed(0)} MB) liegt in den Downloads.
              </p>
              {!phase.saved.sound && <p className="teeth-video-warn">Ohne Ton aufgenommen: beim Teilen „Tab-Audio teilen“ anhaken.</p>}
              {/* biome-ignore lint/a11y/useMediaCaption: the video is the brushing itself, its words are sung. */}
              <video className="teeth-video-preview" src={phase.saved.url} controls />
            </>
          ) : (
            <h1>Fertig</h1>
          )}
          <div className="teeth-video-actions">
            {phase.saved && (
              <button type="button" onClick={() => phase.saved && download(phase.saved)}>
                Nochmal speichern
              </button>
            )}
            <button type="button" className="teeth-video-go" onClick={() => setPhase({ kind: "setup" })}>
              Neue Aufnahme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
