import * as THREE from "three";

// Outlines around the fox, so its movements read clearly in a busy picture:
// a thin dark ink line all around, and on the body parts that are moving a
// wide glowing band (light inside, dark outside, so it shows on sky and sand
// alike). Drawn as "inverted hulls": each part again, a little bigger and
// from the inside, behind the real one.

export type ContourPart = "armL" | "armR" | "legL" | "legR" | "body" | "head";
export const CONTOUR_PARTS: ContourPart[] = ["armL", "armR", "legL", "legR", "body", "head"];

/** Thin ink line when still; how much wider the glow makes it (object units ≈ metres). */
const INK = 0.007;
const GLOW = 0.03;
const EDGE = 0.01;

const hull = (color: string) =>
  new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(color) }, thickness: { value: 0 } },
    vertexShader: /* glsl */ `
      uniform float thickness;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * thickness, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 1.0);
      }`,
    side: THREE.BackSide,
  });

export class Contour {
  private readonly ink = new Map<ContourPart, THREE.ShaderMaterial>();
  private readonly glow = new Map<ContourPart, THREE.ShaderMaterial>();
  private readonly glowMeshes = new Map<ContourPart, THREE.Mesh[]>();

  /** Outlines every shadow-casting mesh under `root`; `partOf` says which body part it moves with. */
  constructor(root: THREE.Object3D, partOf: (mesh: THREE.Object3D) => ContourPart) {
    for (const part of CONTOUR_PARTS) {
      this.ink.set(part, hull("#2b160d"));
      this.glow.set(part, hull("#fff2a6"));
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
      glow.visible = false;
      mesh.add(ink, glow);
      this.glowMeshes.get(part)!.push(glow);
    }
    for (const part of CONTOUR_PARTS) this.set(part, 0);
  }

  /** How much a part glows, 0 (only the ink line) to 1. */
  set(part: ContourPart, glow: number) {
    this.ink.get(part)!.uniforms.thickness.value = INK + glow * (GLOW + EDGE);
    this.glow.get(part)!.uniforms.thickness.value = glow * GLOW;
    for (const mesh of this.glowMeshes.get(part)!) mesh.visible = glow > 0.02;
  }
}
