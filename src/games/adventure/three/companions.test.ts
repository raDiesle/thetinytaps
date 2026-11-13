import { expect, test } from "bun:test";
import * as THREE from "three";
import { FIRE_RESCUE } from "../stories/fireRescue";
import type { Story } from "../stories/story";
import { Guide } from "./guide";
import { quietStage, shown, withoutScreen } from "./headless";
import { storyFrame, storyPose, storyTimes, worldPose } from "./player";

// A companion flying along (Kiki the parrot in Fire Rescue) goes round things, never through them, and is seen: never
// hidden behind a thing for long, nor out of the picture, nor under the dancer's box in the bottom right corner (user
// feedback, November 2026: Kiki flew through the house and hovered behind the bell's post the whole greeting). The
// story is played frame by frame without a screen, as the player plays it.

/** Seconds between the frames checked. */
const EVERY = 0.1;
/** The longest a companion may be hidden, out of the picture or under the dancer's box at a time, in seconds: flying
 * past a thing, or across the picture's edge while the camera swings round to the next step, is fine. */
const AT_MOST = 1.5;
/** Seconds into the first step the companion flies in from afar, and is not looked for yet. */
const FLYING_IN = 3;
/** The screen's shape the pictures are checked at (a tablet on its side, 1024 × 640). */
const ASPECT = 1.6;
/** The dancer's box in the bottom right corner, in the picture's -1…1 space (measured at 1024 × 640), with a margin. */
const DANCER = { left: 0.5, top: -0.02 };
/** How far in from the picture's edges the companion's middle stays, in the picture's -1…1 space. */
const EDGE = 0.92;

/** The meshes something can't go through nor be seen through: shown, not see-through, Tapsi among them, not the companion itself. */
function solids(scene: THREE.Scene, companion: THREE.Object3D) {
  const out: THREE.Object3D[] = [];
  const skip = new Set<THREE.Object3D>([companion]);
  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh) || o instanceof THREE.InstancedMesh) return;
    for (let at: THREE.Object3D | null = o; at; at = at.parent) if (skip.has(at)) return;
    const materials = Array.isArray(o.material) ? o.material : [o.material];
    if (materials.some((m: THREE.Material) => m.transparent || m.opacity < 1)) return;
    if (shown(o)) out.push(o);
  });
  return out;
}

/** What goes wrong with the companion named `name`, as short lines naming the step and the time. */
function companionTrouble(story: Story, name: string) {
  const stage = quietStage();
  stage.camera.aspect = ASPECT;
  stage.camera.updateProjectionMatrix();
  const guide = new Guide();
  stage.scene.add(guide.root);
  const world = withoutScreen(() => story.build(stage, guide, () => {}));
  const companion = stage.scene.getObjectByName(name);
  if (!companion) return [`no ${name} in the scene`];
  const { starts, total } = storyTimes(story);
  const trouble = new Set<string>();
  const ray = new THREE.Raycaster();
  const [now, was, dir, seen] = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  /** Since when each problem lasts. */
  const since = new Map<string, number>();
  let before = -EVERY;
  let first = true;
  for (let t = 0; t <= total; t += EVERY) {
    const f = storyFrame(story, starts, t, before, EVERY);
    before = t;
    const result = world.update(f);
    guide.apply(worldPose(storyPose(story, f, result.walking ? 1 : 0), result), t);
    world.afterPose?.(f);
    stage.scene.updateMatrixWorld(true);
    companion.getWorldPosition(now);
    const at = `step ${f.opening === null ? f.step : "opening"} at ${t.toFixed(1)} s`;
    // Through nothing: the way since the last frame crosses no solid thing, Tapsi included.
    if (!first && now.distanceTo(was) > 1e-4) {
      ray.set(was, dir.subVectors(now, was).normalize());
      ray.far = now.distanceTo(was);
      const hit = ray.intersectObjects(solids(stage.scene, companion), false)[0];
      if (hit) trouble.add(`${name} flies through ${hit.object.name || hit.object.parent?.name || "a solid thing"} in ${at}`);
    }
    first = false;
    was.copy(now);
    if (f.opening !== null) continue;
    // Seen: in the picture, clear of the dancer's box, and not hidden behind a thing – each for no longer than AT_MOST.
    // Not while it flies in at the start, nor as it flies off in the last step's praise.
    if ((f.step === 0 && f.local < FLYING_IN) || (f.step === story.sequence.steps.length - 1 && f.praise > 0)) continue;
    const camera = stage.camera;
    camera.updateMatrixWorld(true);
    seen.copy(now).project(camera);
    const out = Math.abs(seen.x) > EDGE || Math.abs(seen.y) > EDGE || seen.z > 1;
    ray.set(camera.position, dir.subVectors(now, camera.position).normalize());
    ray.far = now.distanceTo(camera.position) - 0.15;
    const problems = {
      "out of the picture": out,
      "under the dancer's box": !out && seen.x > DANCER.left && seen.y < DANCER.top,
      "hidden behind something": ray.intersectObjects(solids(stage.scene, companion), false).length > 0,
    };
    // COMPANION_LOG=1 bun test … prints where the companion is in the picture at every frame with a problem.
    if (process.env.COMPANION_LOG && Object.values(problems).some(Boolean)) console.log(at, seen.x.toFixed(2), seen.y.toFixed(2), JSON.stringify(problems));
    for (const [what, on] of Object.entries(problems)) {
      if (!on) since.delete(what);
      else if (!since.has(what)) since.set(what, t);
      else if (t - (since.get(what) ?? t) > AT_MOST) trouble.add(`${name} ${what} in step ${f.step} from ${since.get(what)?.toFixed(1)} s`);
    }
  }
  return [...trouble].slice(0, 12);
}

test("in Fire Rescue Kiki flies round things and is always seen", () => {
  expect(companionTrouble(FIRE_RESCUE, "Kiki")).toEqual([]);
});
