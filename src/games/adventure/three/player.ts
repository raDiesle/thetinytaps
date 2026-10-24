import * as THREE from "three";
import { movement } from "../library/movements";
import type { Cue, Story, StoryFrame, StoryWorld } from "../stories/story";
import { clipFocus, clipPose } from "./clips";
import { Guide, lerpPose, restPose, type Pose } from "./guide";
import { Stage } from "./stage";

// Plays a story: keeps the clock (pause, skip), works out which step and
// phase it is, poses the guide (blending between clips), lets the world
// react and renders. Everything is a function of the story clock, so jumping
// to another step just works.

export type LineKind = "opening" | "situation" | "instruction" | "turn" | "again" | "praise";

export interface PlayerEvents {
  onLine(text: string, kind: LineKind, step: number): void;
  onStep(step: number): void;
  /** During the opening: the step the map points at (null when it does not). */
  onPointing?(step: number | null): void;
  onFlash(amount: number): void;
  /** The music stops (true) or goes on (false), e.g. in the stop dance. */
  onQuiet?(quiet: boolean): void;
  onCue(cue: Cue): void;
  onEnd(): void;
  /**
   * Every frame: the guide's pose, e.g. for the outline helper, and from
   * where the camera sees the guide (radians round it, 0 = from the front).
   */
  onPose?(pose: Pose, frame: StoryFrame, view: number): void;
}

const ACT_BLEND = 0.7;

/** The legs folded to sit (thighs forward, shins down), blended in by `k`; the rest of the pose stays. */
function sitDown(p: Pose, k: number): Pose {
  if (k <= 0) return p;
  const sit = { ...p, toes: 0, lift: 0, legL: { lift: 1.45, spread: 0.18, knee: 1.5 }, legR: { lift: 1.45, spread: 0.18, knee: 1.5 } };
  return lerpPose(p, sit, k);
}
const PRAISE_BLEND = 0.9;

