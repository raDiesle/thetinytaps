import * as THREE from "three";
import { RigidSkin } from "./skin";

// Outlines around the fox, so its movements read clearly in a busy picture:
// a thin dark ink line all around, drawn as "inverted hulls" (each part again,
// a little bigger and from the inside, behind the real one), and around the
// body parts that are moving a plain neon-green band, a little away from the
// body. The band is worked out on the picture, not per part, so it runs
// around the whole moving shape without seams where the parts meet: the
// moving parts are drawn into a mask (hidden where something solid stands in
// front of them), a jump flood finds for every pixel the nearest masked one,
// and the band is laid where that is the right distance.

export type ContourPart = "armL" | "armR" | "legL" | "legR" | "body" | "head";
export const CONTOUR_PARTS: ContourPart[] = ["armL", "armR", "legL", "legR", "body", "head"];

/** The ink line (object units ≈ metres). */
const INK = 0.009;
/** Where the neon band starts and how wide it is, in metres out from the body. */
const GLOW_GAP = 0.016;
const GLOW_BAND = 0.02;
const GLOW_COLOR = "#39ff14";
/** The layer only the glow's mask is drawn on; the normal picture never sees it. */
export const GLOW_LAYER = 7;
/** The solid things of the scene, which hide the moving parts behind them from the mask. */
const SOLID_LAYER = 8;

/** `merged`: parts baked together (`mergeParts`, `skinRigid`) keep their own ink direction and length in `inkNormal`. */
const hull = (color: string, merged: boolean) =>
  new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(color) }, thickness: { value: INK } },
    defines: merged ? { INK_NORMAL: "" } : {},
    vertexShader: /* glsl */ `
      uniform float thickness;
      #if defined(INK_NORMAL) || defined(USE_SKINNING)
      attribute vec3 inkNormal;
      #else
      #define inkNormal normal
      #endif
      #include <skinning_pars_vertex>
      void main() {
        vec3 transformed = position + inkNormal * thickness;
        #include <skinbase_vertex>
        #include <skinning_vertex>
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 1.0);
      }`,
    side: THREE.BackSide,
  });

/** How strongly a part glows, written into the mask; overlapping parts keep the stronger. */
const maskMaterial = () =>
  new THREE.ShaderMaterial({
    uniforms: { strength: { value: 0 } },
    vertexShader: /* glsl */ `
      #include <skinning_pars_vertex>
      void main() {
        vec3 transformed = position;
        #include <skinbase_vertex>
        #include <skinning_vertex>
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float strength;
      void main() {
        gl_FragColor = vec4(strength, 0.0, 0.0, 1.0);
      }`,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendEquation: THREE.MaxEquation,
  });

