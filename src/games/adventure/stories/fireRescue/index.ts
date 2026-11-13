import * as THREE from "three";
import { CHEER_PERIOD, clipPose, duckDepth, PULL_DOWN_AT, PULL_DOWN_PERIOD } from "../../three/clips";
import { type Guide, lerpPose } from "../../three/guide";
import { updateMoved } from "../../three/matrices";
import { mergeStatic } from "../../three/props";
import { DAY, type Stage } from "../../three/stage";
import { crossed, type Cue, type Story, type StoryFrame, type StoryWorld } from "../story";
import {
  AHEAD,
  CATCH_GAP,
  clamp01,
  FLOOR,
  HOUSE_HALF,
  HOUSE_Z,
  HOVER,
  KITTEN_COLORS,
  PARTY_GAP,
  ROBO_TOP,
  smooth,
  SPRAY_Z,
  STREET_X,
  TAU,
  v3,
  YARD_Z,
} from "./layout";
import { LANGUAGE, LINES, OPENING_LINES } from "./lines";
import { HOSE_OUT, makeGallows, makeSmokyHouse, makeWashingLine, NOZZLE_MOUTH } from "./scenery";
import {
  actLength,
  catchTime,
  clipLength,
  DEMO,
  DUCK_END,
  duckZ,
  floorsUp,
  goes,
  LANDING,
  LEAD,
  lineZ,
  OPENING,
  PRAISE,
  passTime,
  pullTime,
  releaseTime,
  S,
  sequence,
  sprayTime,
  TRAVEL,
} from "./script";
import { makeWorld } from "./world";

// „Fire Rescue“: smoke comes out of a house in town and kittens sit up on its roof. Tapsi never walks: it stands on
// Robo, a round hover robot, and Robo carries it everywhere (user idea, November 2026) – so the child moves along on
// the spot. Tapsi waves Kiki over, rings the fire bell so the gate rolls up, ducks under the washing lines across
// the street, sprays the smoke away with the hose, left and right, while Robo rises floor by floor, catches the
// kittens jumping off the roof, turns round to us and cheers, and waves goodbye. Tapsi always faces the way and the
// camera looks from behind, so left is left; only at the start and the end does it look from the front.
//
// Positions are in layout.ts, the props in scenery.ts, put together in world.ts, the steps and their timing in
// script.ts; here they move.

const UP = new THREE.Vector3(0, 1, 0);
/** How far behind Tapsi the camera stands while it ducks. */
const DUCK_CAMERA_BACK = 3;
/** How high the camera stands while Tapsi ducks, as a share of Tapsi's standing height: under the washing. */
const DUCK_CAMERA_HEIGHT = 0.6;
/** How much higher than the nozzle's mouth the water lands on the house's front. */
const RISE = 0.55;
/** Seconds a kitten flies from the roof into the paws. */
const JUMP = 0.7;
/** Seconds a kitten hops from the paws down onto Robo. */
const HOP = 0.4;
/** How far before Tapsi's middle a caught kitten lies at least, so it never sinks into the chest. */
const KITTEN_OUT = 0.47;
/** How far a kitten swings out to the side as it hops from the paws onto Robo, round Tapsi's body. */
const HOP_ASIDE = 0.4;
/** Where the kittens sit on Robo once caught, in Robo's space (+z its front): round Tapsi's feet. */
const RIDE = [v3(0.5, ROBO_TOP, 0.3), v3(-0.5, ROBO_TOP, 0.3), v3(0.47, ROBO_TOP, -0.38), v3(-0.47, ROBO_TOP, -0.38)];

/** Robo's place and turn for a frame. */
interface Place {
  y: number;
  z: number;
  yaw: number;
  squash: number;
}

