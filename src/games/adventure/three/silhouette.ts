import * as THREE from "three";
import type { Pose } from "./guide";

// A glowing outline of a child doing the guide's movement, like the dancers
// in "Just Dance": a slim dark body with a bright rim, and inside it a stick
// skeleton with dots at the joints and little fingers, so every joint reads
// clearly. Seen from where the camera sees the fox (mostly from behind, so
// left is left). It takes the same pose as the fox but with a child's
// proportions (longer arms and legs), so the movement is easy to copy.

const NS = "http://www.w3.org/2000/svg";

// Child proportions (in metres, roughly).
const HIP = 0.09;
const THIGH = 0.33;
const SHIN = 0.31;
const SHOULDER_X = 0.16;
const SHOULDER_Y = 0.42;
const UPPER_ARM = 0.25;
const FOREARM = 0.22;
const PALM = 0.05;
const FINGER = 0.055;
const NECK_Y = 0.47;
const HEAD = 0.11;

/** Rim width outside the body, and the soft glow around it (viewBox units). */
const RIM = 0.02;
const GLOW = 0.045;
/** What the picture shows (viewBox units): wide enough for arms stretched out to the side. */
const VIEW = { x: -1, y: -2.05, width: 2, height: 2.15 };

const SKELETON = "#9ff7ff";

interface Bone {
  from: THREE.Object3D;
  to: THREE.Object3D;
  /** Width of the body around it; 0 for the skeleton only (fingers). */
  width: number;
  lines: SVGLineElement[];
}

const joint = (parent: THREE.Object3D, x: number, y: number, z = 0) => {
  const o = new THREE.Object3D();
  o.position.set(x, y, z);
  parent.add(o);
  return o;
};

export class Silhouette {
  readonly svg: SVGSVGElement;
  private readonly root = new THREE.Object3D();
  private readonly hips = joint(this.root, 0, 0);
  private readonly spine = joint(this.hips, 0, 0);
  private readonly neck = joint(this.spine, 0, NECK_Y);
  private readonly head = joint(this.neck, 0, HEAD + 0.03);
  private readonly arms: { shoulder: THREE.Object3D; upper: THREE.Object3D; elbow: THREE.Object3D }[] = [];
  private readonly legs: { hip: THREE.Object3D; knee: THREE.Object3D }[] = [];
  private readonly bones: Bone[] = [];
  /** Joints drawn as dots on the skeleton. */
  private readonly dots: { at: THREE.Object3D; circle: SVGCircleElement }[] = [];
  private readonly heads: SVGCircleElement[] = [];
  private readonly at = new THREE.Vector3();

  constructor() {
    this.svg = document.createElementNS(NS, "svg");
    this.svg.setAttribute("viewBox", `${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`);
    this.svg.setAttribute("aria-hidden", "true");

    const fingers: THREE.Object3D[][] = [];
    const joints: THREE.Object3D[] = [this.neck, this.hips];
    for (const side of [1, -1]) {
      const shoulder = joint(this.spine, SHOULDER_X * side, SHOULDER_Y);
      const upper = joint(shoulder, 0, 0);
      const elbow = joint(upper, 0, -UPPER_ARM);
      const wrist = joint(elbow, 0, -FOREARM);
      const palm = joint(wrist, 0, -PALM);
      this.arms.push({ shoulder, upper, elbow });
      const hip = joint(this.hips, HIP * side, 0);
      const knee = joint(hip, 0, -THIGH);
      const foot = joint(knee, 0, -SHIN);
      const toe = joint(foot, 0.03 * side, -0.02, 0.07);
      this.legs.push({ hip, knee });
      this.bone(hip, knee, 0.1);
      this.bone(knee, foot, 0.075);
      this.bone(foot, toe, 0.06);
      this.bone(shoulder, elbow, 0.068);
      this.bone(elbow, wrist, 0.055);
      this.bone(wrist, palm, 0.06);
      // Four fingers fanned out from the palm and a thumb to the inside.
      const hand: THREE.Object3D[] = [];
      for (const a of [-0.45, -0.15, 0.15, 0.45]) hand.push(joint(palm, Math.sin(a) * FINGER, -Math.cos(a) * FINGER));
      hand.push(joint(wrist, -0.05 * side, -0.035, 0.01));
      fingers.push(hand);
      for (const tip of hand.slice(0, 4)) this.bone(palm, tip, 0);
      this.bone(wrist, hand[4], 0);
      joints.push(shoulder, elbow, wrist, hip, knee, foot);
    }
    // Body: from the belly up to the chest, and across the shoulders and hips.
    this.bone(joint(this.spine, 0, 0.1), joint(this.spine, 0, 0.3), 0.2);
    this.bone(this.arms[0].shoulder, this.arms[1].shoulder, 0.07);
    this.bone(this.legs[0].hip, this.legs[1].hip, 0.1);
    this.bone(this.spine, this.neck, 0.06);

    // Rim and glow layers draw the whole figure fatter behind the dark body.
    // The glow's filter covers the whole picture: by default it would only
    // cover the lines' bare geometry and cut the glow off at the sides.
    const filter = document.createElementNS(NS, "filter");
    filter.id = `silhouette-glow-${Math.random().toString(36).slice(2)}`;
    filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("x", String(VIEW.x));
    filter.setAttribute("y", String(VIEW.y));
    filter.setAttribute("width", String(VIEW.width));
    filter.setAttribute("height", String(VIEW.height));
    const blur = document.createElementNS(NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "0.018");
    filter.append(blur);
    this.svg.append(filter);
    const layers: [string, number, string | null][] = [
      ["#ffe9a0", GLOW, filter.id],
      ["#ffffff", RIM, null],
      ["#141a2e", 0, null],
    ];
    for (const [color, extra, glow] of layers) {
      const g = this.group(color);
      if (glow) g.setAttribute("filter", `url(#${glow})`);
      for (const bone of this.bones) {
        if (!bone.width) continue;
        const line = document.createElementNS(NS, "line");
        line.setAttribute("stroke-width", String(bone.width + extra * 2));
        g.append(line);
        bone.lines.push(line);
      }
      const head = document.createElementNS(NS, "circle");
      head.setAttribute("r", String(HEAD + extra));
      head.setAttribute("stroke", "none");
      g.append(head);
      this.heads.push(head);
    }
    // The fingers are only lines, with a thin rim so they show on the dark box.
    const fingerRim = this.group("#ffffff");
    const skeleton = this.group(SKELETON);
    for (const bone of this.bones) {
      if (!bone.width) {
        const rim = document.createElementNS(NS, "line");
        rim.setAttribute("stroke-width", "0.03");
        fingerRim.append(rim);
        bone.lines.push(rim);
      }
      const line = document.createElementNS(NS, "line");
      line.setAttribute("stroke-width", bone.width ? "0.014" : "0.016");
      skeleton.append(line);
      bone.lines.push(line);
    }
    for (const at of joints) {
      const circle = document.createElementNS(NS, "circle");
      circle.setAttribute("r", "0.022");
      circle.setAttribute("stroke", "none");
      skeleton.append(circle);
      this.dots.push({ at, circle });
    }
  }

