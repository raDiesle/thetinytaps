import * as THREE from "three";
import { movement } from "../library/movements";
import { type Cue, DEFAULT_TURN, type FrameResult, type Story, type StoryFrame, type StoryWorld } from "../stories/story";
import { clipFocus, clipPose } from "./clips";
import { type ArmPose, Guide, type LegPose, lerpLeg, lerpPose, restPose, type Pose } from "./guide";
import { Stage } from "./stage";
import { talking } from "../voice";

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

/** The legs on the way down to sitting (and, backwards, up again): squatting with the feet under the hips … */
const SQUAT: LegPose = { lift: 1.2, spread: 0.14, knee: 2.4 };
/** … sitting with the knees pulled up, the feet close in front of the bottom … */
const TUCKED: LegPose = { lift: 2.45, spread: 0.16, knee: 2.35 };
/** … and sitting with the legs stretched out forwards, nearly level, so the heels are as high as the bottom. */
const SEATED: LegPose = { lift: 1.55, spread: 0.1, knee: 0.08 };

/**
 * Sitting on the floor, `k` of the way there (0 stands, 1 sits), the way a child does it: down into a
 * squat with the feet under the hips (the knee bends twice as far as the thigh lifts, so the feet stay put),
 * onto the bottom with the knees pulled up, then the legs stretched out. Getting up goes the same way back:
 * knees in, lean forwards over the feet, push up. The upper body leans forwards in the squat; the rest of the
 * pose (the arms) stays, except that a hanging arm comes a little forwards once seated, so the paw rests on the
 * floor beside the thigh instead of reaching into it.
 */
export function sitDown(p: Pose, k: number): Pose {
  if (k <= 0) return p;
  const leg = (standing: LegPose) =>
    k < 0.45
      ? lerpLeg(standing, SQUAT, smoothstep(k / 0.45))
      : k < 0.7
        ? lerpLeg(SQUAT, TUCKED, smoothstep((k - 0.45) / 0.25))
        : lerpLeg(TUCKED, SEATED, smoothstep((k - 0.7) / 0.3));
  const lean = Math.sin(Math.PI * Math.min(1, k / 0.85)) * 0.45;
  const down = Math.min(1, k / 0.3);
  const seated = smoothstep(THREE.MathUtils.clamp((k - 0.45) / 0.55, 0, 1));
  const rest = (arm: ArmPose): ArmPose => ({ ...arm, raise: arm.raise + seated * 0.4 * (1 - THREE.MathUtils.smoothstep(arm.raise, 0.3, 1)) });
  return {
    ...p,
    toes: p.toes * (1 - down),
    lift: p.lift * (1 - down),
    bend: p.bend + lean,
    headPitch: p.headPitch - lean * 0.5,
    armL: rest(p.armL),
    armR: rest(p.armR),
    legL: leg(p.legL),
    legR: leg(p.legR),
  };
}
const smoothstep = (k: number) => THREE.MathUtils.smoothstep(k, 0, 1);
const PRAISE_BLEND = 0.9;

/** A step's length: the sequence's seconds plus showing the movement first. */
const stepLength = (story: Story, step: number) => story.sequence.steps[step].seconds + story.demo[step];

/** When each step of a story starts (story seconds, after the opening) and how long the whole story is. */
export function storyTimes(story: Story) {
  let t = story.opening?.seconds ?? 0;
  const starts = story.sequence.steps.map((_, i) => {
    const start = t;
    t += stepLength(story, i);
    return start;
  });
  return { starts, total: t };
}

/** The step playing at `t` seconds of the story and how far into it. */
function stepAt(story: Story, starts: number[], t: number) {
  let step = starts.length - 1;
  while (step > 0 && t < starts[step]) step--;
  const local = Math.max(0, Math.min(t - starts[step], stepLength(story, step)));
  return { step, local };
}

/** The story's frame at `t` seconds (`before`: the moment of the frame before, to find what happened in between). */
export function storyFrame(story: Story, starts: number[], t: number, before: number, dt: number): StoryFrame {
  const { step, local } = stepAt(story, starts, t);
  const opening = t < (story.opening?.seconds ?? 0) ? t : null;
  const lead = story.lead[step];
  const actLength = stepLength(story, step) - lead - story.praise[step];
  return {
    step,
    local,
    // The opening holds the first step at its very start, so nothing in it happens yet.
    prevLocal: opening === null ? before - starts[step] : 0,
    lead,
    demo: story.demo[step],
    act: local - lead,
    actLength,
    praise: local - lead - actLength,
    opening,
    time: t,
    dt,
  };
}

