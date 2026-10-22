import * as THREE from "three";
import { movement } from "../library/movements";
import type { Cue, Story, StoryFrame, StoryWorld } from "../stories/story";
import { clipPose } from "./clips";
import { Guide, lerpPose, restPose, type Pose } from "./guide";
import { Stage } from "./stage";

// Plays a story: keeps the clock (pause, skip), works out which step and
// phase it is, poses the guide (blending between clips), lets the world
// react and renders. Everything is a function of the story clock, so jumping
// to another step just works.

export type LineKind = "situation" | "instruction" | "again" | "praise";

export interface PlayerEvents {
  onLine(text: string, kind: LineKind, step: number): void;
  onStep(step: number): void;
  onFlash(amount: number): void;
  onCue(cue: Cue): void;
  onEnd(): void;
  /** Every frame: the guide's pose, e.g. for the outline helper. */
  onPose?(pose: Pose, frame: StoryFrame): void;
}

const ACT_BLEND = 0.7;
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
  private ended = false;
  /** How much slower than written the story runs, e.g. 1.3 for calm mode. */
  private readonly pace: number;
  paused = false;
  /** The parts of the guide that move glow during a movement. */
  highlight = true;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly story: Story,
    private readonly events: PlayerEvents,
    pace = 1,
  ) {
    this.pace = pace;
    this.stage = new Stage(canvas);
    this.stage.scene.add(this.guide.root);
    this.world = story.build(this.stage, this.guide, (c) => events.onCue(c));
    let t = 0;
    this.starts = story.sequence.steps.map((s) => {
      const start = t;
      t += s.seconds;
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
      if (!this.paused) this.elapsed += dt / this.pace;
      this.tick(dt);
    };
    this.frame = requestAnimationFrame(loop);
  }

  resize(width: number, height: number) {
    this.stage.resize(width, height);
  }

  /** Jumps to the start of the next (+1) or previous (-1) step. */
  skip(direction: 1 | -1) {
    const step = this.stepAt(this.elapsed).step;
    const target = Math.max(0, Math.min(this.starts.length - 1, step + direction));
    this.elapsed = this.starts[target];
    // Just before the start, so the step's first line is said again.
    this.prevElapsed = this.elapsed - 0.001;
    this.ended = false;
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

  private stepAt(t: number) {
    let step = this.starts.length - 1;
    while (step > 0 && t < this.starts[step]) step--;
    const local = Math.min(t - this.starts[step], this.story.sequence.steps[step].seconds);
    return { step, local };
  }

  private tick(dt: number) {
    const t = Math.min(this.elapsed, this.total);
    const { step, local } = this.stepAt(t);
    const prevLocal = this.prevElapsed - this.starts[step];
    this.prevElapsed = t;
    const seconds = this.story.sequence.steps[step].seconds;
    const lead = this.story.lead[step];
    const actLength = seconds - lead - this.story.praise;
    const frame: StoryFrame = {
      step,
      local,
      prevLocal,
      lead,
      act: local - lead,
      actLength,
      praise: local - lead - actLength,
      time: this.elapsed,
      dt,
    };

    if (step !== this.currentStep) {
      this.currentStep = step;
      this.events.onStep(step);
    }
    this.speak(frame);

    const result = this.world.update(frame);
    const pose = this.pose(frame, result.walking, dt);
    // From just before the movement until the praise.
    const smooth = (k: number) => THREE.MathUtils.smoothstep(k, 0, 1);
    this.guide.highlight = this.highlight ? smooth((frame.act + 0.5) / 0.6) * (1 - smooth(frame.praise / 0.8)) : 0;
    this.guide.apply(pose, this.elapsed);
    this.events.onPose?.(pose, frame);
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
    if (f.act < 0) return lead;
    const motion = movement(this.story.sequence.steps[f.step].movement).motion;
    const acting = clipPose(motion, f.act);
    let pose = lerpPose(lead, acting, Math.min(1, f.act / ACT_BLEND));
    if (f.praise > 0) pose = lerpPose(pose, restPose(), Math.min(1, f.praise / PRAISE_BLEND));
    return pose;
  }

  private speak(f: StoryFrame) {
    const lines = this.story.lines[f.step];
    const at = (time: number) => f.prevLocal < time && f.local >= time;
    if (lines.situation && at(0.05)) this.events.onLine(lines.situation, "situation", f.step);
    // Without a walk, the instruction follows the situation once it had time to be said.
    const instructionAt = f.lead > 0 ? f.lead : lines.situation ? 2.6 : 0.05;
    if (at(instructionAt)) this.events.onLine(lines.instruction, "instruction", f.step);
    if (at(f.lead + f.actLength * 0.55)) this.events.onLine(lines.again, "again", f.step);
    if (at(f.lead + f.actLength + 0.1)) this.events.onLine(lines.praise, "praise", f.step);
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.stage.dispose();
  }
}
