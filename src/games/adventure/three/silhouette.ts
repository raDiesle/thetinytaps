import * as THREE from "three";
import type { Pose } from "./guide";

// A glowing outline of a child doing the guide's movement, like the dancers
// in "Just Dance": a dark body with a bright rim, seen from the front. It
// takes the same pose as the fox but with a child's proportions (longer arms
// and legs), so the movement is easy to read and to copy like in a mirror.

const NS = "http://www.w3.org/2000/svg";

// Child proportions (in metres, roughly).
const HIP = 0.09;
const THIGH = 0.33;
const SHIN = 0.31;
const SHOULDER_X = 0.17;
const SHOULDER_Y = 0.42;
const UPPER_ARM = 0.25;
const FOREARM = 0.23;
const NECK_Y = 0.47;
const HEAD = 0.13;

/** Rim width outside the body, and the soft glow around it (viewBox units). */
const RIM = 0.035;
const GLOW = 0.07;

interface Bone {
  from: THREE.Object3D;
  to: THREE.Object3D;
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
  private readonly head = joint(this.neck, 0, HEAD + 0.02);
  private readonly arms: { shoulder: THREE.Object3D; upper: THREE.Object3D; elbow: THREE.Object3D }[] = [];
  private readonly legs: { hip: THREE.Object3D; knee: THREE.Object3D }[] = [];
  private readonly bones: Bone[] = [];
  private readonly heads: SVGCircleElement[] = [];
  private readonly at = new THREE.Vector3();

  constructor() {
    this.svg = document.createElementNS(NS, "svg");
    this.svg.setAttribute("viewBox", "-0.8 -2.02 1.6 2.1");
    this.svg.setAttribute("aria-hidden", "true");

    for (const side of [1, -1]) {
      const shoulder = joint(this.spine, SHOULDER_X * side, SHOULDER_Y);
      const upper = joint(shoulder, 0, 0);
      const elbow = joint(upper, 0, -UPPER_ARM);
      const hand = joint(elbow, 0, -FOREARM);
      this.arms.push({ shoulder, upper, elbow });
      const hip = joint(this.hips, HIP * side, 0);
      const knee = joint(hip, 0, -THIGH);
      const foot = joint(knee, 0, -SHIN);
      const toe = joint(foot, 0.03 * side, -0.02, 0.06);
      this.legs.push({ hip, knee });
      this.bone(hip, knee, 0.15);
      this.bone(knee, foot, 0.12);
      this.bone(foot, toe, 0.1);
      this.bone(shoulder, elbow, 0.11);
      this.bone(elbow, hand, 0.095);
    }
    // Body: from the belly up to the chest, and across the shoulders.
    this.bone(joint(this.spine, 0, 0.08), joint(this.spine, 0, 0.3), 0.3);
    this.bone(this.arms[0].shoulder, this.arms[1].shoulder, 0.13);
    this.bone(this.spine, this.neck, 0.09);

    // Three layers of the same shapes: a soft glow, the bright rim, then the
    // dark body on top – together they draw only the outline of the whole figure.
    const filter = document.createElementNS(NS, "filter");
    filter.id = `silhouette-glow-${Math.random().toString(36).slice(2)}`;
    const blur = document.createElementNS(NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", "0.025");
    filter.append(blur);
    this.svg.append(filter);
    const layers: [string, number, string | null][] = [
      ["#ffe9a0", GLOW, filter.id],
      ["#ffffff", RIM, null],
      ["#141a2e", 0, null],
    ];
    for (const [color, extra, glow] of layers) {
      const g = document.createElementNS(NS, "g");
      g.setAttribute("stroke", color);
      g.setAttribute("fill", color);
      g.setAttribute("stroke-linecap", "round");
      if (glow) g.setAttribute("filter", `url(#${glow})`);
      for (const bone of this.bones) {
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
      this.svg.append(g);
    }
  }

  private bone(from: THREE.Object3D, to: THREE.Object3D, width: number) {
    this.bones.push({ from, to, width, lines: [] });
  }

  /** Puts the figure into the guide's pose. */
  update(p: Pose) {
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

    // Seen from the front: x stays, y points down in the picture.
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
  }
}
