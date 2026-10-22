import * as THREE from "three";

// Outlines around the fox, so its movements read clearly in a busy picture:
// a thin dark ink line all around, and on the body parts that are moving a
// wide glowing band (light inside, dark outside, so it shows on sky and sand
// alike) with a soft, gently pulsing halo around it. Drawn as "inverted
// hulls": each part again, a little bigger and from the inside, behind the
// real one.

export type ContourPart = "armL" | "armR" | "legL" | "legR" | "body" | "head";
export const CONTOUR_PARTS: ContourPart[] = ["armL", "armR", "legL", "legR", "body", "head"];

/** Ink line when still; the light band, its dark edge and the halo when moving (object units ≈ metres). */
const INK = 0.01;
const GLOW = 0.05;
const EDGE = 0.014;
const HALO = 0.13;

const hull = (color: string, halo = false) =>
  new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(color) }, thickness: { value: 0 }, opacity: { value: 1 } },
    vertexShader: /* glsl */ `
      uniform float thickness;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * thickness, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      uniform float opacity;
      void main() {
        gl_FragColor = vec4(color, opacity);
      }`,
    side: THREE.BackSide,
    // The halo adds light on top of whatever is behind the fox.
    ...(halo ? { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } : {}),
  });

export class Contour {
  private readonly ink = new Map<ContourPart, THREE.ShaderMaterial>();
  private readonly glow = new Map<ContourPart, THREE.ShaderMaterial>();
  private readonly halo = new Map<ContourPart, THREE.ShaderMaterial>();
  private readonly glowMeshes = new Map<ContourPart, THREE.Mesh[]>();
  private pulse = 1;

  /** Outlines every shadow-casting mesh under `root`; `partOf` says which body part it moves with. */
  constructor(root: THREE.Object3D, partOf: (mesh: THREE.Object3D) => ContourPart) {
    for (const part of CONTOUR_PARTS) {
      this.ink.set(part, hull("#2b160d"));
      this.glow.set(part, hull("#fff8cc"));
      this.halo.set(part, hull("#ffc93a", true));
      this.glowMeshes.set(part, []);
    }
    const meshes: THREE.Mesh[] = [];
    root.traverse((o) => {
      // Small details (eyes, belly, dots) sit inside the outline anyway.
      if (o instanceof THREE.Mesh && o.castShadow) meshes.push(o);
    });
    for (const mesh of meshes) {
      const part = partOf(mesh);
      const ink = new THREE.Mesh(mesh.geometry, this.ink.get(part));
      const glow = new THREE.Mesh(mesh.geometry, this.glow.get(part));
      const halo = new THREE.Mesh(mesh.geometry, this.halo.get(part));
      mesh.add(ink, glow, halo);
      this.glowMeshes.get(part)!.push(glow, halo);
    }
    for (const part of CONTOUR_PARTS) this.set(part, 0);
  }

  /** Story time (s), for the pulse of the halo. */
  setTime(time: number) {
    this.pulse = 0.75 + 0.25 * Math.sin(time * 5);
  }

  /** How much a part glows, 0 (only the ink line) to 1. */
  set(part: ContourPart, glow: number) {
    this.ink.get(part)!.uniforms.thickness.value = INK + glow * (GLOW + EDGE);
    this.glow.get(part)!.uniforms.thickness.value = glow * GLOW;
    const halo = this.halo.get(part)!.uniforms;
    halo.thickness.value = glow * HALO;
    halo.opacity.value = glow * 0.6 * this.pulse;
    for (const mesh of this.glowMeshes.get(part)!) mesh.visible = glow > 0.02;
  }
}
