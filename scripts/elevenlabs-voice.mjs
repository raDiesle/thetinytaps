// Records what Tapsi says in the Bewegungsabenteuer with ElevenLabs: a warm, cheerful
// coach voice for toddlers, one MP3 per line in the story's stimme/ folder
// (src/games/adventure/stories/<story>/stimme/<hash of the text>.mp3). The game plays
// them (src/games/adventure/voice.ts) and falls back to the browser's voice for a
// line that has no recording.
//
//   yarn voice credits                       credits left this month
//   yarn voice design ["<description>"]      three voice drafts into .voice-raw/ to listen to
//   yarn voice save <1|2|3> ["<name>"]       keeps a draft as the voice (src/games/adventure/stimme.json)
//   yarn voice try "<text>" [--kind turn]    one line with the voice, into .voice-raw/probe.mp3
//   yarn voice make [--dry] [--redo "<part of a line>"] [--all] [--no-tags]
//                                            records every line that has no recording yet
//
// `make` only records what is missing (a line changed → new hash → new file) and
// deletes recordings no line uses any more, so running it again costs nothing.
// It says how many characters (≈ credits) it needs first and stops if there are
// not enough left. The key comes from ELEVENLABS_API_KEY (export it in ~/.zshrc).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const API = "https://api.elevenlabs.io/v1";
const ADVENTURE = "src/games/adventure";
const STORIES = join(ADVENTURE, "stories");
const CONFIG = join(ADVENTURE, "stimme.json");
const RAW_DIR = ".voice-raw";
/** Small files (about 4 kB per second): the service worker keeps them all for offline play. */
const FORMAT = "mp3_22050_32";
const DEFAULT_MODEL = "eleven_v4";

/** The voice wanted: a children's sports coach who shows the way and cheers, slowly and clearly for 2-year-olds. */
const DEFAULT_DESCRIPTION =
  "A warm, cheerful young German woman around 30, a children's sports coach. Native standard German (Hochdeutsch) without accent. " +
  "Bright, friendly, smiling voice, full of energy and encouragement, but never shrill, loud or hectic. " +
  "Speaks slowly and very clearly with small pauses, like talking to a two-year-old. Close microphone, studio quality, no background noise.";

/** Said in the drafts, so they show how the voice gives a movement and cheers (100–1000 characters). */
const DESIGN_TEXT =
  "Ahoi! Ich bin Tapsi. Komm, wir suchen einen Schatz! Schau mal: Fuß hoch – und feste stampfen, so! " +
  "Jetzt du – stampf mit! Stampf, stampf, stampf! Super machst du das! Und jetzt ganz hoch strecken – noch ein bisschen höher! " +
  "Ja, genau so! Geschafft – du bist stark!";

/** How each kind of line is said: an audio tag in front of it (costs its characters too). */
const TAGS = {
  opening: "[curious]",
  situation: "[excited]",
  instruction: "[warmly]",
  turn: "[encouraging]",
  again: "[cheering]",
  more: "[encouraging]",
  praise: "[proud]",
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

// ---------- Arguments ----------

const [command, ...argv] = process.argv.slice(2);
const flags = new Set();
const values = {};
const rest = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--redo" || a === "--kind" || a === "--model") {
    if (i + 1 >= argv.length) fail(`${a} needs a value`);
    values[a.slice(2)] = argv[++i];
  } else if (a.startsWith("--")) flags.add(a.slice(2));
  else rest.push(a);
}

// ---------- API ----------

function apiKey() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) fail("ELEVENLABS_API_KEY is not set (make a key on elevenlabs.io → Developers → API Keys and export it in ~/.zshrc)");
  return key;
}

