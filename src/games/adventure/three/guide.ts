import * as THREE from "three";
import { Contour, CONTOUR_PARTS, type ContourPart } from "./contour";

// Tapsi, the guide: a little fox explorer with a red bandana, built from
// simple rounded shapes and posed by joint angles, so any movement of the
// library can be shown without animation files.
//
// Axes (local): x to the fox's own left, y up, z forwards (the way it looks).
// Facing the camera, its left side is on the right of the screen, like a
// person standing opposite the child – it mirrors the child.

export interface ArmPose {
  /** Swing forwards: 0 hangs down, π/2 points ahead, π points up. */
  raise: number;
  /** Lift out to the side: 0 hangs down, π/2 is horizontal. */
  spread: number;
  /** Bend of the elbow, 0 straight. */
  elbow: number;
  /** Turn of the upper arm around itself: which way the elbow folds. */
  twist: number;
}

export interface LegPose {
  /** Thigh forwards (rad). */
  lift: number;
  /** Thigh out to the side (rad). */
  spread: number;
  /** Knee bend (rad). */
  knee: number;
}

export interface Pose {
  /** Extra height above the ground, for hops (m). */
  lift: number;
  /** Hips shifted sideways (m), positive to the fox's left. */
  shift: number;
  /** Whole body turned around the vertical (rad). */
  turn: number;
  /** Upper body tilted to the side (rad), positive to the fox's left. */
  lean: number;
  /** Upper body bent forwards (rad). */
  bend: number;
  /** Upper body twisted (rad), positive turns the chest to the fox's left. */
  twist: number;
  headPitch: number;
  headYaw: number;
  headTilt: number;
  /** 0 flat feet, 1 on tiptoe. */
  toes: number;
  armL: ArmPose;
  armR: ArmPose;
  legL: LegPose;
  legR: LegPose;
}

export const restPose = (): Pose => ({
  lift: 0,
  shift: 0,
  turn: 0,
  lean: 0,
  bend: 0,
  twist: 0,
  headPitch: 0,
  headYaw: 0,
  headTilt: 0,
  toes: 0,
  armL: { raise: 0.05, spread: 0.18, elbow: 0.25, twist: 0 },
  armR: { raise: 0.05, spread: 0.18, elbow: 0.25, twist: 0 },
  legL: { lift: 0, spread: 0.04, knee: 0 },
  legR: { lift: 0, spread: 0.04, knee: 0 },
});

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpArm = (a: ArmPose, b: ArmPose, k: number): ArmPose => ({
  raise: lerp(a.raise, b.raise, k),
  spread: lerp(a.spread, b.spread, k),
  elbow: lerp(a.elbow, b.elbow, k),
  twist: lerp(a.twist, b.twist, k),
});
const lerpLeg = (a: LegPose, b: LegPose, k: number): LegPose => ({
  lift: lerp(a.lift, b.lift, k),
  spread: lerp(a.spread, b.spread, k),
  knee: lerp(a.knee, b.knee, k),
});

export function lerpPose(a: Pose, b: Pose, k: number): Pose {
  return {
    lift: lerp(a.lift, b.lift, k),
    shift: lerp(a.shift, b.shift, k),
    turn: lerp(a.turn, b.turn, k),
    lean: lerp(a.lean, b.lean, k),
    bend: lerp(a.bend, b.bend, k),
    twist: lerp(a.twist, b.twist, k),
    headPitch: lerp(a.headPitch, b.headPitch, k),
    headYaw: lerp(a.headYaw, b.headYaw, k),
    headTilt: lerp(a.headTilt, b.headTilt, k),
    toes: lerp(a.toes, b.toes, k),
    armL: lerpArm(a.armL, b.armL, k),
    armR: lerpArm(a.armR, b.armR, k),
    legL: lerpLeg(a.legL, b.legL, k),
    legR: lerpLeg(a.legR, b.legR, k),
  };
}

const THIGH = 0.24;
const SHIN = 0.24;
const FOOT = 0.07;
const UPPER_ARM = 0.21;
const FOREARM = 0.19;