export class StoryPlayer {
  readonly stage: Stage;
  private readonly guide = new Guide();
  private readonly world: StoryWorld;
  private readonly starts: number[];
  private readonly total: number;
  private elapsed = 0;
  private prevElapsed = -1;
  private lastNow = 0;
  private frame = 0;
  private walkWeight = 0;
  private currentStep = -1;
  private pointing: number | null = null;
  private quiet = false;
  /** Seconds of the opening before the first step. */
  private readonly opening: number;
  private ended = false;
  paused = false;
  /** The parts of the guide that move glow during a movement. */
  highlight = true;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly story: Story,
    private readonly events: PlayerEvents,
  ) {
    this.stage = new Stage(canvas);
    this.stage.scene.add(this.guide.root);
    this.world = story.build(this.stage, this.guide, (c) => events.onCue(c));
    this.opening = story.opening?.seconds ?? 0;
    let t = this.opening;
    this.starts = story.sequence.steps.map((s, i) => {
      const start = t;
      t += this.stepSeconds(i);
      return start;
    });
    this.total = t;
  }

  start() {
    this.lastNow = performance.now();
    const loop = (now: number) => {
      this.frame = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - this.lastNow) / 1000);
      this.lastNow = now;
      if (!this.paused) this.elapsed += dt;
      this.tick(dt);
    };
    this.frame = requestAnimationFrame(loop);
  }

  resize(width: number, height: number) {
    this.stage.resize(width, height);
  }

  /** Jumps to the start of the next (+1) or previous (-1) step; back from the first step is the opening. */
  skip(direction: 1 | -1) {
    const inOpening = this.elapsed < this.opening;
    const step = inOpening ? -1 : this.stepAt(this.elapsed).step;
    const target = Math.max(-1, Math.min(this.starts.length - 1, step + direction));
    this.elapsed = target < 0 ? 0 : this.starts[target];
    // Just before the start, so the step's first line is said again.
    this.prevElapsed = this.elapsed - 0.001;
    this.ended = false;
  }

  /** Jumps to the start of a step; -1 is the opening. */
  jump(step: number) {
    const target = Math.max(-1, Math.min(this.starts.length - 1, step));
    this.seek(target < 0 ? 0 : this.starts[target]);
  }

  /** The step playing now, or -1 during the opening. */
  get step() {
    return this.elapsed < this.opening ? -1 : this.stepAt(this.elapsed).step;
  }

  /** Jumps to a moment of the story, in seconds (for trying out scenes). */
  seek(seconds: number) {
    this.elapsed = Math.max(0, Math.min(this.total, seconds));
    this.prevElapsed = this.elapsed - 0.001;
    this.ended = false;
  }

  /** Start over from the beginning. */
  restart() {
    this.elapsed = 0;
    this.prevElapsed = -1;
    this.ended = false;
  }

  get steps() {
    return this.story.sequence.steps.length;
  }

  /** A step's length: the sequence's seconds plus showing the movement first. */
  private stepSeconds(step: number) {
    return this.story.sequence.steps[step].seconds + this.story.demo[step];
  }

  private stepAt(t: number) {
    let step = this.starts.length - 1;
    while (step > 0 && t < this.starts[step]) step--;
    const local = Math.max(0, Math.min(t - this.starts[step], this.stepSeconds(step)));
    return { step, local };
  }

  private tick(dt: number) {
    const t = Math.min(this.elapsed, this.total);
    const { step, local } = this.stepAt(t);
    const opening = t < this.opening ? t : null;
    // The opening holds the first step at its very start, so nothing in it happens yet.
    const prevLocal = opening === null ? this.prevElapsed - this.starts[step] : 0;
    if (opening !== null) this.speakOpening(t);
    this.prevElapsed = t;
    const lead = this.story.lead[step];
    const actLength = this.stepSeconds(step) - lead - this.story.praise;
    const frame: StoryFrame = {
      step,
      local,
      prevLocal,
      lead,
      demo: this.story.demo[step],
      act: local - lead,
      actLength,
      praise: local - lead - actLength,
      opening,
      time: this.elapsed,
      dt,
    };

    if (step !== this.currentStep) {
      this.currentStep = step;
      this.events.onStep(step);
    }
    this.speak(frame);

    const result = this.world.update(frame);
    const pointing = result.pointing ?? null;
    if (pointing !== this.pointing) {
      this.pointing = pointing;
      this.events.onPointing?.(pointing);
    }
    const quiet = result.quiet ?? false;
    if (quiet !== this.quiet) {
      this.quiet = quiet;
      this.events.onQuiet?.(quiet);
    }
    const pose = sitDown(this.pose(frame, result.walking, dt), result.sitting ?? 0);
    // From just before the guide shows the movement until the praise.
    const smooth = (k: number) => THREE.MathUtils.smoothstep(k, 0, 1);
    this.guide.highlight = this.highlight ? smooth((frame.act + frame.demo + 0.5) / 0.6) * (1 - smooth(frame.praise / 0.8)) : 0;
    this.guide.focus = clipFocus(movement(this.story.sequence.steps[step].movement).motion);
    this.guide.apply(pose, this.elapsed);
    const root = this.guide.root;
    const cam = this.stage.camera.position;
    this.events.onPose?.(pose, frame, Math.atan2(cam.x - root.position.x, cam.z - root.position.z) - root.rotation.y);
    this.guide.setTalking(typeof speechSynthesis !== "undefined" && speechSynthesis.speaking);
    this.events.onFlash(result.flash);
    this.stage.focusShadow(this.world.focus);
    this.stage.render();

    if (!this.ended && this.elapsed >= this.total) {
      this.ended = true;
      this.events.onEnd();
    }
  }

  private pose(f: StoryFrame, walking: boolean, dt: number): Pose {
    this.walkWeight += ((walking ? 1 : 0) - this.walkWeight) * Math.min(1, dt * 6);
    const lead = lerpPose(clipPose("idle", f.time), clipPose("march", f.time * 1.25), this.walkWeight);
    // The clip runs on from showing it into doing it together.
    const clipTime = f.act + f.demo;
    if (clipTime < 0) return lead;
    const motion = movement(this.story.sequence.steps[f.step].movement).motion;
    const acting = clipPose(motion, clipTime);
    let pose = lerpPose(lead, acting, Math.min(1, clipTime / ACT_BLEND));
    if (f.praise > 0) pose = lerpPose(pose, restPose(), Math.min(1, f.praise / PRAISE_BLEND));
    return pose;
  }

  private speak(f: StoryFrame) {
    const lines = this.story.lines[f.step];
    const at = (time: number) => f.prevLocal < time && f.local >= time;
    if (lines.situation && at(0.05)) this.events.onLine(lines.situation, "situation", f.step);
    // Said while the guide shows the movement; without a walk, once the situation had time to be said.
    const travel = f.lead - f.demo;
    const instructionAt = travel > 0 ? travel : lines.situation ? 2.6 : 0.05;
    if (at(instructionAt)) this.events.onLine(lines.instruction, "instruction", f.step);
    if (f.demo > 0 && at(f.lead)) this.events.onLine(lines.turn ?? "Jetzt du!", "turn", f.step);
    if (at(f.lead + f.actLength * 0.55)) this.events.onLine(lines.again, "again", f.step);
    for (const line of lines.more ?? []) if (at(f.lead + line.at)) this.events.onLine(line.text, "again", f.step);
    if (at(f.lead + f.actLength + 0.1)) this.events.onLine(lines.praise, "praise", f.step);
  }

  private speakOpening(t: number) {
    for (const line of this.story.opening?.lines ?? []) {
      if (this.prevElapsed < line.at && t >= line.at) this.events.onLine(line.text, "opening", 0);
    }
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.stage.dispose();
  }
}
