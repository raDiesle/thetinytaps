import * as THREE from "three";

// Outlines around the fox, so its movements read clearly in a busy picture:
// a thin dark ink line all around, and on the body parts that are moving a
// slim glowing band (light inside, dark outside, so it shows on sky and sand
// alike) with stripes of light running along it and a pulsing halo. Drawn
// as "inverted hulls": each part again, a little bigger and from the
// inside, behind the real one.

export type ContourPart = "armL" | "armR" | "legL" | "legR" | "body" | "head";
export const CONTOUR_PARTS: ContourPart[] = ["armL", "armR", "legL", "legR", "body", "head"];

/** Ink line when still; the light band, its dark edge and the halo when moving (object units ≈ metres). */
const INK = 0.009;
const GLOW = 0.026;
const EDGE = 0.01;
const HALO = 0.07;

/** Story time, shared by all outline shaders. */
const clock = { value: 0 };

const hull = (color: string, kind: "ink" | "glow" | "halo") =>
  new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(color) }, thickness: { value: 0 }, opacity: { value: 1 }, time: clock },
    vertexShader: /* glsl */ `
      uniform float thickness;
      varying float height;
      void main() {
        vec4 world = modelMatrix * vec4(position + normal * thickness, 1.0);
        height = world.y;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      uniform float opacity;
      uniform float time;
      varying float height;
      void main() {
        vec3 c = color;
        ${
          kind === "glow"
            ? // Bright stripes running upwards along the band, like a neon sign.
              `float stripe = pow(0.5 + 0.5 * sin(height * 22.0 - time * 9.0), 4.0);
        c = mix(c, vec3(1.0), stripe);`
            : ""
        }
        gl_FragColor = vec4(c, opacity);
      }`,
    side: THREE.BackSide,
    // The halo adds light on top of whatever is behind the fox.
    ...(kind === "halo" ? { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } : {}),
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
      this.ink.set(part, hull("#2b160d", "ink"));
      this.glow.set(part, hull("#ffd400", "glow"));
      this.halo.set(part, hull("#ffae00", "halo"));
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

  /** Story time (s), for the running light and the pulse of the halo. */
  setTime(time: number) {
    clock.value = time;
    this.pulse = 0.55 + 0.45 * Math.sin(time * 6);
  }

  /** How much a part glows, 0 (only the ink line) to 1. */
  set(part: ContourPart, glow: number) {
    this.ink.get(part)!.uniforms.thickness.value = INK + glow * (GLOW + EDGE);
    this.glow.get(part)!.uniforms.thickness.value = glow * GLOW;
    const halo = this.halo.get(part)!.uniforms;
    halo.thickness.value = glow * HALO;
    halo.opacity.value = glow * 0.95 * this.pulse;
    for (const mesh of this.glowMeshes.get(part)!) mesh.visible = glow > 0.02;
  }
}
