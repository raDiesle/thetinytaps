import * as THREE from "three";
import { updateMoved } from "./matrices";

// The 3D stage every story plays on: renderer, sky with sun, light, fog and
// the camera. Lighting is soft and warm, like an animated film; the sky can
// fade from day to sunset.

export interface SkyColors {
  top: string;
  horizon: string;
  sun: string;
}

export const DAY: SkyColors = { top: "#3f8fe8", horizon: "#cdeeff", sun: "#fff3d6" };
export const SUNSET: SkyColors = { top: "#4b4fa8", horizon: "#ffb38a", sun: "#ffcf8a" };

const SKY_VERTEX = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = p.xyww;
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y, -0.2, 1.0);
    vec3 col = mix(uHorizon, uTop, pow(max(h, 0.0), 0.55));
    col = mix(col, uHorizon * 0.92, smoothstep(0.0, -0.2, h));
    float s = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);
    col += uSun * (pow(s, 600.0) * 2.5 + pow(s, 12.0) * 0.35);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 900);
  readonly sun = new THREE.DirectionalLight("#fff1dc", 2.6);
  readonly fill = new THREE.HemisphereLight("#cfe8ff", "#e9cf9b", 1.1);
  private readonly skyUniforms = {
    uTop: { value: new THREE.Color(DAY.top) },
    uHorizon: { value: new THREE.Color(DAY.horizon) },
    uSun: { value: new THREE.Color(DAY.sun) },
    uSunDir: { value: new THREE.Vector3(0.45, 0.62, 0.55).normalize() },
  };
  private readonly fog = new THREE.Fog(DAY.horizon, 90, 330);
  private envTarget: THREE.WebGLRenderTarget | null = null;
  private readonly pmrem: THREE.PMREMGenerator;
  private readonly skyMesh: THREE.Mesh;
  /** What the camera sees, for leaving out shadows that fall where it does not look. */
  private readonly view = new THREE.Frustum();
  private readonly toSun = new THREE.Vector3();
  private readonly sunTarget = new THREE.Vector3();
  private readonly viewMatrix = new THREE.Matrix4();
  /** The lowest thing a shadow can fall on: no shadow reaches further, worked out with the first picture. */
  private floor: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, stencil: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.skyMesh = new THREE.Mesh(
      new THREE.SphereGeometry(600, 48, 24),
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERTEX,
        fragmentShader: SKY_FRAGMENT,
        uniforms: this.skyUniforms,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    );
    this.skyMesh.frustumCulled = false;
    this.scene.add(this.skyMesh);
    this.scene.fog = this.fog;
    // The world matrices are brought up to date in render(), only where something moved.
    this.scene.matrixWorldAutoUpdate = false;

    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.03;
    const s = this.sun.shadow.camera;
    s.left = s.bottom = -14;
    s.right = s.top = 14;
    s.near = 1;
    s.far = 120;
    this.scene.add(this.sun, this.sun.target, this.fill);
    // The shadow's own box holds much that throws its shadow behind the camera or out of the picture: drawing
    // those into the shadow cost an old phone as much as drawing what is seen (October 2026), and leaving them
    // out changes no pixel. The box stays as it is, so the shadows look the same; only fewer things go in.
    const box = this.sun.shadow.getFrustum();
    const sphere = new THREE.Sphere();
    const end = new THREE.Vector3();
    const cull = {
      intersectsObject: (o: THREE.Mesh) => {
        if (!box.intersectsObject(o)) return false;
        if (this.floor === null || this.toSun.y < 0.05) return true;
        const own = (o as Partial<THREE.InstancedMesh>).boundingSphere;
        sphere.copy(own ?? o.geometry.boundingSphere!).applyMatrix4(o.matrixWorld);
        // A little more, for the soft edge of the shadow.
        const r = sphere.radius + 0.3;
        // The shadow runs from the thing away from the sun, down to the floor at most: seen if any of it is in view.
        const reach = Math.max(0, (sphere.center.y + r - this.floor) / this.toSun.y);
        end.copy(sphere.center).addScaledVector(this.toSun, -reach);
        for (const plane of this.view.planes) if (plane.distanceToPoint(sphere.center) < -r && plane.distanceToPoint(end) < -r) return false;
        return true;
      },
      intersectsSprite: (sprite: THREE.Sprite) => box.intersectsSprite(sprite),
    };
    this.sun.shadow.getFrustum = () => cull as unknown as THREE.Frustum;

    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    this.refreshEnvironment();
  }

  /** Reflections and soft light from the sky itself. */
  private refreshEnvironment() {
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(this.skyMesh.geometry, this.skyMesh.material));
    const target = this.pmrem.fromScene(envScene, 0.02);
    this.envTarget?.dispose();
    this.envTarget = target;
    this.scene.environment = target.texture;
    this.scene.environmentIntensity = 0.55;
  }

  /** Fades the sky and light between two moods, k = 0 is `from`. */
  setSky(from: SkyColors, to: SkyColors, k: number) {
    const mix = (a: string, b: string) => new THREE.Color(a).lerp(new THREE.Color(b), k);
    this.skyUniforms.uTop.value.copy(mix(from.top, to.top));
    this.skyUniforms.uHorizon.value.copy(mix(from.horizon, to.horizon));
    this.skyUniforms.uSun.value.copy(mix(from.sun, to.sun));
    this.fog.color.copy(this.skyUniforms.uHorizon.value);
    this.sun.color.copy(mix("#fff1dc", "#ffb27a"));
    this.sun.intensity = 2.6 - k * 0.9;
    this.fill.color.copy(mix("#cfe8ff", "#b9a8ff"));
    // The sun sinks behind the hill, seen from the bay.
    this.skyUniforms.uSunDir.value.set(0.45 - k * 0.15, 0.62 - k * 0.54, 0.55 + k * 0.4).normalize();
  }

  /** Puts the sun in the sky (and the light coming from it) towards `dir`; call after setSky, which moves it for the sunset. */
  setSunDirection(dir: THREE.Vector3) {
    this.skyUniforms.uSunDir.value.copy(dir).normalize();
  }

  /** Call after setSky when the mood changed a lot, so reflections follow (costs a few ms). */
  updateReflections() {
    this.refreshEnvironment();
  }

  /** The sun's shadow follows the action, so it stays sharp where the camera looks. */
  focusShadow(target: THREE.Vector3) {
    const dir = this.skyUniforms.uSunDir.value;
    this.sun.target.position.copy(target);
    this.sun.position.copy(target).addScaledVector(dir, 50);
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Portrait screens see less to the sides: widen the view instead of cutting the guide off.
    this.camera.fov = width / height < 1 ? 70 : 50;
    this.camera.updateProjectionMatrix();
  }

  render() {
    updateMoved(this.scene);
    this.sweepView();
    this.renderer.render(this.scene, this.camera);
  }

  /** Where the camera looks and the sun shines from, for the shadow's culling above. */
  private sweepView() {
    if (this.camera.parent === null) this.camera.updateMatrixWorld();
    this.viewMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    this.view.setFromProjectionMatrix(this.viewMatrix, this.camera.coordinateSystem, this.camera.reversedDepth);
    this.toSun.setFromMatrixPosition(this.sun.matrixWorld);
    this.toSun.sub(this.sunTarget.setFromMatrixPosition(this.sun.target.matrixWorld)).normalize();
    if (this.floor === null) {
      let floor = Number.POSITIVE_INFINITY;
      const bounds = new THREE.Box3();
      this.scene.traverse((o) => {
        // A skinned figure's vertices lie where its joints put them, not where its own matrix does; it stands on something anyway.
        if (!(o instanceof THREE.Mesh) || !o.receiveShadow || o instanceof THREE.SkinnedMesh) return;
        // An instanced mesh's copies lie wherever their own matrices put them.
        if (o instanceof THREE.InstancedMesh) o.computeBoundingBox();
        else if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        const box = o instanceof THREE.InstancedMesh ? o.boundingBox : o.geometry.boundingBox;
        floor = Math.min(floor, bounds.copy(box!).applyMatrix4(o.matrixWorld).min.y);
      });
      // Things that sink further later (a fish diving) still end there: two metres more for them.
      this.floor = floor - 2;
    }
  }

  dispose() {
    this.envTarget?.dispose();
    this.pmrem.dispose();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.InstancedMesh) {
        o.geometry.dispose();
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of materials) {
          for (const value of Object.values(m)) if (value instanceof THREE.Texture) value.dispose();
          m.dispose();
        }
      }
    });
    this.renderer.dispose();
  }
}