const SCREEN_VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }`;

/** Every masked pixel is its own nearest seed: (x, y, strength, 1). */
const SEED_FRAGMENT = /* glsl */ `
  uniform sampler2D mask;
  uniform vec2 size;
  void main() {
    float m = texture2D(mask, gl_FragCoord.xy / size).r;
    gl_FragColor = m > 0.01 ? vec4(gl_FragCoord.xy, m, 1.0) : vec4(0.0);
  }`;

/** One jump of the flood: the nearest of the seeds `jump` pixels around. */
const FLOOD_FRAGMENT = /* glsl */ `
  uniform sampler2D seeds;
  uniform vec2 size;
  uniform float jump;
  void main() {
    vec2 p = gl_FragCoord.xy;
    vec4 best = vec4(0.0);
    float bestDistance = 1e9;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec4 s = texture2D(seeds, (p + vec2(x, y) * jump) / size);
        float d = distance(p, s.xy);
        if (s.a > 0.5 && d < bestDistance) {
          bestDistance = d;
          best = s;
        }
      }
    }
    gl_FragColor = best;
  }`;

/** The band over the finished picture, between `inner` and `outer` screen pixels from the moving shape. */
const BAND_FRAGMENT = /* glsl */ `
  uniform sampler2D seeds;
  uniform vec2 size;
  uniform float scale;
  uniform float inner;
  uniform float outer;
  uniform vec3 color;
  void main() {
    vec2 p = gl_FragCoord.xy * scale;
    vec4 s = texture2D(seeds, p / size);
    if (s.a < 0.5) discard;
    // A seed is the middle of a mask pixel; the shape's edge lies about half a mask pixel further out.
    float d = distance(p, s.xy) / scale - 0.5 / scale;
    float a = smoothstep(inner - 0.8, inner + 0.8, d) * (1.0 - smoothstep(outer - 0.8, outer + 0.8, d));
    gl_FragColor = vec4(color, a * s.z);
    #include <colorspace_fragment>
  }`;

const screenPass = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>, blend = false) =>
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader: SCREEN_VERTEX,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
    transparent: blend,
    blending: blend ? THREE.NormalBlending : THREE.NoBlending,
  });

const target = (type: THREE.TextureDataType) =>
  new THREE.WebGLRenderTarget(1, 1, {
    type,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    depthBuffer: type === THREE.UnsignedByteType,
    generateMipmaps: false,
  });

export class Contour {
  private readonly mask = new Map<ContourPart, THREE.ShaderMaterial>();
  private readonly maskMeshes = new Map<ContourPart, THREE.Mesh[]>();
  private readonly strength: Record<ContourPart, number> = { armL: 0, armR: 0, legL: 0, legR: 0, body: 0, head: 0 };
  // The flood runs on half the screen's pixels: plenty for a band a few pixels wide, and cheap on tablets.
  private readonly maskTarget = target(THREE.UnsignedByteType);
  private readonly depthOnly = new THREE.MeshBasicMaterial({ colorWrite: false });
  // Half floats hold whole pixel positions exactly up to 2048.
  private readonly seeds = [target(THREE.HalfFloatType), target(THREE.HalfFloatType)];
  private readonly size = new THREE.Vector2();
  private readonly seedPass = screenPass(SEED_FRAGMENT, { mask: { value: null }, size: { value: this.size } });
  private readonly floodPass = screenPass(FLOOD_FRAGMENT, { seeds: { value: null }, size: { value: this.size }, jump: { value: 1 } });
  private readonly bandPass = screenPass(
    BAND_FRAGMENT,
    {
      seeds: { value: null },
      size: { value: this.size },
      scale: { value: 0.5 },
      inner: { value: 0 },
      outer: { value: 0 },
      color: { value: new THREE.Color(GLOW_COLOR) },
    },
    true,
  );
  private readonly screen = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.seedPass);
  private readonly screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly drawing = new THREE.Vector2();
  private readonly middle = new THREE.Vector3();
  private readonly ahead = new THREE.Vector3();
  private readonly bounds = new THREE.Sphere();

  /** Outlines every shadow-casting mesh under `root`; `partOf` says which body part it moves with. */
  constructor(
    private readonly root: THREE.Object3D,
    partOf: (mesh: THREE.Object3D) => ContourPart,
  ) {
    const ink = hull("#2b160d", false);
    const inkMerged = hull("#2b160d", true);
    for (const part of CONTOUR_PARTS) {
      this.mask.set(part, maskMaterial());
      this.maskMeshes.set(part, []);
    }
    const meshes: THREE.Mesh[] = [];
    root.traverse((o) => {
      // Small details (eyes, belly, dots) sit inside the outline anyway.
      if (o instanceof THREE.Mesh && o.castShadow) meshes.push(o);
    });
    for (const mesh of meshes) {
      const part = partOf(mesh);
      const masked = new THREE.Mesh(mesh.geometry, this.mask.get(part));
      masked.layers.set(GLOW_LAYER);
      masked.visible = false;
      mesh.add(new THREE.Mesh(mesh.geometry, mesh.geometry.attributes.inkNormal ? inkMerged : ink), masked);
      this.maskMeshes.get(part)!.push(masked);
    }
    this.screen.frustumCulled = false;
  }

  /** Parts skinned after they were outlined (`skinRigid`): the glow's masks are their skinned meshes now. */
  adopt(replaced: Map<THREE.Mesh, THREE.Mesh>) {
    for (const [part, meshes] of this.maskMeshes) this.maskMeshes.set(part, [...new Set(meshes.map((m) => replaced.get(m) ?? m))]);
  }

  /** How much a part glows, 0 (only the ink line) to 1. */
  set(part: ContourPart, glow: number) {
    this.strength[part] = glow;
    this.mask.get(part)!.uniforms.strength.value = glow;
    for (const mesh of this.maskMeshes.get(part)!) mesh.visible = glow > 0.05;
  }

  /** Lays the band over the picture just drawn; nothing to do while no part glows. */
  draw(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
    const glow = Math.max(...CONTOUR_PARTS.map((part) => this.strength[part]));
    if (glow <= 0.05) return;
    // Without half-float pictures to draw into, there is no flood; the ink line stays.
    if (!renderer.extensions.has("EXT_color_buffer_float") && !renderer.extensions.has("EXT_color_buffer_half_float")) return;

    renderer.getDrawingBufferSize(this.drawing);
    const width = Math.max(1, Math.ceil(this.drawing.x / 2));
    const height = Math.max(1, Math.ceil(this.drawing.y / 2));
    if (width !== this.size.x || height !== this.size.y) {
      this.size.set(width, height);
      this.maskTarget.setSize(width, height);
      for (const t of this.seeds) t.setSize(width, height);
    }

    // The band is as wide on the fox close up as far away: metres at the fox, in screen pixels.
    this.middle.set(0, 0.45, 0);
    this.root.localToWorld(this.middle);
    const distance = Math.max(0.5, this.middle.distanceTo(camera.position));
    const perMetre = this.drawing.y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance);
    const inner = Math.max(1.5, GLOW_GAP * perMetre);
    const outer = Math.min(inner + Math.max(2.5, GLOW_BAND * perMetre), 60);

    const before = renderer.getRenderTarget();
    const autoClear = renderer.autoClear;
    const layers = camera.layers.mask;
    renderer.autoClear = true;

    // First the depth of everything solid apart from the fox, then the moving parts where they are not behind it.
    // Only what comes nearer to the camera than the far side of the moving parts can hide some of them, so
    // the rest (most of the world, behind the fox) is left out of the depth: hundreds of draw calls fewer.
    camera.getWorldDirection(this.ahead);
    const depthOf = (mesh: THREE.Mesh, side: number) => {
      // An instanced mesh's own bounds hold all its copies; one that keeps none (its copies move) may be anywhere.
      if (mesh instanceof THREE.InstancedMesh && !mesh.boundingSphere) return -side * Infinity;
      if (mesh instanceof RigidSkin) return mesh.reach(camera.position, this.ahead, side, this.bounds);
      if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
      this.bounds.copy(mesh instanceof THREE.InstancedMesh ? mesh.boundingSphere! : mesh.geometry.boundingSphere!).applyMatrix4(mesh.matrixWorld);
      return this.bounds.center.sub(camera.position).dot(this.ahead) + side * this.bounds.radius;
    };
    let far = -Infinity;
    for (const meshes of this.maskMeshes.values()) for (const mesh of meshes) if (mesh.visible) far = Math.max(far, depthOf(mesh, 1));
    let scene: THREE.Object3D = this.root;
    while (scene.parent) scene = scene.parent;
    // What is hidden is not drawn, whatever its layers; nor is the fox here.
    const sort = (o: THREE.Object3D) => {
      if (!o.visible || o === this.root) return;
      // The lights come along, though they light nothing here: whenever the lights of one picture differ from
      // the one before, three.js works out the program of every lit material again, which took most of a
      // phone's frame while a part glowed.
      if (o instanceof THREE.Light) o.layers.enable(SOLID_LAYER);
      else if (o instanceof THREE.Mesh) {
        const m = o.material;
        const solid = !Array.isArray(m) && !m.transparent && m.depthWrite && m.colorWrite;
        if (solid && depthOf(o, -1) <= far) o.layers.enable(SOLID_LAYER);
        else o.layers.disable(SOLID_LAYER);
      }
      for (const child of o.children) sort(child);
    };
    sort(scene);
    renderer.setRenderTarget(this.maskTarget);
    if (scene instanceof THREE.Scene) {
      const shadows = renderer.shadowMap.autoUpdate;
      renderer.shadowMap.autoUpdate = false;
      scene.overrideMaterial = this.depthOnly;
      camera.layers.set(SOLID_LAYER);
      this.root.visible = false;
      renderer.render(scene, camera);
      this.root.visible = true;
      scene.overrideMaterial = null;
      renderer.shadowMap.autoUpdate = shadows;
    } else renderer.clear();
    renderer.autoClear = false;
    camera.layers.set(GLOW_LAYER);
    // The fox's matrices are up to date from the picture just drawn.
    const own = this.root.matrixWorldAutoUpdate;
    this.root.matrixWorldAutoUpdate = false;
    renderer.render(this.root, camera);
    this.root.matrixWorldAutoUpdate = own;
    camera.layers.mask = layers;
    renderer.autoClear = true;

    const pass = (material: THREE.ShaderMaterial, to: THREE.WebGLRenderTarget | null) => {
      this.screen.material = material;
      renderer.setRenderTarget(to);
      renderer.render(this.screen, this.screenCamera);
    };
    this.seedPass.uniforms.mask.value = this.maskTarget.texture;
    pass(this.seedPass, this.seeds[0]);
    // Jumps from far to near; only as far as the band reaches (in mask pixels).
    let from = 0;
    for (let jump = THREE.MathUtils.ceilPowerOfTwo(Math.ceil(outer / 2) + 1); jump >= 1; jump /= 2) {
      this.floodPass.uniforms.seeds.value = this.seeds[from].texture;
      this.floodPass.uniforms.jump.value = jump;
      pass(this.floodPass, this.seeds[1 - from]);
      from = 1 - from;
    }

    const band = this.bandPass.uniforms;
    band.seeds.value = this.seeds[from].texture;
    band.scale.value = width / this.drawing.x;
    band.inner.value = inner;
    band.outer.value = outer;
    renderer.autoClear = false;
    pass(this.bandPass, before);
    renderer.autoClear = autoClear;
  }
}