const FUR = "#f08a3c";
const CREAM = "#fff4e2";
const DARK = "#4a2c22";
const BANDANA = "#e8423f";

function fur(color: string) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.75,
    sheen: 0.8,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.5),
  });
}

function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, castShadow = true) {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = castShadow;
  m.receiveShadow = true;
  return m;
}

/** A capsule hanging down from its pivot, `length` long. */
function limb(length: number, radius: number, material: THREE.Material) {
  const m = mesh(new THREE.CapsuleGeometry(radius, length - radius, 6, 14), material);
  m.position.y = -length / 2;
  return m;
}

interface Arm {
  shoulder: THREE.Group;
  upper: THREE.Group;
  elbow: THREE.Group;
}

interface Leg {
  hip: THREE.Group;
  knee: THREE.Group;
  foot: THREE.Group;
}

export class Guide {
  readonly root = new THREE.Group();
  private readonly hips = new THREE.Group();
  private readonly spine = new THREE.Group();
  private readonly head = new THREE.Group();
  private readonly tail = new THREE.Group();
  private readonly eyes: THREE.Object3D[] = [];
  private readonly mouth: THREE.Mesh;
  /** The happy face: eyes squeezed into arcs, a wide open laugh and red cheeks. */
  private readonly happyEyes: THREE.Object3D[] = [];
  private readonly laugh: THREE.Group;
  private readonly blush: THREE.Mesh[] = [];
  private readonly ears: THREE.Group[] = [];
  private readonly armL: Arm;
  private readonly armR: Arm;
  private readonly legL: Leg;
  private readonly legR: Leg;
  /** The hands, e.g. to hold a paddle or a rope. */
  readonly handL = new THREE.Group();
  readonly handR = new THREE.Group();
  private talking = false;
  private readonly contour: Contour;
  /** How much moving body parts glow (0..1); the story turns it up during a movement. */
  highlight = 0;
  /** How happy the face looks (0..1): at the treasure Tapsi laughs with the whole face. */
  joy = 0;
  /** The ears folded back flat (0..1), e.g. when the head bumps into something. */
  earsBack = 0;
  /** The parts that may glow: only where the movement is (the arms for a crank), not everything that moves. */
  focus: readonly ContourPart[] = CONTOUR_PARTS;
  private readonly activity: Record<ContourPart, number> = { armL: 0, armR: 0, legL: 0, legR: 0, body: 0, head: 0 };
  private previous: Pose | null = null;
  private previousTime = 0;