function build(stage: Stage, guide: Guide, cue: (c: Cue) => void): StoryWorld {
  const scene = stage.scene;
  stage.setSky(DAY, DAY, 0);
  stage.updateReflections();
  const { robo, parrot, door, bell, rope, handle, puffs, roofSmoke, kittens, nozzle, hose, water, confetti, spray } = makeWorld(scene);

  const focus = v3(0, 0, YARD_Z);
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const fromPos = new THREE.Vector3();
  const fromLook = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpC = new THREE.Vector3();
  const tmpD = new THREE.Vector3();
  const GREY = new THREE.Color("#7d838c");
  const WHITE = new THREE.Color("#ffffff");
  let lastTime = 0;
  let doorShown = -1;

  // --- Measuring the paws --------------------------------------------------
  // Tapsi is posed at the world's middle, facing +z, to find where the paws (or the head) will be at a moment of a
  // clip, so each thing is put exactly there. The poses blend in from standing like the player's.
  let measureTime = -1e5;
  function measure(motion: Parameters<typeof clipPose>[0], clip: number) {
    const pose = lerpPose(clipPose("idle", 0), clipPose(motion, clip), Math.min(1, clip / 0.7));
    guide.root.position.set(0, 0, 0);
    guide.root.rotation.set(0, 0, 0);
    // Far apart in time, so the springs of the paws and ears settle at once.
    measureTime -= 10;
    guide.apply(pose, measureTime);
    updateMoved(guide.root);
    const L = guide.gripPoint("L", new THREE.Vector3());
    const R = guide.gripPoint("R", new THREE.Vector3());
    return { L, R, mid: L.clone().add(R).multiplyScalar(0.5), top: new THREE.Box3().setFromObject(guide.root).max.y };
  }
  /** A point measured in Tapsi's own space (x to its left, z ahead) in the world, Tapsi standing at `root` turned by `yaw`. */
  const fromTapsi = (local: THREE.Vector3, root: THREE.Vector3, yaw: number, out: THREE.Vector3) => out.copy(local).applyAxisAngle(UP, yaw).add(root);

  /**
   * Where the hose's water goes, from the paws' pose right now: the nozzle in the middle of the paws, pointing where
   * the chest is turned (a little up), and where its arc lands on the plane `planeZ` ahead. Works for the measuring
   * pose at the origin and for Tapsi in the world alike.
   */
  const aim = { mid: new THREE.Vector3(), flat: new THREE.Vector3(), dir: new THREE.Vector3(), tip: new THREE.Vector3(), end: new THREE.Vector3(), far: 0 };
  function aimNow(planeZ: number) {
    guide.gripPoint("L", tmpA);
    guide.gripPoint("R", tmpB);
    aim.mid.copy(tmpA).add(tmpB).multiplyScalar(0.5);
    guide.bodyPoint(tmpA.set(0, 0.6, 1), tmpA);
    guide.bodyPoint(tmpB.set(0, 0.6, 0), tmpB);
    aim.flat.subVectors(tmpA, tmpB).setY(0).normalize();
    aim.dir.copy(aim.flat).setY(0.22).normalize();
    aim.tip.copy(aim.mid).addScaledVector(aim.dir, NOZZLE_MOUTH);
    aim.far = (planeZ - aim.tip.z) / aim.flat.z;
    aim.end.copy(aim.tip).addScaledVector(aim.flat, aim.far);
    aim.end.y = aim.tip.y + RISE;
    return aim;
  }

  // The washing hangs between the ducked head and where the standing head would be.
  const standTop = measure("idle", 1).top;
  const duckTop = measure("duck", passTime(0)).top;
  const ROOT_HOVER = HOVER + ROBO_TOP;
  const LAUNDRY_BOTTOM = ROOT_HOVER + (duckTop + standTop) / 2;
  const lines = new THREE.Group();
  for (let n = 0; n < goes(S.duck); n++) lines.add(makeWashingLine(300 + n * 7, lineZ(n), LAUNDRY_BOTTOM + 0.42, LAUNDRY_BOTTOM));
  scene.add(mergeStatic(lines));

  // The bell's rope hangs where the paws are up high, so they take its handle there; the bell beside it on Tapsi's right.
  const yardRoot = v3(0, ROOT_HOVER, YARD_Z);
  const pullUp = measure("pull_down", PULL_DOWN_PERIOD).mid;
  const pullDown = measure("pull_down", pullTime(1)).mid;
  const HANDLE_REST = fromTapsi(pullUp, yardRoot, AHEAD, new THREE.Vector3());
  const ROPE_TOP = HANDLE_REST.clone().add(v3(0, 0.8, 0));
  /** How far down the rope comes at a pull. */
  const PULL_REACH = pullUp.y - pullDown.y;
  const BELL_AT = ROPE_TOP.clone().add(v3(0.6, 0, 0));
  scene.add(mergeStatic(makeGallows(ROPE_TOP, ROPE_TOP.x + 1.55)));
  bell.position.copy(BELL_AT);

  // A window with smoke for each place the water lands at the left and the right end of every go of the hose, where
  // Robo has risen to by then: one floor higher for every go.
  const windows = puffs.map((_, n) => {
    measure("spray", sprayTime(n));
    const { end } = aimNow(SPRAY_Z - HOUSE_Z);
    const root = v3(0, ROOT_HOVER + Math.round(floorsUp(sprayTime(n))) * FLOOR, SPRAY_Z);
    const at = fromTapsi(end, root, AHEAD, new THREE.Vector3());
    at.x = THREE.MathUtils.clamp(at.x, -HOUSE_HALF + 0.7, HOUSE_HALF - 0.7);
    at.z = HOUSE_Z;
    return at;
  });
  const EAVES = Math.max(...windows.map((w) => w.y)) + 1;
  scene.add(mergeStatic(makeSmokyHouse(windows, EAVES)));

  // Robo rises to the roof for the kittens: the paws close round each one a little below the gutter, close to the house.
  const catchHold = measure("catch", catchTime(1)).mid;
  const CATCH_Z = HOUSE_Z + CATCH_GAP;
  const CATCH_Y = EAVES - 0.75 - catchHold.y - ROBO_TOP;
  const SPRAY_TOP = HOVER + (goes(S.spray) - 1) * FLOOR;
  const PARTY_Z = HOUSE_Z + PARTY_GAP;
  /** Where kitten n waits on the roof's edge, looking down at us. */
  const seat = (n: number) => v3((n - (KITTEN_COLORS.length - 1) / 2) * 0.7, EAVES + 0.02, HOUSE_Z + 0.22);

  // --- Robo's way ----------------------------------------------------------
  /** Robo floats up and down a little where nothing has to meet a paw. */
  const bob = (step: number, time: number) => (step === S.hello || step >= S.hooray ? Math.sin(time * 1.3) * 0.04 : 0);
  /** From the roof down before the house, from the kittens' praise through the turn round. */
  const down = (k: number, out: Place) => {
    const u = smooth(k);
    out.y = CATCH_Y + (HOVER - CATCH_Y) * u;
    out.z = CATCH_Z + (PARTY_Z - CATCH_Z) * u;
  };
  const DOWN_TIME = PRAISE[S.catch] + TRAVEL[S.hooray];

  /** Where Robo is `local` seconds into a step. */
  function roboAt(step: number, local: number, time: number, out: Place) {
    const clip = local - TRAVEL[step];
    out.y = HOVER + bob(step, time);
    out.z = YARD_Z;
    out.yaw = AHEAD;
    out.squash = 0;
    switch (step) {
      case S.hello:
      case S.bell:
        break;
      case S.duck:
        out.z = duckZ(local);
        break;
      case S.spray:
        out.z = DUCK_END + (SPRAY_Z - DUCK_END) * smooth(local / TRAVEL[step]);
        out.y = HOVER + floorsUp(Math.max(0, clip)) * FLOOR;
        break;
      case S.catch: {
        // Up to the roof on the way over, held still for the kittens, then slowly down again in the praise.
        const k = smooth(local / TRAVEL[step]);
        out.y = SPRAY_TOP + (CATCH_Y - SPRAY_TOP) * k;
        out.z = SPRAY_Z + (CATCH_Z - SPRAY_Z) * k;
        const praise = clip - clipLength(step);
        if (praise > 0) down(praise / DOWN_TIME, out);
        break;
      }
      case S.hooray: {
        // Robo turns round with Tapsi, to us, and comes down before the house; then bounces under every landing.
        down((PRAISE[S.catch] + local) / DOWN_TIME, out);
        out.y += bob(step, time) * smooth(local / TRAVEL[step]);
        out.yaw = AHEAD - Math.PI * smooth(local / TRAVEL[step]);
        if (clip > 0 && clip < clipLength(step)) {
          const k = (clip / CHEER_PERIOD) % 1;
          out.squash = Math.max(0, 1 - Math.abs(k - LANDING - 0.04) / 0.12);
        }
        break;
      }
      default:
        out.z = PARTY_Z;
        out.yaw = AHEAD - Math.PI;
    }
    return out;
  }

  const place: Place = { y: HOVER, z: YARD_Z, yaw: AHEAD, squash: 0 };
  function setRobo(p: Place) {
    robo.group.position.set(0, p.y, p.z);
    robo.group.rotation.set(0, p.yaw, 0);
    robo.squash(p.squash);
    robo.beamTo(p.y);
    updateMoved(robo.group);
  }
  /** Where Tapsi's feet are on Robo (the guide's root). */
  const rootOn = (p: Place, out: THREE.Vector3) => robo.group.localToWorld(out.set(0, ROBO_TOP * (1 - p.squash * 0.14), 0));

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
        // From the front: the first look at Tapsi's face, on Robo, with Kiki beside it.
        around(g, Math.PI + 0.15, 1.4, 0.9, pos, look, 0.45);
        return;
      case S.bell:
        // From Tapsi's left side, a little behind and raised: the paws up at the handle in front of the body, the bell
        // beyond them and the gate rolling up ahead (on the left of the picture). From behind, the head hid the paws.
        around(g, -1.2, 1.35, 1.1, pos, look, 1.3);
        look.z -= 0.4;
        return;
      case S.duck:
        // Behind, under the washing and looking a little up the street: the whole ducking body shows, and every line
        // passes over the head.
        pos.set(g.x, g.y + standTop * DUCK_CAMERA_HEIGHT, g.z + DUCK_CAMERA_BACK);
        look.set(g.x, g.y + standTop, g.z - 6);
        return;
      case S.spray:
        // Behind and high over the head, rising with Robo: the nozzle in the paws and the water's arc to either side
        // and the house's front. From behind on one side, the body hid the water going to the other.
        pos.set(g.x - 0.4, g.y + 2.5, g.z + 3.3);
        look.set(g.x, g.y + 1.3, g.z - 5);
        return;
      case S.catch:
        // From Tapsi's left side, a little behind: the kittens on the gutter, the open arms they jump into and the
        // kitten held in them. Over the shoulder, the body hid the kitten in the arms.
        pos.set(g.x - 2.6, g.y + 1.4, g.z + 2.3);
        look.set(g.x, g.y + 1.15, g.z - 1.1);
        return;
      default: {
        // Turned round to us: from the front, the house behind Tapsi; at the very end up and away.
        const away = step === S.bye ? smooth(praise / PRAISE[step]) : 0;
        around(g, 0.15, 1.15 + away * 2.5, 1.2 + away * 3, pos, look, 1);
        look.z -= 2;
      }
    }
  }

  /** Blends two camera shots by going round `center` (Tapsi) instead of straight through: from the front to behind the camera circles past. */
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

  // The opening: the camera looks at the house with the smoke and the kittens on its roof, turns round and flies
  // back up the street, high over the washing lines and the yard's wall, down to Tapsi's front.
  const HOUSE_SHOT = v3(2.6, EAVES - 2, HOUSE_Z + 16);
  const HOUSE_LOOK = v3(0, EAVES - 2.6, HOUSE_Z);
  const flight = new THREE.CatmullRomCurve3([HOUSE_SHOT.clone(), v3(2, 6, 2), v3(0.6, 5.6, 14), v3(0, 5.2, 23.5), v3(0, 0, 0)]);
  /** Seconds into the opening when the camera leaves the house. */
  const LEAVE = 4.4;
  function openingShot(t: number, g: THREE.Vector3, pos: THREE.Vector3, look: THREE.Vector3) {
    actShot(S.hello, 0, g, tmpA, tmpB);
    flight.points[4].copy(tmpA);
    const k = smooth((t - LEAVE) / (OPENING - LEAVE));
    flight.getPoint(k, pos);
    // Turning from the house round to the way ahead (over the houses on the right), then down onto Tapsi.
    const yaw = Math.PI * (1 - smooth((t - LEAVE) / 1.8));
    const ahead = tmpC.set(Math.sin(yaw), -0.12, Math.cos(yaw)).multiplyScalar(6).add(pos);
    look.copy(HOUSE_LOOK).lerp(ahead, smooth((t - LEAVE) / 0.6));
    look.lerp(tmpB, smooth((t - (OPENING - 2)) / 2));
  }

  // --- Kiki ----------------------------------------------------------------
  /**
   * Where Kiki flies in each step, in Tapsi's space (x to its left, z ahead): always on Tapsi's right, a good way off
   * and clear of the paws and of what comes – over the washing lines in the street, beside the water's arc.
   */
  const KIKI = [v3(-1.8, 1.25, -0.5), v3(-2.4, 1.5, 2.4), v3(-2.2, 2.5, 2.4), v3(-2.6, 1.8, 0.8), v3(-2.4, 0.9, 1.4), v3(-2.2, 1.9, -1.8), v3(-2.2, 1.9, -1.8)];
  /** Kiki doesn't hang still: a slow, wide loop round its place, on its own side of Tapsi always. */
  const kikiLoop = (time: number, size: number, out: THREE.Vector3) =>
    out.set(0.6 * Math.sin(time * 0.43), 0.25 * Math.sin(time * 0.71 + 1), 1.1 * Math.sin(time * 0.29 + 2)).multiplyScalar(size);
  const kikiFar = v3(6, 7, 8);
  function placeKiki(f: StoryFrame, g: THREE.Vector3) {
    const { step, time } = f;
    const p = parrot.group.position;
    const loop = kikiLoop(time, step === S.hello ? 0.35 : 1, new THREE.Vector3());
    // While Robo turns round in the hooray, Kiki's places are taken as Tapsi faces before and after the turn.
    const yawOf = (s: number) => (s >= S.hooray ? AHEAD - Math.PI : step >= S.hooray ? AHEAD : place.yaw);
    const here = fromTapsi(loop.add(KIKI[step]), g, yawOf(step), tmpA);
    if (f.opening !== null) {
      p.copy(kikiFar);
    } else if (step === S.hello) {
      p.copy(kikiFar).lerp(here, smooth((f.local - 0.3) / 2.4));
      if (f.act + f.demo > 0) p.y += Math.abs(Math.sin(time * 4.5)) * 0.12;
    } else {
      const before = fromTapsi(kikiLoop(time, step - 1 === S.hello ? 0.35 : 1, tmpB).add(KIKI[step - 1]), g, yawOf(step - 1), tmpB);
      p.copy(before).lerp(here, smooth(f.local / 1.5));
    }
    p.y += Math.sin(time * 2.3) * 0.08;
    // At the very end Kiki flies off up over the town.
    if (step === S.bye) p.lerp(tmpB.set(-8, 12, PARTY_Z + 14), smooth((f.praise - 0.3) / 2.5) * 0.5);
    parrot.group.rotation.set(0, Math.atan2(camPos.x - p.x, camPos.z - p.z), 0);
    parrot.flap(time, true);
    if (step === S.hello) {
      for (const at of [1.2, TRAVEL[S.hello] + 0.6, LEAD[S.hello] + 1, LEAD[S.hello] + 4]) if (crossed(f, at)) cue("tweet");
    } else if (step === S.bye && (crossed(f, LEAD[S.bye] + 0.5) || crossed(f, LEAD[S.bye] + 3))) cue("tweet");
  }

  // --- The world in step with the movements --------------------------------
  /** How far into its pulls the bell's rope is `clip` s into the bell clip: the gate rolls up a share at each. */
  const pulled = (clip: number) => {
    let sum = 0;
    for (let n = 0; n < goes(S.bell); n++) sum += smooth((clip - (n + 0.02) * PULL_DOWN_PERIOD) / ((PULL_DOWN_AT - 0.02) * PULL_DOWN_PERIOD));
    return sum / goes(S.bell);
  };

  function updateWorld(f: StoryFrame, g: THREE.Vector3) {
    const { step, time } = f;
    const clip = f.act + f.demo;
    const inOpening = f.opening !== null;
    /** True if this frame passed the moment `c` of the step's clip. */
    const atClip = (c: number) => !inOpening && crossed(f, TRAVEL[step] + c);

    // The gate rolls up a little with every pull; the bell rings at the bottom of each.
    const open = inOpening || step < S.bell ? 0 : step > S.bell ? 1 : pulled(clip);
    if (open !== doorShown) {
      doorShown = open;
      door.open(open);
    }
    if (step === S.bell) {
      for (let n = 0; n < goes(S.bell); n++) if (atClip(pullTime(n))) cue("bell");
      if (atClip(pullTime(goes(S.bell) - 1) + 0.2)) cue("rumble");
    }

    // A line of washing passes right over the ducked head in every duck.
    if (step === S.duck) for (let n = 0; n < goes(S.duck); n++) if (atClip(passTime(n) - 0.35)) cue("whoosh");
    guide.earsBack = step === S.duck && clip > 0 ? duckDepth(clip) * 0.8 : 0;

    // The smoke: grey puffs at the windows, breathing a little, until the water reaches one: it turns white like steam,
    // rises and is gone. The smoke over the roof thins with every puff put out.
    const sprayClip = inOpening || step < S.spray ? -99 : step > S.spray ? 99 : clip;
    let out = 0;
    puffs.forEach((puff, n) => {
      const since = sprayClip - sprayTime(n);
      const at = puff.group.position.copy(windows[n]).add(tmpA.set(0, 0.05, 0.4));
      const k = clamp01(since / 1.6);
      at.y += k * k * 2.2;
      at.z += k * 0.6;
      puff.group.visible = k < 1;
      puff.group.scale.setScalar((1 + Math.sin(time * 1.4 + n) * 0.05) * (1 + k * 0.6));
      puff.material.color.copy(GREY).lerp(WHITE, smooth(since / 0.5));
      puff.material.emissiveIntensity = smooth(since / 0.5) * 0.3;
      puff.material.opacity = 1 - smooth((since - 0.4) / 1.2);
      if (since > 0) out++;
      if (step === S.spray && atClip(sprayTime(n))) {
        cue("splash");
        spray.burst(tmpA.copy(windows[n]).add(v3(0, 0, 0.35)), 22, 2.2, true);
      }
    });
    const smoky = 1 - out / puffs.length;
    roofSmoke.forEach((puff, n) => {
      const k = (time * 0.12 + n / roofSmoke.length) % 1;
      puff.group.visible = smoky > 0.01;
      puff.group.position.set((n - 1) * 1.1 + Math.sin(time * 0.4 + n) * 0.3, EAVES + 2.4 + k * 4, HOUSE_Z - 2);
      puff.group.scale.setScalar((0.7 + k * 0.8) * (0.5 + smoky * 0.5));
      puff.material.opacity = smoky * Math.min(1, k * 4, (1 - k) * 2);
    });

    // Every kitten caught gives a happy meow.
    if (step === S.catch) for (let n = 0; n < kittens.length; n++) if (atClip(catchTime(n))) cue("meow");

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
    spray.update(dt);
  }

  // --- What the paws hold, placed after the pose -----------------------------
  const left = new THREE.Vector3();
  const across = new THREE.Vector3();
  const bend = new THREE.Vector3();
  const middle = new THREE.Vector3();
  const FORWARD = new THREE.Vector3(0, 0, 1);

  /** The bell's handle in the paws while they pull, hanging from its rope otherwise; the bell tips with the rope. */
  function holdRope(f: StoryFrame) {
    const clip = f.act + f.demo;
    const pulling = f.opening === null && f.step === S.bell;
    // Let go at the end of the last pull, while the paws are up at the handle: dropping with them, the handle
    // went through Tapsi's head and chest (`collisions.test.ts`).
    const held = pulling ? smooth((clip - 0.25) / 0.5) * (1 - smooth((clip - clipLength(S.bell) + 0.3) / 0.3)) : 0;
    const at = handle.position.copy(HANDLE_REST);
    if (held > 0) {
      guide.gripPoint("L", tmpA);
      guide.gripPoint("R", tmpB);
      at.lerp(tmpA.add(tmpB).multiplyScalar(0.5), held);
      // The paws close round the bar on either side of the rope.
      left.set(1, 0, 0).applyAxisAngle(UP, place.yaw);
      guide.hold("L", tmpC.copy(at).addScaledVector(left, 0.09), left, held);
      guide.hold("R", tmpC.copy(at).addScaledVector(left, -0.09), left, held);
    }
    handle.rotation.set(0, place.yaw, 0);
    rope.between(ROPE_TOP, tmpA.copy(at).add(v3(0, 0.03, 0)));
    // The bell tips over as the rope comes down and swings back with a ring after each pull.
    const down = clamp01((HANDLE_REST.y - at.y) / PULL_REACH);
    let ring = 0;
    if (pulling) {
      for (let n = 0; n < goes(S.bell); n++) {
        const since = clip - pullTime(n);
        if (since > 0) ring += 0.22 * Math.exp(-since * 2.5) * Math.sin(since * 11);
      }
    }
    bell.rotation.set(down * 0.55 + ring, 0, 0);
  }

  /** The nozzle in the paws while they spray, with the hose up to it from Robo's hatch and the water's arc out of it. */
  function holdHose(f: StoryFrame) {
    const clip = f.act + f.demo;
    const spraying = f.opening === null && f.step === S.spray;
    const held = spraying ? smooth(clip / 0.6) * (1 - smooth((clip - clipLength(S.spray)) / 0.6)) : 0;
    nozzle.visible = held > 0.01;
    hose.mesh.visible = nozzle.visible;
    const wet = spraying ? smooth((clip - 0.5) / 0.3) * (1 - smooth((clip - clipLength(S.spray) + 0.2) / 0.2)) : 0;
    water.mesh.visible = wet > 0.01;
    if (!nozzle.visible) return;
    const a = aimNow(HOUSE_Z + 0.05);
    const hatch = robo.group.localToWorld(tmpC.copy(HOSE_OUT));
    // Coming up out of the hatch into the paws, and going back into it.
    nozzle.position.copy(hatch).addScaledVector(UP, 0.12).lerp(a.mid, held);
    nozzle.quaternion.setFromUnitVectors(FORWARD, a.dir);
    // The hose: from the hatch up to the nozzle's back, bulging out forwards so it never runs through the body.
    const back = tmpB.copy(nozzle.position).addScaledVector(a.dir, -0.2);
    bend.copy(hatch).add(back).multiplyScalar(0.5).addScaledVector(a.flat, 0.4);
    const piece = (u: number, out: THREE.Vector3) =>
      out
        .copy(hatch)
        .multiplyScalar((1 - u) ** 2)
        .addScaledVector(bend, 2 * u * (1 - u))
        .addScaledVector(back, u * u);
    for (let i = 0; i < hose.count; i++) {
      piece(i / hose.count, tmpA);
      piece((i + 1) / hose.count, across);
      const length = across.distanceTo(tmpA);
      middle.copy(tmpA).add(across).multiplyScalar(0.5);
      hose.set(i, middle, across.sub(tmpA).normalize(), length * 1.15);
    }
    hose.done();
    if (!water.mesh.visible) return;
    // The water: drops flowing along an arc from the mouth to where it lands on the house.
    const arcTop = tmpC
      .copy(a.tip)
      .addScaledVector(a.flat, a.far * 0.5)
      .addScaledVector(UP, RISE * 0.5 + 0.4);
    for (let i = 0; i < water.count; i++) {
      const u = (i / water.count + f.time * 1.4) % 1;
      if (u > wet) {
        water.hide(i);
        continue;
      }
      const w = 1 - u;
      tmpA
        .copy(a.tip)
        .multiplyScalar(w * w)
        .addScaledVector(arcTop, 2 * u * w)
        .addScaledVector(a.end, u * u);
      across
        .copy(arcTop)
        .sub(a.tip)
        .multiplyScalar(2 * w)
        .addScaledVector(tmpB.copy(a.end).sub(arcTop), 2 * u)
        .normalize();
      water.set(i, tmpA, across, 1.4 + u * 1.5, 0.7 + u * 0.9);
    }
    water.done();
  }

  /**
   * The kittens sit on the roof's edge until each one's turn; then it jumps into the paws, is held there while they
   * are closed, and hops down onto Robo when they open again, riding along at Tapsi's feet to the end.
   */
  function holdKittens(f: StoryFrame) {
    const clip = f.opening === null && f.step === S.catch ? f.act + f.demo : f.opening === null && f.step > S.catch ? 99 : -99;
    guide.gripPoint("L", tmpA);
    guide.gripPoint("R", tmpB);
    // Lying on the forearms in front of the chest, never pressed into it (`collisions.test.ts`): where the arms
    // close in, it stays KITTEN_OUT before Tapsi's middle.
    const paws = tmpA
      .add(tmpB)
      .multiplyScalar(0.5)
      .add(v3(0, -0.17, 0));
    const ahead = tmpB.set(0, 0, 1).applyAxisAngle(UP, place.yaw);
    const out = tmpC.copy(paws).sub(guide.root.position).dot(ahead);
    if (out < KITTEN_OUT) paws.addScaledVector(ahead, KITTEN_OUT - out);
    kittens.forEach((kitten, n) => {
      const p = kitten.position;
      const ride = robo.group.localToWorld(tmpC.copy(RIDE[n]));
      const jumped = (clip - catchTime(n) + JUMP) / JUMP;
      const hopped = (clip - releaseTime(n)) / HOP;
      if (jumped <= 0) {
        p.copy(seat(n));
      } else if (jumped < 1) {
        p.copy(seat(n)).lerp(paws, smooth(jumped));
        p.y += Math.sin(jumped * Math.PI) * 0.45;
      } else if (hopped <= 0) {
        p.copy(paws);
      } else if (hopped < 1) {
        // Round Tapsi's side, never through it: two of the spots lie behind it.
        const side = tmpB.set(1, 0, 0).applyAxisAngle(UP, place.yaw);
        const away = Math.sign(tmpD.copy(ride).sub(guide.root.position).dot(side)) || 1;
        p.copy(paws).lerp(ride, smooth(hopped));
        p.y += Math.sin(hopped * Math.PI) * 0.25;
        p.addScaledVector(side, away * Math.sin(hopped * Math.PI) * HOP_ASIDE);
      } else {
        p.copy(ride);
      }
      // Waiting on the roof a kitten looks down the street; moving or riding it looks at us.
      kitten.rotation.set(0, jumped <= 0 ? Math.sin(f.time * 0.8 + n * 2) * 0.3 : Math.atan2(camPos.x - p.x, camPos.z - p.z), 0);
    });
  }

  return {
    focus,
    update(f) {
      const { step } = f;
      const inOpening = f.opening !== null;
      roboAt(step, f.local, f.time, place);
      setRobo(place);
      const g = rootOn(place, guide.root.position);
      guide.root.rotation.set(0, place.yaw, 0);
      guide.joy = step >= S.hooray ? smooth(f.local / 1) : f.praise > 0 ? smooth(f.praise / 0.5) * (1 - smooth((f.praise - PRAISE[step] + 0.3) / 0.3)) : 0;

      // Camera: from the last step's shot round to this step's while Robo hovers on.
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
      camPos.y = Math.max(camPos.y, 0.3);
      // Never out past the street's house fronts.
      camPos.x = THREE.MathUtils.clamp(camPos.x, -STREET_X + 0.4, STREET_X - 0.4);
      stage.camera.position.copy(camPos);
      stage.camera.lookAt(camLook);
      focus.copy(g);

      placeKiki(f, g);
      updateWorld(f, g);
      return { walking: false, flash: 0, sitting: 0, bend: 0 };
    },
    afterPose(f) {
      updateMoved(guide.root);
      holdRope(f);
      holdHose(f);
      holdKittens(f);
    },
    held: () => [handle, nozzle, ...kittens],
  };
}

export const FIRE_RESCUE: Story = {
  sequence,
  language: LANGUAGE,
  opening: { seconds: OPENING, lines: OPENING_LINES },
  lead: LEAD,
  demo: DEMO,
  praise: PRAISE,
  lines: LINES,
  build,
};
