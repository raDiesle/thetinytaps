// Runs every paid request the user has approved, in a Claude cloud session (/paid-queue): the Mac most sessions run on
// sits behind the company's Zscaler, which blocks ElevenLabs and Gemini (November 2026), so sessions there write
// approved runs into queues, and only a cloud session makes them – it also looks at what came, redoes what is wrong and
// does each entry's `after`. Run as a bare script on another computer it is deprecated (user decision, 21 November 2026).
//
//   bun run paid --dry        what would be made and what it costs, sends nothing (works behind Zscaler too)
//   bun run paid              records src/content/voiceQueue.ts, then makes the cheap pictures of pictureQueue.ts
//   bun run paid --no-images | --no-voice     only one of the two
//
// The sound effects of src/content/soundQueue.ts are listed, not made: the cloud session makes them by hand as
// src/lib/sounds/README.md says („Made with ElevenLabs“) and cuts each to its sound. The keys are the cloud
// environment's secrets (ELEVENLABS_API_KEY, ELEVENLABS_API_KEY_2 when a job uses the second account, GEMINI_API_KEY);
// afterwards take what was made out of its queue and commit the new files with it (.claude/skills/paid-queue/).
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { plugin } from "bun";
import { SOUND_QUEUE } from "../src/content/soundQueue.ts";
import { ACCOUNT_KEYS, VOICE_QUEUE } from "../src/content/voiceQueue.ts";
import { appPlugin } from "../tools/appPlugin.ts";
import { reachable } from "./networkFilter.mjs";

const ROOT = resolve(import.meta.dir, "..");
const args = new Set(process.argv.slice(2));
const dry = args.has("--dry");
const voice = !args.has("--no-voice");
const images = !args.has("--no-images");
for (const a of args) if (!["--dry", "--no-voice", "--no-images"].includes(a)) fail(`unknown option ${a} – see scripts/paid-queue.mjs`);

/**
 * @param {string} message
 * @returns {never}
 */
function fail(message) {
  console.error(message);
  process.exit(1);
}

/**
 * Runs one of the repo's scripts with the terminal's input and output, and says whether it ended well.
 * @param {string[]} command
 * @param {Record<string, string | undefined>} [env]
 */
function run(command, env = {}) {
  console.log(`\n$ bun ${command.join(" ")}`);
  return spawnSync("bun", command, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } }).status === 0;
}

// The pictures cheap to make now, read as `bun run image queue` reads them (the games' prompts import like the app's).
plugin(appPlugin());
const { PICTURE_QUEUE } = await import("../src/content/pictureQueue.ts");
const { planQueue } = await import("../src/content/pictureQueuePlan.ts");
const waiting = PICTURE_QUEUE.filter((p) => !existsSync(resolve(ROOT, p.file)));
const cheap = planQueue(waiting).now;

const jobs = voice ? VOICE_QUEUE : [];
const pictures = images && cheap.length > 0;
console.log(
  `${jobs.length} recording job${jobs.length === 1 ? "" : "s"} (src/content/voiceQueue.ts), ` +
    `${images ? cheap.length : 0} picture request${cheap.length === 1 ? "" : "s"} cheap now of ${waiting.length} waiting (src/content/pictureQueue.ts)`,
);
const sounds = voice ? SOUND_QUEUE.filter((sound) => !existsSync(resolve(ROOT, sound.file))) : [];
if (sounds.length) console.log(`${sounds.length} sound effect${sounds.length === 1 ? "" : "s"} to make by hand (src/content/soundQueue.ts)`);
if (!jobs.length && !pictures && !sounds.length) {
  console.log("nothing to make");
  process.exit(0);
}

if (!dry) {
  // Every key before the first request, so a run never stops halfway for a missing one.
  /** @type {Set<string>} */
  const keys = new Set(jobs.map((job) => ACCOUNT_KEYS[job.account]));
  if (pictures) keys.add("GEMINI_API_KEY");
  const missing = [...keys].filter((key) => !process.env[key]);
  if (missing.length) fail(`not set here: ${missing.join(", ")} – export them in this computer's shell first`);
  const blocked = [];
  if (jobs.length && !(await reachable("https://api.elevenlabs.io/v1/models"))) blocked.push("ElevenLabs");
  if (pictures && !(await reachable("https://generativelanguage.googleapis.com/v1beta/models"))) blocked.push("Gemini");
  if (blocked.length)
    fail(`this network blocks ${blocked.join(" and ")} (a filter like Zscaler answers instead) – a Claude cloud session runs it: /paid-queue`);
}

/** @type {string[]} */
const made = [];
for (const job of jobs) {
  console.log(`\n▶ ${job.id}: ${job.why}`);
  const command = ["scripts/elevenlabs-voice.mjs", "make", "--only", job.only.join(","), "--lang", job.lang.join(",")];
  if (job.voice) command.push("--voice", job.voice);
  if (job.parallel) command.push("--parallel", String(job.parallel));
  if (dry) command.push("--dry");
  // The voice script reads ELEVENLABS_API_KEY: a job on the second account gets that account's key under this name.
  if (!run(command, dry ? {} : { ELEVENLABS_API_KEY: process.env[ACCOUNT_KEYS[job.account]] }))
    fail(`\n${job.id} stopped – nothing after it was started. Started again, \`bun run paid\` goes on where it stopped.`);
  if (!dry) made.push(job.id);
}

if (images && waiting.length) {
  if (!run(["scripts/gemini-image.mjs", "queue", ...(pictures && !dry ? ["--make"] : [])])) fail("\nthe pictures stopped");
}

for (const sound of sounds) {
  console.log(`\n♪ ${sound.id} → ${sound.file}: ${sound.use}`);
  console.log(`  "${sound.prompt}" (${sound.seconds} s, influence ${sound.influence}) – by hand, src/lib/sounds/README.md`);
}

// What is left to do once a thing is made: the session that made it does it before committing.
const after = [
  ...jobs.filter((job) => job.after).map((job) => `${job.id}: ${job.after}`),
  ...(pictures ? cheap.flatMap((sheet) => sheet.pictures) : []).filter((p) => p.after).map((p) => `${p.id}: ${p.after}`),
  ...sounds.filter((sound) => sound.after).map((sound) => `${sound.id}: ${sound.after}`),
];
if (after.length) console.log(`\nthen, for what was made:\n${after.map((line) => `  ${line}`).join("\n")}`);

if (dry) console.log("\n--dry: nothing was sent.");
else {
  if (made.length) console.log(`\nrecorded – take ${made.map((id) => `"${id}"`).join(", ")} out of src/content/voiceQueue.ts`);
  console.log("then commit the new files (stimme/, bilder/) together with the shorter queues.");
}