  constructor() {
    const furMat = fur(FUR);
    const creamMat = fur(CREAM);
    const darkMat = new THREE.MeshStandardMaterial({ color: DARK, roughness: 0.6 });
    const bandanaMat = new THREE.MeshStandardMaterial({ color: BANDANA, roughness: 0.55 });

    this.root.add(this.hips);
    this.hips.add(this.spine);

    // Body: a soft pear with a cream belly.
    const body = mesh(new THREE.SphereGeometry(0.23, 32, 24), furMat);
    body.scale.set(1, 1.25, 0.92);
    body.position.y = 0.2;
    this.spine.add(body);
    const belly = mesh(new THREE.SphereGeometry(0.17, 28, 20), creamMat, false);
    belly.scale.set(1, 1.3, 0.6);
    belly.position.set(0, 0.17, 0.12);
    this.spine.add(belly);
    // A little satchel strap across the chest, for the explorer look.
    const strap = mesh(new THREE.TorusGeometry(0.24, 0.018, 8, 40), new THREE.MeshStandardMaterial({ color: "#7a4b2a", roughness: 0.8 }));
    strap.rotation.set(0, Math.PI / 2, 0.75);
    strap.scale.set(1, 1.2, 0.85);
    strap.position.y = 0.22;
    this.spine.add(strap);
    const bag = mesh(new THREE.BoxGeometry(0.14, 0.11, 0.06), new THREE.MeshStandardMaterial({ color: "#8d5a33", roughness: 0.8 }));
    bag.position.set(-0.2, 0.06, 0.1);
    bag.rotation.z = 0.2;
    this.spine.add(bag);

    // Head: big and round, with muzzle, nose, eyes, ears and bandana.
    this.head.position.y = 0.5;
    this.spine.add(this.head);
    const skull = mesh(new THREE.SphereGeometry(0.27, 40, 30), furMat);
    skull.scale.set(1.08, 0.95, 0.95);
    skull.position.y = 0.16;
    this.head.add(skull);
    const cheeks = mesh(new THREE.SphereGeometry(0.2, 32, 24), creamMat);
    cheeks.scale.set(1.15, 0.6, 0.75);
    cheeks.position.set(0, 0.06, 0.12);
    this.head.add(cheeks);
    const muzzle = mesh(new THREE.SphereGeometry(0.11, 28, 20), creamMat);
    muzzle.scale.set(1, 0.75, 1.15);
    muzzle.position.set(0, 0.09, 0.25);
    this.head.add(muzzle);
    const nose = mesh(new THREE.SphereGeometry(0.042, 20, 16), new THREE.MeshPhysicalMaterial({ color: "#2b1b17", roughness: 0.2, clearcoat: 1 }));
    nose.scale.set(1.2, 0.85, 1);
    nose.position.set(0, 0.13, 0.37);
    this.head.add(nose);
    this.mouth = mesh(new THREE.TorusGeometry(0.035, 0.01, 8, 20, Math.PI), darkMat, false);
    this.mouth.rotation.z = Math.PI;
    this.mouth.position.set(0, 0.04, 0.33);
    this.head.add(this.mouth);
    // The laugh: a wide open half-moon with a pink tongue.
    this.laugh = new THREE.Group();
    this.laugh.position.set(0, 0.045, 0.325);
    this.laugh.rotation.x = -0.35;
    const laughGeo = new THREE.CircleGeometry(0.06, 24, Math.PI, Math.PI);
    laughGeo.scale(1.15, 1, 1);
    this.laugh.add(new THREE.Mesh(laughGeo, new THREE.MeshStandardMaterial({ color: "#5a1a1f", roughness: 0.6, side: THREE.DoubleSide })));
    const tongue = new THREE.Mesh(new THREE.CircleGeometry(0.03, 16), new THREE.MeshStandardMaterial({ color: "#ff7c8f", roughness: 0.5 }));
    tongue.scale.set(1.2, 0.6, 1);
    tongue.position.set(0, -0.042, 0.002);
    this.laugh.add(tongue);
    this.laugh.visible = false;
    this.head.add(this.laugh);

    const eyeMat = new THREE.MeshPhysicalMaterial({ color: "#1d1411", roughness: 0.1, clearcoat: 1 });
    const shine = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    for (const side of [1, -1]) {
      const eye = new THREE.Group();
      eye.position.set(0.1 * side, 0.2, 0.25);
      const ball = mesh(new THREE.SphereGeometry(0.045, 20, 16), eyeMat, false);
      ball.scale.set(0.9, 1.15, 0.7);
      eye.add(ball);
      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), shine);
      glint.position.set(0.012 * side, 0.02, 0.03);
      eye.add(glint);
      this.head.add(eye);
      this.eyes.push(eye);
      // A happy eye: a little arch, like ^.
      const arc = mesh(new THREE.TorusGeometry(0.04, 0.012, 8, 20, Math.PI), darkMat, false);
      arc.position.set(0.1 * side, 0.2, 0.262);
      arc.rotation.x = -0.25;
      arc.visible = false;
      this.head.add(arc);
      this.happyEyes.push(arc);
      const cheek = new THREE.Mesh(
        new THREE.CircleGeometry(0.045, 20),
        new THREE.MeshBasicMaterial({ color: "#ff6f8e", transparent: true, opacity: 0, depthWrite: false }),
      );
      cheek.position.set(0.16 * side, 0.1, 0.235);
      cheek.rotation.y = 0.55 * side;
      this.head.add(cheek);
      this.blush.push(cheek);

