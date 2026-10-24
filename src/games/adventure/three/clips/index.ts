import type { MotionClipId } from "../../library/types";
import type { ContourPart } from "../contour";
import type { Pose } from "../guide";
import { ARM_CLIPS } from "./arms";
import { BODY_CLIPS } from "./body";
import { LEG_CLIPS } from "./legs";
import { type Clip, posed } from "./motion";
import { WHOLE_CLIPS } from "./whole";

// The guide's body animations, one per MotionClipId. A clip turns the time
// since it started (s) into a pose; it loops by itself. Everything is slow and
// exaggerated, so a two-year-old can see what to do.
// One file per body part the clip is about; motion.ts has their building blocks.

export {
  BRUSH_HIT,
  BRUSH_PERIOD,
  BUMP_HEIGHT,
  CAST_PERIOD,
  CRANK_PERIOD,
  DRUM_HIT,
  DRUM_PERIOD,
  JUMP_HEIGHT,
  JUMP_LANDING,
  JUMP_PEAK,
  JUMP_PERIOD,
  KEY_PICKUP,
  KEY_TURN,
  PUSH_PERIOD,
  SHAPE_SECONDS,
  STOP_DANCE,
  duckDepth,
  isBump,
  jumpProgress,
  keyTurn,
  stopDance,
} from "./motion";

/** Where a clip's movement is; only that part glows while it moves (the crank is about the arms). */
type Focus = "arms" | "legs" | "body" | "all";

/** The clips by the part of the body they are about. */
export const CLIP_GROUPS: Record<Focus, Partial<Record<MotionClipId, Clip>>> = { arms: ARM_CLIPS, legs: LEG_CLIPS, body: BODY_CLIPS, all: WHOLE_CLIPS };

const CLIPS: Record<MotionClipId, Clip> = { ...ARM_CLIPS, ...LEG_CLIPS, ...BODY_CLIPS, ...WHOLE_CLIPS };

const FOCUS = Object.fromEntries(Object.entries(CLIP_GROUPS).flatMap(([focus, clips]) => Object.keys(clips).map((id) => [id, focus]))) as Record<
  MotionClipId,
  Focus
>;

const FOCUS_PARTS: Record<Focus, ContourPart[]> = {
  arms: ["armL", "armR"],
  legs: ["legL", "legR"],
  body: ["body", "head"],
  all: ["armL", "armR", "legL", "legR", "body", "head"],
};

/** The parts of the guide that may glow during clip `id`. */
export const clipFocus = (id: MotionClipId) => FOCUS_PARTS[FOCUS[id]];

/** The pose of clip `id`, `t` seconds after it started. */
export const clipPose = (id: MotionClipId, t: number): Pose => posed(CLIPS[id], t);

export const CLIP_IDS = Object.keys(CLIPS) as MotionClipId[];
