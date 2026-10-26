import * as THREE from "three";
import { arcDraw, ARC_PERIOD, CHEER_PERIOD, clipPose, duckDepth, FLAP_PERIOD, LEAN_PERIOD, PUSH_PERIOD, sitProgress } from "../../three/clips";
import { type Guide, lerpPose, type Pose } from "../../three/guide";
import { sitDown } from "../../three/player";
import { DAY, type SkyColors, type Stage } from "../../three/stage";
import { crossed, type Cue, type Story, type StoryFrame, type StoryWorld } from "../story";
import {
  AHEAD,
  ALT,
  BALLOON_Z,
  clamp01,
  CURVE_SWING,
  DUCK_Z,
  FLAP_TO,
  groundHeight,
  MEADOW_Z,
  PUFF_GAP,
  PUFF_RADIUS,
  SIT_DROP,
  SIT_Z,
  smooth,
  SUN,
  SUN_Z,
  TAU,
  v3,
  WOLLE_REST,
  WOLLE_TOP,
} from "./layout";
import { LINES, OPENING_LINES } from "./lines";
import { BALLOON_RADIUS } from "./scenery";
import {
  ARC_TOP,
  actLength,
  clipLength,
  curveZ,
  DEMO,
  goes,
  LANDING,
  LEAD,
  OPENING,
  PRAISE,
  passTime,
  pushTime,
  S,
  STAND_Z,
  sequence,
  starTime,
  tapTime,
  TRAVEL,
} from "./script";
import { TRANSLATIONS } from "./translations";
import { makeWorld } from "./world";

// „Die Wolkenreise“: the sun is stuck behind a rain cloud and everything is grey. Tapsi rides on
// Wolle, a little cloud with a face, from the meadow up into the sky to fetch it: flapping lifts Wolle
// up, toy planes come at Tapsi's head (duck), balloons float to the paws (tap), sitting down Wolle
// races round cloud towers (lean into the curve and take a star), standing up again Tapsi pushes the
// grey puffs of the rain cloud away until the sun laughs, paints a rainbow with the arms, turns round
// to us, cheers and waves goodbye. Tapsi always faces the way and the camera looks from behind, so
// left is left; only at the start and the end does it look from the front.
//
// Positions are in layout.ts, the props in scenery.ts, put together in world.ts, the steps and
// their timing in script.ts; here they move.

const UP = new THREE.Vector3(0, 1, 0);
/** The rainy sky at the start. */
const GREY: SkyColors = { top: "#7d8796", horizon: "#c3c9d1", sun: "#000000" };
/** How far Tapsi's feet sink into Wolle's fluff. */
const SINK = 0.03;
/** Seconds a balloon floats towards the paw. */
const FLOAT = 3.2;
/** How fast the planes fly (m/s). */
const PLANE_SPEED = 7;

/** Wolle's place and turn for a frame. */
interface Place {
  x: number;
  y: number;
  z: number;
  yaw: number;
  roll: number;
  squash: number;
}