async function call(path, { body, query, soft = false } = {}) {
  const url = `${API}${path}${query ? `?${new URLSearchParams(query)}` : ""}`;
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: { "xi-api-key": apiKey(), ...(body ? { "content-type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (soft && !response.ok) return null;
  if (!response.ok) fail(`${path}: ${response.status} ${await response.text()}`);
  return response;
}

/** Characters used and allowed this month; null if the key may not read them (it needs "User: Read"). */
async function credits() {
  const response = await call("/user/subscription", { soft: true });
  if (!response) return null;
  const { character_count: used, character_limit: limit } = await response.json();
  return { used, limit, left: limit - used };
}

function readConfig() {
  if (!existsSync(CONFIG)) fail(`No voice yet: run "yarn voice design", listen, then "yarn voice save <1|2|3>"`);
  return JSON.parse(readFileSync(CONFIG, "utf8"));
}

/** The spoken text: the line with the tag of its kind in front. */
const spoken = (line) => (flags.has("no-tags") ? line.text : `${TAGS[line.kind]} ${line.text}`);

async function record(config, text, seed) {
  const response = await call(`/text-to-speech/${config.voice}`, {
    query: { output_format: FORMAT },
    body: { text, model_id: values.model ?? config.model, seed, voice_settings: { stability: 0.5, similarity_boost: 0.75 } },
  });
  return Buffer.from(await response.arrayBuffer());
}

// ---------- The lines ----------

const load = (path) => import(pathToFileURL(resolve(path)).href);
const { voiceId, spokenLines } = await load(join(ADVENTURE, "voiceId.ts"));
const { DEFAULT_TURN } = await load(join(STORIES, "story.ts"));

/** Every story with its lines and its stimme/ folder. */
async function stories() {
  const found = [];
  for (const entry of readdirSync(STORIES, { withFileTypes: true })) {
    const dir = join(STORIES, entry.name);
    if (!entry.isDirectory() || !existsSync(join(dir, "lines.ts"))) continue;
    const { OPENING_LINES, LINES } = await load(join(dir, "lines.ts"));
    found.push({ name: entry.name, folder: join(dir, "stimme"), lines: spokenLines(OPENING_LINES, LINES, DEFAULT_TURN) });
  }
  return found;
}

// ---------- Commands ----------

async function design() {
  const description = rest[0] ?? DEFAULT_DESCRIPTION;
  const response = await call("/text-to-voice/design", {
    body: { voice_description: description, model_id: "eleven_ttv_v3", text: DESIGN_TEXT },
  });
  const { previews } = await response.json();
  mkdirSync(RAW_DIR, { recursive: true });
  const drafts = previews.map((preview, i) => {
    const file = join(RAW_DIR, `entwurf-${i + 1}.mp3`);
    writeFileSync(file, Buffer.from(preview.audio_base_64, "base64"));
    console.log(`${i + 1}: ${file}`);
    return preview.generated_voice_id;
  });
  writeFileSync(join(RAW_DIR, "entwurf.json"), JSON.stringify({ description, drafts }, null, 2));
  console.log(`Listen, then: yarn voice save <1-${drafts.length}> "<name>"`);
}

async function save() {
  const file = join(RAW_DIR, "entwurf.json");
  if (!existsSync(file)) fail(`No drafts: run "yarn voice design" first`);
  const { description, drafts } = JSON.parse(readFileSync(file, "utf8"));
  const chosen = drafts[Number(rest[0]) - 1];
  if (!chosen) fail(`Which draft? 1-${drafts.length}`);
  const name = rest[1] ?? "Tapsi Coach";
  const response = await call("/text-to-voice", {
    body: { voice_name: name, voice_description: description, generated_voice_id: chosen, played_not_selected_voice_ids: drafts.filter((d) => d !== chosen) },
  });
  const { voice_id } = await response.json();
  writeFileSync(CONFIG, `${JSON.stringify({ voice: voice_id, name, model: DEFAULT_MODEL, description }, null, 2)}\n`);
  console.log(`Saved "${name}" (${voice_id}) in ${CONFIG}. Next: yarn voice try "Jetzt du – stampf mit!" or yarn voice make --dry`);
}

async function tryLine() {
  const text = rest[0];
  if (!text) fail('What should it say? yarn voice try "Jetzt du – stampf mit!"');
  const kind = values.kind ?? "turn";
  if (!TAGS[kind]) fail(`--kind is one of ${Object.keys(TAGS).join(", ")}`);
  mkdirSync(RAW_DIR, { recursive: true });
  const file = join(RAW_DIR, "probe.mp3");
  writeFileSync(file, await record(readConfig(), spoken({ text, kind }), 1));
  console.log(file);
}

async function make() {
  const config = flags.has("dry") ? null : readConfig();
  const todo = [];
  for (const story of await stories()) {
    const wanted = new Set(story.lines.map((line) => `${voiceId(line.text)}.mp3`));
    const orphans = existsSync(story.folder) ? readdirSync(story.folder).filter((f) => f.endsWith(".mp3") && !wanted.has(f)) : [];
    for (const line of story.lines) {
      const file = join(story.folder, `${voiceId(line.text)}.mp3`);
      const redo = flags.has("all") || (values.redo !== undefined && line.text.includes(values.redo));
      if (redo || !existsSync(file)) todo.push({ ...line, file, story });
    }
    if (orphans.length) {
      console.log(`${story.name}: ${orphans.length} recordings no line uses${flags.has("dry") ? " (would be deleted)" : " – deleted"}`);
      if (!flags.has("dry")) for (const f of orphans) rmSync(join(story.folder, f));
    }
  }
  const characters = todo.reduce((sum, line) => sum + spoken(line).length, 0);
  console.log(`${todo.length} lines to record, ${characters} characters (≈ credits)`);
  if (flags.has("dry")) {
    for (const line of todo) console.log(`  ${line.story.name}/${voiceId(line.text)}  ${spoken(line)}`);
    return;
  }
  if (!todo.length) return;
  const before = await credits();
  if (!before) console.log('The key may not read the credits ("User: Read" on elevenlabs.io), so they are not checked.');
  else if (before.left < characters) fail(`Only ${before.left} credits left this month, ${characters} needed`);
  for (const [i, line] of todo.entries()) {
    mkdirSync(line.story.folder, { recursive: true });
    writeFileSync(line.file, await record(config, spoken(line), Number.parseInt(voiceId(line.text), 16)));
    console.log(`${i + 1}/${todo.length}  ${line.text}`);
  }
  const after = await credits();
  if (before && after) console.log(`Used ${after.used - before.used} credits, ${after.left} left this month.`);
}

const COMMANDS = {
  credits: async () => {
    const left = await credits();
    if (!left) fail('The key may not read the credits: give it "User: Read" on elevenlabs.io → Developers → API Keys');
    console.log(`${left.left} of ${left.limit} credits left (${left.used} used)`);
  },
  design,
  save,
  try: tryLine,
  make,
};
if (!COMMANDS[command]) fail(`yarn voice ${Object.keys(COMMANDS).join(" | ")} – see scripts/elevenlabs-voice.mjs`);
await COMMANDS[command]();
