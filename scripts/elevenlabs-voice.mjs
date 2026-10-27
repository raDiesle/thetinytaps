// Records what Tapsi says in the Bewegungsabenteuer with ElevenLabs: a warm, cheerful
// coach voice for toddlers, one MP3 per line in the story's stimme/ folder
// (src/games/adventure/stories/<story>/stimme/<hash of the text>.mp3), and the same
// for every translation of the lines (lines.<language>.ts → stimme/<language>/<language>-<hash>.mp3).
// The game plays them (src/games/adventure/voice.ts) and falls back to the browser's
// voice for a line that has no recording.
//
//   bun run voice credits                       credits left this month
//   bun run voice design ["<description>"]      three voice drafts into .voice-raw/ to listen to
//   bun run voice save <1|2|3> ["<name>"]       keeps a draft as the voice (src/games/adventure/stimme.json)
//   bun run voice try "<text>" [--kind turn] [--lang en]   one line with the voice, into .voice-raw/probe.mp3
//   bun run voice make [--dry] [--lang de,en] [--redo "<part of a line>"] [--kind again] [--all] [--no-tags]
//                                            records every line that has no recording yet, in all
//                                            languages or those of --lang (and again: lines with
//                                            that text part, of that kind, or all); --model eleven_v4_turbo
//                                            costs half, --no-tags leaves out how a line is said
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
/** Always the turbo model: half the credits of eleven_v4, so the monthly credits reach for every language. */
const DEFAULT_MODEL = "eleven_v4_turbo";

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
  // Not [cheering]: that adds a "Juhu!", "Jo!" or even a cheering crowd before the line.
  again: "[enthusiastically]",
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
  if (a === "--redo" || a === "--kind" || a === "--model" || a === "--lang") {
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

/** Credits per character of a model (eleven_v4_turbo costs half), 1 if the service does not say. */
async function rate(model) {
  const response = await call("/models", { soft: true });
  const found = response && (await response.json()).find((m) => m.model_id === model);
  return found?.model_rates?.character_cost_multiplier ?? 1;
}

function readConfig() {
  if (!existsSync(CONFIG)) fail(`No voice yet: run "bun run voice design", listen, then "bun run voice save <1|2|3>"`);
  return JSON.parse(readFileSync(CONFIG, "utf8"));
}

/** The spoken text: the line with the tag of its kind in front. */
const spoken = (line) => (flags.has("no-tags") ? line.text : `${TAGS[line.kind]} ${line.text}`);

/** Records `text` in `language` ("de", "en", …); the language is given so a short line is not read as German. */
async function record(config, text, seed, language) {
  const response = await call(`/text-to-speech/${config.voice}`, {
    query: { output_format: FORMAT },
    body: {
      text,
      model_id: values.model ?? config.model,
      language_code: language,
      seed,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    },
  });
  return Buffer.from(await response.arrayBuffer());
}

// ---------- The lines ----------

const load = (path) => import(pathToFileURL(resolve(path)).href);
const { recordingName, spokenLines, voiceId } = await load(join(ADVENTURE, "voiceId.ts"));
const { DEFAULT_TURN, translateLines } = await load(join(STORIES, "story.ts"));
/** The languages asked for with --lang, or null for all. */
const LANGUAGES = values.lang ? new Set(values.lang.split(",")) : null;

/** Every story in every language: its lines and the folder of their recordings. */
async function stories() {
  const found = [];
  for (const entry of readdirSync(STORIES, { withFileTypes: true })) {
    const dir = join(STORIES, entry.name);
    if (!entry.isDirectory() || !existsSync(join(dir, "lines.ts"))) continue;
    const { OPENING_LINES, LINES } = await load(join(dir, "lines.ts"));
    found.push({ name: entry.name, language: "de", folder: join(dir, "stimme"), lines: spokenLines(OPENING_LINES, LINES, DEFAULT_TURN) });
    for (const file of readdirSync(dir).sort()) {
      const language = /^lines\.([a-z]{2})\.ts$/.exec(file)?.[1];
      if (!language) continue;
      const { TRANSLATION } = await load(join(dir, file));
      const { opening, lines } = translateLines(OPENING_LINES, LINES, TRANSLATION);
      found.push({
        name: `${entry.name}/${language}`,
        language,
        folder: join(dir, "stimme", language),
        lines: spokenLines(opening, lines, TRANSLATION.defaultTurn),
      });
    }
  }
  return found.filter((story) => !LANGUAGES || LANGUAGES.has(story.language));
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
  console.log(`Listen, then: bun run voice save <1-${drafts.length}> "<name>"`);
}

async function save() {
  const file = join(RAW_DIR, "entwurf.json");
  if (!existsSync(file)) fail(`No drafts: run "bun run voice design" first`);
  const { description, drafts } = JSON.parse(readFileSync(file, "utf8"));
  const chosen = drafts[Number(rest[0]) - 1];
  if (!chosen) fail(`Which draft? 1-${drafts.length}`);
  const name = rest[1] ?? "Tapsi Coach";
  const response = await call("/text-to-voice", {
    body: { voice_name: name, voice_description: description, generated_voice_id: chosen, played_not_selected_voice_ids: drafts.filter((d) => d !== chosen) },
  });
  const { voice_id } = await response.json();
  writeFileSync(CONFIG, `${JSON.stringify({ voice: voice_id, name, model: DEFAULT_MODEL, description }, null, 2)}\n`);
  console.log(`Saved "${name}" (${voice_id}) in ${CONFIG}. Next: bun run voice try "Jetzt du – stampf mit!" or bun run voice make --dry`);
}

async function tryLine() {
  const text = rest[0];
  if (!text) fail('What should it say? bun run voice try "Jetzt du – stampf mit!"');
  const kind = values.kind ?? "turn";
  if (!TAGS[kind]) fail(`--kind is one of ${Object.keys(TAGS).join(", ")}`);
  mkdirSync(RAW_DIR, { recursive: true });
  const file = join(RAW_DIR, "probe.mp3");
  writeFileSync(file, await record(readConfig(), spoken({ text, kind }), 1, values.lang ?? "de"));
  console.log(file);
}

async function make() {
  const config = flags.has("dry") ? null : readConfig();
  const todo = [];
  for (const story of await stories()) {
    const wanted = new Set(story.lines.map((line) => `${recordingName(line.text, story.language)}.mp3`));
    const orphans = existsSync(story.folder) ? readdirSync(story.folder).filter((f) => f.endsWith(".mp3") && !wanted.has(f)) : [];
    for (const line of story.lines) {
      const file = join(story.folder, `${recordingName(line.text, story.language)}.mp3`);
      const redo = flags.has("all") || (values.redo !== undefined && line.text.includes(values.redo)) || values.kind === line.kind;
      if (redo || !existsSync(file)) todo.push({ ...line, file, story });
    }
    if (orphans.length) {
      console.log(`${story.name}: ${orphans.length} recordings no line uses${flags.has("dry") ? " (would be deleted)" : " – deleted"}`);
      if (!flags.has("dry")) for (const f of orphans) rmSync(join(story.folder, f));
    }
  }
  const characters = todo.reduce((sum, line) => sum + spoken(line).length, 0);
  const byStory = Object.entries(Object.groupBy(todo, (line) => line.story.name)).map(
    ([name, lines]) => `${name} ${lines.reduce((sum, line) => sum + spoken(line).length, 0)}`,
  );
  console.log(`${todo.length} lines to record, ${characters} characters (≈ credits)${byStory.length > 1 ? `: ${byStory.join(", ")}` : ""}`);
  if (flags.has("dry")) {
    for (const line of todo) console.log(`  ${line.story.name}/${recordingName(line.text, line.story.language)}  ${spoken(line)}`);
    return;
  }
  if (!todo.length) return;
  const needed = Math.ceil(characters * (await rate(values.model ?? config.model)));
  const before = await credits();
  if (!before) console.log('The key may not read the credits ("User: Read" on elevenlabs.io), so they are not checked.');
  else if (before.left < needed) fail(`Only ${before.left} credits left this month, ${needed} needed`);
  for (const [i, line] of todo.entries()) {
    mkdirSync(line.story.folder, { recursive: true });
    writeFileSync(line.file, await record(config, spoken(line), Number.parseInt(voiceId(line.text), 16), line.story.language));
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
if (!COMMANDS[command]) fail(`bun run voice ${Object.keys(COMMANDS).join(" | ")} – see scripts/elevenlabs-voice.mjs`);
await COMMANDS[command]();
