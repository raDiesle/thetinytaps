import { type CSSProperties, type ReactNode, type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { YouTubeTexts } from "@/components/YouTubeTexts";
import type { YouTubeVideoId } from "@/video/youtubeTexts";
import { MenuTop } from "@/components/MenuTop";
import { unlockAudio } from "@/lib/sfx";
import { useTimers } from "@/lib/timers";
import "./videoRecorder.css";

/** Between the recording's start and the play: a still first frame to cut at, and time for the setup card to be gone. */
const LEAD_IN_MS = 600;

/** The formats tried in turn: MP4 (H.264 + AAC, which YouTube and every editor take as it is), else WebM. */
const VIDEO_TYPES = ["video/mp4;codecs=avc1.640033,mp4a.40.2", "video/mp4;codecs=avc1,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"];

/** Sharp enough for 1080p and more, without files of gigabytes for a few minutes. */
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

/** What the page shows: the choices before, the play (recorded or only played), or the video made. */
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

/** One choice of a few before the recording (morning or evening, what Tapsi needs …), as a row of buttons. */
export function VideoChoice<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  /** What is chosen, shown before the row and read out. */
  label: string;
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="video-rec-choice" role="radiogroup" aria-label={label}>
      <span className="video-rec-choice-label">{label}</span>
      {options.map(([option, name]) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          className={value === option ? "chosen" : undefined}
          onClick={() => onChange(option)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

/**
 * The frame every game's YouTube video is made in (idea Y-25), on a hidden page for grown-ups reached from /management/:
 * a 16 : 9 stage as big as the window allows, a card before with what the video will be and its choices, then the play
 * alone on the stage. In Chrome „🎬 Aufnehmen“ records the tab itself with its sound (`getDisplayMedia` with
 * `preferCurrentTab`, cut to the stage by Region Capture, `MediaRecorder` as MP4, else WebM) and saves the file once the
 * play calls its `onFinished`; „▶ Nur abspielen“ plays in fullscreen for a recorder of one's own; Esc stops early (a
 * recording keeps what is there). A game gives only its play, its choices, its facts and when everything is loaded.
 */
export function VideoRecorder({
  title,
  about,
  facts,
  options,
  ready,
  loading,
  fileName,
  stageStyle,
  youtube,
  play,
}: {
  /** The card's heading, German like the rest of /management/. */
  title: string;
  /** What the video shows, in a sentence or two. */
  about: ReactNode;
  /** Rows of what the video will be (language, child, song …); the video's size in pixels is added below them. */
  facts: readonly (readonly [string, ReactNode])[];
  /** The game's choices before the recording (`VideoChoice` rows). */
  options?: ReactNode;
  /** Everything the play needs is loaded, so nothing comes late in the video: only then can it start. */
  ready: boolean;
  /** What still loads while not `ready`, shown as a fact („lädt … 40 %“). */
  loading?: string;
  /** The saved file's name for its extension. */
  fileName: (extension: "mp4" | "webm") => string;
  /** The stage's look before the play draws (its background), so the first frames are not black. */
  stageStyle?: CSSProperties;
  /** Which video it is in `YOUTUBE_VIDEOS`, for its title and description to copy into YouTube Studio (Y-18). */
  youtube?: YouTubeVideoId;
  /** The play, mounted on the stage while it runs; it calls `onFinished` when the video should end. */
  play: (onFinished: () => void) => ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>({ kind: "setup" });
  const stage = useRef<HTMLDivElement>(null);
  const recording = useRef<Recording | null>(null);
  const pixels = useStagePixels(stage);
  const { later } = useTimers();
  const nameFor = useRef(fileName);
  nameFor.current = fileName;

  const onSaved = useCallback((blob: Blob, sound: boolean) => {
    recording.current = null;
    const saved = { url: URL.createObjectURL(blob), name: nameFor.current(blob.type.includes("mp4") ? "mp4" : "webm"), bytes: blob.size, sound };
    download(saved);
    setPhase({ kind: "done", saved });
  }, []);

  // The old video's file is let go when a new one is made or the page is left.
  const savedUrl = phase.kind === "done" ? phase.saved?.url : undefined;
  useEffect(() => (savedUrl ? () => URL.revokeObjectURL(savedUrl) : undefined), [savedUrl]);

  /** The play is over: the recording ends and is saved, or the playing simply stops. */
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

  const running = phase.kind === "lead" || phase.kind === "play" || phase.kind === "saving";
  const sharp = pixels && pixels.height >= 1080;

  return (
    <div className={`video-rec${running ? " running" : ""}`}>
      <div className="video-rec-stage" ref={stage} style={stageStyle}>
        {phase.kind === "play" && play(finish)}
      </div>

      {phase.kind === "setup" && (
        <div className="video-rec-card">
          <MenuTop to="/management/" back="Management" />
          <h1>{title}</h1>
          <p>{about}</p>
          <dl className="video-rec-facts">
            {facts.map(([name, value]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div>
              <dt>Video</dt>
              <dd className={sharp ? undefined : "video-rec-warn"}>
                {pixels ? `${pixels.width} × ${pixels.height} Pixel` : "…"}
                {pixels && !sharp && " – für 1080p das Fenster größer ziehen"}
              </dd>
            </div>
            <div>
              <dt>Geladen</dt>
              <dd>{ready ? "alles" : (loading ?? "lädt …")}</dd>
            </div>
          </dl>
          {options}
          {phase.note && <p className="video-rec-warn">{phase.note}</p>}
          <div className="video-rec-actions">
            {canRecord() && (
              <button type="button" className="video-rec-go" disabled={!ready} onClick={() => void record()}>
                🎬 Aufnehmen
              </button>
            )}
            <button type="button" disabled={!ready} onClick={playOnly}>
              ▶ Nur abspielen
            </button>
          </div>
          <p className="video-rec-small">
            {canRecord()
              ? "🎬 Der Browser fragt, ob er diesen Tab teilen darf: „Tab-Audio teilen“ angehakt lassen. Aufgenommen wird nur das Bild; am Ende speichert er das Video in den Downloads. "
              : "Dieser Browser kann den Tab nicht selbst aufnehmen (das kann Chrome). "}
            ▶ spielt im Vollbild, für ein eigenes Aufnahmeprogramm. Esc bricht ab.
          </p>
          {youtube && <YouTubeTexts video={youtube} />}
        </div>
      )}

      {phase.kind === "saving" && <p className="video-rec-card video-rec-small">Video wird gespeichert …</p>}

      {phase.kind === "done" && (
        <div className="video-rec-card">
          <MenuTop to="/management/" back="Management" />
          {phase.saved ? (
            <>
              <h1>Video gespeichert</h1>
              <p>
                {phase.saved.name} ({(phase.saved.bytes / 1e6).toFixed(0)} MB) liegt in den Downloads.
              </p>
              {!phase.saved.sound && <p className="video-rec-warn">Ohne Ton aufgenommen: beim Teilen „Tab-Audio teilen“ anhaken.</p>}
              {/* biome-ignore lint/a11y/useMediaCaption: the video is the game itself, its words are its own voice and song. */}
              <video className="video-rec-preview" src={phase.saved.url} controls />
            </>
          ) : (
            <h1>Fertig</h1>
          )}
          <div className="video-rec-actions">
            {phase.saved && (
              <button type="button" onClick={() => phase.saved && download(phase.saved)}>
                Nochmal speichern
              </button>
            )}
            <button type="button" className="video-rec-go" onClick={() => setPhase({ kind: "setup" })}>
              Neue Aufnahme
            </button>
          </div>
          {phase.saved && youtube && <YouTubeTexts video={youtube} />}
        </div>
      )}
    </div>
  );
}
