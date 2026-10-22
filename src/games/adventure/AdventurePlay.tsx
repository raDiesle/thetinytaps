import { useEffect, useRef, useState } from "react";
import {
  playChime,
  playKnock,
  playPop,
  playRumble,
  playSplash,
  playTweet,
  playTwinkle,
  playWhoosh,
  playDrum,
} from "@/lib/sfx";
import { speak, stopSpeaking } from "@/lib/speech";
import { useWakeLock } from "@/lib/wakeLock";
import { movement } from "./library/movements";
import { CALM_PACE, type AdventureSettings } from "./settings";
import type { Cue, Story, StoryFrame } from "./stories/story";
import { Music } from "./three/music";
import { StoryPlayer } from "./three/player";
import { Silhouette } from "./three/silhouette";
import "./adventure.css";

const CUES: Record<Cue, () => void> = {
  splash: playSplash,
  whoosh: playWhoosh,
  rumble: playRumble,
  chime: playChime,
  sparkle: playTwinkle,
  pop: playPop,
  knock: () => playKnock(),
  tweet: playTweet,
  drum: playDrum,
};

const smooth = (k: number) => {
  const c = Math.min(1, Math.max(0, k));
  return c * c * (3 - 2 * c);
};

/** How much the outline shows: it comes in when Tapsi starts to show the movement and goes with the praise. */
const outlineShown = (f: StoryFrame) => smooth((f.act + f.demo + 0.8) / 0.8) * (1 - smooth(f.praise / 0.8));

/**
 * A 3D movement story: the fox Tapsi shows each movement and the child does
 * it along in front of the screen; the world answers on its own time. Nobody
 * has to tap, and nothing has to be read – Tapsi says everything. Arrow keys
 * jump between steps, Space pauses.
 */
export function AdventurePlay({ story, speechLang, settings }: { story: Story; speechLang: string; settings: AdventureSettings }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<StoryPlayer | null>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [pointing, setPointing] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useWakeLock(!ended && !paused);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const music = new Music();
    const silhouette = new Silhouette();
    outlineRef.current?.append(silhouette.svg);
    let player: StoryPlayer;
    try {
      player = new StoryPlayer(
        canvas,
        story,
        {
          onLine(text, kind, at) {
            if (!settingsRef.current.speech) return;
            // A new step starts fresh; within a step, lines wait for each other.
            speak(text, speechLang, { queue: kind !== "situation" && !(kind === "instruction" && !story.lines[at].situation) });
          },
          onPointing: setPointing,
          onStep(at) {
            setStep(at);
            setEnded(false);
            music.energy = story.sequence.steps[at].energy;
          },
          onFlash(amount) {
            if (flashRef.current) flashRef.current.style.opacity = String(amount);
          },
          onCue(cue) {
            if (settingsRef.current.sounds) CUES[cue]();
          },
          onEnd() {
            setEnded(true);
          },
          onPose(pose, frame, view) {
            const box = outlineRef.current;
            if (!box) return;
            const shown = settingsRef.current.outline ? outlineShown(frame) : 0;
            box.style.opacity = String(shown);
            if (shown > 0) silhouette.update(pose, view);
          },
        },
        settings.pace === "calm" ? CALM_PACE : 1,
      );
    } catch {
      // No WebGL (very old device or switched off).
      setFailed(true);
      return;
    }
    player.highlight = settings.glow;
    playerRef.current = player;
    // For trying out scenes in the browser console: __adventure.seek(90)
    if (!import.meta.env.PROD) Object.assign(window, { __adventure: player });
    const fit = () => player.resize(canvas.clientWidth, canvas.clientHeight);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(canvas);
    player.start();
    if (settings.music) music.start();
    return () => {
      observer.disconnect();
      music.stop();
      stopSpeaking();
      player.dispose();
      silhouette.svg.remove();
      playerRef.current = null;
    };
    // The story is built once; changing settings mid-play is not possible anyway.
  }, [story]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const player = playerRef.current;
      if (!player) return;
      if (e.key === "ArrowRight") player.skip(1);
      else if (e.key === "ArrowLeft") player.skip(-1);
      else if (e.key === " ") {
        player.paused = !player.paused;
        setPaused(player.paused);
        if (player.paused) stopSpeaking();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const again = () => {
    playerRef.current?.restart();
    setEnded(false);
  };

  if (failed) {
    return (
      <div className="adventure adventure-failed">
        <p>Dieses Gerät kann die 3D-Bilder leider nicht zeigen.</p>
      </div>
    );
  }

  const current = story.sequence.steps[step];

  return (
    <div className="adventure">
      <canvas ref={canvasRef} className="adventure-canvas" />
      <div ref={flashRef} className="adventure-flash" aria-hidden />
      <div ref={outlineRef} className="adventure-outline" aria-hidden />
      <ol className="adventure-route" aria-label={story.sequence.title}>
        {story.sequence.steps.map((s, i) => (
          <li key={i} className={pointing !== null ? (i === pointing ? "now" : "") : i < step ? "done" : i === step ? "now" : ""} title={movement(s.movement).name}>
            {story.lines[i].icon}
          </li>
        ))}
      </ol>
      {paused && (
        <div className="adventure-paused" aria-label="Pause">
          ⏸
        </div>
      )}
      {ended && (
        <button type="button" className="adventure-again" onClick={again} aria-label="Nochmal">
          🔁
        </button>
      )}
      <p className="adventure-sr-only">{current.situation}</p>
    </div>
  );
}