      const ear = new THREE.Group();
      ear.position.set(0.17 * side, 0.36, -0.02);
      ear.rotation.set(-0.15, 0, -0.35 * side);
      const outer = mesh(new THREE.ConeGeometry(0.1, 0.24, 20), furMat);
      outer.scale.z = 0.5;
      outer.position.y = 0.1;
      ear.add(outer);
      const inner = mesh(new THREE.ConeGeometry(0.06, 0.15, 16), creamMat, false);
      inner.scale.z = 0.4;
      inner.position.set(0, 0.07, 0.025);
      ear.add(inner);
      const tip = mesh(new THREE.ConeGeometry(0.045, 0.08, 16), darkMat, false);
      tip.scale.z = 0.55;
      tip.position.y = 0.19;
      ear.add(tip);
      this.head.add(ear);
      this.ears.push(ear);
    }

    // The bandana: a cap over the top of the head with a knot at the back.
    const cap = mesh(new THREE.SphereGeometry(0.285, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.38), bandanaMat);
    cap.scale.set(1.1, 0.95, 0.98);
    cap.position.y = 0.17;
    cap.rotation.x = -0.25;
    this.head.add(cap);
    const dotMat = new THREE.MeshStandardMaterial({ color: "#fff3e8", roughness: 0.6 });
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const dot = mesh(new THREE.SphereGeometry(0.018, 8, 6), dotMat, false);
      dot.position.set(Math.cos(a) * 0.19, 0.39, Math.sin(a) * 0.17 - 0.06);
      this.head.add(dot);
    }
    for (const side of [1, -1]) {
      const knot = mesh(new THREE.ConeGeometry(0.05, 0.16, 12), bandanaMat);
      knot.position.set(0.05 * side, 0.22, -0.3);
      knot.rotation.set(-1.1, 0, 0.5 * side);
      this.head.add(knot);
    }

    // Tail: a bushy curve with a cream tip, wagging from the hips; small, so seen from behind it
    // does not hide the legs.
    this.tail.position.set(0, 0.1, -0.17);
    this.tail.scale.setScalar(0.42);
    this.hips.add(this.tail);
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -0.05, -0.18),
      new THREE.Vector3(0, 0.08, -0.36),
      new THREE.Vector3(0, 0.3, -0.42),
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 24, 1, 14);
    // Thick in the middle, thin at the root.
    const pos = tailGeo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const u = Math.floor(i / 15) / 24;
      const p = tailCurve.getPointAt(u);
      v.fromBufferAttribute(pos, i).sub(p);
      const r = 0.04 + Math.sin(Math.min(1, u * 1.15) * Math.PI) * 0.1;
      v.normalize().multiplyScalar(r).add(p);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    tailGeo.computeVertexNormals();
    this.tail.add(mesh(tailGeo, furMat));
    const tailTip = mesh(new THREE.SphereGeometry(0.075, 20, 16), creamMat);
    tailTip.scale.set(1, 1.5, 1);
    tailTip.position.set(0, 0.32, -0.42);
    this.tail.add(tailTip);

    // Arms: orange fur above the elbow and dark "gloves" below, like a real fox's legs, so they
    // stand out against the body; paws with a pink pad, four short fingers and a thumb.
    const padMat = fur("#e7a3a0");
    const makeArm = (side: 1 | -1, hand: THREE.Group): Arm => {
      const shoulder = new THREE.Group();
      shoulder.position.set(0.2 * side, 0.36, 0);
      const upper = new THREE.Group();
      shoulder.add(upper);
      const joint = mesh(new THREE.SphereGeometry(0.08, 20, 16), furMat);
      upper.add(joint);
      upper.add(limb(UPPER_ARM, 0.072, furMat));
      const elbow = new THREE.Group();
      elbow.position.y = -UPPER_ARM;
      upper.add(elbow);
      elbow.add(limb(FOREARM, 0.064, darkMat));
      hand.position.y = -FOREARM;
      elbow.add(hand);
      const palm = mesh(new THREE.SphereGeometry(0.07, 20, 16), darkMat);
      palm.scale.set(1.05, 1.05, 0.72);
      palm.position.y = -0.035;
      hand.add(palm);
      // The palm faces the body while the arm hangs.
      const pad = mesh(new THREE.SphereGeometry(0.04, 14, 10), padMat, false);
      pad.scale.set(0.35, 1, 0.9);
      pad.position.set(-0.05 * side, -0.04, 0);
      hand.add(pad);
      for (let i = 0; i < 4; i++) {
        const finger = mesh(new THREE.CapsuleGeometry(0.019, 0.045, 4, 8), darkMat, false);
        finger.position.set((i - 1.5) * 0.028, -0.105, 0.012);
        finger.rotation.set(0.35, 0, (i - 1.5) * 0.12);
        hand.add(finger);
      }
      const thumb = mesh(new THREE.CapsuleGeometry(0.02, 0.04, 4, 8), darkMat, false);
      thumb.position.set(-0.055 * side, -0.06, 0.035);
      thumb.rotation.set(0.5, 0, 0.6 * side);
      hand.add(thumb);
      this.spine.add(shoulder);
      return { shoulder, upper, elbow };
    };
    this.armL = makeArm(1, this.handL);
    this.armR = makeArm(-1, this.handR);

    const makeLeg = (side: 1 | -1): Leg => {
      const hip = new THREE.Group();
      hip.position.set(0.11 * side, 0.02, 0);
      hip.add(limb(THIGH, 0.08, furMat));
      const knee = new THREE.Group();
      knee.position.y = -THIGH;
      hip.add(knee);
      knee.add(limb(SHIN, 0.065, darkMat));
      const foot = new THREE.Group();
      foot.position.y = -SHIN;
      knee.add(foot);
      const sole = mesh(new THREE.SphereGeometry(0.08, 20, 14), darkMat);
      sole.scale.set(0.85, 0.55, 1.4);
      sole.position.set(0, -0.02, 0.05);
      foot.add(sole);
      this.hips.add(hip);
      return { hip, knee, foot };
    };
    this.legL = makeLeg(1);
    this.legR = makeLeg(-1);

    const parts: [THREE.Object3D, ContourPart][] = [
      [this.armL.shoulder, "armL"],
      [this.armR.shoulder, "armR"],
      [this.legL.hip, "legL"],
      [this.legR.hip, "legR"],
      [this.head, "head"],
    ];
    this.contour = new Contour(this.root, (mesh) => {
      for (let o: THREE.Object3D | null = mesh; o; o = o.parent) {
        const found = parts.find(([group]) => group === o);
        if (found) return found[1];
      }
      return "body";
    });
  }

  /** Talking moves the mouth while the voice speaks. */
  setTalking(on: boolean) {
    this.talking = on;
  }

  /** Puts the fox into `pose`; `time` (s) drives blinking, breathing and the tail. */
  apply(p: Pose, time: number) {
    const legHeight = (l: LegPose) => THIGH * Math.cos(l.lift) * Math.cos(l.spread) + SHIN * Math.cos(l.lift - l.knee);
    const stand = Math.max(legHeight(p.legL), legHeight(p.legR));
    const breathe = Math.sin(time * 2.2) * 0.006;
    this.hips.position.set(p.shift, stand + FOOT + p.toes * 0.05 + p.lift + breathe, 0);
    // The turn of a pose is on top of where the story points the fox (root).
    this.hips.rotation.y = p.turn;

    this.spine.rotation.set(p.bend, p.twist, -p.lean);
    this.head.rotation.set(p.headPitch, p.headYaw, -p.headTilt);

    const arm = (a: Arm, pose: ArmPose, side: 1 | -1) => {
      a.shoulder.rotation.set(-pose.raise, 0, pose.spread * side);
      a.upper.rotation.y = pose.twist * side;
      a.elbow.rotation.x = -pose.elbow;
    };
    arm(this.armL, p.armL, 1);
    arm(this.armR, p.armR, -1);

    const leg = (l: Leg, pose: LegPose, side: 1 | -1) => {
      l.hip.rotation.set(-pose.lift, 0, pose.spread * side);
      l.knee.rotation.x = pose.knee;
      // Keep the sole level, also with the legs apart, tipped up onto the toes when asked.
      l.foot.rotation.x = pose.lift - pose.knee + p.toes * 0.6;
      l.foot.rotation.z = -pose.spread * side;
    };
    leg(this.legL, p.legL, 1);
    leg(this.legR, p.legR, -1);

    this.tail.rotation.set(0.15 + Math.sin(time * 1.7) * 0.05, Math.sin(time * 2.6) * 0.35, 0);

    // Blink every few seconds.
    const blink = time % 3.7 < 0.12 ? 0.1 : 1;
    const happy = this.joy > 0.5;
    for (const eye of this.eyes) {
      eye.scale.y = blink;
      eye.visible = !happy;
    }
    for (const arc of this.happyEyes) arc.visible = happy;
    for (const cheek of this.blush) (cheek.material as THREE.MeshBasicMaterial).opacity = this.joy * 0.75;
    // The ears wiggle with joy.
    this.ears.forEach((ear, i) => {
      const side = i === 0 ? 1 : -1;
      ear.rotation.z = (-0.35 + Math.sin(time * 9 + i) * 0.18 * this.joy) * side;
      ear.rotation.x = -0.15 - this.earsBack * 1.35;
    });

    const open = this.talking ? 0.6 + Math.abs(Math.sin(time * 14)) * 0.9 : 0.6;
    this.mouth.scale.set(1, open, 1);
    this.mouth.visible = !happy;
    this.laugh.visible = happy;
    const laughOpen = 0.85 + (this.talking ? Math.abs(Math.sin(time * 14)) * 0.35 : Math.sin(time * 6) * 0.08);
    this.laugh.scale.set(1, laughOpen, 1);

    this.glowMoving(p, time);
  }

  /** Lets the parts that move right now glow, so the movement stands out. */
  private glowMoving(p: Pose, time: number) {
    const q = this.previous;
    const dt = time - this.previousTime;
    this.previous = structuredClone(p);
    this.previousTime = time;
    // After a jump in the story there is no speed to measure.
    if (!q || dt <= 0 || dt > 0.2) return;
    const d = (a: number, b: number) => Math.abs(a - b);
    const arm = (a: ArmPose, b: ArmPose) => d(a.raise, b.raise) + d(a.spread, b.spread) + d(a.elbow, b.elbow) * 0.7 + d(a.twist, b.twist) * 0.5;
    const leg = (a: LegPose, b: LegPose) => d(a.lift, b.lift) + d(a.knee, b.knee) * 0.6 + d(a.spread, b.spread);
    const body = d(p.lean, q.lean) + d(p.bend, q.bend) + d(p.twist, q.twist) + d(p.turn, q.turn) * 0.5 + (d(p.lift, q.lift) + d(p.shift, q.shift)) * 4;
    const head = d(p.headPitch, q.headPitch) + d(p.headYaw, q.headYaw) + d(p.headTilt, q.headTilt);
    // Change per second (radians, roughly); a calm movement is about 1.
    const speed: Record<ContourPart, number> = {
      armL: arm(p.armL, q.armL) / dt,
      armR: arm(p.armR, q.armR) / dt,
      legL: leg(p.legL, q.legL) / dt,
      legR: leg(p.legR, q.legR) / dt,
      body: body / dt,
      head: Math.max(head, body * 0.8) / dt,
    };
    for (const part of CONTOUR_PARTS) {
      const target = this.focus.includes(part) ? THREE.MathUtils.smoothstep(speed[part], 0.25, 1.0) : 0;
      const now = this.activity[part];
      // Comes on quickly, fades slowly, so it stays on through the pauses of a movement.
      this.activity[part] = now + (target - now) * Math.min(1, dt * (target > now ? 8 : 1.2));
      this.contour.set(part, this.activity[part] * this.highlight);
    }
  }
}
