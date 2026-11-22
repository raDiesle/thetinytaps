import { BALL_LEVEL } from "./ball";
import { BALLON_LEVEL } from "./ballon";
import { DRACHEN_LEVEL } from "./drachen";
import { FLOSS_LEVEL } from "./floss";
import { KATZE_LEVEL } from "./katze";
import { LOK_LEVEL } from "./lok";
import { PICKNICK_LEVEL } from "./picknick";
import { SANDBURG_LEVEL } from "./sandburg";
import { SCHNEEMANN_LEVEL } from "./schneemann";
import type { TrailLevel } from "./types";

// Every trail level stands in its own module with its drawing (`ball.tsx` holds the ball's world and `BALL_LEVEL`), so
// the game loads one level's code when it is played (`../catalog.ts`). This list of all of them is only for tests and
// tools (the voice lines, the checks): never import it from the start screen or a player, or every level is downloaded
// with it (`../catalog.test.ts`).

/** All trail levels, in the order of their cards. */
export const TRAIL_LEVELS: TrailLevel[] = [
  DRACHEN_LEVEL,
  BALL_LEVEL,
  BALLON_LEVEL,
  LOK_LEVEL,
  FLOSS_LEVEL,
  SANDBURG_LEVEL,
  PICKNICK_LEVEL,
  KATZE_LEVEL,
  SCHNEEMANN_LEVEL,
];