/**
 * The guide's pose in a frame, before the world sits or bends it: standing (or walking, `walkWeight`) while
 * travelling, the step's clip from when the guide shows it, and back to standing in the praise.
 */
export function storyPose(story: Story, f: StoryFrame, walkWeight: number): Pose {
  const lead = lerpPose(clipPose("idle", f.time), clipPose("march", f.time * 1.25), walkWeight);
  // The clip runs on from showing it into doing it together.
  const clipTime = f.act + f.demo;
  if (clipTime < 0) return lead;
  const motion = movement(story.sequence.steps[f.step].movement).motion;
  const acting = clipPose(motion, clipTime);
  let pose = lerpPose(lead, acting, Math.min(1, clipTime / ACT_BLEND));
  if (f.praise > 0) pose = lerpPose(pose, restPose(), Math.min(1, f.praise / PRAISE_BLEND));
  return pose;
}

/** The pose a world's answer turns that into: sitting and bending on top. */
export const worldPose = (pose: Pose, result: FrameResult) => {
  const p = sitDown(pose, result.sitting ?? 0);
  p.bend += result.bend ?? 0;
  return p;
};

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

  constructor(
    canvas: HTMLCanvasElement,
    private readonly story: Story,
    private readonly events: PlayerEvents,
  ) {
    this.stage = new Stage(canvas);
    this.stage.scene.add(this.guide.root);
    this.world = story.build(this.stage, this.guide, (c) => events.onCue(c));
    this.opening = story.opening?.seconds ?? 0;
    ({ starts: this.starts, total: this.total } = storyTimes(story));
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

  /** The whole story's length in seconds, opening included. */
  get duration() {
    return this.total;
  }

  private stepAt(t: number) {
    return stepAt(this.story, this.starts, t);
  }

  private tick(dt: number) {
    const t = Math.min(this.elapsed, this.total);
    const frame = storyFrame(this.story, this.starts, t, this.prevElapsed, dt);
    // The clock runs on past the end; the frame stays at it.
    frame.time = this.elapsed;
    const { step } = frame;
    if (frame.opening !== null) this.speakOpening(t);
    this.prevElapsed = t;

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
    this.walkWeight += ((result.walking ? 1 : 0) - this.walkWeight) * Math.min(1, dt * 6);
    const pose = worldPose(storyPose(this.story, frame, this.walkWeight), result);
    // From just before the guide shows the movement until the praise.
    const smooth = (k: number) => THREE.MathUtils.smoothstep(k, 0, 1);
    this.guide.highlight = smooth((frame.act + frame.demo + 0.5) / 0.6) * (1 - smooth(frame.praise / 0.8));
    this.guide.focus = clipFocus(movement(this.story.sequence.steps[step].movement).motion);
    this.guide.apply(pose, this.elapsed);
    this.world.afterPose?.(frame);
    const root = this.guide.root;
    const cam = this.stage.camera.position;
    this.events.onPose?.(pose, frame, Math.atan2(cam.x - root.position.x, cam.z - root.position.z) - root.rotation.y);
    this.guide.setTalking(talking());
    this.events.onFlash(result.flash);
    this.stage.focusShadow(this.world.focus);
    this.stage.render();
    this.guide.drawGlow(this.stage.renderer, this.stage.camera);

    if (!this.ended && this.elapsed >= this.total) {
      this.ended = true;
      this.events.onEnd();
    }
  }

  private speak(f: StoryFrame) {
    const lines = this.story.lines[f.step];
    const at = (time: number) => f.prevLocal < time && f.local >= time;
    if (lines.situation && at(0.05)) this.events.onLine(lines.situation, "situation", f.step);
    // Said while the guide shows the movement; without a walk, once the situation had time to be said.
    const travel = f.lead - f.demo;
    const instructionAt = travel > 0 ? travel : lines.situation ? 2.6 : 0.05;
    if (at(instructionAt)) this.events.onLine(lines.instruction, "instruction", f.step);
    if (f.demo > 0 && at(f.lead)) this.events.onLine(lines.turn ?? DEFAULT_TURN, "turn", f.step);
    if (lines.again && at(f.lead + f.actLength * 0.55)) this.events.onLine(lines.again, "again", f.step);
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
