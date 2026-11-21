import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { audioContext, speaker } from "@/lib/sfx";
import { CANVAS } from "./canvas";
import { wavBytes } from "./sound";

// What every video drawn frame by frame shares (the intro, the outro): a 1920 × 1080 canvas scaled to its stage, the
// live play following the clock with its sound laid onto the same start, and the handle `bun run video` drives with
// `?render` to step through it frame by frame.

/** How far ahead the sound is laid onto the audio context's clock, so its first note is never late against the picture. */
const SOUND_AHEAD_SECONDS = 0.05;

/** What `bun run video` drives in the page (only with `?render`), as `window.__video`. */
export interface VideoRenderApi {
  seconds: number;
  /** Shows the frame at second `t` and resolves once it is painted. */
  seek: (t: number) => Promise<void>;
  /** The video's sound rendered without playing, as a WAV file in base64. */
  sound: () => Promise<string>;
}

/** Whether the page is opened by `bun run video` to be stepped through (`?render`). */
export const isRender = () => typeof location !== "undefined" && new URLSearchParams(location.search).has("render");

/** Waits until every one of `pictures` is decoded, so no frame shows one missing. */
export const decodePictures = (pictures: readonly string[]) =>
  Promise.all(
    pictures.map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode().catch(() => undefined);
    }),
  );

/** Whether `pictures` are decoded, for the recorder's `ready`. */
export function usePicturesDecoded(pictures: readonly string[]) {
  const [ready, setReady] = useState(false);
  const list = useRef(pictures);
  useEffect(() => {
    void decodePictures(list.current).then(() => setReady(true));
  }, []);
  return ready;
}

const nextPaint = () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

/** The canvas's scale on this screen: the box's width against the canvas's 1920 pixels. */
function useFit(box: React.RefObject<HTMLDivElement | null>) {
  const [fit, setFit] = useState(1);
  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () => setFit(element.getBoundingClientRect().width / CANVAS.width);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [box]);
  return fit;
}

/** The 1920 × 1080 canvas, scaled to fill the box it lies in. */
export function Fitted({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const fit = useFit(box);
  return (
    <div className="vi-box" ref={box}>
      <div className="vi-fit" style={{ transform: `scale(${fit})` }}>
        {children}
      </div>
    </div>
  );
}

/** A video's frame at a second, its length and its sound: what the live play and the render need of it. */
interface Clip {
  seconds: number;
  scene: (t: number) => ReactNode;
  /** Lays the sound onto `ac` from `at` seconds of its clock into `out`. */
  schedule: (ac: BaseAudioContext, out: AudioNode, at: number) => void;
}

/** The video played live on the recorder's stage: the frame follows the clock, the sound was laid onto the same start. */
export function LivePlay({ seconds, scene, schedule, onFinished }: Clip & { onFinished: () => void }) {
  const [t, setT] = useState(0);
  const finished = useRef(onFinished);
  finished.current = onFinished;
  const sound = useRef(schedule);
  useEffect(() => {
    const ac = audioContext();
    if (ac) sound.current(ac, speaker(ac), ac.currentTime + SOUND_AHEAD_SECONDS);
    const start = performance.now() + SOUND_AHEAD_SECONDS * 1000;
    let frame = requestAnimationFrame(function tick(now) {
      const second = Math.max(0, (now - start) / 1000);
      setT(Math.min(second, seconds));
      if (second >= seconds) finished.current();
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [seconds]);
  return <Fitted>{scene(t)}</Fitted>;
}

/** Renders a schedule of sound without playing it (for the video file): `seconds` long, at 48 kHz in stereo. */
export async function renderSound(seconds: number, schedule: Clip["schedule"]): Promise<AudioBuffer> {
  const ac = new OfflineAudioContext(2, Math.ceil(48000 * seconds), 48000);
  const limiter = ac.createDynamicsCompressor();
  limiter.threshold.value = -3;
  limiter.ratio.value = 20;
  limiter.connect(ac.destination);
  schedule(ac, limiter, 0);
  return ac.startRendering();
}

/** For `bun run video`: the window is the canvas, and the tool steps through it frame by frame. */
export function RenderPlay({ seconds, scene, schedule, pictures }: Clip & { pictures: readonly string[] }) {
  const [t, setT] = useState(0);
  const clip = useRef({ seconds, schedule, pictures });
  useEffect(() => {
    const { seconds, schedule, pictures } = clip.current;
    const api: VideoRenderApi = {
      seconds,
      seek: async (second) => {
        await decodePictures(pictures);
        flushSync(() => setT(second));
        await nextPaint();
      },
      sound: async () => {
        const bytes = wavBytes(await renderSound(seconds, schedule));
        let text = "";
        for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        return btoa(text);
      },
    };
    (window as unknown as { __video?: VideoRenderApi }).__video = api;
  }, []);
  return (
    <div className="vi-render">
      <Fitted>{scene(t)}</Fitted>
    </div>
  );
}
