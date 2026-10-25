import { useEffect, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import type { TargetLanguage } from "@/content/targetLanguages";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { playChime, playKnock, playPop, playRumble, playSplash, playTweet, playTwinkle, playWhoosh, playDrum } from "@/lib/sfx";
import { useWakeLock } from "@/lib/wakeLock";
import { movement } from "./library/movements";
import type { AdventureSettings } from "./settings";
import type { Cue, Story, StoryFrame } from "./stories/story";
import { Music } from "./three/music";
import { StoryPlayer } from "./three/player";
import { Silhouette } from "./three/silhouette";
import { hush, loadVoice, say } from "./voice";
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
 * has to tap, and nothing has to be read – Tapsi says everything. Grown-ups
 * can pause and jump between steps with the buttons in the corner, by tapping
 * a picture on the route, or with the keys (arrows jump, Space pauses).
 */
export function AdventurePlay({
  story,
  language,
  settings,
  next,
}: {
  story: Story;
  language: TargetLanguage;
  settings: AdventureSettings;
  /** The story „Weiter“ starts at the end. */
  next: { emoji: string; name: string; onNext: () => void };
}) {
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
  const musicRef = useRef<Music | null>(null);

  useWakeLock(!ended && !paused);
  // The story has its own music, which the stop dance needs to control.
  useNoBackgroundMusic();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const music = new Music();
    musicRef.current = music;
    const silhouette = new Silhouette();
    outlineRef.current?.append(silhouette.svg);
    let player: StoryPlayer;
    try {
      player = new StoryPlayer(canvas, story, {
        onLine(text, kind, at) {
          if (!settingsRef.current.speech) return;
          // A new step starts fresh; within a step, lines wait for each other.
          say(text, language, { queue: kind !== "situation" && !(kind === "instruction" && !story.lines[at].situation) });
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
        onQuiet(quiet) {
          music.hush(quiet);
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
      });
    } catch {
      // No WebGL (very old device or switched off).
      setFailed(true);
      return;
    }
    player.highlight = settings.glow;
    if (settings.speech) loadVoice(story, language);
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
      hush();
      player.dispose();
      silhouette.svg.remove();
      playerRef.current = null;
      musicRef.current = null;
    };
    // The story is built once; changing settings mid-play is not possible anyway.
  }, [story]);

  const togglePause = () => {
    const player = playerRef.current;
    if (!player) return;
    player.paused = !player.paused;
    setPaused(player.paused);
    if (player.paused) {
      hush();
      musicRef.current?.stop();
    } else if (settingsRef.current.music) {
      musicRef.current?.start();
    }
  };

  /** Jumps to a step (-1 is the opening); what was being said stops, the step's first line comes again. */
  const jump = (to: (player: StoryPlayer) => void) => {
    const player = playerRef.current;
    if (!player) return;
    hush();
    to(player);
  };

  const keys = useRef({ togglePause, jump });
  keys.current = { togglePause, jump };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") keys.current.jump((p) => p.skip(1));
      else if (e.key === "ArrowLeft") keys.current.jump((p) => p.skip(-1));
      else if (e.key === " ") {
        e.preventDefault();
        keys.current.togglePause();
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
          <li key={i} className={pointing !== null ? (i === pointing ? "now" : "") : i < step ? "done" : i === step ? "now" : ""}>
            <button type="button" title={s.name ?? movement(s.movement).name} onClick={() => jump((p) => p.jump(i))}>
              {story.lines[i].icon}
            </button>
          </li>
        ))}
      </ol>
      <div className="adventure-controls">
        <button type="button" onClick={() => jump((p) => p.skip(-1))} aria-label="Zurück" title="Zurück (←)">
          ⏮
        </button>
        <button type="button" onClick={togglePause} aria-label={paused ? "Weiter" : "Pause"} title={paused ? "Weiter (Leertaste)" : "Pause (Leertaste)"}>
          {paused ? "▶" : "⏸"}
        </button>
        <button type="button" onClick={() => jump((p) => p.skip(1))} aria-label="Vor" title="Vor (→)">
          ⏭
        </button>
      </div>
      {paused && (
        <button type="button" className="adventure-paused" onClick={togglePause} aria-label="Weiter">
          ▶
        </button>
      )}
      {ended && <GameEnd onAgain={again} next={next} />}
      <p className="adventure-sr-only">{current.situation}</p>
    </div>
  );
}
