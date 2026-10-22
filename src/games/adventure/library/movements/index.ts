import type { Movement } from "../types";
import { ANIMAL_MIMICRY } from "./animalMimicry";
import { BALANCE } from "./balance";
import { DODGE_LEAN } from "./dodgeLean";
import { HOP_BOUNCE } from "./hopBounce";
import { MARCH_STOMP } from "./marchStomp";
import { PUSH_PULL } from "./pushPull";
import { REACH_POINT } from "./reachPoint";
import { SHAKE_DANCE } from "./shakeDance";
import { SIDE_STEPS } from "./sideSteps";
import { STOP_GO } from "./stopGo";
import { STRETCH_CURL } from "./stretchCurl";
import { THROW_CATCH } from "./throwCatch";
import { TOOL_MIMICRY } from "./toolMimicry";
import { TRAVEL_STROKES } from "./travelStrokes";
import { TURN } from "./turn";

// Result B: the whole movement library, in category order.

export const MOVEMENTS: Movement[] = [
  ...PUSH_PULL,
  ...DODGE_LEAN,
  ...SIDE_STEPS,
  ...HOP_BOUNCE,
  ...SHAKE_DANCE,
  ...ANIMAL_MIMICRY,
  ...REACH_POINT,
  ...THROW_CATCH,
  ...STRETCH_CURL,
  ...MARCH_STOMP,
  ...BALANCE,
  ...TURN,
  ...STOP_GO,
  ...TRAVEL_STROKES,
  ...TOOL_MIMICRY,
];

const BY_ID = new Map(MOVEMENTS.map((m) => [m.id, m]));

export function movement(id: string): Movement {
  const found = BY_ID.get(id);
  if (!found) throw new Error(`Unknown movement: ${id}`);
  return found;
}