  private group(color: string) {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("stroke", color);
    g.setAttribute("fill", color);
    g.setAttribute("stroke-linecap", "round");
    this.svg.append(g);
    return g;
  }

  private bone(from: THREE.Object3D, to: THREE.Object3D, width: number) {
    this.bones.push({ from, to, width, lines: [] });
  }

  /** Puts the figure into the guide's pose, seen from `view` (radians round it, 0 = front, π = behind). */
  update(p: Pose, view = 0) {
    this.root.rotation.y = -view;
    const legHeight = (l: Pose["legL"]) => THIGH * Math.cos(l.lift) * Math.cos(l.spread) + SHIN * Math.cos(l.lift - l.knee);
    // Jumps are scaled up a little, as the child is taller than the fox.
    this.hips.position.set(p.shift * 1.4, Math.max(legHeight(p.legL), legHeight(p.legR)) + p.lift * 1.4, 0);
    this.hips.rotation.y = p.turn;
    this.spine.rotation.set(p.bend, p.twist, -p.lean);
    this.neck.rotation.set(p.headPitch, p.headYaw, -p.headTilt);
    [p.armL, p.armR].forEach((pose, i) => {
      const side = i === 0 ? 1 : -1;
      const arm = this.arms[i];
      arm.shoulder.rotation.set(-pose.raise, 0, pose.spread * side);
      arm.upper.rotation.y = pose.twist * side;
      arm.elbow.rotation.x = -pose.elbow;
    });
    [p.legL, p.legR].forEach((pose, i) => {
      const side = i === 0 ? 1 : -1;
      this.legs[i].hip.rotation.set(-pose.lift, 0, pose.spread * side);
      this.legs[i].knee.rotation.x = pose.knee;
    });
    this.root.updateMatrixWorld(true);

    // The figure is turned instead of the eye, so it is seen from the front: x stays, y points down in the picture.
    for (const bone of this.bones) {
      bone.from.getWorldPosition(this.at);
      const x1 = this.at.x.toFixed(3);
      const y1 = (-this.at.y).toFixed(3);
      bone.to.getWorldPosition(this.at);
      const x2 = this.at.x.toFixed(3);
      const y2 = (-this.at.y).toFixed(3);
      for (const line of bone.lines) {
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
      }
    }
    this.head.getWorldPosition(this.at);
    for (const head of this.heads) {
      head.setAttribute("cx", this.at.x.toFixed(3));
      head.setAttribute("cy", (-this.at.y).toFixed(3));
    }
    for (const dot of this.dots) {
      dot.at.getWorldPosition(this.at);
      dot.circle.setAttribute("cx", this.at.x.toFixed(3));
      dot.circle.setAttribute("cy", (-this.at.y).toFixed(3));
    }
  }
}
