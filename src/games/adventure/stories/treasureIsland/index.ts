import * as THREE from "three";
import {
  BRUSH_HIT,
  BRUSH_PERIOD,
  CAST_PERIOD,
  castSwing,
  CRANK_PERIOD,
  DODGE_PASS,
  DODGE_PERIOD,
  DRUM_HIT,
  DRUM_PERIOD,
  JUMP_LANDING,
  JUMP_PEAK,
  JUMP_PERIOD,
  KEY_PICKUP,
  KEY_TURN,
  keyTurn,
  PULL_PERIOD,
  pulledIn,
  pullReach,
  SHAPE_SECONDS,
  sitProgress,
} from "../../three/clips";
import { GUIDE_SIZE, type Guide } from "../../three/guide";
import { updateMoved } from "../../three/matrices";
import { PADDLE_REACH, TURTLE_BACK, TURTLE_HALF_WIDTH, turtleTop } from "../../three/props";
import { DAY, SUNSET, type Stage } from "../../three/stage";
import { crossed, type Cue, type Story, type StoryFrame, type StoryWorld } from "../story";
import {
  APPLE_Z,
  BAY,
  BEACH_Z,
  BOAT_END,
  BOAT_START,
  bridgeTop,
  BROOK_FROM,
  CARRY_PATH,
  CAST_REACH,
  CHEST_SAND,
  CHEST_Y,
  CHEST_Z,
  COIN_FALL,
  COIN_STAND,
  COINS_PER_TOSS,
  clamp01,
  CRANK_BAR,
  CRANK_REACH,
  DOOR_Z,
  DRUMS_Z,
  GATE_LIFT,
  GATE_Z,
  groundHeight,
  JUMP_FROM,
  JUMP_TO,
  KEY_RING,
  KEY_VIEW,
  LAGOON,
  LAGOON_LEVEL,
  LOCK,
  MONKEY_Z,
  PADDLE_STAND,
  PARTY,
  RAFT_FROM,
  RAFT_TO,
  RAFT_X,
  RIDDLE_Z,
  ROD_GRIP_L,
  ROD_GRIP_R,
  ROD_LENGTH,
  ROD_REST,
  ROLL_LEAD,
  ROLL_BANK_END,
  ROLL_RADIUS,
  ROLL_Z,
  SHORE,
  SIT_DROP,
  smooth,
  ROPE_REACH,
  ROPE_TAIL,
  ROPE_TIE,
  ss,
  STOMP_Z,
  SWING_HELD,
  SWING_PARKED,
  SWING_Z,
  TAU,
  TURTLE_FLOAT,
  v3,
  WEB_GAP,
  WEB_STAND,
  WEB_Z,
  WINCH_X,
  WINCH_Z,
} from "./layout";
import {
  ACROSS,
  actLength,
  bumpTime,
  CARRY,
  CAST_LANDS,
  CAST_OUT,
  clipLength,
  DEMO,
  goes,
  ISLAND,
  jumpZ,
  LEAD,
  LEAN_PERIOD,
  LEAP_FROM,
  LEAP_TO,
  HOP_FROM,
  HOP_LAND,
  ON_SAND,
  OPENING,
  OPENING_CUT,
  PADDLE_DROP,
  PADDLE_GRIP,
  PADDLE_PERIOD,
  PADDLE_TILT,
  PRAISE,
  REACH_PERIOD,
  REEL,
  REEL_TIME,
  S,
  sequence,
  STANDING,
  SWING_PERIOD,
  TRAIL_FROM,
  tossAt,
  TRAIL_TO,
  TRAVEL,
} from "./script";
import { LINES, OPENING_LINES } from "./lines";
import { TRANSLATIONS } from "./translations";
import { makeWorld } from "./world";

// "Die Schatzinsel": Tapsi stands on the back of Ole, a big sea turtle, greets
// Kiki the parrot and casts a fishing rod (a fish leaps at every cast), sits
// down and paddles to an island, stands up again on the beach,
// stomps the scorpions on the beach away, hops over the little bridge across
// the brook and bumps a star box with the head at every jump, ducks under a swinging log,
// beats two hanging drums (every beat scares a bird off the path), cranks a
// wooden gate open, steps aside for rolling coconuts,
// dodges the monkeys' nuts in slow motion, picks apples, solves the riddle of
// the stone door, brushes the cobwebs out of the passage behind it, pulls the
// treasure chest ashore and unlocks it with the key Kiki brings – then two crabs
// carry the open chest up the beach, Tapsi hops down behind it, reaches deep into
// it and throws the coins up, so they rain down all round, turns round to us and
// jumps for joy, and waves goodbye. Every world reaction is timed to the
// guide's clip, so it happens together with the child's movement. Every
// movement stays on the spot: the child in front of the screen never has to
// go forwards. So Tapsi never walks either: Ole carries Tapsi the whole way,
// swimming and crawling from station to station, through the gorge into the
// hidden bay, and at the treasure turns round under Tapsi to face us.
//
// First a red dotted trail draws the way across the island to the chest, like
// on a treasure map. Then we see Tapsi from the front and Tapsi waves to us and
// Kiki, and the camera swings round behind for the fishing. At every station Tapsi first shows
// the movement alone and the child joins in, the same number of times at every
// station's target as the clip hits it. Tapsi faces the island and the camera looks from behind, a
// little raised and to the side where the arms would hide behind the body:
// the child sees what Tapsi sees, and left is left. Over the brook it looks
// from the side, like a jump-and-run game. Where things come at Tapsi (the log,
// the apples above) it looks from right behind the head, the way Tapsi looks.
// After the gold rain Tapsi turns round and celebrates facing us.
//
// Positions along the path are in layout.ts, the props in scenery.ts, putting them
// together in world.ts, the steps and their timing in script.ts; here they move.

const UP = new THREE.Vector3(0, 1, 0);
/** How high over Tapsi the camera follows through the gorge. */
const GORGE_CAM = new THREE.Vector3(0, 2.0, 0);