/**
 * Water with gentle waves, computed on the graphics card. `shallow` is the
 * colour near the shore (by distance to `center`), `deep` further out.
 */
export function makeWater(size: number, segments: number, center: THREE.Vector2, radius: number, shallow: string, deep: string) {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  geometry.rotateX(-Math.PI / 2);
  const colors: number[] = [];
  const pos = geometry.attributes.position;
  const a = new THREE.Color(shallow);
  const b = new THREE.Color(deep);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const d = Math.hypot(pos.getX(i) - center.x, pos.getZ(i) - center.y);
    c.copy(a).lerp(b, THREE.MathUtils.smoothstep(d, radius * 0.75, radius * 1.6));
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const time = { value: 0 };
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.12,
    metalness: 0,
    transparent: true,
    opacity: 0.86,
    clearcoat: 0.6,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uTime;
        float wave(vec2 p) {
          return sin(p.x * 0.35 + uTime * 1.1) * 0.12 + sin(p.y * 0.28 - uTime * 0.9) * 0.1
            + sin((p.x + p.y) * 0.9 + uTime * 2.0) * 0.035;
        }`,
      )
      .replace(
        "#include <beginnormal_vertex>",
        `float e = 0.15;
        float hC = wave(position.xz);
        float hX = wave(position.xz + vec2(e, 0.0));
        float hZ = wave(position.xz + vec2(0.0, e));
        vec3 objectNormal = normalize(vec3(hC - hX, e, hC - hZ));`,
      )
      .replace("#include <begin_vertex>", "vec3 transformed = vec3(position.x, position.y + hC, position.z);");
  };
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return { mesh, time };
}
