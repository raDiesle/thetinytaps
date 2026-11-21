import { type RefObject, useEffect, useState } from "react";

// Recording a page's own tab with its sound, for the YouTube videos made from the games on /management/ (Zähne putzen's
// `TeethVideo`, Aufs Töpfchen's `ParentsVideo`): Chrome captures this very tab (`getDisplayMedia` with
// `preferCurrentTab`), cuts it to the 16 : 9 stage (Region Capture) and records it as MP4, else WebM. One place for it,
// so a better format or sharper picture reaches every video at once (idea Y-25).

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
export interface Recording {
  stop: () => void;
  /** Whether the tab's sound is in it (Chrome's „Tab-Audio teilen“ was left on). */
  sound: boolean;
}

/** The finished video, to save and to look at. */
export interface SavedVideo {
  url: string;
  name: string;
  bytes: number;
  sound: boolean;
}

/** Whether this browser can record its own tab (Chrome, Edge); elsewhere only playing for another recorder is offered. */
export const canRecord = () => typeof navigator !== "undefined" && !!navigator.mediaDevices?.getDisplayMedia && typeof MediaRecorder !== "undefined";

/** The file's ending for what the recorder made. */
export const videoExtension = (type: string) => (type.includes("mp4") ? "mp4" : "webm");

/**
 * Asks to capture this very tab with its sound, cuts it to `stage` where the browser can, and records it; the file comes
 * to `onSaved` once `stop` is called or the grown-up ends the sharing in the browser's bar.
 */
export async function recordTab(stage: HTMLElement, onSaved: (blob: Blob, sound: boolean) => void): Promise<Recording> {
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
export function downloadVideo(saved: SavedVideo) {
  const link = document.createElement("a");
  link.href = saved.url;
  link.download = saved.name;
  link.click();
}

/** How many pixels the stage gives the video: its size on the screen times the screen's pixel density. */
export function useStagePixels(stage: RefObject<HTMLDivElement | null>) {
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