function build(stage: Stage, guide: Guide, cue: (c: Cue) => void): StoryWorld {
  const scene = stage.scene;
  stage.setSky(DAY, SUNSET, 0);
  stage.updateReflections();

  const {
    sea,
    clouds,
    turtle,
    paddle,
    parrot,
    scorpions,
    bridge,
    boxes,
    swing,
    rod,
    rodTip,
    bobber,
    line,
    fishes,
    drums,
    beats,
    riddleRounds,
    keyTurns,
    lastTurn,
    birds,
    flock,
    gate,
    rollers,
    monkeys,
    RING_TIMES,
    throws,
    basketAt,
    apples,
    REACH_TOP,
    door,
    riddle,
    webGround,
    webs,
    spider,
    raft,
    chest,
    lock,
    key,
    ropeMat,
    crabs,
    confetti,
    spray,
    gold,
    sand,
    porters,
    coins,
    trail,
  } = makeWorld(scene);
  const ropeParts: THREE.Mesh[] = [];

  // --- Helpers -------------------------------------------------------------
  const focus = v3(0, 0, BOAT_START);
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const fromPos = new THREE.Vector3();
  const fromLook = new THREE.Vector3();
  const midPos = new THREE.Vector3();
  const midLook = new THREE.Vector3();
  const spot = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpC = new THREE.Vector3();
  const tmpD = new THREE.Vector3();
  const carryPos = new THREE.Vector3();
  const carryLook = new THREE.Vector3();
  const lapQ = new THREE.Quaternion();
  const restQ = new THREE.Quaternion();
  const heldQ = new THREE.Quaternion();
  const tmpQ = new THREE.Quaternion();
  const basis = new THREE.Matrix4();
  const bladeY = [1, 1];
  let sunsetDone = -1;
  let lastTime = 0;
  let lastOpening = -1;

  /** Ole's place (z) at sea: waiting, swimming to the island while Tapsi paddles, and up onto the beach in the praise. */
  const boatZ = (step: number, act: number, praise = -1) => {
    if (step < S.paddle) return BOAT_START;
    if (step > S.paddle) return BEACH_Z;
    if (praise > 0) return BOAT_END + (BEACH_Z - BOAT_END) * smooth(praise / 2);
    if (act <= 0) return BOAT_START;
    const len = actLength(S.paddle);
    const k = clamp01(act / len);
    // Each stroke pushes Ole a bit, so it surges with the paddling.
    const surge = Math.sin((act / (PADDLE_PERIOD / 2)) * TAU) * 0.012 * (1 - k);
    return BOAT_START + (BOAT_END - BOAT_START) * (smooth(k) * 0.4 + k * 0.6 + surge);
  };

  /**
   * Raft position (z) at a moment of the story: pulled in with the rope from when Tapsi starts to pull,
   * tug by tug as each paw comes back to the body, so it is there when the praise begins.
   */
  const raftAt = (step: number, act: number) => {
    if (step < S.rope) return RAFT_FROM;
    if (step > S.rope) return RAFT_TO;
    const pulls = goes(S.rope);
    const clip = Math.max(0, Math.min(pulls * PULL_PERIOD, act + DEMO[S.rope]));
    return RAFT_FROM + ((RAFT_TO - RAFT_FROM) * pulledIn(clip)) / (2 * pulls);
  };

  /** How far the camera stands from Tapsi, so Tapsi is big: the whole body with the arms up just fills the picture. */
  const frameDistance = () => {
    const cam = stage.camera;
    const v = THREE.MathUtils.degToRad(cam.fov / 2);
    const h = Math.atan(Math.tan(v) * cam.aspect);
    return Math.max(0.95 / Math.tan(v), 0.72 / Math.tan(h));
  };

  /**
   * Right behind Tapsi's head, looking straight ahead the way Tapsi looks, `up` metres up at 4 m ahead:
   * what comes at Tapsi comes at us too. `height` is the camera over Tapsi's feet, `back` how far behind.
   */
  function overHead(at: THREE.Vector3, pos: THREE.Vector3, look: THREE.Vector3, height: number, back: number, up: number) {
    const a = ISLAND + Math.PI;
    pos.set(at.x + Math.sin(a) * back, at.y + height, at.z + Math.cos(a) * back);
    look.set(at.x - Math.sin(a) * 4, at.y + height + up, at.z - Math.cos(a) * 4);
  }

  /**
   * Tapsi standing at `at`, seen from the sea's side (from behind while
   * Tapsi faces the island), big in the middle. `side` turns the camera round
   * towards Tapsi's right (radians), so arms in front of the body still show;
   * `height` raises it to look over Tapsi's shoulders.
   */
  function rear(at: THREE.Vector3, pos: THREE.Vector3, look: THREE.Vector3, side = 0, height = 1.45, far = 1) {
    const d = frameDistance() * far;
    const a = ISLAND + Math.PI + side;
    pos.set(at.x + Math.sin(a) * d, at.y + height, at.z + Math.cos(a) * d);
    look.set(at.x, at.y + 0.75, at.z);
  }

  /** Where Ole carries Tapsi for a step's movement, (x, z). */
  function standAt(step: number): [number, number] {
    switch (step) {
      case S.stand:
        return [0, BEACH_Z];
      case S.stomp:
        return [0, STOMP_Z];
      case S.jump:
        return [0, JUMP_FROM];
      case S.duck:
        return [0, SWING_Z];
      case S.drums:
        return [0, DRUMS_Z];
      case S.gate:
        return [WINCH_X, WINCH_Z + CRANK_REACH];
      case S.roll:
      case S.rollLeft:
      case S.rollMiddle:
        return [0, ROLL_Z];
      case S.monkeys:
        return [0, MONKEY_Z];
      case S.apples:
        return [0, APPLE_Z];
      case S.riddle:
        return [0, RIDDLE_Z];
      case S.webs:
        return [0, WEB_STAND];
      case S.rope:
      case S.key:
        return [BAY.x, BAY.z];
      case S.hooray:
      case S.coins:
      case S.bye:
        return [PARTY.x, PARTY.z];
      default:
        return [SHORE.x, SHORE.z];
    }
  }

  /** Where Ole is when a step's movement is over. */
  const endAt = (step: number): [number, number] => (step === S.jump ? [0, JUMP_TO] : standAt(step));

  /**
   * The way to a step's place: from where the step before ended (up the beach to the scorpions), round
   * the winch after the gate, and from the cobwebs through the gorge down into the bay.
   */
  const route = (step: number): [number, number][] =>
    step === S.roll
      ? [endAt(S.gate), [-0.2, WINCH_Z + CRANK_REACH + 0.1], standAt(S.roll)]
      : step === S.rope
        ? [standAt(S.webs), [0, -19.5], [BAY.x, BAY.z + 1.2], standAt(S.rope)]
        : [endAt(step - 1), standAt(step)];

  /** A point `k` (0..1) of the way along a route, by distance. */
  function along(points: [number, number][], k: number): [number, number] {
    const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
    let d = k * lengths.reduce((a, b) => a + b, 0);
    for (const [i, len] of lengths.entries()) {
      if (d <= len || i === lengths.length - 1) {
        const u = len > 0 ? clamp01(d / len) : 1;
        return [points[i][0] + (points[i + 1][0] - points[i][0]) * u, points[i][1] + (points[i + 1][1] - points[i][1]) * u];
      }
      d -= len;
    }
    return points[points.length - 1];
  }
  const routeLength = (points: [number, number][]) => points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]), 0);

  /** The sea's waves at (x, z), as the water's shader moves them. */
  const wave = (x: number, z: number, time: number) =>
    Math.sin(x * 0.35 + time * 1.1) * 0.12 + Math.sin(z * 0.28 - time * 0.9) * 0.1 + Math.sin((x + z) * 0.9 + time * 2.0) * 0.035;
  /** The water at (x, z): the sea with its waves, or the lagoon. */
  const waterAt = (x: number, z: number, time: number) => Math.max(wave(x, z, time), Math.hypot(x - LAGOON.x, z - LAGOON.y) < 7.8 ? LAGOON_LEVEL : -Infinity);
  /** Where Ole's belly is at (x, z): on the ground or the bridge, or swimming in the water. */
  const turtleY = (x: number, z: number, time: number) => Math.max(groundHeight(x, z), bridgeTop(x, z), waterAt(x, z, time) - TURTLE_FLOAT);

  /** Where Tapsi's feet are while showing and doing a step's movement, for the cameras: on Ole's back. */
  function actSpot(step: number, act: number, out: THREE.Vector3) {
    if (step <= S.paddle) return out.set(0, TURTLE_BACK - TURTLE_FLOAT - (step >= S.sit ? SIT_DROP : 0), boatZ(step, act));
    // At the end Tapsi stands in the sand beside Ole: the camera looks at both, from the middle of the
    // gorge Ole came down, whose rock walls come close on either side.
    if (step >= S.coins) {
      const x = (PARTY.x + COIN_STAND.x) / 2;
      return out.set(x, groundHeight(x, COIN_STAND.z), COIN_STAND.z);
    }
    const [x, z] = step === S.jump ? [0, jumpZ(act + DEMO[S.jump])] : standAt(step);
    return out.set(x, Math.max(groundHeight(x, z), bridgeTop(x, z), (step >= S.rope && step <= S.key ? LAGOON_LEVEL : 0) - TURTLE_FLOAT) + TURTLE_BACK, z);
  }

  /** How far the bridge gives way under Tapsi's landings (m), `clip` seconds into the jump clip; it springs back. */
  function bridgeDip(clip: number) {
    if (clip < JUMP_LANDING || clip > clipLength(S.jump) + JUMP_PERIOD) return 0;
    const since = (clip - JUMP_LANDING) % JUMP_PERIOD;
    return 0.035 * Math.exp(-since * 7) * Math.cos(since * 22);
  }

  /** How far the crank has turned (whole turns) at a moment of the gate step; the gate follows. */
  const crankTurns = (clip: number) => Math.max(0, clip) / CRANK_PERIOD;

  /** The camera of a step from when Tapsi shows the movement until the praise: position and point looked at. */
  function actShot(step: number, f: { local: number; act: number; demo: number; praise: number; time: number }, pos: THREE.Vector3, look: THREE.Vector3) {
    const at = actSpot(step, f.act, spot);
    const clip = f.act + DEMO[step];
    switch (step) {
      case S.fish:
        // Behind Tapsi, a little raised and to the side: the rod swings back over us and the float flies out ahead.
        rear(at, pos, look, 0.35, 1.45, 1.25);
        look.set(at.x, at.y + 0.9, at.z - 1.6);
        return;
      case S.hello:
        // From the front, a little to Tapsi's right, where Kiki flutters and Tapsi waves: hello to us too.
        rear(at, pos, look, Math.PI - 0.3, 1.3, 1.3);
        look.y += 0.05;
        return;
      case S.sit:
      case S.stand:
        // From the left side, where sitting down and getting up show best and the paddle standing on the right hides nothing.
        rear(at, pos, look, -1.15, 1.3, 1.3);
        look.y -= 0.1;
        return;
      case S.paddle:
        // As if riding on Ole too.
        rear(at, pos, look, 0, 1.15);
        look.y -= 0.2;
        return;
      case S.stomp:
        // Raised and to the side, looking down at the feet and the scorpions.
        rear(at, pos, look, 0.4, 2.0);
        look.y = at.y + 0.3;
        return;
      case S.jump: {
        // From the side, like a jump-and-run game: Tapsi jumps from left to right over the bridge,
        // the boxes above; the camera glides along with the jumps.
        const k = clamp01(clip / clipLength(step));
        const z = JUMP_FROM - 0.9 - (JUMP_FROM - JUMP_TO - 0.4) * (k * 0.7 + smooth(k) * 0.3);
        const d = frameDistance() * 1.45;
        // Up with the far bank at the end, so the boxes stay in the picture.
        pos.set(d, at.y + 1.35, z);
        look.set(0, at.y + 1.3, z - 0.2);
        return;
      }
      case S.duck:
        // Right behind Tapsi's head and a little over it, looking ahead the way Tapsi looks: the head stays low in
        // the picture and the log swings straight at us, then over Tapsi's ducked head and ours.
        overHead(at, pos, look, 1.5, 1.4, 1.5);
        return;
      case S.drums:
        // Straight behind Tapsi and high up: both paws and both drums beside the body show, and the birds on
        // the path beyond, over Tapsi's head.
        rear(at, pos, look, 0, 2.3, 1.2);
        look.y = at.y + 0.55;
        return;
      case S.gate: {
        // From behind on the left: the paws on the crank in front, the gate beyond; then through the open gate.
        const open = smooth(f.praise / 1.6);
        rear(at, pos, look, -0.85, 1.6, 1.45);
        look.x += 0.3 + open * 0.8;
        look.y += 0.3 + open * 0.4;
        return;
      }
      case S.roll:
      case S.rollLeft:
      case S.rollMiddle:
        // Right behind Tapsi in the middle and a little from below, looking up the path where the coconuts come from.
        rear(at, pos, look, 0, 0.55, 1.3);
        look.set(at.x + 0.15, at.y + 1.05, at.z - 2.5);
        return;
      case S.monkeys:
        // Behind Tapsi, swinging round a little with every nut like a slow-motion film; the monkeys up ahead.
        rear(at, pos, look, 0.2 + Math.sin((clip / LEAN_PERIOD) * TAU) * 0.25, 1.25, 1.0);
        look.set(at.x, at.y + 1.1, at.z - 1.2);
        return;
      case S.apples:
        // Behind Tapsi like at the log but lower, looking up into the tree, where the apples hang over Tapsi's head.
        overHead(at, pos, look, 0.65, 1.7, 2.6);
        return;
      case S.riddle:
        // Further back, so the three pictures over the door show above Tapsi.
        rear(at, pos, look, 0.15, 1.2, 1.55);
        look.lerp(tmpB.set(0, groundHeight(0, DOOR_Z) + 3.1, DOOR_Z), 0.6);
        return;
      case S.webs: {
        // Behind Tapsi and raised, so the cobwebs left and right of the head show against the light;
        // once they are gone, up a little to look through the gorge.
        const reveal = smooth(f.praise / 1.6);
        rear(at, pos, look, 0.3, 1.6 + reveal * 0.6, 1.1 + reveal * 0.3);
        look.y = at.y + 1.25;
        look.lerp(tmpB.set(0, at.y + 1.4, DOOR_Z - 3), reveal * 0.6);
        return;
      }
      case S.rope:
        // From the right, so the paws on the rope show beside the body, and looking a little ahead to
        // where the chest comes from.
        rear(at, pos, look, 0.85, 1.9, 1.25);
        look.z -= 0.9;
        return;
      case S.key: {
        // From behind on the right while Kiki brings the key and Tapsi picks it up; for the turning
        // close over Tapsi's shoulder, where the key's ring turns in the picture.
        rear(at, pos, look, 0.7, 1.4, 0.9);
        const lock = v3(RAFT_X, LAGOON_LEVEL + 0.2 + LOCK.y, RAFT_TO + LOCK.z);
        look.copy(lock);
        const k = smooth((f.act + f.demo - KEY_PICKUP + 0.9) / 1.1) * (1 - smooth((f.praise - 0.4) / 1.5));
        look.lerp(lock.clone().add(KEY_RING), k);
        pos.lerp(lock.add(KEY_VIEW), k);
        return;
      }
      case S.coins: {
        // Behind Tapsi on the left and above: down into the chest and up with the coins over it. From further
        // left than straight behind, so the cliff right beside Tapsi stays out of the picture.
        pos.set(COIN_STAND.x - 2.6 + Math.sin(f.local * 0.3) * 0.1, at.y + 1.95, COIN_STAND.z + 1.2);
        look.set(COIN_STAND.x - 0.1, at.y + 0.85, COIN_STAND.z - 0.8);
        // Before that, while the chest opens and the crabs carry it up the beach to where Tapsi hops down.
        const toss = smooth((f.local - HOP_FROM + 0.4) / 1.8);
        if (toss < 1) {
          carryShot(f.local, carryPos, carryLook);
          pos.lerpVectors(carryPos, pos, toss);
          look.lerpVectors(carryLook, look, toss);
        }
        return;
      }
      case S.hooray:
        // In front: Tapsi has turned round to us and jumps for joy, the gold glittering out of the chest behind.
        rear(at, pos, look, 0.1, 1.5, 1.25);
        look.y += 0.45;
        return;
      case S.bye: {
        // In front; at the end the camera rises and flies back to show the whole island at sunset.
        rear(at, pos, look, 0, 1.6, 1.3);
        look.y += 0.6;
        const k = smooth((f.act - actLength(step) + 1.5) / 7);
        pos.lerp(tmpA.set(-12, 21, SHORE.z - 26), k);
        look.lerp(tmpA.set(0, 2, 2), k);
        return;
      }
      default:
        rear(at, pos, look, 0, 1.6);
    }
  }

  /**
   * While the chest opens and is carried up the beach, `local` seconds into the coins step: first behind
   * Tapsi and above, the opening chest in front; Ole turns round, and we see Tapsi's face; then back and
   * over to the right, so the crabs bringing the chest up the beach show too.
   */
  function carryShot(local: number, pos: THREE.Vector3, look: THREE.Vector3) {
    const at = tmpC.set(PARTY.x, Math.max(groundHeight(PARTY.x, PARTY.z), -TURTLE_FLOAT) + TURTLE_BACK, PARTY.z);
    tmpA.set(at.x - 0.6, at.y + 2.2, at.z + 3.6);
    tmpB.set(RAFT_X - 0.4, at.y + 0.7, RAFT_TO + 0.4);
    const follow = smooth((local - CARRY.off) / 3);
    at.lerp(tmpD.set(CHEST_SAND.x, at.y, CHEST_SAND.z), follow * 0.5);
    rear(at, pos, look, 0.25 - follow * 0.6, 1.3 + follow * 0.4, 1.15 + follow * 0.3);
    const k = smooth((local - 1.2) / 1.6);
    pos.lerpVectors(tmpA, pos, k);
    look.lerpVectors(tmpB, look, k);
  }

  /**
   * Blends two camera shots by going round `center` (Tapsi) instead of
   * straight through: from behind to the front the camera circles past.
   */
  function orbitBlend(
    center: THREE.Vector3,
    aPos: THREE.Vector3,
    aLook: THREE.Vector3,
    bPos: THREE.Vector3,
    bLook: THREE.Vector3,
    k: number,
    pos: THREE.Vector3,
    look: THREE.Vector3,
  ) {
    const ax = aPos.x - center.x;
    const az = aPos.z - center.z;
    const bx = bPos.x - center.x;
    const bz = bPos.z - center.z;
    const from = Math.atan2(ax, az);
    let turn = Math.atan2(bx, bz) - from;
    turn -= Math.round(turn / TAU) * TAU;
    // Nearly opposite: always the same way round, so it never flips between frames.
    if (Math.abs(turn) > Math.PI - 0.25) turn = Math.abs(turn);
    const a = from + turn * k;
    const r = Math.hypot(ax, az) + (Math.hypot(bx, bz) - Math.hypot(ax, az)) * k;
    const y = aPos.y + (bPos.y - aPos.y) * k;
    look.lerpVectors(aLook, bLook, k);
    pos.set(center.x + Math.sin(a) * r, y, center.z + Math.cos(a) * r);
  }

  /** The camera in the opening: the island from above the sea, then along the trail to the chest; after the cut, Tapsi on Ole at sea from the front. */
  function openingShot(t: number, pos: THREE.Vector3, look: THREE.Vector3) {
    if (t >= OPENING_CUT) {
      const k = smooth((t - OPENING_CUT) / (OPENING - OPENING_CUT));
      pos.set(2.2 - k * 0.6, 3.6 - k * 1.2, BOAT_START - 6.5 + k * 1.5);
      look.set(0, 1, BOAT_START);
      return;
    }
    const head = trail.head(trailAt(t), tmpA);
    // High up like over a map, so the drawn part of the trail shows; closer once it has reached the chest.
    const near = 1 - 0.45 * smooth((t - TRAIL_TO) / 1);
    const into = smooth((t - 0.2) / 1.4);
    pos.set(12, 30, BOAT_START + 24).lerp(tmpB.set(head.x + 2 * near, head.y + 24 * near, head.z + 18 * near), into);
    look.set(0, 0, 12).lerp(tmpB.set(head.x, head.y, head.z - 3), into);
  }

  /** How far the trail is drawn at a moment of the opening, 0..1. */
  const trailAt = (t: number) => smooth((t - TRAIL_FROM) / (TRAIL_TO - TRAIL_FROM));

  /** Which step's place the trail is passing in the opening. */
  function pointingAt(t: number) {
    if (t >= OPENING_CUT) return undefined;
    if (t < TRAIL_FROM) return S.hello;
    const z = trail.head(trailAt(t), tmpA).z;
    const places: [number, number][] = [
      [S.rope, SHORE.z + 1],
      [S.webs, DOOR_Z + 1.5],
      [S.riddle, RIDDLE_Z + 1.5],
      [S.apples, APPLE_Z + 1.5],
      [S.monkeys, MONKEY_Z + 1.5],
      [S.roll, ROLL_Z + 1.5],
      [S.gate, GATE_Z + 1.5],
      [S.drums, DRUMS_Z + 2],
      [S.duck, SWING_Z + 2],
      [S.jump, BROOK_FROM + 1],
      [S.stomp, STOMP_Z + 2],
    ];
    return places.find(([, at]) => z < at)?.[0] ?? S.paddle;
  }

  /**
   * Where Ole is, which way it looks, how much it walks and how far through its steps it is, and how
   * far it has turned side on in the bay (0..1), with Tapsi still facing the way.
   */
  const ride = { x: 0, z: 0, yaw: ISLAND, walking: 0, stride: 0, side: 0 };
  /** Ole takes a step every this many metres. */
  const STRIDE = 0.8;
  /** 0 → 1 → 0 over a walk that takes k from 0 to 1: Ole starts and stops its steps softly. */
  const walkingAt = (k: number) => (k > 0 && k < 1 ? ss(0, 0.08, k) * ss(1, 0.9, k) : 0);

  /**
   * Ole carries Tapsi through the story: swimming at sea, up the beach, along
   * the routes between the stations and across the bridge, through the door
   * and the gorge behind it, and in the bay side on at the water's edge; at
   * the treasure it turns round to face us and crawls up the beach.
   */
  function rideAt(f: StoryFrame) {
    const { step } = f;
    const travel = f.lead - f.demo;
    ride.yaw = ISLAND;
    ride.walking = 0;
    ride.stride = 0;
    ride.side = step > S.rope || (step === S.rope && f.act >= -f.demo) ? 1 : 0;
    const go = (points: [number, number][], k: number) => {
      const e = smooth(k) * 0.3 + k * 0.7;
      [ride.x, ride.z] = along(points, e);
      ride.walking = walkingAt(k);
      ride.stride = ((e * routeLength(points)) / STRIDE) * TAU;
      // Facing the way it goes, and round to the island again at the end.
      const [ax, az] = along(points, Math.max(0, e - 0.08));
      const [bx, bz] = along(points, Math.min(1, e + 0.08));
      if (Math.hypot(bx - ax, bz - az) > 1e-3) {
        let turn = Math.atan2(bx - ax, bz - az) - ISLAND;
        turn -= Math.round(turn / TAU) * TAU;
        ride.yaw = ISLAND + turn * ss(0, 0.15, k) * ss(1, 0.8, k);
      }
    };
    if (step <= S.paddle) {
      ride.x = 0;
      ride.z = boatZ(step, f.act, step === S.paddle ? f.praise : -1);
      if (step === S.paddle && f.praise > 0) {
        ride.walking = walkingAt(f.praise / 2);
        ride.stride = ((BOAT_END - ride.z) / STRIDE) * TAU;
      }
    } else if (step === S.stand || step === S.rollLeft || step === S.rollMiddle) {
      // Lying still on the beach while Tapsi gets up, and where the coconuts roll.
      [ride.x, ride.z] = standAt(step);
    } else if (step === S.rope && f.act < -f.demo) {
      // Through the gorge into the light of the bay, and round side on at the water's edge at the end.
      const k = clamp01((f.local - 0.3) / (travel - 0.6));
      go(route(step), k);
      ride.side = ss(0.75, 1, k);
      ride.yaw -= (Math.PI / 2) * ride.side;
    } else if (step === S.rope || step === S.key) {
      // Side on, its head to the right, so the raft comes right up to Tapsi in front.
      [ride.x, ride.z] = standAt(step);
      ride.yaw = ISLAND - Math.PI / 2;
    } else if (step === S.coins) {
      // Once the lid is open, Ole turns round under Tapsi to face us and crawls up the beach.
      const k = clamp01((f.local - 1.3) / 1.8);
      const e = smooth(k);
      ride.x = BAY.x;
      ride.z = BAY.z + (PARTY.z - BAY.z) * e;
      ride.yaw = ISLAND - Math.PI / 2 - Math.PI * e;
      ride.walking = walkingAt(k);
      ride.stride = e * 5 * TAU;
    } else if (step > S.coins) {
      [ride.x, ride.z] = standAt(step);
      ride.yaw = ISLAND - Math.PI * 1.5;
    } else if (f.act < -f.demo) {
      go(route(step), clamp01((f.local - 0.3) / (travel - 0.8)));
    } else if (step === S.jump) {
      // Steadily across the bridge while Tapsi hops on Ole's back.
      const clip = f.act + f.demo;
      ride.x = 0;
      ride.z = jumpZ(clip);
      ride.walking = clip < clipLength(S.jump) ? 0.6 : 0;
      ride.stride = ((JUMP_FROM - ride.z) / STRIDE) * TAU;
    } else {
      [ride.x, ride.z] = standAt(step);
    }
  }

  /** Ole on the water or the ground, tipped with the slope and the waves, rocking a little with its steps. */
  function placeTurtle(f: StoryFrame) {
    rideAt(f);
    const { x, z, yaw } = ride;
    const t = f.time;
    const hx = Math.sin(yaw);
    const hz = Math.cos(yaw);
    const front = turtleY(x + hx * 0.75, z + hz * 0.75, t);
    const back = turtleY(x - hx * 0.75, z - hz * 0.75, t);
    const left = turtleY(x + hz * 0.6, z - hx * 0.6, t);
    const right = turtleY(x - hz * 0.6, z + hx * 0.6, t);
    const ground = Math.max(groundHeight(x, z), bridgeTop(x, z));
    const y = Math.max(turtleY(x, z, t), (front + back) / 2, (left + right) / 2);
    const swimming = clamp01((waterAt(x, z, t) - TURTLE_FLOAT - ground) / 0.15);
    const dip = f.step === S.jump && bridgeTop(x, z) > -Infinity ? bridgeDip(f.act + f.demo) : 0;
    const step = Math.sin(ride.stride) * ride.walking * (1 - swimming);
    turtle.group.position.set(x, y + Math.abs(step) * 0.025 - dip, z);
    turtle.group.rotation.set(Math.atan2(back - front, 1.5), yaw, Math.atan2(left - right, 1.2) + step * 0.03, "YXZ");
    turtle.move(ride.stride, ride.walking, swimming, t);
    updateMoved(turtle.group);
  }

  /** The top of Ole's back at (x, z) in the world, e.g. where something lies on it. */
  function onOle(x: number, z: number, out: THREE.Vector3) {
    turtle.group.worldToLocal(out.set(x, turtle.group.position.y, z));
    out.y = turtleTop(out.x, out.z);
    return turtle.group.localToWorld(out);
  }

  /** How far the paddle has gone from Tapsi's lap onto the sand, in the praise after the paddling. */
  const putDown = (step: number, praise: number) => (step > S.paddle ? 1 : step === S.paddle ? clamp01((praise - 1.2) / 0.9) : 0);

  /** The paddle standing in the water beside Ole while Tapsi fishes, its top leaning against the shell towards Tapsi. */
  function paddleStanding(pos: THREE.Vector3, q: THREE.Quaternion) {
    turtle.group.localToWorld(pos.copy(PADDLE_STAND));
    // The paddle's own y (the shaft) points down into the water.
    return q.copy(turtle.group.quaternion).multiply(STANDING);
  }

  /**
   * The paddle stands in the water beside Ole while Tapsi waves, fishes and
   * sits down; before paddling, Tapsi takes it onto the lap with the right paw
   * first. Then it is always in Tapsi's paws: lying across the lap,
   * then taken up to paddle – its shaft through both paws, tipped a little
   * more, so the low blade reaches the water – and back on the lap; on the
   * beach Tapsi swings it out over Ole's side and lets it fall onto the sand.
   */
  function holdPaddle(f: StoryFrame) {
    const { step, act, praise } = f;
    const clip = act + f.demo;
    updateMoved(guide.root);
    // Across the lap, the blades flat; the paddle's own y (the shaft) to Tapsi's left.
    const lapPos = guide.lap.getWorldPosition(tmpA);
    lapQ.copy(guide.lap.getWorldQuaternion(tmpQ)).multiply(ACROSS);
    // How far the paddle has come from standing in the water onto the lap, and how firmly each paw holds it then.
    const before = (from: number, soft: number) => (step < S.paddle ? 0 : step === S.paddle ? smooth((f.local - from) / soft) : 1);
    const pick = before(0.6, 1.3);
    const grabR = before(0.1, 0.5);
    const grabL = before(1.3, 0.5);
    const sandPos = tmpB.copy(PADDLE_DROP);
    sandPos.y = Math.max(groundHeight(sandPos.x, sandPos.z), 0) + 0.03;

    const hold = step === S.paddle && f.opening === null ? smooth(clip / 0.7) * (1 - smooth(praise / 0.9)) : 0;
    const put = putDown(step, praise);
    const left = guide.gripPoint("L", new THREE.Vector3());
    const right = guide.gripPoint("R", new THREE.Vector3());
    const mid = left.clone().add(right).multiplyScalar(0.5);
    if (put > 0) {
      // Up and out to the right, over Ole's side, and down onto the sand.
      tmpC.copy(lapPos).lerp(sandPos, 0.4);
      tmpC.y = lapPos.y + 0.3;
      const u = 1 - put;
      paddle.position
        .set(0, 0, 0)
        .addScaledVector(lapPos, u * u)
        .addScaledVector(tmpC, 2 * u * put)
        .addScaledVector(sandPos, put * put);
      paddle.quaternion.slerpQuaternions(lapQ, ON_SAND, smooth(put));
    } else if (hold > 0) {
      // The shaft runs from paw to paw; tipped a little more than the paws, so the low blade reaches the water.
      const shaftAlong = left.clone().sub(right);
      const flat = Math.hypot(shaftAlong.x, shaftAlong.z);
      let tilt = Math.atan2(shaftAlong.y, flat) * PADDLE_TILT;
      // But never so much that the shaft goes through Ole: on the low side it has to pass over the shell.
      const lowX = (shaftAlong.x / flat) * (tilt > 0 ? -1 : 1);
      if (Math.abs(lowX) > 0.2) {
        let most = Infinity;
        for (const k of [0.3, 0.55, 0.8, 1]) {
          const x = Math.sign(lowX) * TURTLE_HALF_WIDTH * k;
          const toShell = (x - (mid.x - turtle.group.position.x)) / lowX;
          if (toShell > 0.05) most = Math.min(most, Math.atan2(mid.y - (turtle.group.position.y + turtleTop(x, 0) + 0.08), toShell));
        }
        tilt = Math.sign(tilt) * Math.min(Math.abs(tilt), Math.max(0, most));
      }
      const shaft = v3((shaftAlong.x / flat) * Math.cos(tilt), Math.sin(tilt), (shaftAlong.z / flat) * Math.cos(tilt));
      // The blades face the way Ole swims.
      const ahead = v3(Math.sin(guide.root.rotation.y), 0, Math.cos(guide.root.rotation.y));
      ahead.addScaledVector(shaft, -ahead.dot(shaft)).normalize();
      heldQ.setFromRotationMatrix(basis.makeBasis(new THREE.Vector3().crossVectors(shaft, ahead), shaft, ahead));
      // Lifted clear of the thighs while it turns from lying flat to upright.
      paddle.position.lerpVectors(lapPos, mid, hold).y += Math.sin(hold * Math.PI) * 0.1;
      paddle.quaternion.slerpQuaternions(lapQ, heldQ, hold);
    } else if (pick < 1) {
      // Lifted out of the water over Ole's side and laid across the lap.
      const standQ = paddleStanding(tmpC, new THREE.Quaternion());
      paddle.position.lerpVectors(tmpC, lapPos, pick).y += Math.sin(pick * Math.PI) * 0.2;
      paddle.quaternion.slerpQuaternions(standQ, lapQ, pick);
    } else {
      paddle.position.copy(lapPos);
      paddle.quaternion.copy(lapQ);
    }
    updateMoved(paddle);

    // The paws on the shaft: a shoulder's width apart on the lap, where they are when paddling; they
    // let go as the paddle swings out to fall.
    if (step === S.paddle) {
      const along = tmpC.set(0, 1, 0).applyQuaternion(paddle.quaternion);
      const center = paddle.position;
      const letGo = smooth((praise - 1.35) / 0.3);
      for (const [hand, at, lap, weight] of [
        ["L", left, PADDLE_GRIP, (1 - letGo) * grabL],
        ["R", right, -PADDLE_GRIP, (1 - letGo) * grabR],
      ] as const) {
        const s = lap + (at.clone().sub(center).dot(along) - lap) * hold;
        guide.hold(hand, center.clone().addScaledVector(along, s), along, weight);
      }
    }
    if (step === S.paddle && crossed(f, LEAD[S.paddle] + actLength(S.paddle) + 2.1)) {
      sand.burst(sandPos, 14, 2);
      cue("knock");
    }

    // A splash whenever a blade dips into the water.
    for (const [i, end] of [1, -1].entries()) {
      const tip = paddle.localToWorld(tmpB.set(0, end * (PADDLE_REACH - 0.15), 0));
      if (hold > 0.9 && bladeY[i] >= 0.12 && tip.y < 0.12) {
        spray.burst(v3(tip.x, 0.1, tip.z), 22, 3);
        cue("splash");
      }
      bladeY[i] = tip.y;
    }
  }

  /** Where the float is now: in the paws, flying out, on the water by `landing`, or reeled in. */
  function floatAt(clip: number, tip: THREE.Vector3, out: THREE.Vector3, time: number) {
    const hang = out.copy(tip).add(tmpC.set(0, -0.22, 0));
    const u = clip / CAST_PERIOD;
    const n = Math.floor(u);
    const k = u - n;
    const casting = clip >= 0 && n < fishes.length;
    if (casting && k >= CAST_OUT && k < CAST_LANDS) {
      // Out in a high arc.
      const t = (k - CAST_OUT) / (CAST_LANDS - CAST_OUT);
      const land = landing(n, tmpB);
      land.y = wave(land.x, land.z, time);
      return hang.lerp(land, t).add(tmpC.set(0, Math.sin(t * Math.PI) * 1.2, 0));
    }
    if (casting && k >= CAST_LANDS && k < REEL) {
      const land = landing(n, out);
      land.y = wave(land.x, land.z, time) + Math.sin(time * 5) * 0.02;
      return land;
    }
    // Reeled in quickly, on into the first moment of the next cast.
    let reeling = -1;
    let r = 0;
    if (casting && k >= REEL) [reeling, r] = [n, (k - REEL) / REEL_TIME];
    else if (clip >= 0 && n >= 1 && n - 1 < fishes.length && k + 1 - REEL < REEL_TIME) [reeling, r] = [n - 1, (k + 1 - REEL) / REEL_TIME];
    if (reeling >= 0) {
      const land = landing(reeling, tmpB);
      land.y = wave(land.x, land.z, time);
      return hang.lerp(land, 1 - smooth(r)).add(tmpC.set(0, Math.sin(r * Math.PI) * 0.15, 0));
    }
    return hang;
  }

  /** Where the float of cast n lands, ahead of Tapsi on the sea. */
  const landing = (n: number, out: THREE.Vector3) => out.set([0.3, -0.5, 0.6, -0.2, 0.1][n % 5], 0, BOAT_START - CAST_REACH - (n % 2) * 0.5);

  /**
   * The fishing rod lies on Ole's back while Tapsi waves; Tapsi picks it up and holds it in both paws,
   * tipped up, the float on its line. Each cast swings it back sideways over the right shoulder and out
   * ahead, and a fish leaps over the float. After the fishing Tapsi lays the rod down on Ole's back
   * again, where it stays for the rest of the way.
   */
  function holdRod(f: StoryFrame) {
    const { step, praise } = f;
    const clip = f.act + f.demo;
    // Lying on the round shell, it touches it once, halfway along, and is clear of it everywhere else:
    // along the shell's slope there, never through it.
    const shell = (z: number) => turtleTop(ROD_REST.x, z);
    const touch = ROD_REST.z - ROD_LENGTH * 0.4;
    const slope = (shell(touch + 0.01) - shell(touch - 0.01)) / 0.02;
    const onShell = (z: number) => shell(touch) + 0.05 + slope * (z - touch);
    const resting = turtle.group.localToWorld(tmpA.set(ROD_REST.x, onShell(ROD_REST.z), ROD_REST.z));
    const behind = turtle.group.localToWorld(tmpB.set(ROD_REST.x, onShell(ROD_REST.z - 0.6), ROD_REST.z - 0.6));
    restQ.setFromUnitVectors(UP, behind.sub(resting).normalize());
    const fishing = step === S.fish && f.opening === null;
    // Picked up in the travel before the fishing, laid down again in the praise after it.
    const down = fishing ? Math.max(1 - smooth((f.local - 0.7) / 1.0), smooth((praise - 0.2) / 0.8)) : 1;
    const grip = fishing ? smooth((f.local - 0.2) / 0.5) * (1 - smooth((praise - 0.4) / 0.5)) : 0;
    if (down < 1) {
      updateMoved(guide.root);
      // The right paw holds the rod in front of the chest; swung back it is up beside the head, over the
      // right shoulder and outside the head, cast out it is up ahead. The left paw holds lower down.
      const { back, out } = clip > 0 ? castSwing(clip) : { back: 0, out: 0 };
      const rest = Math.max(0, 1 - back - out);
      const paw = guide.bodyPoint(
        tmpB.set(-0.06 * rest - 0.3 * back - 0.08 * out, 0.2 * rest + 0.6 * back + 0.56 * out, 0.3 * rest - 0.02 * back + 0.34 * out),
        tmpB,
      );
      // Tipped up and a little forwards; swung back, it points up and back over the right shoulder, cast
      // out it points ahead to where the float flies.
      const yaw = guide.root.rotation.y;
      const ahead = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
      const right = new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw));
      const dir = new THREE.Vector3(0, 1, 0)
        .addScaledVector(ahead, 0.3 - back * 1.15 + out * 0.55)
        .addScaledVector(right, 0.12 + back * 0.4)
        .normalize();
      heldQ.setFromUnitVectors(UP, dir);
      const butt = paw.addScaledVector(dir, -ROD_GRIP_R);
      rod.position.lerpVectors(butt, resting, down);
      rod.quaternion.slerpQuaternions(heldQ, restQ, down);
    } else {
      rod.position.copy(resting);
      rod.quaternion.copy(restQ);
    }
    updateMoved(rod);
    if (grip > 0) {
      const along = new THREE.Vector3(0, 1, 0).applyQuaternion(rod.quaternion);
      guide.hold("R", rod.position.clone().addScaledVector(along, ROD_GRIP_R), along, grip);
      guide.hold("L", rod.position.clone().addScaledVector(along, ROD_GRIP_L), along, grip);
    }

    // The float and its line, while fishing.
    const casting = fishing && praise < 0.2 && down < 0.6;
    bobber.visible = line.visible = casting;
    const tip = rodTip.getWorldPosition(new THREE.Vector3());
    if (casting) {
      floatAt(clip, tip, bobber.position, f.time);
      line.position.lerpVectors(tip, bobber.position, 0.5);
      line.scale.y = Math.max(0.01, tip.distanceTo(bobber.position));
      line.quaternion.setFromUnitVectors(UP, tmpC.copy(bobber.position).sub(tip).normalize());
    }

    // A fish leaps over the float after every cast: out on one side, in on the other.
    fishes.forEach((fish, n) => {
      const t = (clip / CAST_PERIOD - n - LEAP_FROM) / (LEAP_TO - LEAP_FROM);
      fish.visible = step === S.fish && f.opening === null && t > 0 && t < 1;
      const land = landing(n, tmpB);
      const sea = wave(land.x, land.z, f.time);
      if (fish.visible) {
        fish.position.set(land.x + 0.7 - 1.4 * t, sea - 0.15 + Math.sin(t * Math.PI) * 1.1, land.z - 0.25);
        fish.lookAt(tmpC.copy(fish.position).add(tmpA.set(-1.4, Math.cos(t * Math.PI) * Math.PI * 1.1, 0)));
      }
      if (step !== S.fish) return;
      const at = (k: number) => crossed(f, TRAVEL[S.fish] + (n + k) * CAST_PERIOD);
      if (at(0.45)) cue("whoosh");
      for (const [k, x] of [
        [CAST_LANDS, land.x],
        [LEAP_FROM, land.x + 0.7],
        [LEAP_TO, land.x - 0.7],
      ]) {
        if (at(k)) {
          spray.burst(tmpA.set(x, sea + 0.05, land.z - 0.25), 16, 2);
          cue("splash");
        }
      }
    });
  }

  /** While the key turns in the lock, the right paw holds its ring and turns with it. */
  function holdKey(f: StoryFrame) {
    const clip = f.act + f.demo;
    if (f.step !== S.key || !key.visible) return;
    const weight = smooth((clip - KEY_PICKUP + 0.3) / 0.3) * (1 - smooth((clip - lastTurn - 0.1) / 0.4));
    if (weight <= 0) return;
    key.updateMatrixWorld(true);
    const ring = key.localToWorld(new THREE.Vector3(0, 0, -0.19));
    const across = new THREE.Vector3(0, 1, 0).applyQuaternion(key.quaternion);
    guide.hold("R", ring, across, weight);
  }

  /** Both paws on the level bar of the crank, all the way round, from just before Tapsi starts to turn it. */
  function holdCrank(f: StoryFrame) {
    if (f.step !== S.gate) return;
    const clip = f.act + f.demo;
    const weight = smooth((clip + 0.6) / 0.6) * (1 - smooth((f.praise - 0.3) / 0.6));
    if (weight <= 0) return;
    gate.group.updateMatrixWorld(true);
    const bar = gate.bar.getWorldPosition(new THREE.Vector3());
    const across = new THREE.Vector3(1, 0, 0);
    // Tapsi's left is -x here, facing the island.
    guide.hold("L", bar.clone().addScaledVector(across, -CRANK_BAR * 0.3), across, weight);
    guide.hold("R", bar.clone().addScaledVector(across, CRANK_BAR * 0.3), across, weight);
  }

  /**
   * Hand over hand on the rope: the pulling paw holds it and comes back to the body while the other goes
   * out open, a little above and beside it, to take hold further on. The rope runs from the chest
   * through the holding paws, past Tapsi's right side and down onto Ole's back, never through the body.
   */
  function holdRope(f: StoryFrame) {
    for (const part of ropeParts) {
      scene.remove(part);
      part.geometry.dispose();
    }
    ropeParts.length = 0;
    const len = actLength(S.rope);
    if (f.step !== S.rope || f.act < -f.demo || f.act >= len + 0.5) return;
    const clip = Math.min(f.act + f.demo, goes(S.rope) * PULL_PERIOD);
    const weight = smooth(clip / 0.3) * (1 - smooth((f.act - len) / 0.4));
    const tie = chest.group.getWorldPosition(new THREE.Vector3()).add(ROPE_TIE);
    // Where the rope passes in front of the belly, and from there straight to the chest.
    const near = guide.hipsPoint(v3(-0.03, 0.27, 0.21), new THREE.Vector3());
    const along = tie.clone().sub(near).normalize();
    // Once the chest is close, the paws stay short of where the rope is tied.
    const span = Math.min(ROPE_REACH * GUIDE_SIZE, Math.max(0, near.distanceTo(tie) - 0.15));
    const zero = guide.hipsPoint(v3(0, 0, 0), new THREE.Vector3());
    const reach = pullReach(clip);
    const held: THREE.Vector3[] = [];
    (["L", "R"] as const).forEach((hand, i) => {
      // Holding on while it comes back to the body (the middle of its period), open while it goes out.
      const k = (clip / PULL_PERIOD + i * 0.5) % 1;
      const grip = ss(0.2, 0.27, k) * ss(0.8, 0.73, k);
      const onRope = near.clone().addScaledVector(along, span * (i ? 1 - reach : reach));
      const open = guide.hipsPoint(v3((i ? -1 : 1) * 0.07, 0.06, 0), new THREE.Vector3()).sub(zero);
      guide.hold(hand, onRope.clone().addScaledVector(open, 1 - grip), along, weight);
      if (grip > 0.5) held.push(onRope.lerp(guide.gripPoint(hand, new THREE.Vector3()), weight));
    });
    held.sort((a, b) => a.distanceTo(tie) - b.distanceTo(tie));
    if (held.length === 0) held.push(near.clone().addScaledVector(along, span * 0.5));
    const tube = (points: THREE.Vector3[], segments: number) => {
      const part = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, false, "centripetal"), segments, 0.03, 6), ropeMat);
      part.castShadow = true;
      scene.add(part);
      ropeParts.push(part);
    };
    // Out to the chest: taut while a paw pulls, sagging a little in between (less when it is short).
    const far = held[0];
    const tug = clamp01((pulledIn(clip + 0.05) - pulledIn(clip)) / 0.1);
    const mid = far.clone().lerp(tie, 0.5);
    mid.y -= (0.05 + 0.2 * (1 - tug)) * clamp01(far.distanceTo(tie) / 3);
    tube([tie, mid, far], 24);
    // Through the paws and off to the right side, down onto Ole's back and lying along it.
    const tail = ROPE_TAIL.map((p, n) => (n < 2 ? guide.hipsPoint(p, new THREE.Vector3()) : guide.root.localToWorld(p.clone())));
    tube([far.clone().addScaledVector(along, 0.1), ...held, ...tail], 32);
  }

  /** How far Tapsi leans forward: picking up and laying down the rod, lifting the paddle out of the water, swinging it out over Ole's side. */
  function bendAt(f: StoryFrame) {
    if (f.opening !== null) return 0;
    const bump = (t: number, from: number, to: number, soft: number) => smooth((t - from) / soft) * (1 - smooth((t - to) / soft));
    if (f.step === S.fish) return 0.3 * (bump(f.local, 0.3, 1.2, 0.4) + bump(f.praise, 0.2, 0.9, 0.4));
    if (f.step === S.paddle) return 0.2 * (bump(f.local, 0.5, 1.6, 0.4) + smooth((f.praise - 1.0) / 0.4) * (1 - smooth((f.praise - 1.6) / 0.5)));
    return 0;
  }

  /**
   * Tapsi on Ole's back: standing to wave and fish, sitting down slowly before the paddling, getting up
   * slowly on the beach, and always facing the way Ole carries it.
   */
  function placeGuide(f: StoryFrame) {
    const { step } = f;
    const clip = f.act + f.demo;
    const sitting = step === S.sit ? sitProgress(clip) : step === S.paddle ? 1 : step === S.stand ? 1 - sitProgress(clip) : 0;
    // The ears fold back flat when the head bumps a star box.
    const bumpNow = step === S.jump ? Math.round((clip - JUMP_PEAK) / JUMP_PERIOD) : -1;
    guide.earsBack = bumpNow >= 0 && bumpNow < boxes.length ? clamp01(1.4 - Math.abs(clip - bumpTime(bumpNow)) / 0.3) : 0;
    // In the bay Ole lies side on, Tapsi across its back facing the water; turning round, Ole turns Tapsi with it.
    turtle.group.localToWorld(guide.root.position.set(0, TURTLE_BACK - SIT_DROP * sitting, 0));
    guide.root.rotation.y = ride.yaw + (Math.PI / 2) * ride.side;
    // At the end Tapsi hops down off Ole's back into the sand before the chest, turning round to it in
    // the air, and stays there; for the hooray it turns back to us.
    const off = step === S.coins ? clamp01((f.local - HOP_FROM) / (HOP_LAND - HOP_FROM)) : step > S.coins ? 1 : 0;
    if (off > 0) {
      guide.root.position.lerp(tmpA.set(COIN_STAND.x, groundHeight(COIN_STAND.x, COIN_STAND.z), COIN_STAND.z), smooth(off));
      guide.root.position.y += Math.sin(off * Math.PI) * 0.35;
      guide.root.rotation.y += Math.PI * (step === S.coins ? smooth(off) : step === S.hooray ? 1 - smooth(f.local / 1.2) : 0);
    }
    guide.joy = step === S.coins ? smooth((f.local - 0.8) / 0.6) : step > S.coins ? 1 : 0;
    return { sitting };
  }

  /** Where the chest is (world), for the crabs carrying it. */
  const chestAt = new THREE.Vector3();

  /**
   * Before the coins two crabs come up out of the water at the raft, lift the open chest off it onto their
   * backs, carry it up the beach past Ole and set it down in the sand where Tapsi will stand before it;
   * then they dig themselves in. Before that it sits on the raft.
   */
  function placeChest(f: StoryFrame) {
    const { step, time } = f;
    const h = step === S.coins ? f.local : step > S.coins ? 99 : -1;
    const show = h >= CARRY.up && h < CARRY.gone + 0.6;
    porters.forEach((crab) => {
      crab.group.visible = show;
    });
    if (h < CARRY.lift) {
      chest.group.position.set(0, CHEST_Y, CHEST_Z);
      chest.group.quaternion.identity();
    }
    // The crabs' backs: a little under the water out in the bay, on the sand up the beach.
    const base = (x: number, z: number) => Math.max(groundHeight(x, z), LAGOON_LEVEL - 0.2);
    const onCrate = raft.localToWorld(tmpB.set(0, CHEST_Y, CHEST_Z));
    const [sx, sz] = CARRY_PATH[0];
    const start = tmpC.set(sx, base(sx, sz) + 0.32, sz);
    let k = 0;
    if (h < CARRY.lift) {
      chestAt.copy(start);
    } else if (h < CARRY.off) {
      // Off the crate in a little arc onto the crabs.
      const e = smooth((h - CARRY.lift) / (CARRY.off - CARRY.lift));
      chestAt.lerpVectors(onCrate, start, e);
      chestAt.y += Math.sin(e * Math.PI) * 0.2;
    } else {
      k = clamp01((h - CARRY.off) / (CARRY.down - CARRY.off));
      const [x, z] = along(CARRY_PATH, smooth(k) * 0.3 + k * 0.7);
      const down = smooth((h - CARRY.down) / (CARRY.set - CARRY.down));
      chestAt.set(x, base(x, z) + 0.32 * (1 - down) + (k < 1 ? Math.abs(Math.sin(time * 9)) * 0.03 : 0), z);
    }
    if (h >= CARRY.lift) {
      // Level, whichever way the raft rocks.
      updateMoved(raft);
      chest.group.position.copy(raft.worldToLocal(tmpB.copy(chestAt)));
      chest.group.quaternion.copy(raft.quaternion).invert();
    }
    if (!show) return;
    // Under the chest's two ends while carrying; then out to the sides and down into the sand.
    const rise = smooth((h - CARRY.up) / (CARRY.lift - CARRY.up));
    const leave = smooth((h - CARRY.set) / 0.6);
    const dig = smooth((h - CARRY.gone) / 0.6);
    porters.forEach((crab, i) => {
      const side = i ? 1 : -1;
      const p = tmpB.set(side * (0.35 + leave * 0.7), 0, 0).add(chestAt);
      p.y = base(p.x, p.z) - 0.6 * (1 - rise) - 0.6 * dig;
      crab.group.position.copy(p);
      crab.dance(time * 1.5 + i, 0.3);
    });
  }

  function updateWorld(f: StoryFrame) {
    const { step, act, time } = f;
    const len = actLength(step);
    const inAct = act >= 0 && act <= len;
    /** Time in the step's clip: from when Tapsi starts to show the movement. */
    const clip = act + f.demo;
    /** True if this frame passed the moment `c` of the step's clip. */
    const atClip = (c: number) => crossed(f, TRAVEL[step] + c);
    updateMoved(guide.root);

    // Scorpions crawl over the sand and up onto Ole's shell, one for every stomp of the clip, straight
    // to a foot at an even pace: they are still crawling when it comes down on them – plopp, flat, and
    // gone in a puff of sand. They live on Ole, so x is Ole's left, which is Tapsi's left here.
    const CRAWL = 1.6;
    scorpions.forEach((sc, n) => {
      const t = clip - sc.land;
      const on = step === S.stomp && f.opening === null && t > -CRAWL && t < 0.6;
      sc.group.visible = on;
      if (!on) return;
      // Even ones come to the left foot, which stamps first.
      const side = n % 2 === 0 ? 1 : -1;
      const footX = side * 0.13 * GUIDE_SIZE;
      const footZ = 0.05;
      const fromX = side * (TURTLE_HALF_WIDTH + 0.55 + (n % 3) * 0.15);
      // From the front half, so they never cross the rod lying behind Tapsi on the left.
      const fromZ = 0.75 - (n % 3) * 0.25;
      const at = (k: number) => [fromX + (footX - fromX) * k, fromZ + (footZ - fromZ) * k] as const;
      const k = Math.min(1, (t + CRAWL) / CRAWL);
      const [px, pz] = at(k);
      const [qx, qz] = at(Math.min(1, k + 0.04));
      sc.group.position.set(px, turtleTop(px, pz), pz);
      // Nose up while climbing the shell's side.
      const climb = Math.atan2(turtleTop(qx, qz) - turtleTop(px, pz), Math.hypot(qx - px, qz - pz) || 1);
      sc.group.rotation.set(-climb, Math.atan2(footX - fromX, footZ - fromZ), 0, "YXZ");
      if (t < 0) sc.walk(time * 1.5 + n);
      const flat = t > 0 ? Math.min(1, t * 10) : 0;
      const gone = 1 - smooth((t - 0.3) / 0.3);
      sc.group.scale.set((1 + flat * 0.45) * gone, (1 - flat * 0.85) * gone, (1 + flat * 0.45) * gone);
      if (atClip(sc.land)) {
        sand.burst(turtle.group.localToWorld(tmpA.set(footX, TURTLE_BACK + 0.05, footZ)), 16, 2.2);
        cue("pop");
      }
    });

    // Over the brook: the bridge gives a little under every landing, and a star comes out of every box the head bumps.
    bridge.position.y = step === S.jump ? -bridgeDip(clip) : 0;
    boxes.forEach((box, n) => {
      const since = step === S.jump ? clip - bumpTime(n) : step > S.jump ? 99 : -99;
      box.set(since, time);
      if (step === S.jump && atClip(bumpTime(n))) {
        gold.burst(box.group.getWorldPosition(tmpA).add(v3(0, 0.6, 0)), 22, 3);
        cue("knock");
        cue("sparkle");
      }
    });

    // The swinging log waits hooked up in front, so Tapsi can walk in under it. It is let go when Tapsi
    // shows the ducking: one pass right over the head for every duck of the clip, front to back and back
    // again; at the end it is up in front again and is hooked up higher, so Tapsi walks on below it.
    let swingAngle = -SWING_HELD + Math.sin(time * 0.8) * 0.03;
    if (step === S.duck && clip > 0) {
      swingAngle = -SWING_HELD * Math.cos((clip / SWING_PERIOD) * TAU);
      if (clip >= clipLength(step)) swingAngle = -SWING_HELD - (SWING_PARKED - SWING_HELD) * smooth((clip - clipLength(step)) / 1.5);
      for (let n = 0; n * 3 < clipLength(step); n++) if (atClip(0.9 + n * 3)) cue("whoosh");
    } else if (step > S.duck) {
      swingAngle = -SWING_PARKED + Math.sin(time * 0.8) * 0.03;
    }
    swing.pivot.rotation.x = -swingAngle;

    // Drums: beat n comes down on the left drum when even, the right one when odd. The drum bounces
    // and swings, and the nearest bird on the path on that side startles, hops and flies off the path
    // to that side, over the bushes and away; with the last beat the way is free.
    const beatAt = (n: number) => DRUM_HIT + n * (DRUM_PERIOD / 2);
    for (const side of [0, 1]) {
      let since = -1;
      for (let n = side; n < beats; n += 2) if (step === S.drums && clip >= beatAt(n)) since = clip - beatAt(n);
      drums.set(side, since);
    }
    birds.forEach((b, n) => {
      const t = step === S.drums ? clip - beatAt(n) : step > S.drums ? 99 : -1;
      if (step === S.drums && atClip(beatAt(n))) {
        cue("drum");
        if (n % 2 === 0) cue("tweet");
      }
      b.group.visible = t < 2.5;
      if (!b.group.visible) return;
      if (t < 0) {
        b.group.position.copy(b.home);
        b.group.rotation.set(0, b.look, 0);
        b.pose(time + n * 0.7, false);
        return;
      }
      // A startled hop on the spot, then up and away sideways, faster and faster.
      const hop = t < 0.18 ? Math.sin((t / 0.18) * Math.PI) * 0.12 : 0;
      const fly = Math.max(0, t - 0.12);
      b.group.position.set(
        b.home.x + b.side * (fly * 1.6 + fly * fly * 1.4),
        b.home.y + hop + fly * 1.5 + fly * fly * 0.5 + Math.sin(fly * 9) * 0.04,
        b.home.z - fly * 0.5,
      );
      // Turned to fly out sideways, nose a little up.
      const turn = smooth(t / 0.25);
      b.group.rotation.set(-0.35 * turn, b.look + ((b.side * Math.PI) / 2 - b.look) * turn, 0, "YXZ");
      b.pose(time, t > 0.08);
    });
    flock.update();

    // The gate: the crank follows Tapsi's paws, and every half turn the gate clicks up a bit.
    let lift = step > S.gate ? GATE_LIFT : 0;
    let crankAngle = 0;
    if (step === S.gate && clip > 0) {
      const q = crankTurns(clip) * 2;
      const all = crankTurns(clipLength(step)) * 2;
      lift = GATE_LIFT * clamp01((Math.floor(q) + smooth(((q % 1) - 0.2) / 0.5)) / all);
      // Where the clip's paws are on their circle: to Tapsi's left at its start, then up, right and down.
      crankAngle = Math.PI / 2 - (clip / CRANK_PERIOD) * TAU;
      for (let n = 1; n <= all; n++) if (atClip((n * CRANK_PERIOD) / 2 - 0.3)) cue("knock");
      if (atClip(clipLength(step) - 0.2)) cue("rumble");
    }
    gate.set(lift, crankAngle);

    // The monkeys up in the palms drop small coconuts that roll down the path at Tapsi: first right through
    // where it stood (a big step aside), then on its left under the lifted foot, then in the middle between
    // its feet. Each is held up, dropped, bounces and rolls, and passes Tapsi when the step is furthest out.
    const throwing = [0, 0];
    rollers.forEach(({ nut, step: at, n }) => {
      const pass = DODGE_PASS + n * DODGE_PERIOD;
      const dt = clip - pass;
      const on = step === at && f.opening === null && dt > -ROLL_LEAD && dt < 1.2 && pass < clipLength(step);
      nut.visible = on;
      if (!on) return;
      // From the monkey on Tapsi's right (+x) first, from the left one for the left foot, in turns for the middle.
      const side = at === S.roll ? 1 : at === S.rollLeft ? -1 : n % 2 === 0 ? 1 : -1;
      const hand = monkeys[side > 0 ? 1 : 0].hand.getWorldPosition(tmpA);
      const x = at === S.roll ? 0.05 : at === S.rollLeft ? -0.15 * GUIDE_SIZE : 0;
      const drop = -ROLL_LEAD + 0.6;
      const land = drop + 0.55;
      // Onto the bank in front of Ole.
      const landAt = tmpB.set(hand.x * 0.6, 0, ROLL_BANK_END - 1.0);
      landAt.y = groundHeight(landAt.x, landAt.z) + ROLL_RADIUS;
      if (dt < drop) {
        // Held up by the monkey, its arm going back to throw.
        throwing[side > 0 ? 1 : 0] = clamp01((dt + ROLL_LEAD) / 0.5);
        nut.position.copy(hand);
      } else if (dt < land) {
        // Falling, faster and faster.
        const v = (dt - drop) / (land - drop);
        nut.position.lerpVectors(hand, landAt, v);
        nut.position.y = hand.y + (landAt.y - hand.y) * v * v;
      } else {
        // Rolling, steadily, into its lane before it reaches Tapsi and straight on past.
        const u = (dt - land) / -land;
        const speed = (ROLL_Z - landAt.z) / -land;
        const z = u < 1 ? landAt.z + (ROLL_Z - landAt.z) * u : ROLL_Z + speed * dt;
        const nx = x + (landAt.x - x) * (1 - smooth(clamp01(u * 1.3)));
        // Off the bank's edge in a hop over Ole's head and onto the shell.
        const off = (z - ROLL_BANK_END + 0.4) / 1.25;
        const hop = off > 0 && off < 1 ? groundHeight(nx, ROLL_BANK_END - 0.4) + 0.25 * Math.sin(Math.PI * off) : -Infinity;
        const over = Math.max(groundHeight(nx, z), onOle(nx, z, tmpC).y, hop);
        const since = dt - land;
        const bounce = 0.3 * Math.exp(-5 * since) * Math.abs(Math.sin(since * 10));
        nut.position.set(nx, over + ROLL_RADIUS + bounce, z);
        nut.rotation.set(z / ROLL_RADIUS, 0, 0);
      }
      if (atClip(pass + land)) cue("knock");
      if (atClip(pass - 0.5)) cue("whoosh");
    });

    // The monkeys throw small coconuts; each flies, in slow motion as it passes, right where Tapsi's head was.
    throws.forEach((th, n) => {
      const pass = LEAN_PERIOD / 4 + n * (LEAN_PERIOD / 2);
      const dt = clip - pass;
      const valid = step === S.monkeys && f.opening === null && pass < clipLength(step) - 0.2;
      // Even: Tapsi leans to its left (-x), the nut comes from the monkey on the right.
      const side = n % 2 === 0 ? 1 : -1;
      const monkey = monkeys[side > 0 ? 1 : 0];
      if (valid && dt > -1.6 && dt < -0.95) throwing[side > 0 ? 1 : 0] = clamp01((dt + 1.6) / 0.65);
      const flying = valid && dt > -1 && dt < 0.7;
      th.nut.visible = flying;
      if (!th.curve) {
        monkey.hand.updateMatrixWorld(true);
        const start = monkey.hand.getWorldPosition(new THREE.Vector3());
        const g = groundHeight(0, MONKEY_Z) + TURTLE_BACK;
        // Through where the head was, close to the head leaning away, and on out to the same side.
        const passAt = v3(side * 0.12, g + 1.25, MONKEY_Z);
        const end = v3(side * 1.2, g + 0.3, MONKEY_Z + 3.5);
        const control = passAt.clone().multiplyScalar(2).sub(start.clone().add(end).multiplyScalar(0.5));
        th.curve = new THREE.QuadraticBezierCurve3(start, control, end);
      }
      // Fast far away, nearly still right at the head: u goes 0 → 0.5 (passing) → 1.
      const u = (d: number) => (d < 0 ? 0.5 - 0.5 * (0.12 * (-d / 1) + 0.88 * (-d / 1) ** 2) : 0.5 + 0.5 * (0.12 * (d / 0.7) + 0.88 * (d / 0.7) ** 2));
      if (flying) {
        th.curve.getPoint(clamp01(u(dt)), th.nut.position);
        th.nut.rotation.set(time * 7, time * 5, 0);
      }
      // Rings in the air behind the nut, like in a slow-motion film.
      th.rings.forEach((ring, i) => {
        const age = dt - RING_TIMES[i];
        ring.visible = valid && age > 0 && age < 0.8;
        if (!ring.visible) return;
        const at = clamp01(u(RING_TIMES[i]));
        th.curve!.getPoint(at, ring.position);
        ring.lookAt(th.curve!.getPoint(Math.min(1, at + 0.01), tmpC));
        ring.scale.setScalar(0.12 + age * 0.45);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - age / 0.8);
      });
      if (valid && atClip(pass - 0.55)) cue("whoosh");
    });
    const monkeysCheer = step === S.monkeys ? smooth(f.praise / 0.5) : 0;
    monkeys.forEach((m, i) => m.pose(throwing[i], monkeysCheer, time + i));

    // Apples: each reach picks one from the bunch above that paw; it plumps into the basket.
    apples.forEach((ap, n) => {
      const pick = REACH_PERIOD / 4 + n * (REACH_PERIOD / 2);
      // Even: the left paw (Tapsi's left is -x).
      const side = n % 2 === 0 ? -1 : 1;
      const g = groundHeight(0, APPLE_Z) + TURTLE_BACK;
      const hang = tmpA.set(side * REACH_TOP.x, g + REACH_TOP.y + 0.07, APPLE_Z - REACH_TOP.z).add(ap.jitter);
      const slot = tmpB.set(basketAt.x + Math.cos(n * 2.4) * 0.13, basketAt.y + 0.13 + Math.floor(n / 4) * 0.08, basketAt.z + Math.sin(n * 2.4) * 0.13);
      const dt = step === S.apples ? clip - pick : step > S.apples ? 99 : -99;
      ap.stem.visible = dt < 0;
      if (dt < 0) ap.group.position.copy(hang);
      else if (dt < 0.25) (side < 0 ? guide.handL : guide.handR).getWorldPosition(ap.group.position);
      else if (dt < 0.75) {
        const k = (dt - 0.25) / 0.5;
        ap.group.position.lerpVectors(hang, slot, k);
        ap.group.position.y += Math.sin(k * Math.PI) * 0.25;
      } else ap.group.position.copy(slot);
      if (step === S.apples) {
        if (atClip(pick)) cue("pop");
        if (atClip(pick + 0.75)) cue("knock");
      }
    });

    // The riddle, twice round: the picture of the shape that comes next blinks, and lights up once the
    // shape is made, brighter in the second round.
    const shapes = riddleRounds * 3;
    let solved = step > S.riddle ? shapes : 0;
    for (let i = 0; i < 3; i++) {
      let k = step > S.riddle ? 1 : 0;
      if (step === S.riddle && clip > 0) {
        for (let n = i; n < shapes; n += 3) {
          const from = n * SHAPE_SECONDS;
          const done = from + SHAPE_SECONDS * 0.4;
          if (atClip(done)) {
            tmpA.set((i - 1) * 1.55, groundHeight(0, DOOR_Z) + 4.05, DOOR_Z + 0.9);
            gold.burst(tmpA, 18, 3);
            cue("chime");
          }
          if (clip >= done) {
            k = 0.7 + (0.3 * (Math.floor(n / 3) + 1)) / riddleRounds;
            solved = Math.max(solved, n + 1);
          } else {
            if (clip >= from - 0.5) k = k > 0 ? k - 0.2 + 0.2 * Math.sin(time * 9) : 0.25 + 0.2 * Math.sin(time * 9);
            break;
          }
        }
      }
      riddle.set(i, step > S.webs ? 0.4 : k);
    }

    // With the riddle solved the spiral glows bright and the door sinks into the ground.
    const open = step > S.riddle ? 1 : step === S.riddle ? smooth((f.praise - 0.3) / 2) : 0;
    if (step === S.riddle && crossed(f, LEAD[S.riddle] + len + 0.3)) cue("rumble");
    // Light flashes in the doorway while the door sinks and is gone once it is down: through the cobwebs one
    // sees the gorge behind them, not a white wall.
    const shine = step === S.riddle ? Math.sin(open * Math.PI) * 0.8 : 0;
    door.set(open, step === S.riddle ? Math.max((solved / shapes) * 0.3, smooth(f.praise / 0.5)) : open, shine);

    // Cobwebs in the passage: each sweep of a paw tears the front one on its side; it blows away
    // to that side and is gone. The little spider climbs up its thread when the way is free.
    webs.forEach(({ web, home, side }, n) => {
      const torn = BRUSH_HIT + n * (BRUSH_PERIOD / 2);
      const since = step === S.webs ? clip - torn : step > S.webs ? 99 : -99;
      const material = web.material as THREE.MeshBasicMaterial;
      web.visible = since < 0.8 && step >= S.riddle;
      if (!web.visible) return;
      const k = clamp01(since / 0.8);
      web.position.copy(home);
      web.position.x += side * (k * k * 2.2);
      web.position.y += Math.sin(time * 1.3 + n) * 0.02 + k * 0.4;
      web.rotation.set(0, side * k * 1.1, side * k * 0.9);
      // The paw pulls it a little before it tears.
      const tug = since > -0.25 && since < 0 ? Math.sin(((since + 0.25) / 0.25) * Math.PI) : 0;
      web.scale.set(1 - k * 0.5 + tug * 0.08, 1 - k * 0.6, 1);
      material.opacity = 0.85 * (1 - k);
      if (step === S.webs && atClip(torn)) {
        spray.burst(tmpA.copy(home).add(v3(side * 0.4, 0, 0.2)), 10, 1.5);
        cue("whoosh");
      }
    });
    const lastWeb = BRUSH_HIT + (webs.length - 1) * (BRUSH_PERIOD / 2);
    const climb = step > S.webs ? 1 : step === S.webs ? smooth((clip - lastWeb - 0.3) / 1.5) : 0;
    spider.group.visible = step >= S.riddle && climb < 1;
    const hang = 2.0 + TURTLE_BACK + Math.sin(time * 1.6) * 0.05 + climb * 1.6;
    spider.group.position.set(0.05, webGround + hang, WEB_Z - WEB_GAP * 0.5);
    spider.group.rotation.set(0, Math.sin(time * 0.9) * 0.4, 0);
    // The thread goes up to the stone above the door.
    const thread = Math.max(0.02, 3.5 - hang - 0.1);
    spider.thread.scale.y = thread;
    spider.thread.position.y = 0.1 + thread / 2;
    if (step === S.webs && atClip(lastWeb + 0.4)) cue("sparkle");

    // The chest on its raft comes closer with every pull: a tug, its front lifting a little and water
    // splashing up at the front; in between it stops.
    const raftZ = raftAt(step, act);
    const tug = step === S.rope ? clamp01((raftAt(step, act + 0.1) - raftZ) / 0.25) : 0;
    if (step === S.rope) {
      for (let n = 1; n * (PULL_PERIOD / 2) <= goes(step) * PULL_PERIOD; n++) {
        if (atClip(n * (PULL_PERIOD / 2) - 0.45)) {
          cue("splash");
          spray.burst(tmpA.set(RAFT_X, LAGOON_LEVEL + 0.05, raftZ + 0.9), 10, 1.5);
        }
      }
    }
    raft.position.set(RAFT_X, LAGOON_LEVEL + Math.sin(time * 1.4) * 0.03, raftZ);
    raft.rotation.set(-tug * 0.06, 0, Math.sin(time * 1.1) * 0.03);
    // In the opening the chest waits far out in the bay, at the end of the trail.
    raft.visible = step >= S.webs || f.opening !== null;
    updateMoved(raft);

    // The key: Kiki drops it in front of Tapsi, Tapsi picks it up, puts it in the lock and turns it.
    const [keyX, keyZ] = standAt(S.key);
    const unlocked = step > S.key ? 1 : step === S.key ? smooth((clip - lastTurn) / 0.3) : 0;
    key.visible = step === S.key && f.local > 0.4 && clip < lastTurn + 0.5;
    if (key.visible) {
      // On Ole's back in front of Tapsi's feet.
      const lying = onOle(keyX + 0.15, keyZ - 0.35, new THREE.Vector3()).add(v3(0, 0.03, 0));
      if (f.local < 1.3) {
        // Falling from Kiki's feet.
        const k = clamp01((f.local - 0.9) / 0.4);
        key.position
          .copy(parrot.group.position)
          .add(v3(0, -0.15, 0))
          .lerp(lying, k * k);
        key.rotation.set(0, time * 3, 0);
        if (crossed(f, 1.3)) {
          gold.burst(lying, 14, 2);
          cue("sparkle");
        }
      } else if (clip < 0.75) {
        key.position.copy(lying);
        key.rotation.set(-Math.PI / 2, 0.4, 0);
      } else if (clip < KEY_PICKUP - 0.1) {
        guide.handR.getWorldPosition(key.position);
        key.rotation.set(0, Math.PI, 0);
      } else {
        lock.group.getWorldPosition(key.position);
        key.position.z += 0.17;
        key.rotation.set(0, Math.PI, keyTurn(clip) * (Math.PI / 2));
      }
    }
    if (step === S.key) for (let n = 0; n < keyTurns; n++) if (atClip(KEY_PICKUP + n * KEY_TURN + KEY_TURN * 0.45)) cue(n === keyTurns - 1 ? "chime" : "knock");
    lock.open(unlocked);
    // Unlocked, it drops off the chest into the water.
    const drop = step > S.key ? 1 : step === S.key ? clamp01((clip - lastTurn - 0.4) / 0.5) : 0;
    lock.group.position.set(LOCK.x, LOCK.y - drop * drop * 0.9, LOCK.z + drop * 0.1);
    lock.group.visible = drop < 1;
    if (step === S.key && atClip(lastTurn + 0.9)) {
      spray.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0, 0.6)), 14, 2);
      cue("splash");
    }

    let lid = step > S.coins ? 1.2 : 0;
    if (step === S.coins) {
      // It opens first, gold glittering out of it, then the crabs carry it; set down in the sand it opens all the way.
      lid = smooth((f.local - 0.6) / 1.2) + 0.2 * smooth((f.local - CARRY.set) / 0.6);
      if (crossed(f, 0.8)) cue("chime");
      for (let n = 0; n < 2; n++) {
        if (crossed(f, 1.0 + n * 1.1)) {
          gold.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0.9, 0)), 18, 4.5);
          cue("sparkle");
        }
      }
    }
    chest.open(lid);
    placeChest(f);
    if (step === S.coins && crossed(f, CARRY.set)) {
      sand.burst(tmpA.set(CHEST_SAND.x, groundHeight(CHEST_SAND.x, CHEST_SAND.z), CHEST_SAND.z), 20, 2);
      cue("knock");
    }
    // At every second jump for joy, at its top, gold glitters out of the chest behind Tapsi and confetti flies.
    if (step === S.hooray) {
      for (let n = 0; TRAVEL[S.hooray] + n * 1.6 < LEAD[S.hooray] + len; n++) {
        if (crossed(f, TRAVEL[S.hooray] + 0.4 + n * 1.6)) {
          gold.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0.9, 0)), 18, 4.5);
          confetti.burst(tmpA.copy(guide.root.position).add(v3(0, 1.8, 0)), 30, 5);
          cue(n % 2 ? "pop" : "sparkle");
        }
      }
    }
    if (step === S.coins && crossed(f, HOP_LAND)) {
      sand.burst(tmpA.set(COIN_STAND.x, groundHeight(COIN_STAND.x, COIN_STAND.z), COIN_STAND.z), 16, 2);
      cue("pop");
    }

    // The coins of every throw fly up out of Tapsi's paws, spread all round but away from Ole on the
    // left, spin, and stay lying in the sand close by where they land (or fall back into the chest).
    const sandY = groundHeight(COIN_STAND.x, COIN_STAND.z) + 0.006;
    let landed = Infinity;
    coins.forEach((coin, i) => {
      const n = Math.floor(i / COINS_PER_TOSS);
      const t = step === S.coins ? clip - tossAt(n) : step > S.coins ? 99 : -1;
      coin.visible = t > 0;
      if (!coin.visible) return;
      const j = i % COINS_PER_TOSS;
      const a = -1.4 + (2.6 * (j + 0.5)) / COINS_PER_TOSS + Math.sin(i * 12.9898) * 0.15;
      const speed = 0.3 + ((i * 7) % 5) * 0.07;
      const rise = 3 + ((i * 3) % 4) * 0.2;
      const from = tmpA.set(COIN_STAND.x, sandY + 1.45, COIN_STAND.z - 0.1);
      const flight = (rise + Math.sqrt(rise * rise + 2 * COIN_FALL * (from.y - sandY))) / COIN_FALL;
      const u = Math.min(t, flight);
      coin.position.set(from.x + Math.cos(a) * speed * u, from.y + rise * u - 0.5 * COIN_FALL * u * u, from.z + Math.sin(a) * speed * u);
      coin.rotation.set(t < flight ? u * 11 : 0, i, t < flight ? u * 7 : 0);
      if (j === 0) {
        if (step === S.coins && atClip(tossAt(n))) {
          gold.burst(from, 24, 3.5);
          cue("whoosh");
        }
        if (step === S.coins && atClip(tossAt(n) + flight)) cue("sparkle");
        if (t >= flight) landed = Math.min(landed, t - flight);
      }
    });

    // Crabs come out of the sand at the treasure and wave their claws; they hop whenever the coins come down,
    // and with Tapsi's hoorays.
    const out = step === S.coins ? smooth((f.local - 3) / 1.5) : step > S.coins ? 1 : 0;
    const cheer = step === S.hooray && act > -f.demo && act < len ? Math.abs(Math.sin(((act + f.demo) / 0.8) * Math.PI)) * 0.12 : 0;
    const hop = step === S.coins && landed < 0.6 ? Math.sin((landed / 0.6) * Math.PI) * 0.15 : cheer;
    crabs.forEach((crab, i) => {
      crab.holder.position.y = crab.ground - 0.6 + out * 0.6 + hop * (0.7 + (i % 3) * 0.15);
      crab.holder.visible = step >= S.coins;
      crab.dance(time + i * 0.4, 0.3);
    });

    // Kiki: flies in from the island to be waved at, watches the fishing from
    // a little ahead on the left, leads the way to the beach, then circles Tapsi; brings the key, sits on the chest from the
    // treasure on, and at the end flies off over the bay to be waved goodbye.
    const g = guide.root.position;
    const p = parrot.group.position;
    const around = v3(g.x + Math.cos(time * 1.1) * 1.1, g.y + 2.3 + Math.sin(time * 2.3) * 0.2, g.z + Math.sin(time * 1.1) * 0.8);
    // Close beside Tapsi's waving paw, so we see both from the front.
    const beside = v3(g.x + 0.82 + Math.sin(time * 1.3) * 0.06, g.y + 1.12 + Math.sin(time * 2.3) * 0.06, g.z + 0.35 + Math.cos(time * 1.3) * 0.08);
    // A little ahead and behind the brook as the camera sees it, below the boxes, showing the way.
    const ahead = v3(g.x - 0.6, g.y + 1.3 + Math.sin(time * 2.3) * 0.12, g.z - 1.2 + Math.sin(time * 1.3) * 0.2);
    // Ahead on the left and high, out of the way of the rod, watching the float.
    const watch = v3(g.x - 1.4 + Math.sin(time * 1.3) * 0.2, g.y + 2.0 + Math.sin(time * 2.3) * 0.1, g.z - 1.8);
    // High above the bow, leading the way to the island out of the paddle's reach.
    const leading = v3(g.x + 0.3 + Math.sin(time * 1.3) * 0.3, g.y + 2.6 + Math.sin(time * 2.3) * 0.15, g.z - 4.5);
    // Beyond the webs on the left, beside the spider hanging in the middle.
    const beyond = v3(g.x - 0.75, g.y + 1.75 + Math.sin(time * 2.3) * 0.08, g.z - 1.1 + Math.sin(time * 1.3) * 0.1);
    const perch = chest.group.getWorldPosition(new THREE.Vector3()).add(v3(0.3, 1.0, 0));
    let flying = true;
    let circling = false;
    if (f.opening !== null || step === S.hello) {
      // Far over the sea in the opening; comes in for the hello.
      const come = step === S.hello && f.opening === null ? smooth((f.local - 0.3) / 2.2) : 0;
      p.set(5, 7, BOAT_START - 22).lerp(beside, come);
      // A little hop in the air whenever Tapsi waves.
      if (step === S.hello && act + f.demo > 0) p.y += Math.abs(Math.sin(time * 4.5)) * 0.15;
    } else if (step === S.fish || step === S.sit) {
      p.copy(beside).lerp(watch, step === S.fish ? smooth(f.local / 2) : 1);
    } else if (step === S.paddle) {
      p.copy(watch).lerp(leading, smooth(f.local / 2));
    } else if (step === S.key) {
      // Over Tapsi with the key, lets it fall, then circles again.
      const over = v3(keyX + 0.15, g.y + 1.45 + Math.sin(time * 4) * 0.08, keyZ - 0.35);
      p.copy(around).lerp(over, smooth(f.local / 0.8) * (1 - smooth((f.local - 1.4) / 1.2)));
      circling = f.local > 2.6;
    } else if (step === S.jump) {
      p.copy(around).lerp(ahead, smooth(f.local / 1.5));
    } else if (step === S.webs) {
      // Waiting to the left beyond the webs, out of the way of the camera close behind Tapsi.
      p.copy(around).lerp(beyond, smooth(f.local / 1.5));
    } else if (step < S.coins) {
      circling = true;
      const from = step === S.stand ? leading : step === S.duck ? ahead : step === S.rope ? beyond : around;
      p.copy(from).lerp(around, smooth(f.local / 2));
    } else if (step === S.bye) {
      const away = v3(1.2 + Math.sin(time * 0.9) * 0.5, 2.5 + Math.sin(time * 1.7) * 0.25, SHORE.z - 5 + Math.cos(time * 0.9) * 0.5);
      const k = smooth((f.local - 0.3) / 3);
      p.copy(perch).lerp(away, k);
      flying = k > 0.02;
    } else {
      const settle = step === S.coins ? smooth((f.local - 1) / 1.5) : 1;
      p.copy(around).lerp(perch, settle);
      flying = settle < 0.95;
      // Hopping on the chest with joy.
      p.y += Math.abs(Math.sin(time * 6)) * 0.12;
    }
    // Looking at Tapsi, except while circling; sitting on the chest it looks at us.
    const face = circling
      ? Math.atan2(-Math.sin(time * 1.1), Math.cos(time * 1.1))
      : flying
        ? Math.atan2(g.x - p.x, g.z - p.z)
        : Math.atan2(camPos.x - p.x, camPos.z - p.z);
    parrot.group.rotation.set(0, face, 0);
    parrot.flap(time, flying || step >= S.coins);
    if (step === S.hello) {
      for (const at of [1.2, TRAVEL[S.hello] + 0.6, LEAD[S.hello] + 1, LEAD[S.hello] + 4]) if (crossed(f, at)) cue("tweet");
    } else if (step === S.bye) {
      if (crossed(f, LEAD[S.bye] + 0.5) || crossed(f, LEAD[S.bye] + 3)) cue("tweet");
    } else if (step > S.hello && step < S.coins && crossed(f, 2)) cue("tweet");

    // Sunset during the coins, the hooray and the goodbye.
    const dusk =
      step === S.coins
        ? smooth(f.local / sequence.steps[S.coins].seconds) * 0.45
        : step === S.hooray
          ? 0.45 + clamp01(f.local / (sequence.steps[S.hooray].seconds + DEMO[S.hooray])) * 0.25
          : step > S.hooray
            ? 0.7 + smooth(f.local / 6) * 0.3
            : 0;
    stage.setSky(DAY, SUNSET, dusk);
    const band = Math.floor(dusk * 4);
    if (band !== sunsetDone) {
      sunsetDone = band;
      stage.updateReflections();
    }

    // The opening: the trail draws itself to the chest, which sparkles when it gets there.
    const opening = f.opening ?? OPENING;
    trail.show(opening < OPENING_CUT ? trailAt(opening) : 0);
    if (lastOpening < TRAIL_TO + 0.2 && opening >= TRAIL_TO + 0.2 && opening < OPENING_CUT) {
      gold.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0.9, 0)), 40, 5);
      cue("chime");
    }
    lastOpening = opening;

    for (const [i, cloud] of clouds.entries()) cloud.position.x += Math.sin(i) * 0.002;
    sea.time.value = time;
    const dt = Math.max(0, Math.min(0.1, time - lastTime));
    lastTime = time;
    confetti.update(dt);
    spray.update(dt);
    gold.update(dt);
    sand.update(dt);
    return inAct;
  }

  return {
    focus,
    update(f) {
      placeTurtle(f);
      const { sitting } = placeGuide(f);
      updateWorld(f);

      // Camera: follow the walk from behind, then come round to where the
      // step's movement shows best before Tapsi shows it.
      const g = guide.root.position;
      const travel = f.lead - f.demo;
      if (f.opening !== null) {
        openingShot(f.opening, camPos, camLook);
      } else if (f.step === S.hello) {
        actShot(f.step, f, camPos, camLook);
        openingShot(OPENING, fromPos, fromLook);
        orbitBlend(g, fromPos, fromLook, camPos, camLook, smooth(f.local / travel), camPos, camLook);
      } else {
        actShot(f.step, f, camPos, camLook);
        const prev = f.step - 1;
        const prevEnd = {
          local: sequence.steps[prev].seconds + DEMO[prev],
          act: actLength(prev) + PRAISE[prev],
          demo: DEMO[prev],
          praise: PRAISE[prev],
          time: f.time,
        };
        actShot(prev, prevEnd, fromPos, fromLook);
        midPos.copy(fromPos);
        midLook.copy(fromLook);
        // Not at sea or on the beach before the walk: there the camera swings round Tapsi, e.g. from the
        // greeting in front to behind for the fishing.
        const chase = travel >= 3 && f.step > S.stand && f.step !== S.coins;
        if (chase && f.step === S.rope) {
          // In the narrow gorge close behind Tapsi, the way it looks, so the camera never goes into the rock.
          tmpC.set(Math.sin(guide.root.rotation.y), 0, Math.cos(guide.root.rotation.y));
          tmpA.copy(g).addScaledVector(tmpC, -3).add(GORGE_CAM);
          tmpB.copy(g).addScaledVector(tmpC, 3).add(UP);
          midPos.lerpVectors(fromPos, tmpA, smooth(f.local / 1.2));
          midLook.lerpVectors(fromLook, tmpB, smooth(f.local / 1.2));
        } else if (chase) {
          // A chase camera behind the fox while it walks.
          tmpA.set(g.x + 0.9, g.y + 2.4, g.z + 4.6);
          tmpB.set(g.x, g.y + 1.0, g.z - 3);
          orbitBlend(g, fromPos, fromLook, tmpA, tmpB, smooth(f.local / 1.2), midPos, midLook);
        }
        // Into the chest's opening as quickly as before, though the coins' travel is long.
        const settle = chase ? smooth((f.local - (travel - 1.5)) / 1.6) : smooth(f.local / Math.max(1.2, Math.min(travel, 2.5)));
        orbitBlend(g, midPos, midLook, camPos, camLook, settle, camPos, camLook);
      }
      // A gentle breathing of the camera, like it is held by hand.
      camPos.x += Math.sin(f.time * 0.6) * 0.03;
      camPos.y += Math.sin(f.time * 0.8) * 0.02;
      // Never below the ground (the low camera under the swinging log).
      camPos.y = Math.max(camPos.y, groundHeight(camPos.x, camPos.z) + 0.2);
      stage.camera.position.copy(camPos);
      stage.camera.lookAt(camLook);
      // Lean the view with the fox while dodging the monkeys' nuts.
      if (f.step === S.monkeys && f.act + f.demo > 0 && f.act < actLength(f.step)) {
        stage.camera.rotateZ(Math.sin(((f.act + f.demo) / LEAN_PERIOD) * TAU) * 0.06);
      }
      focus.copy(guide.root.position);

      // Only the cut from the map to the sea; everywhere else the camera travels with Tapsi.
      const flash = f.opening !== null ? Math.max(0, 1 - Math.abs(f.opening - OPENING_CUT) / 0.5) : 0;
      return {
        // Ole walks; Tapsi never does.
        walking: false,
        flash,
        sitting: f.opening !== null ? 0 : sitting,
        bend: bendAt(f),
        pointing: f.opening !== null ? pointingAt(f.opening) : undefined,
      };
    },
    afterPose(f) {
      holdPaddle(f);
      holdRod(f);
      holdCrank(f);
      holdKey(f);
      holdRope(f);
    },
  };
}

export const TREASURE_ISLAND: Story = {
  sequence,
  opening: { seconds: OPENING, lines: OPENING_LINES },
  lead: LEAD,
  demo: DEMO,
  praise: PRAISE,
  lines: LINES,
  translations: TRANSLATIONS,
  build,
};
