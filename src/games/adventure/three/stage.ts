import * as THREE from "three";

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

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
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
    this.renderer.render(this.scene, this.camera);
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