function build(stage: Stage, guide: Guide, cue: (c: Cue) => void): StoryWorld {
  const scene = stage.scene;
  stage.setSky(GREY, DAY, 0);
  stage.updateReflections();
  const { wolle, parrot, planes, balloons, stars, puffs, rainCloud, sun, rain, rainbow, tip, confetti, sparkle } = makeWorld(scene);

  const focus = v3(0, 0, MEADOW_Z);
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const fromPos = new THREE.Vector3();
  const fromLook = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const GREY_PUFF = new THREE.Color("#8a929c");
  const DARK_CLOUD = new THREE.Color("#6f7884");
  const WHITE = new THREE.Color("#ffffff");
  const DIM_FILL = new THREE.Color("#aab4c0");
  const DAY_FILL = new THREE.Color("#cfe8ff");
  let skyBand = -1;
  let lastTime = 0;

  // --- Wolle's way ---------------------------------------------------------
  const REST_Y = groundHeight(0, MEADOW_Z) + WOLLE_REST;
  /** Wolle floats up and down a little where nothing has to meet a paw exactly. */
  const bob = (step: number, time: number) => (step === S.stars || step === S.push ? 0 : Math.sin(time * 1.3) * 0.05);
  /** How many wing beats have lifted Wolle `clip` s into the flapping: only the downstrokes lift. */
  const beats = (clip: number) => {
    if (clip <= 0) return 0;
    const n = Math.floor(clip / FLAP_PERIOD);
    return Math.min(goes(S.flap), n + smooth((clip / FLAP_PERIOD - n - 0.5) / 0.5));
  };
  /** From one place (z) to the next while travelling to a step. */
  const travelTo = (local: number, step: number, from: number, to: number) => from + (to - from) * smooth(local / TRAVEL[step]);

  /** Where Wolle is `local` seconds into a step. */
  function wolleAt(step: number, local: number, time: number, out: Place) {
    const clip = local - TRAVEL[step];
    out.x = 0;
    out.y = ALT + bob(step, time);
    out.yaw = AHEAD;
    out.roll = 0;
    out.squash = 0;
    switch (step) {
      case S.hello:
        out.y = REST_Y;
        out.z = MEADOW_Z;
        break;
      case S.flap: {
        // Wanting to fly, Wolle hops on the grass; then every downstroke lifts it a bit, up and on.
        const k = beats(clip) / goes(S.flap);
        out.y = REST_Y + (ALT - REST_Y) * k + bob(step, time) * k + (clip < 0 ? Math.abs(Math.sin(local * 5)) * 0.05 : 0);
        out.z = MEADOW_Z + (FLAP_TO - MEADOW_Z) * k;
        break;
      }
      case S.duck:
        out.z = travelTo(local, step, FLAP_TO, DUCK_Z);
        break;
      case S.balloons:
        out.z = travelTo(local, step, DUCK_Z, BALLOON_Z);
        break;
      case S.sit:
        out.z = travelTo(local, step, BALLOON_Z, SIT_Z);
        break;
      case S.stars: {
        // Round the cloud towers: swinging out to the right while leaning left into the curve, and the other way.
        out.z = curveZ(local);
        const curving = clip > 0 && clip < clipLength(step);
        const a = (Math.max(0, clip) / LEAN_PERIOD) * TAU;
        out.x = curving ? CURVE_SWING * Math.sin(a) : 0;
        const dx = curving ? CURVE_SWING * (TAU / LEAN_PERIOD) * Math.cos(a) : 0;
        out.yaw = AHEAD - 0.35 * Math.atan2(dx, 2);
        out.roll = curving ? -0.12 * Math.sin(a) : 0;
        break;
      }
      case S.stand:
        out.z = STAND_Z;
        break;
      case S.push:
        out.z = travelTo(local, step, STAND_Z, SUN_Z);
        break;
      case S.rainbow:
        out.z = SUN_Z;
        break;
      case S.hooray: {
        // Wolle turns round with Tapsi, to us; then bounces under every landing.
        out.z = SUN_Z;
        out.yaw = AHEAD - Math.PI * smooth(local / TRAVEL[step]);
        if (clip > 0 && clip < clipLength(step)) {
          const k = (clip / CHEER_PERIOD) % 1;
          out.squash = Math.max(0, 1 - Math.abs(k - LANDING - 0.04) / 0.12);
        }
        break;
      }
      default:
        out.z = SUN_Z;
        out.yaw = AHEAD - Math.PI;
    }
    return out;
  }

  const place: Place = { x: 0, y: 0, z: 0, yaw: AHEAD, roll: 0, squash: 0 };
  function setWolle(p: Place) {
    wolle.group.position.set(p.x, p.y, p.z);
    wolle.group.rotation.set(0, p.yaw, p.roll, "YXZ");
    wolle.squash(p.squash);
    wolle.group.updateMatrixWorld(true);
  }
  /** Where Tapsi's feet are on Wolle (the guide's root). */
  const rootOn = (p: Place, sitting: number, out: THREE.Vector3) =>
    wolle.group.localToWorld(out.set(0, WOLLE_TOP * (1 - p.squash * 0.14) - SINK - SIT_DROP * sitting, 0));
  /** A point measured in Tapsi's own space (x to its left, z ahead) in the world, Tapsi standing at `root` turned by `yaw`. */
  const fromTapsi = (local: THREE.Vector3, root: THREE.Vector3, yaw: number, out: THREE.Vector3) => out.copy(local).applyAxisAngle(UP, yaw).add(root);

  // --- Measuring the paws --------------------------------------------------
  // Tapsi is posed at the world's middle, facing +z, to find where a paw (or the head) will be at a
  // moment of a clip, so each thing is put exactly there. The poses blend in from standing like the player's.
  let measureTime = -1e5;
  function measure(motion: Parameters<typeof clipPose>[0], clip: number, sitting: number) {
    const pose: Pose = lerpPose(clipPose("idle", 0), clipPose(motion, clip), Math.min(1, clip / 0.7));
    guide.root.position.set(0, 0, 0);
    guide.root.rotation.set(0, 0, 0);
    // Far apart in time, so the springs of the paws and ears settle at once.
    measureTime -= 10;
    guide.apply(sitDown(pose, sitting), measureTime);
    guide.root.updateMatrixWorld(true);
    return {
      L: guide.gripPoint("L", new THREE.Vector3()),
      R: guide.gripPoint("R", new THREE.Vector3()),
      top: new THREE.Box3().setFromObject(guide.root).max.y,
    };
  }

  // The planes fly between the ducked head and where the standing head would be.
  const standTop = measure("idle", 1, 0).top;
  const duckTop = measure("duck", passTime(0), 0).top;
  const PASS_Y = Math.max(duckTop + 0.24, (duckTop + standTop) / 2 + 0.05);

  // A balloon at the front of every tapping paw: the left one first.
  const balloonAt = balloons.map((_, n) => {
    const m = measure("tap_forward", tapTime(n), 0);
    return (n % 2 === 0 ? m.L : m.R).clone().add(v3(0, 0, BALLOON_RADIUS + 0.02));
  });

  // A star at the reaching paw at the furthest lean of every curve, where Wolle carries Tapsi then.
  const starAt = stars.map((_, n) => {
    const left = n % 2 === 0;
    const m = measure("lean_side", starTime(n), 1);
    const paw = (left ? m.L : m.R).clone().add(v3(left ? 0.1 : -0.1, 0.03, 0));
    const p = wolleAt(S.stars, TRAVEL[S.stars] + starTime(n), 0, { ...place });
    setWolle(p);
    return fromTapsi(paw, rootOn(p, 1, new THREE.Vector3()), p.yaw, new THREE.Vector3());
  });
  for (const [n, star] of stars.entries()) star.position.copy(starAt[n]);

  // A grey puff touching the top of the paws at the top of every push, under the rain cloud.
  const station = { ...place, z: SUN_Z, y: ALT };
  setWolle(station);
  const stationRoot = rootOn(station, 0, new THREE.Vector3());
  const puffAt = puffs.map((_, n) => {
    const m = measure("push_up", pushTime(n), 0);
    const top = Math.max(m.L.y, m.R.y);
    const paws = v3((m.L.x + m.R.x) / 2, top + 0.04 + PUFF_RADIUS, (m.L.z + m.R.z) / 2);
    return fromTapsi(paws, stationRoot, AHEAD, new THREE.Vector3());
  });
  rain.mesh.position.copy(stationRoot);
  const cloudHome = rainCloud.puffs.map((p) => p.position.clone());

  // --- Camera --------------------------------------------------------------
  /** How far the camera stands from Tapsi, so the whole body with the arms up fills most of the picture. */
  const frameDistance = () => {
    const cam = stage.camera;
    const v = THREE.MathUtils.degToRad(cam.fov / 2);
    const h = Math.atan(Math.tan(v) * cam.aspect);
    return Math.max(1.15 / Math.tan(v), 0.95 / Math.tan(h));
  };
  /** Tapsi at `at` seen from the world direction `angle` (0: from +z, behind Tapsi while it faces the way). */
  function around(at: THREE.Vector3, angle: number, far: number, height: number, pos: THREE.Vector3, look: THREE.Vector3, lookY = 0.8) {
    const d = frameDistance() * far;
    pos.set(at.x + Math.sin(angle) * d, at.y + height, at.z + Math.cos(angle) * d);
    look.set(at.x, at.y + lookY, at.z);
  }

  /** Where the camera looks from in a step, `local` seconds into it, at Tapsi standing at `g`. */
  function actShot(step: number, local: number, g: THREE.Vector3, pos: THREE.Vector3, look: THREE.Vector3) {
    const praise = local - LEAD[step] - actLength(step);
    switch (step) {
      case S.hello:
        // From the front: the first look at Tapsi's face.
        around(g, Math.PI + 0.15, 1.05, 1.1, pos, look);
        return;
      case S.flap:
        around(g, 0, 1.15, 1.3, pos, look, 0.9);
        return;
      case S.duck:
        // Right behind the head and just over it, looking the way Tapsi looks: the planes come at us.
        pos.set(g.x, g.y + standTop + 0.3, g.z + 1.5);
        look.set(g.x, g.y + standTop * 0.75, g.z - 6);
        return;
      case S.balloons:
        // A little from the right and higher, so the paws in front of the body show.
        around(g, 0.55, 1.05, 1.5, pos, look);
        look.z -= 0.4;
        return;
      case S.sit:
      case S.stand:
        around(g, 0.5, 1, 1.2, pos, look, 0.6);
        return;
      case S.stars:
        // Behind, swinging out only half as far as Wolle, so the curves show.
        around(g, 0, 1.1, 1.4, pos, look, 0.6);
        pos.x -= place.x * 0.5;
        look.z -= 1;
        return;
      case S.push:
        // Low behind Tapsi, looking up past it at the puffs and the sun.
        pos.set(g.x + 0.5, g.y + 0.85, g.z + 2.7);
        look.set(g.x, g.y + 2.4, g.z - 1.2);
        return;
      case S.rainbow:
        // Behind and a bit higher, looking out at the sky where the rainbow is painted.
        pos.set(g.x + 0.3, g.y + 1.5, g.z + 3.2);
        look.set(g.x, g.y + 3.2, g.z - 12);
        return;
      default: {
        // Turned round to us: from the front, the sun and the rainbow behind Tapsi; at the very end up and away.
        const away = step === S.bye ? smooth(praise / PRAISE[step]) : 0;
        around(g, 0.15, 1.15 + away * 2.5, 1.2 + away * 3, pos, look, 1);
        look.z -= 2;
      }
    }
  }

  /**
   * Blends two camera shots by going round `center` (Tapsi) instead of
   * straight through: from the front to behind the camera circles past.
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

  /** The way the camera flies in the opening: from the rain cloud before the sun back over the land to Tapsi. */
  const flight = new THREE.CatmullRomCurve3([v3(1, ALT + 2, SUN_Z + 24), v3(3, ALT + 1, 10), v3(8, 7, MEADOW_Z - 14), v3(0, 0, 0)]);
  /** The camera in the opening: still at the rain cloud while Tapsi wonders where the sun is, then the flight home to Tapsi's front. */
  function openingShot(t: number, g: THREE.Vector3, pos: THREE.Vector3, look: THREE.Vector3) {
    actShot(S.hello, 0, g, tmpA, tmpB);
    flight.points[3].copy(tmpA);
    const k = smooth((t - 4) / (OPENING - 4));
    flight.getPoint(k * 0.98 + 0.02 * smooth(t / 4) * (1 - k), pos);
    look.copy(SUN).lerp(tmpB, smooth((t - 4.5) / (OPENING - 4.8)));
  }

  // --- Kiki ----------------------------------------------------------------
  /**
   * Where Kiki flies in each step, in Tapsi's space (x to its left, z ahead): clear of the paws and of what
   * comes, and away from the camera. From the balloons on the camera often looks from Tapsi's right, so Kiki
   * changes to the left once, ahead of Tapsi, and stays there (crossing later would fly through the shot).
   */
  const KIKI = [
    v3(-1.0, 1.55, 0.8),
    v3(-1.3, 1.9, -0.6),
    v3(-1.3, 1.9, -0.6),
    v3(1.5, 1.8, -1.2),
    v3(1.5, 1.8, -1.2),
    v3(1.3, 1.6, -1.6),
    v3(1.3, 1.6, -1.6),
    v3(1.4, 0.5, 0.4),
    v3(1.5, 1.2, -0.3),
    v3(1.3, 1.5, -0.5),
    v3(1.3, 1.5, -0.5),
  ];
  const kikiFar = v3(-10, 6, MEADOW_Z - 22);
  function placeKiki(f: StoryFrame, g: THREE.Vector3) {
    const { step, time } = f;
    const p = parrot.group.position;
    const here = fromTapsi(KIKI[step], g, place.yaw, tmpA);
    if (f.opening !== null) {
      p.copy(kikiFar);
    } else if (step === S.hello) {
      p.copy(kikiFar).lerp(here, smooth((f.local - 0.3) / 2.4));
      if (f.act + f.demo > 0) p.y += Math.abs(Math.sin(time * 4.5)) * 0.12;
    } else {
      const before = fromTapsi(KIKI[step - 1], g, place.yaw, tmpB);
      p.copy(before).lerp(here, smooth(f.local / 1.5));
    }
    p.y += Math.sin(time * 2.3) * 0.08;
    // At the very end Kiki flies off up into the sun.
    if (step === S.bye) p.lerp(tmpB.set(SUN.x, SUN.y - 4, SUN.z + 6), smooth((f.praise - 0.3) / 2.5) * 0.4);
    parrot.group.rotation.set(0, Math.atan2(camPos.x - p.x, camPos.z - p.z), 0);
    parrot.flap(time, true);
    if (step === S.hello) {
      for (const at of [1.2, TRAVEL[S.hello] + 0.6, LEAD[S.hello] + 1, LEAD[S.hello] + 4]) if (crossed(f, at)) cue("tweet");
    } else if (step === S.bye && (crossed(f, LEAD[S.bye] + 0.5) || crossed(f, LEAD[S.bye] + 3))) cue("tweet");
  }

  // --- The world in step with the movements --------------------------------
  function updateWorld(f: StoryFrame, g: THREE.Vector3) {
    const { step, time } = f;
    const clip = f.act + f.demo;
    const inOpening = f.opening !== null;
    /** True if this frame passed the moment `c` of the step's clip. */
    const atClip = (c: number) => !inOpening && crossed(f, TRAVEL[step] + c);

    // Every downstroke lifts Wolle: a puff of air under it.
    if (step === S.flap) {
      for (let n = 0; n < goes(S.flap); n++) {
        if (atClip((n + 0.75) * FLAP_PERIOD)) {
          cue("whoosh");
          sparkle.burst(tmpA.copy(g).add(v3(0, -0.6, 0)), 6, 1.5);
        }
      }
    }

    // The planes: one comes at Tapsi's head in every duck, passes right over it at the deepest point and
    // pulls up steeply over the camera behind.
    planes.forEach((plane, n) => {
      const d = step === S.duck && !inOpening ? (clip - passTime(n)) * PLANE_SPEED : -99;
      const on = d > -22 && d < 5;
      plane.group.visible = on;
      if (!on) return;
      const rise = (x: number) => (x < 0 ? -x * 0.06 : x * x * 1.4);
      plane.group.position.set(g.x + Math.sin(time * 2 + n) * 0.05 * Math.min(1, -d / 4), g.y + PASS_Y + rise(d), g.z + d);
      plane.group.rotation.set(-Math.atan((rise(d + 0.1) - rise(d - 0.1)) / 0.2), 0, Math.sin(time * 2.5 + n) * 0.12, "YXZ");
      plane.spin(time);
      if (atClip(passTime(n) - 0.35)) cue("whoosh");
    });
    // Tapsi's face shows the planes passing: a little shy while they go over.
    guide.earsBack = step === S.duck && clip > 0 ? duckDepth(clip) * 0.8 : 0;

    // The balloons float up to the paws from ahead, the left one first, and pop – confetti.
    balloons.forEach((balloon, n) => {
      const u = step === S.balloons && !inOpening ? (clip - tapTime(n) + FLOAT) / FLOAT : -1;
      balloon.visible = u >= 0 && u < 1;
      if (balloon.visible) {
        const side = n % 2 === 0 ? 1 : -1;
        const target = balloonAt[n];
        const e = u * 0.6 + smooth(u) * 0.4;
        tmpA.set(target.x + side * 1.6, target.y - 2.6, target.z + 4.5).lerp(target, e);
        tmpA.x += Math.sin(time * 1.7 + n) * 0.12 * (1 - u);
        fromTapsi(tmpA, g, place.yaw, balloon.position);
        balloon.rotation.set(0, 0, Math.sin(time * 1.3 + n) * 0.15 * (1 - u));
      }
      if (step === S.balloons && atClip(tapTime(n))) {
        confetti.burst(fromTapsi(balloonAt[n], g, place.yaw, tmpB), 26, 2.6, true);
        cue("pop");
      }
    });

    // The stars hang along the curves; the reaching paw takes each one: it twinkles and flies up into the sky.
    stars.forEach((star, n) => {
      const since = step === S.stars ? clip - starTime(n) : step > S.stars ? 99 : -99;
      star.visible = since < 1.2 && step <= S.stars;
      const away = Math.max(0, since);
      star.position.copy(starAt[n]).add(tmpA.set(0, away * 2.5 + away * away * 3, 0));
      star.scale.setScalar(1 + Math.sin(Math.min(1, away / 0.25) * Math.PI) * 0.6 - smooth(away / 1.2) * 0.9);
      star.rotation.set(0, time * 1.5 + n + away * 8, 0);
      if (step === S.stars && atClip(starTime(n))) {
        sparkle.burst(starAt[n], 30, 2.6, true);
        cue("sparkle");
      }
    });

    // The rain cloud: a grey puff hangs down to the paws for every push; the stack comes down one puff
    // after each push, so the next one is there exactly when the paws come up again. A pushed puff
    // flies up and away to the side and turns white; the rain stops, the cloud opens, the sun laughs.
    const pushClip = step === S.push ? clip : step > S.push ? 99 : -99;
    const pushed = (c: number) => puffs.reduce((sum, _, n) => sum + smooth((c - pushTime(n)) / 0.8), 0) / puffs.length;
    const comeDown = (c: number) => {
      let levels = 0;
      for (let n = -1; n < puffs.length - 1; n++) {
        const from = n < 0 ? pushTime(0) - PUSH_PERIOD : pushTime(n) + 0.3;
        const u = clamp01((c - from) / (pushTime(n + 1) - from));
        levels += u * 0.6 + smooth(u) * 0.4;
      }
      return levels;
    };
    const down = comeDown(pushClip);
    puffs.forEach((puff, n) => {
      const since = pushClip - pushTime(n);
      const side = n % 2 === 0 ? -1 : 1;
      const at = puff.group.position.copy(puffAt[n]);
      if (since < 0) {
        at.y += Math.max(0, n + 1 - down) * PUFF_GAP;
      } else {
        at.add(tmpA.set(side * (0.8 * since + 0.6 * since * since), 2.2 * since + 1.5 * since * since, -0.5 * since));
      }
      const gone = smooth((since - 1.4) / 1.4);
      puff.group.visible = gone < 1;
      puff.group.scale.setScalar(1 + clamp01(since) * 0.3);
      puff.material.color.copy(GREY_PUFF).lerp(WHITE, smooth(since / 0.8));
      puff.material.emissiveIntensity = smooth(since / 0.8) * 0.3;
      puff.material.opacity = 1 - gone;
      if (step === S.push && atClip(pushTime(n))) {
        cue("whoosh");
        sparkle.burst(tmpA.copy(puffAt[n]).add(v3(0, -PUFF_RADIUS, 0)), 14, 2);
      }
    });
    const clear = Math.min(1, pushed(pushClip));
    rainCloud.material.color.copy(DARK_CLOUD).lerp(WHITE, clear);
    rainCloud.material.emissiveIntensity = clear * 0.25;
    rainCloud.puffs.forEach((puff, i) => {
      const home = cloudHome[i];
      puff.position.set(home.x + Math.sign(home.x - SUN.x || 1) * clear * (i < 9 ? 9 : 16), home.y + clear * 2, home.z);
    });
    const raining = inOpening ? 1 - smooth(((f.opening ?? 0) - 4) / 1) : step === S.push ? Math.min(smooth(f.local / 2), 1 - clear) : 0;
    rain.update(time, raining);
    const lastPush = pushClip - pushTime(puffs.length - 1);
    sun.set(clear, lastPush > 0.2 ? 1 : 0);
    sun.beams.rotation.z = time * 0.25;
    sun.group.scale.setScalar(1 + (step === S.hooray ? place.squash * 0.06 : 0));
    if (step === S.push && atClip(pushTime(puffs.length - 1) + 0.3)) {
      cue("chime");
      sparkle.burst(tmpA.copy(SUN).add(v3(0, 0, 4)), 60, 6, true);
    }

    // The sky follows the cloud: grey and dim at the start, blue and bright once the sun is out.
    stage.setSky(GREY, DAY, clear);
    stage.setSunDirection(tmpA.copy(SUN).sub(stationRoot));
    stage.sun.color.set("#fff4e0");
    stage.sun.intensity = 1.1 + clear * 1.5;
    stage.fill.color.copy(DIM_FILL).lerp(DAY_FILL, clear);
    const band = Math.floor(clear * 4);
    if (band !== skyBand) {
      skyBand = band;
      stage.updateReflections();
    }

    // The rainbow: every go of the arms paints one band, the left arm the left half from its end up to the
    // top, then the right arm the right half; a bright spot shows where the paint is.
    const arcClip = step === S.rainbow ? clip : step > S.rainbow ? 99 : -99;
    const painting = Math.floor(arcClip / ARC_PERIOD);
    const draw = arcDraw(Math.max(0, arcClip));
    for (let b = 0; b < 6; b++) {
      if (b < painting) rainbow.paint(b, 1, 1);
      else if (b > painting || arcClip < 0) rainbow.paint(b, 0, 0);
      else rainbow.paint(b, draw.left ? draw.up : 1, draw.left ? 0 : draw.up);
    }
    tip.visible = step === S.rainbow && arcClip >= 0 && painting < 6 && draw.up > 0.02 && draw.down === 0;
    if (tip.visible) {
      rainbow.edge(painting, draw.left, draw.up, tip.position);
      rainbow.group.localToWorld(tip.position);
    }
    if (step === S.rainbow) {
      for (let h = 0; h < 12; h++) {
        if (atClip((h + ARC_TOP) * (ARC_PERIOD / 2))) {
          cue("chime");
          sparkle.burst(rainbow.group.localToWorld(rainbow.edge(Math.floor(h / 2), h % 2 === 0, 1, tmpA)), 30, 3, true);
        }
      }
    }

    // Hooray: confetti when Tapsi has turned round, and again with every other landing.
    if (step === S.hooray) {
      if (atClip(0)) {
        confetti.burst(tmpA.copy(g).add(v3(0, 1.4, 0)), 60, 4.5, true);
        cue("chime");
      }
      for (let n = 0; n * CHEER_PERIOD < clipLength(step); n += 2) {
        if (atClip((n + LANDING) * CHEER_PERIOD)) confetti.burst(tmpA.copy(g).add(v3(0, 1.8, 0)), 14, 3);
      }
    }

    const dt = Math.max(0, Math.min(0.1, time - lastTime));
    lastTime = time;
    confetti.update(dt);
    sparkle.update(dt);
  }

  return {
    focus,
    update(f) {
      const { step } = f;
      const inOpening = f.opening !== null;
      wolleAt(step, f.local, f.time, place);
      setWolle(place);
      const clip = f.act + f.demo;
      const sitting = inOpening ? 0 : step === S.sit ? sitProgress(clip) : step === S.stars ? 1 : step === S.stand ? 1 - sitProgress(clip) : 0;
      const g = rootOn(place, sitting, guide.root.position);
      guide.root.rotation.set(0, place.yaw, 0);
      guide.joy = step >= S.hooray ? smooth(f.local / 1) : f.praise > 0 ? smooth(f.praise / 0.5) * (1 - smooth((f.praise - PRAISE[step] + 0.3) / 0.3)) : 0;

      // Camera: from the last step's shot round to this step's while Wolle flies on.
      if (inOpening) {
        openingShot(f.opening ?? 0, g, camPos, camLook);
      } else {
        actShot(step, f.local, g, camPos, camLook);
        if (step === S.hello) {
          openingShot(OPENING, g, fromPos, fromLook);
        } else {
          actShot(step - 1, sequence.steps[step - 1].seconds + DEMO[step - 1], g, fromPos, fromLook);
        }
        const travel = f.lead - f.demo;
        orbitBlend(g, fromPos, fromLook, camPos, camLook, smooth(f.local / Math.max(1.2, travel)), camPos, camLook);
      }
      // A gentle breathing of the camera, like it is held by hand.
      camPos.x += Math.sin(f.time * 0.6) * 0.03;
      camPos.y += Math.sin(f.time * 0.8) * 0.02;
      camPos.y = Math.max(camPos.y, groundHeight(camPos.x, camPos.z) + 0.3);
      stage.camera.position.copy(camPos);
      stage.camera.lookAt(camLook);
      // Lean the view a little with Wolle in the curves.
      if (step === S.stars && clip > 0 && clip < clipLength(step)) stage.camera.rotateZ(Math.sin((clip / LEAN_PERIOD) * TAU) * 0.05);
      focus.copy(g);

      placeKiki(f, g);
      updateWorld(f, g);
      return { walking: false, flash: 0, sitting, bend: 0 };
    },
  };
}

export const CLOUD_TRIP: Story = {
  sequence,
  opening: { seconds: OPENING, lines: OPENING_LINES },
  lead: LEAD,
  demo: DEMO,
  praise: PRAISE,
  lines: LINES,
  translations: TRANSLATIONS,
  build,
};
