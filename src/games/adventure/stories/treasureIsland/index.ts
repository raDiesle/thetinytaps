import * as THREE from "three";
import {
  BRUSH_HIT,
  BRUSH_PERIOD,
  CRANK_PERIOD,
  duckDepth,
  JUMP_LANDING,
  JUMP_PEAK,
  JUMP_PERIOD,
  KEY_PICKUP,
  KEY_TURN,
  keyTurn,
  SHAPE_SECONDS,
  STOP_DANCE,
  stopDance,
} from "../../three/clips";
import { GUIDE_SIZE, type Guide } from "../../three/guide";
import { PADDLE_REACH, TURTLE_BACK, TURTLE_HALF_WIDTH, turtleTop } from "../../three/props";
import { DAY, SUNSET, type Stage } from "../../three/stage";
import { crossed, type Cue, type Story, type StoryFrame, type StoryWorld } from "../story";
import {
  APPLE_Z,
  BAY,
  BEACH_Z,
  BOAT_END,
  BOAT_START,
  BROOK_FROM,
  CRANK_REACH,
  CRANK_Y,
  DOOR_Z,
  FLOWERS_Z,
  GATE_LIFT,
  GATE_Z,
  JUMP_FROM,
  JUMP_TO,
  LAGOON,
  LAGOON_LEVEL,
  LOCK,
  MONKEY_Z,
  PARTY,
  RAFT_FROM,
  RAFT_TO,
  RAFT_X,
  RIDDLE_Z,
  ROLL_RADIUS,
  ROLL_X,
  ROLL_Z,
  SHORE,
  SIT_DROP,
  STOMP_Z,
  SWING_HELD,
  SWING_PARKED,
  SWING_Z,
  TAU,
  TURTLE_FLOAT,
  WEB_GAP,
  WEB_LAYERS,
  WEB_STAND,
  WEB_Z,
  WINCH_X,
  WINCH_Z,
  bridgeTop,
  clamp01,
  groundHeight,
  smooth,
  ss,
  v3,
} from "./layout";
import {
  ACROSS,
  DEMO,
  ISLAND,
  LEAD,
  LEAN_PERIOD,
  ON_SAND,
  OPENING,
  OPENING_CUT,
  PADDLE_DROP,
  PADDLE_GRIP,
  PADDLE_PERIOD,
  PADDLE_TILT,
  PRAISE,
  REACH_PERIOD,
  S,
  SIDE_STEP_PERIOD,
  TRAIL_FROM,
  TRAIL_TO,
  TRAVEL,
  actLength,
  bumpTime,
  clipLength,
  jumpZ,
  sequence,
} from "./script";
import { makeWorld } from "./world";

// "Die Schatzinsel": Tapsi greets us from the back of Ole, a big sea turtle,
// and paddles to an island,
// stomps the scorpions on the beach away, hops over the little bridge across
// the brook and bumps star boxes with the head, ducks under a swinging log, wakes
// the flowers, cranks a wooden gate open, steps aside for rolling coconuts,
// dodges the monkeys' nuts in slow motion, picks apples, solves the riddle of
// the stone door, brushes the cobwebs out of the passage behind it, pulls the
// treasure chest ashore and unlocks it with the key Kiki brings – then Tapsi
// turns round to us and there is a party at sunset with a stop dance (when
// the music stops, Tapsi, Kiki and the crabs freeze) and fireworks. Every world reaction is timed to the
// guide's clip, so it happens together with the child's movement. Every
// movement stays on the spot: the child in front of the screen never has to
// go forwards. So Tapsi never walks either: Ole carries Tapsi the whole way,
// swimming and crawling from station to station, and at the treasure turns
// round under Tapsi to face us.
//
// First a red dotted trail draws the way across the island to the chest, like
// on a treasure map. Tapsi greets us from the front, then the camera swings
// round behind. At every station Tapsi first shows the movement alone and the
// child joins in. Tapsi faces the island and the camera looks from behind, a
// little raised and to the side where the arms would hide behind the body:
// the child sees what Tapsi sees, and left is left. Over the brook it looks
// from the side, like a jump-and-run game. At the treasure Tapsi turns round
// and celebrates facing us.
//
// Positions along the path are in layout.ts, the props in scenery.ts, putting them
// together in world.ts, the steps and their timing in script.ts; here they move.

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
    flowerSpots,
    flowers,
    butterflies,
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
    sparks,
    rockets,
    trail,
  } = makeWorld(scene);
  let rope: THREE.Mesh | null = null;

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
  const lapQ = new THREE.Quaternion();
  const heldQ = new THREE.Quaternion();
  const tmpQ = new THREE.Quaternion();
  const basis = new THREE.Matrix4();
  const bladeY = [1, 1];
  let sunsetDone = -1;
  let lastTime = 0;
  let lastOpening = -1;

  /** The stop dance at the party: since when everyone is still, or null while the music plays (and before and after). */
  const stillAt = (step: number, clip: number) => (step === S.party && clip >= 0 && clip - DEMO[step] < actLength(step) ? stopDance(clip).still : null);
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

  /** Raft position (z) at a moment of the story: pulled in with the rope. */
  const raftAt = (step: number, act: number) => {
    if (step < S.rope || (step === S.rope && act <= 0)) return RAFT_FROM;
    if (step > S.rope) return RAFT_TO;
    const k = clamp01(act / (actLength(S.rope) - 0.5));
    return RAFT_FROM + (RAFT_TO - RAFT_FROM) * (k + Math.sin((act * TAU) / 0.9) * 0.01 * (1 - k));
  };

  /** How far the camera stands from Tapsi, so the whole body with the arms up fills most of the picture. */
  const frameDistance = () => {
    const cam = stage.camera;
    const v = THREE.MathUtils.degToRad(cam.fov / 2);
    const h = Math.atan(Math.tan(v) * cam.aspect);
    return Math.max(1.15 / Math.tan(v), 0.95 / Math.tan(h));
  };

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
      case S.stomp:
        return [0, STOMP_Z];
      case S.jump:
        return [0, JUMP_FROM];
      case S.duck:
        return [0, SWING_Z];
      case S.flowers:
        return [0, FLOWERS_Z];
      case S.gate:
        return [WINCH_X, WINCH_Z + CRANK_REACH];
      case S.roll:
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
      case S.party:
      case S.bye:
        return [PARTY.x, PARTY.z];
      default:
        return [SHORE.x, SHORE.z];
    }
  }

  /** Where Ole is when a step's movement is over. */
  const endAt = (step: number): [number, number] => (step === S.jump ? [0, JUMP_TO] : standAt(step));

  /** The way to a step's place: from where the step before ended, up the beach to the scorpions, round the winch after the gate. */
  const route = (step: number): [number, number][] =>
    step === S.stomp
      ? [[0, BEACH_Z], standAt(S.stomp)]
      : step === S.roll
        ? [endAt(S.gate), [-0.2, WINCH_Z + CRANK_REACH + 0.1], standAt(S.roll)]
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
    if (step <= S.paddle) return out.set(0, TURTLE_BACK - TURTLE_FLOAT - SIT_DROP, boatZ(step, act));
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
  function actShot(step: number, f: { local: number; act: number; praise: number; time: number }, pos: THREE.Vector3, look: THREE.Vector3) {
    const at = actSpot(step, f.act, spot);
    const clip = f.act + DEMO[step];
    switch (step) {
      case S.hello:
        // From the front, a little to Tapsi's right, where Kiki flutters and Tapsi waves: hello to us too.
        rear(at, pos, look, Math.PI - 0.3, 1.2, 0.95);
        look.y -= 0.15;
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
      case S.duck: {
        // Low behind Tapsi and to the side, looking up: the log swings over us and looks dangerous.
        const dip = clip > 0 && f.act < actLength(step) ? duckDepth(clip) : 0;
        rear(at, pos, look, 0.55, 0.45 - dip * 0.1, 0.9);
        look.set(at.x, at.y + 1.25 - dip * 0.2, at.z - 1.2);
        return;
      }
      case S.flowers:
        // Raised and to the side: the paws that come together in front show, and the flowers beside them.
        rear(at, pos, look, 0.5, 1.9);
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
        // From behind on the right, where the coconuts pass, looking up the path where they come from.
        rear(at, pos, look, 0.9, 1.75, 1.2);
        look.x += 0.3;
        look.z -= 1.4;
        return;
      case S.monkeys:
        // Behind Tapsi, swinging round a little with every nut like a slow-motion film; the monkeys up ahead.
        rear(at, pos, look, 0.2 + Math.sin((clip / LEAN_PERIOD) * TAU) * 0.25, 1.25, 1.0);
        look.set(at.x, at.y + 1.1, at.z - 1.2);
        return;
      case S.apples:
        // A little low, looking up into the tree.
        rear(at, pos, look, 0.35, 1.0, 1.0);
        look.y = at.y + 1.2;
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
        // To the side, so the pulling paws show, and high enough to see the chest come.
        rear(at, pos, look, 0.55, 2.0, 1.1);
        return;
      case S.key:
        // From behind on the right, close: the paw with the key and the lock.
        rear(at, pos, look, 0.7, 1.4, 0.9);
        look.set(RAFT_X, LAGOON_LEVEL + 0.2 + LOCK.y, RAFT_TO + LOCK.z);
        return;
      case S.hooray: {
        // First over Tapsi's shoulder at the opening chest; Tapsi turns round, and we see the face.
        cheerShot(at, tmpA, tmpB);
        rear(at, pos, look, 0.25, 1.3, 1.15);
        const k = smooth((f.local - 1.2) / 1.6);
        pos.lerpVectors(tmpA, pos, k);
        look.lerpVectors(tmpB, look, k);
        return;
      }
      case S.party:
        // In front of Tapsi, slowly a little to and fro, the crabs dancing around.
        rear(at, pos, look, Math.sin(f.local * 0.35) * 0.4, 1.5, 1.3);
        return;
      case S.bye: {
        // In front; at the end the camera rises and flies back to show the whole island at sunset.
        rear(at, pos, look, 0.3, 1.6, 1.25);
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

  /** Behind Tapsi and above, the chest in front: for when the lid opens. */
  function cheerShot(at: THREE.Vector3, pos: THREE.Vector3, look: THREE.Vector3) {
    pos.set(at.x - 0.6, at.y + 2.2, at.z + 3.6);
    look.set(RAFT_X - 0.4, at.y + 0.7, RAFT_TO + 0.4);
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

  /** The camera in the opening: the island from above the sea, then along the trail to the chest; after the cut, above Ole at sea. */
  function openingShot(t: number, pos: THREE.Vector3, look: THREE.Vector3) {
    if (t >= OPENING_CUT) {
      const k = smooth((t - OPENING_CUT) / (OPENING - OPENING_CUT));
      pos.set(4, 5.5 - k * 1.2, BOAT_START + 7 - k);
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
      [S.flowers, FLOWERS_Z + 2],
      [S.duck, SWING_Z + 2],
      [S.jump, BROOK_FROM + 1],
      [S.stomp, STOMP_Z + 2],
    ];
    return places.find(([, at]) => z < at)?.[0] ?? S.paddle;
  }

  /** Where Ole is, which way it looks, how much it walks and how far through its steps it is. */
  const ride = { x: 0, z: 0, yaw: ISLAND, walking: 0, stride: 0 };
  /** Ole takes a step every this many metres. */
  const STRIDE = 0.8;
  /** 0 → 1 → 0 over a walk that takes k from 0 to 1: Ole starts and stops its steps softly. */
  const walkingAt = (k: number) => (k > 0 && k < 1 ? ss(0, 0.08, k) * ss(1, 0.9, k) : 0);

  /**
   * Ole carries Tapsi through the story: swimming at sea, up the beach, along
   * the routes between the stations and across the bridge, through the door,
   * and in the bay side on at the water's edge; at the treasure it turns round
   * to face us and crawls up the beach.
   */
  function rideAt(f: StoryFrame) {
    const { step } = f;
    const travel = f.lead - f.demo;
    ride.yaw = ISLAND;
    ride.walking = 0;
    ride.stride = 0;
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
    } else if (step === S.rope && f.local < 2.5) {
      // Into the light behind the door; the flash hides the jump to the bay.
      go([standAt(S.webs), [0, WEB_STAND - 3.6]], clamp01((f.local - 0.3) / 2.2));
    } else if (step === S.rope || step === S.key) {
      // Side on, its head to the right, so the raft comes right up to Tapsi in front.
      [ride.x, ride.z] = standAt(step);
      ride.yaw = ISLAND - Math.PI / 2;
    } else if (step === S.hooray) {
      // Once the lid is open, Ole turns round under Tapsi to face us and crawls up the beach.
      const k = clamp01((f.local - 1.3) / 1.8);
      const e = smooth(k);
      ride.x = BAY.x;
      ride.z = BAY.z + (PARTY.z - BAY.z) * e;
      ride.yaw = ISLAND - Math.PI / 2 - Math.PI * e;
      ride.walking = walkingAt(k);
      ride.stride = e * 5 * TAU;
    } else if (step > S.hooray) {
      [ride.x, ride.z] = standAt(step);
      ride.yaw = ISLAND - Math.PI * 1.5;
    } else if (f.act < -f.demo) {
      // Standing up first after the sea, then off up the beach.
      const startAt = step === S.stomp ? 0.6 : 0.3;
      go(route(step), clamp01((f.local - startAt) / (travel - 0.5 - startAt)));
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
    turtle.group.updateMatrixWorld(true);
  }

  /** The top of Ole's back at (x, z) in the world, e.g. where something lies on it. */
  function onOle(x: number, z: number, out: THREE.Vector3) {
    turtle.group.worldToLocal(out.set(x, turtle.group.position.y, z));
    out.y = turtleTop(out.x, out.z);
    return turtle.group.localToWorld(out);
  }

  /** How far the paddle has gone from Tapsi's lap onto the sand, in the praise after the paddling. */
  const putDown = (step: number, praise: number) => (step > S.paddle ? 1 : step === S.paddle ? clamp01((praise - 1.2) / 0.9) : 0);

  /**
   * The paddle is always in Tapsi's paws while at sea: lying across the lap,
   * then taken up to paddle – its shaft through both paws, tipped a little
   * more, so the low blade reaches the water – and back on the lap; on the
   * beach Tapsi swings it out over Ole's side and lets it fall onto the sand.
   * Waving hello, one paw lets go of it.
   */
  function holdPaddle(f: StoryFrame) {
    const { step, act, praise } = f;
    const clip = act + f.demo;
    guide.root.updateMatrixWorld(true);
    // Across the lap, the blades flat; the paddle's own y (the shaft) to Tapsi's left.
    const lapPos = guide.lap.getWorldPosition(tmpA);
    lapQ.copy(guide.lap.getWorldQuaternion(tmpQ)).multiply(ACROSS);
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
    } else {
      paddle.position.copy(lapPos);
      paddle.quaternion.copy(lapQ);
    }
    paddle.updateMatrixWorld(true);

    // The paws on the shaft: a shoulder's width apart on the lap, where they are when paddling; they
    // let go as the paddle swings out to fall.
    if (step <= S.paddle) {
      const along = tmpC.set(0, 1, 0).applyQuaternion(paddle.quaternion);
      const center = paddle.position;
      const letGo = step === S.paddle ? smooth((praise - 1.35) / 0.3) : 0;
      const waving = step === S.hello && f.opening === null ? clamp01(clip / 0.7) * (1 - clamp01(praise / 0.9)) : 0;
      for (const [hand, at, lap, weight] of [
        ["L", left, PADDLE_GRIP, 1 - letGo],
        ["R", right, -PADDLE_GRIP, (1 - letGo) * (1 - waving)],
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

  /** Tapsi on Ole's back: sitting at sea, standing up on the beach, and always facing the way Ole carries it. */
  function placeGuide(f: StoryFrame) {
    const { step } = f;
    const sitting = step <= S.paddle ? 1 : step === S.stomp ? 1 - smooth(f.local / 0.6) : 0;
    // The ears fold back flat when the head bumps a star box.
    const jumpClip = f.act + f.demo;
    const bumpNow = step === S.jump ? Math.round((jumpClip - JUMP_PEAK - 2 * JUMP_PERIOD) / (3 * JUMP_PERIOD)) : -1;
    guide.earsBack = bumpNow >= 0 && bumpNow < boxes.length ? clamp01(1.4 - Math.abs(jumpClip - bumpTime(bumpNow)) / 0.3) : 0;
    // In the bay Ole lies side on, Tapsi across its back facing the water; turning round, Ole turns Tapsi with it.
    const sideOn = step > S.rope || (step === S.rope && f.local >= 2.5);
    turtle.group.localToWorld(guide.root.position.set(0, TURTLE_BACK - SIT_DROP * sitting, 0));
    guide.root.rotation.y = ride.yaw + (sideOn ? Math.PI / 2 : 0);
    guide.joy = step === S.hooray ? smooth((f.local - 0.8) / 0.6) : step > S.hooray ? 1 : 0;
    return { sitting };
  }

  function updateWorld(f: StoryFrame) {
    const { step, act, time } = f;
    const len = actLength(step);
    const inAct = act >= 0 && act <= len;
    /** Time in the step's clip: from when Tapsi starts to show the movement. */
    const clip = act + f.demo;
    /** True if this frame passed the moment `c` of the step's clip. */
    const atClip = (c: number) => crossed(f, TRAVEL[step] + c);
    guide.root.updateMatrixWorld(true);

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
      const fromZ = 0.55 - (n % 3) * 0.45;
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
      swingAngle = -SWING_HELD * Math.cos((clip / 6) * TAU);
      if (clip >= clipLength(step)) swingAngle = -SWING_HELD - (SWING_PARKED - SWING_HELD) * smooth((clip - clipLength(step)) / 1.5);
      for (let n = 0; n * 3 < clipLength(step); n++) if (atClip(0.9 + n * 3)) cue("whoosh");
    } else if (step > S.duck) {
      swingAngle = -SWING_PARKED + Math.sin(time * 0.8) * 0.03;
    }
    swing.pivot.rotation.x = -swingAngle;

    // Flowers open with the arms and stay open after the second time.
    let bloom = step > S.flowers ? 1 : 0;
    if (step === S.flowers && act > 0) {
      const k = (act / 4) % 1;
      const arms = k < 0.1 ? 0 : k < 0.45 ? smooth((k - 0.1) / 0.35) : k < 0.7 ? 1 : 1 - smooth((k - 0.7) / 0.25);
      const stay = act > 4.3 ? smooth((act - 4.3) / 1.2) : 0;
      bloom = Math.max(arms, stay);
      for (let n = 0; n < 2; n++) if (crossed(f, LEAD[S.flowers] + 0.6 + n * 4)) cue("sparkle");
    }
    flowers.forEach((fl, i) => fl.open(clamp01(bloom * 1.15 - i * 0.04)));
    butterflies.forEach((b, i) => {
      const out = step >= S.flowers && step <= S.gate && (step > S.flowers || bloom > 0.6 || act > 4.3);
      b.group.visible = out;
      if (!out) return;
      const home = flowerSpots[i % flowerSpots.length];
      const a = time * (0.7 + i * 0.13) + i;
      b.group.position.set(home[0] + Math.sin(a) * 1.4, home[2] + 0.4 + Math.sin(a * 1.7) * 0.6, home[1] + Math.cos(a * 0.8) * 1.2);
      b.group.rotation.y = a + Math.PI / 2;
      b.flap(time + i);
    });

    // The gate: the crank follows Tapsi's paws, and every half turn the gate clicks up a bit.
    let lift = step > S.gate ? GATE_LIFT : 0;
    let crankAngle = 0;
    if (step === S.gate && clip > 0) {
      const q = crankTurns(clip) * 2;
      const all = crankTurns(clipLength(step)) * 2;
      lift = GATE_LIFT * clamp01((Math.floor(q) + smooth(((q % 1) - 0.2) / 0.5)) / all);
      const hands = guide.handL.getWorldPosition(tmpA).add(guide.handR.getWorldPosition(tmpB)).multiplyScalar(0.5);
      const axleY = gate.group.position.y + CRANK_Y;
      crankAngle = Math.atan2(-(hands.x - WINCH_X), hands.y - axleY);
      for (let n = 1; n <= all; n++) if (atClip((n * CRANK_PERIOD) / 2 - 0.3)) cue("knock");
      if (atClip(clipLength(step) - 0.2)) cue("rumble");
    }
    gate.set(lift, crankAngle);

    // Coconuts roll down the path, on Tapsi's right, past Ole's head and over its shell; Tapsi steps aside
    // to the left on Ole's back as each one comes.
    rollers.forEach((nut, n) => {
      const pass = 1.3 + n * SIDE_STEP_PERIOD;
      const dt = clip - pass;
      const on = step === S.roll && f.opening === null && dt > -2 && dt < 1.2 && pass < clipLength(step);
      nut.visible = on;
      if (!on) return;
      const z = ROLL_Z + dt * 4.2;
      const x = ROLL_X;
      const over = Math.max(groundHeight(x, z), onOle(x, z, tmpA).y);
      nut.position.set(x, over + ROLL_RADIUS + Math.abs(Math.sin(dt * 5)) * 0.05, z);
      nut.rotation.set(z / ROLL_RADIUS, 0, 0);
      if (atClip(pass - 0.5)) cue("whoosh");
    });

    // The monkeys throw small coconuts; each flies, in slow motion as it passes, right where Tapsi's head was.
    const throwing = [0, 0];
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
        // Well clear of the head leaning away, and on out to the same side.
        const passAt = v3(side * 0.5, g + 1.35, MONKEY_Z);
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

    // The riddle: the picture of the shape that comes next blinks, and lights up once the shape is made.
    let solved = step > S.riddle ? 3 : 0;
    for (let i = 0; i < 3; i++) {
      let k = step > S.riddle ? 1 : 0;
      if (step === S.riddle && clip > 0) {
        const from = i * SHAPE_SECONDS;
        const done = from + SHAPE_SECONDS * 0.4;
        if (clip >= done) {
          k = 1;
          solved = i + 1;
        } else if (clip >= from - 0.5) k = 0.25 + 0.2 * Math.sin(time * 9);
        if (atClip(done)) {
          tmpA.set((i - 1) * 1.55, groundHeight(0, DOOR_Z) + 4.05, DOOR_Z + 0.9);
          gold.burst(tmpA, 18, 3);
          cue("chime");
        }
      }
      riddle.set(i, step > S.webs ? 0.4 : k);
    }

    // With the riddle solved the spiral glows bright and the door sinks into the ground.
    const open = step > S.riddle ? 1 : step === S.riddle ? smooth((f.praise - 0.3) / 2) : 0;
    if (step === S.riddle && crossed(f, LEAD[S.riddle] + len + 0.3)) cue("rumble");
    door.set(open, step === S.riddle ? Math.max(solved * 0.1, smooth(f.praise / 0.5)) : open);

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
    const lastWeb = BRUSH_HIT + (WEB_LAYERS * 2 - 1) * (BRUSH_PERIOD / 2);
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

    // The chest on its raft comes closer with the pulling.
    const raftZ = raftAt(step, act);
    if (step === S.rope && act > 0) {
      for (let n = 0; n * 1.8 < len; n++) if (crossed(f, LEAD[S.rope] + 0.9 + n * 1.8)) cue("splash");
    }
    raft.position.set(RAFT_X, LAGOON_LEVEL + Math.sin(time * 1.4) * 0.03, raftZ);
    raft.rotation.z = Math.sin(time * 1.1) * 0.03;
    // In the opening the chest waits far out in the bay, at the end of the trail.
    raft.visible = step >= S.webs || f.opening !== null;
    raft.updateMatrixWorld(true);

    // The key: Kiki drops it in front of Tapsi, Tapsi picks it up, puts it in the lock and turns it.
    const [keyX, keyZ] = standAt(S.key);
    const lastTurn = KEY_PICKUP + 3 * KEY_TURN + KEY_TURN * 0.45;
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
    if (step === S.key) for (let n = 0; n < 4; n++) if (atClip(KEY_PICKUP + n * KEY_TURN + KEY_TURN * 0.45)) cue(n === 3 ? "chime" : "knock");
    lock.open(unlocked);
    // Unlocked, it drops off the chest into the water.
    const drop = step > S.key ? 1 : step === S.key ? clamp01((clip - lastTurn - 0.4) / 0.5) : 0;
    lock.group.position.set(LOCK.x, LOCK.y - drop * drop * 0.9, LOCK.z + drop * 0.1);
    lock.group.visible = drop < 1;
    if (step === S.key && atClip(lastTurn + 0.9)) {
      spray.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0, 0.6)), 14, 2);
      cue("splash");
    }

    let lid = step > S.hooray ? 1 : 0;
    if (step === S.hooray) {
      // It opens first, then Tapsi turns round to us and cheers.
      lid = smooth((f.local - 0.6) / 1.2);
      if (crossed(f, 0.8)) cue("chime");
    }
    chest.open(lid);
    // The stop dance: when the music stops, the crabs and Kiki freeze with Tapsi; their dance clock stands still.
    const still = stillAt(step, clip);
    const wasStill = stillAt(step, f.prevLocal - TRAVEL[step]);
    const partyTime = still === null ? time : time - still;
    const wobbly = still !== null && STOP_DANCE[stopDance(clip).round].statue === "wobbly";
    if (step >= S.hooray && step <= S.party && still === null) {
      for (let n = 0; n < 10; n++) {
        if (crossed(f, 1.0 + n * 1.1)) {
          gold.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0.9, 0)), 18, 4.5);
          confetti.burst(tmpA.add(v3(-1, 0.6, 0.5)), 30, 5);
          if (step === S.hooray) cue(n % 2 ? "pop" : "sparkle");
        }
      }
    }

    // The rope from the chest to the fox's paws.
    if (rope) {
      scene.remove(rope);
      rope.geometry.dispose();
      rope = null;
    }
    if (step === S.rope && f.local > 2.5 && act < len + 0.5) {
      guide.handL.getWorldPosition(tmpA);
      guide.handR.getWorldPosition(tmpB);
      const hands = tmpA.add(tmpB).multiplyScalar(0.5);
      const end = chest.group.getWorldPosition(new THREE.Vector3()).add(v3(0, 0.4, 0.45));
      const mid = hands.clone().lerp(end, 0.5);
      mid.y -= 0.25 + 0.15 * Math.sin(time * 3);
      const behind = hands.clone().add(v3(0.3, -0.6, 0.6));
      const curve = new THREE.CatmullRomCurve3([behind, hands, mid, end]);
      rope = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.03, 6), ropeMat);
      rope.castShadow = true;
      scene.add(rope);
    }

    // Party: crabs come out of the sand and dance, hopping with their claws up; frozen they hang in mid-hop
    // (and tremble when Tapsi wobbles). Confetti at the start and whenever the music comes back.
    const party = step === S.party ? smooth(f.local / 1.5) : step > S.party ? 1 : step === S.hooray ? smooth((f.local - 3) / 1.5) : 0;
    crabs.forEach((crab, i) => {
      const hop = step >= S.party ? Math.abs(Math.sin(partyTime * 5 + i * 1.3)) * 0.18 : 0;
      crab.holder.position.y = crab.ground - 0.6 + party * 0.6 + hop;
      crab.holder.rotation.z = wobbly ? Math.sin(time * 7 + i * 2) * 0.1 : 0;
      crab.holder.visible = step >= S.hooray;
      crab.dance(partyTime + i * 0.4, step === S.party ? 1 : 0.4);
    });
    if (step === S.party && (crossed(f, 1) || (wasStill !== null && still === null))) {
      const side = stopDance(clip).round % 2 ? 1 : -1;
      confetti.burst(v3(PARTY.x + side * 2.5, 2.5, PARTY.z - 1), 40, 4);
      cue("pop");
    }

    // Fireworks over the bay at the end, behind Tapsi.
    rockets.forEach((rocket, n) => {
      const start = 0.8 + n * 1.3;
      const t = step === S.bye ? f.local - start : -1;
      const bx = [-4, 3, 0, -2, 5, 1][n];
      // Low enough over the bay to burst in the picture above Tapsi.
      const top = 4 + (n % 3) * 0.7;
      const bz = -30 - (n % 2) * 2;
      rocket.visible = t > 0 && t < 0.9;
      if (rocket.visible) rocket.position.set(bx, LAGOON_LEVEL + (top - LAGOON_LEVEL) * Math.sqrt(t / 0.9), bz);
      if (step === S.bye && crossed(f, start + 0.9)) {
        sparks.burst(v3(bx, top, bz), 90, 4, true);
        cue(n % 2 ? "pop" : "sparkle");
      }
    });

    // Kiki: flies in from the island to be waved at, leads the way to the
    // beach, then circles Tapsi; brings the key, sits on the chest from the
    // treasure on, and at the end flies off over the bay to be waved goodbye.
    const g = guide.root.position;
    const p = parrot.group.position;
    const front = v3(g.x + 1.1 + Math.sin(time * 1.3) * 0.25, g.y + 1.45 + Math.sin(time * 2.3) * 0.12, g.z - 2.8 + Math.cos(time * 1.3) * 0.2);
    const around = v3(g.x + Math.cos(time * 1.1) * 1.1, g.y + 2.3 + Math.sin(time * 2.3) * 0.2, g.z + Math.sin(time * 1.1) * 0.8);
    // Close beside Tapsi's waving paw, so we see both from the front.
    const beside = v3(g.x + 0.82 + Math.sin(time * 1.3) * 0.06, g.y + 1.12 + Math.sin(time * 2.3) * 0.06, g.z + 0.35 + Math.cos(time * 1.3) * 0.08);
    // A little ahead and behind the brook as the camera sees it, below the boxes, showing the way.
    const ahead = v3(g.x - 0.6, g.y + 1.3 + Math.sin(time * 2.3) * 0.12, g.z - 1.2 + Math.sin(time * 1.3) * 0.2);
    // Beyond the webs on the left, beside the spider hanging in the middle.
    const beyond = v3(g.x - 0.75, g.y + 1.75 + Math.sin(time * 2.3) * 0.08, g.z - 1.1 + Math.sin(time * 1.3) * 0.1);
    const perch = chest.group.getWorldPosition(new THREE.Vector3()).add(v3(0.3, 1.0, 0));
    let flying = true;
    let circling = false;
    if (f.opening !== null || step === S.hello) {
      const come = f.opening !== null ? 0 : smooth((f.local - 0.3) / 2.2);
      p.set(5, 7, BOAT_START - 22).lerp(beside, come);
      // A little hop in the air whenever Tapsi waves.
      if (step === S.hello && act + f.demo > 0) p.y += Math.abs(Math.sin(time * 4.5)) * 0.15;
    } else if (step === S.paddle) {
      // Leading the way, high above the bow, out of the paddle's reach.
      p.copy(beside).lerp(v3(g.x + 0.3 + Math.sin(time * 1.3) * 0.3, g.y + 2.6 + Math.sin(time * 2.3) * 0.15, g.z - 4.5), smooth(f.local / 2));
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
    } else if (step < S.hooray) {
      circling = true;
      const from = step === S.stomp ? front : step === S.duck ? ahead : step === S.rope ? beyond : around;
      p.copy(from).lerp(around, smooth(f.local / 2));
    } else if (step === S.bye) {
      const away = v3(1.2 + Math.sin(time * 0.9) * 0.5, 2.5 + Math.sin(time * 1.7) * 0.25, SHORE.z - 5 + Math.cos(time * 0.9) * 0.5);
      const k = smooth((f.local - 0.3) / 3);
      p.copy(perch).lerp(away, k);
      flying = k > 0.02;
    } else {
      const settle = step === S.hooray ? smooth((f.local - 1) / 1.5) : 1;
      p.copy(around).lerp(perch, settle);
      flying = settle < 0.95;
      // Hopping on the chest with joy.
      if (step >= S.hooray) p.y += Math.abs(Math.sin(partyTime * 6)) * 0.12;
    }
    // Looking at Tapsi, except while circling; sitting on the chest it looks at us.
    const face = circling
      ? Math.atan2(-Math.sin(time * 1.1), Math.cos(time * 1.1))
      : flying
        ? Math.atan2(g.x - p.x, g.z - p.z)
        : Math.atan2(camPos.x - p.x, camPos.z - p.z);
    parrot.group.rotation.set(0, face, wobbly ? Math.sin(time * 6) * 0.15 : 0);
    parrot.flap(partyTime, flying || step >= S.hooray);
    if (step === S.hello) {
      for (const at of [1.2, TRAVEL[S.hello] + 0.6, LEAD[S.hello] + 1, LEAD[S.hello] + 4]) if (crossed(f, at)) cue("tweet");
    } else if (step === S.bye) {
      if (crossed(f, LEAD[S.bye] + 0.5) || crossed(f, LEAD[S.bye] + 3)) cue("tweet");
    } else if (step < S.hooray && crossed(f, 2)) cue("tweet");

    // Sunset during the party and the goodbye.
    const dusk = step === S.party ? smooth(f.local / sequence.steps[S.party].seconds) * 0.7 : step > S.party ? 0.7 + smooth(f.local / 6) * 0.3 : 0;
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
    sparks.update(dt);
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
      } else if (f.step === S.rope && f.local >= 2.5) {
        // After the flash, straight behind Tapsi at the bay.
        actShot(f.step, f, camPos, camLook);
      } else {
        actShot(f.step, f, camPos, camLook);
        const prev = f.step - 1;
        const prevEnd = { local: sequence.steps[prev].seconds + DEMO[prev], act: actLength(prev) + PRAISE, praise: PRAISE, time: f.time };
        actShot(prev, prevEnd, fromPos, fromLook);
        midPos.copy(fromPos);
        midLook.copy(fromLook);
        // Not at sea: there the camera swings round from the greeting in front to behind Tapsi.
        const chase = travel >= 3 && f.step !== S.hooray && f.step !== S.paddle;
        if (chase) {
          // A chase camera behind the fox while it walks.
          tmpA.set(g.x + 0.9, g.y + 2.4, g.z + 4.6);
          tmpB.set(g.x, g.y + 1.0, g.z - 3);
          orbitBlend(g, fromPos, fromLook, tmpA, tmpB, smooth(f.local / 1.2), midPos, midLook);
        }
        const settle = chase ? smooth((f.local - (travel - 1.5)) / 1.6) : smooth(f.local / Math.max(1.2, travel));
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

      const flash =
        f.opening !== null ? Math.max(0, 1 - Math.abs(f.opening - OPENING_CUT) / 0.5) : f.step === S.rope ? Math.max(0, 1 - Math.abs(f.local - 2.5) / 0.9) : 0;
      return {
        // Ole walks; Tapsi never does.
        walking: false,
        flash,
        sitting: f.opening !== null ? 1 : sitting,
        // Leaning a little forwards to swing the paddle out over Ole's side.
        bend: f.step === S.paddle ? 0.2 * smooth((f.praise - 1.0) / 0.4) * (1 - smooth((f.praise - 1.6) / 0.5)) : 0,
        pointing: f.opening !== null ? pointingAt(f.opening) : undefined,
        quiet: stillAt(f.step, f.act + f.demo) !== null,
      };
    },
    afterPose: holdPaddle,
  };
}

export const TREASURE_ISLAND: Story = {
  sequence,
  opening: {
    seconds: OPENING,
    lines: [
      { at: 0.3, text: "Schau – da hinten ist die Schatzinsel!" },
      { at: 3, text: "Und da liegt ein Schatz!" },
      { at: 6.7, text: "Kommst du mit?" },
    ],
  },
  lead: LEAD,
  demo: DEMO,
  praise: PRAISE,
  lines: [
    {
      icon: "👋",
      situation: "Ahoi! Ich bin Tapsi. Und da kommt Kiki, mein Papagei!",
      instruction: "Ich winke Kiki Hallo – so!",
      turn: "Winkst du Kiki auch?",
      again: "Hallo, Kiki!",
      praise: "Kiki freut sich, dass du da bist!",
    },
    {
      icon: "🛶",
      situation: "Ole schwimmt los – zur Schatzinsel!",
      instruction: "Schau: das Paddel rechts ins Wasser – und links.",
      turn: "Paddel mit!",
      again: "Paddeln, paddeln – die Insel kommt näher!",
      praise: "Geschafft! Ole ist am Strand.",
    },
    {
      icon: "🦂",
      situation: "Huch! Skorpione krabbeln auf Ole!",
      instruction: "Fuß hoch – und schnell feste stampfen, so!",
      turn: "Jetzt du – stampf mit!",
      again: "Stampf, stampf – plopp!",
      praise: "Alle Skorpione sind weg!",
    },
    {
      icon: "🌉",
      situation: "Eine kleine Brücke! Und da oben schweben Kisten.",
      instruction: "Hopp, hopp – und mit dem Kopf an die Kiste, bumm!",
      turn: "Jetzt du – hüpf mit!",
      again: "Hopp, hopp – Kopf hoch!",
      praise: "Drüben! Und drei goldene Sterne!",
    },
    {
      icon: "🪵",
      situation: "Achtung! Da oben schaukelt ein Baumstamm.",
      instruction: "Wenn er kommt, ducken wir uns – so!",
      turn: "Er kommt! Duck dich!",
      again: "Und nochmal ducken!",
      praise: "Puh, der Stamm ist vorbei!",
    },
    {
      icon: "🌸",
      situation: "Psst … die Blumen schlafen noch.",
      instruction: "Hände zusammen – und ganz weit auf. So!",
      turn: "Jetzt du – weck die Blumen!",
      again: "Langsam auf … und wieder zu.",
      praise: "Wie schön! Alle Blumen sind wach.",
    },
    {
      icon: "⚙️",
      situation: "Ein Tor! Und da ist eine Kurbel.",
      instruction: "Wir drehen die Kurbel – rundherum, so!",
      turn: "Jetzt du – dreh mit!",
      again: "Rundherum – das Tor geht hoch!",
      praise: "Das Tor ist offen!",
    },
    {
      icon: "🥥",
      situation: "Da kullern Kokosnüsse den Weg herunter!",
      instruction: "Ein Schritt zur Seite – und zurück. So!",
      turn: "Kokosnuss! Schritt zur Seite!",
      again: "Und nochmal Platz machen!",
      praise: "Alle Kokosnüsse sind vorbeigekullert.",
    },
    {
      icon: "🐒",
      situation: "Oh, Affen! Die werfen mit Kokosnüssen!",
      instruction: "Wir weichen ganz langsam aus – zur Seite, so!",
      turn: "Jetzt du – weich aus!",
      again: "Und zur anderen Seite!",
      praise: "Daneben! Die Affen klatschen.",
    },
    {
      icon: "🍎",
      situation: "Ein Apfelbaum! Und da steht ein Korb.",
      instruction: "Ganz hoch strecken und pflücken – so!",
      turn: "Jetzt du – pflück einen Apfel!",
      again: "Hoch – und plumps in den Korb!",
      praise: "Der Korb ist voll!",
    },
    {
      icon: "🧩",
      situation: "Eine Tür mit drei Bildern. Ein Rätsel!",
      instruction: "Wir machen die Bilder nach. Erst ganz groß – so!",
      turn: "Jetzt du – ganz groß!",
      more: [{ at: 1.7, text: "Und jetzt ganz breit, wie ein Stern!" }],
      again: "Und jetzt ganz klein!",
      praise: "Rätsel gelöst! Die Tür geht auf.",
    },
    {
      icon: "🕸️",
      situation: "Oh, lauter Spinnweben! Da kommen wir nicht durch.",
      instruction: "Mit der Pfote hoch – und weit zur Seite wedeln, so!",
      turn: "Jetzt du – wedel mit!",
      again: "Links – und rechts – weg damit!",
      praise: "Der Weg ist frei! Die Spinne winkt.",
    },
    {
      icon: "🪢",
      situation: "Da schwimmt die Schatztruhe!",
      instruction: "Hand über Hand am Seil ziehen – so!",
      turn: "Zieh mit!",
      again: "Ziehen, ziehen – sie kommt!",
      praise: "Die Truhe ist da!",
    },
    {
      icon: "🔑",
      situation: "Oh, ein Schloss! Kiki bringt den Schlüssel.",
      instruction: "Aufheben, reinstecken und umdrehen – so!",
      turn: "Jetzt du – dreh den Schlüssel!",
      again: "Klick – und nochmal!",
      praise: "Das Schloss ist auf!",
    },
    {
      icon: "🙌",
      situation: "Oh! Was ist da drin?",
      instruction: "Gold! Arme hoch – Hurra!",
      turn: "Du auch – Hurra!",
      again: "Hurra, ein Schatz!",
      praise: "So viel Gold!",
    },
    {
      icon: "🎵",
      situation: "Party! Wir machen Stopptanz.",
      instruction: "Wir tanzen – und hört die Musik auf: stopp!",
      turn: "Jetzt du! Tanz mit und hör gut hin!",
      more: [{ at: 6.7, text: "Kiki und die Krebse machen auch mit!" }],
      again: "Und weiter tanzen!",
      praise: "Was für eine Party!",
    },
    {
      icon: "🌅",
      situation: "Die Sonne geht unter. Schau, ein Feuerwerk!",
      instruction: "Ich winke Kiki Tschüss – so!",
      turn: "Winkst du mit?",
      again: "Tschüss, Kiki! Tschüss, Insel!",
      praise: "Danke fürs Mitmachen! Bis bald!",
    },
  ],
  build,
};
