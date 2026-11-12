// Records what the games say with ElevenLabs: a warm, cheerful coach voice for toddlers (Tapsi), one MP3 per
// line. Tapsi's lines in the Bewegungsabenteuer go into the story's stimme/ folder
// (src/games/adventure/stories/<story>/stimme/<hash of the text>.mp3), and the same for every translation of
// the lines (lines.<language>.ts → stimme/<language>/<language>-<hash>.mp3); the other games that are recorded
// (Zähne putzen, Kleine Abenteuer, Abstillen, Was gehört zum Tier?, Gefühle, Schatten finden, Was gehört zusammen?,
// Kettenreaktion, Aufs Töpfchen, Socken-Paare, Buchstaben & Zahlen, and what every game says: good night and the question at a level's end) list their lines in every language in
// src/content/recordedLines.ts, into the game's own stimme/ folder the same way. src/lib/voice.ts plays them;
// a line without a recording stays silent.
//
//   bun run voice credits                       credits left this month
//   bun run voice design ["<description>"]      three voice drafts into .voice-raw/ to listen to
//   bun run voice save <1|2|3> ["<name>"]       keeps a draft as the voice (src/games/adventure/stimme.json)
//   bun run voice try "<text>" [--kind turn] [--lang en]   one line with the voice, into .voice-raw/probe.mp3
//   --voice <id> (try, make)                    another voice for this run only, e.g. the clone; stimme.json stays
//   bun run voice clone "<name>" <file.mp3>...  an Instant Voice Clone from samples, prints its id for --voice
//   bun run voice make [--dry] [--lang de,en] [--only zaehne,alle-spiele] [--redo "<part of a line>"] [--kind again] [--all] [--no-tags] [--parallel 4]
//                                            records every line that has no recording yet, in all
//                                            languages or those of --lang, of every story and game or
//                                            those of --only (and again: lines with that text part, of
//                                            that kind, or all); --model eleven_v4_turbo costs half,
//                                            --no-tags leaves out how a line is said; English first, then
//                                            the order of RECORDING_ORDER, --parallel at once
//
// `make` only records what is missing (a line changed → new hash → new file) and
// deletes recordings no line uses any more, so running it again costs nothing.
// It says how many characters (≈ credits) it needs first and stops if there are
// not enough left. The key comes from ELEVENLABS_API_KEY (export it in ~/.zshrc).
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { plugin } from "bun";

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

/**
 * The order `make` records the languages in: English, then by speakers in the world (Mandarin, Hindi, Spanish, Arabic –
 * Ethnologue 2025, first and second language), then German before Russian (user decision, November 2026: German is the
 * app's own language), then the rest (Italian).
 */
const RECORDING_ORDER = ["en", "zh", "hi", "es", "ar", "de", "ru"];

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
  calm: "[softly]",
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
  if (a === "--redo" || a === "--kind" || a === "--model" || a === "--lang" || a === "--only" || a === "--parallel" || a === "--voice") {
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

/** How often a request is tried again when the service turns it away (429: too many at once) or fails on its side (5xx). */
const RETRIES = 5;

/**
 * How long a request may go without its answer before the run stops. A line takes a second or two; a request the Mac
 * slept through (lid closed, November 2026) never answered at all, while the service had made – and charged – the line.
 * So the limit is far above any real answer, and a request that reaches it, or loses its connection, is never sent
 * again: it may already be paid. The run stops instead; started again, it goes on where it stopped.
 */
const ANSWER_LIMIT_MS = 10 * 60_000;

async function call(path, { body, query, soft = false } = {}) {
  const url = `${API}${path}${query ? `?${new URLSearchParams(query)}` : ""}`;
  let response;
  for (let attempt = 0; ; attempt++) {
    response = await fetch(url, {
      method: body ? "POST" : "GET",
      headers: { "xi-api-key": apiKey(), ...(body ? { "content-type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(ANSWER_LIMIT_MS),
    }).catch((error) => ({ ok: false, status: 0, text: async () => `no answer (${error}) – the line may have been charged; run again to go on` }));
    if (response.ok || attempt >= RETRIES || !(response.status === 429 || response.status >= 500)) break;
    await new Promise((done) => setTimeout(done, 2000 * 2 ** attempt));
  }
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

/**
 * Credits a character really costs with the turbo model, as measured in October 2026: 0.096 (10,399 characters for
 * 995), 0.078 (6,398 for 498), 0.102 (34,408 for 3,506) and, in November 2026, 0.109 (26,425 for 2,881), 0.085 (15,528 for 1,327) and 0.189
 * (103,890 English characters for 19,607, 7 November 2026 – nearly twice the month before, so measure again after a big
 * run and raise this when a run costs more). The service's own `character_cost_multiplier` (0.5) once stopped a run that
 * would have fit, so the check before a run goes by this, a little above the latest measurement.
 */
const CREDITS_PER_CHARACTER = 0.2;

function readConfig() {
  if (!existsSync(CONFIG)) fail(`No voice yet: run "bun run voice design", listen, then "bun run voice save <1|2|3>"`);
  const config = JSON.parse(readFileSync(CONFIG, "utf8"));
  // --voice records with another voice for this run only, e.g. a clone of Tapsi in a second account whose credits
  // are used while the first account's are spent (a designed voice can't be shared outside its own workspace).
  return values.voice ? { ...config, voice: values.voice } : config;
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
// The games' data imports like the app's (`…?glob`) and reads translations loaded by language, as in the tests.
plugin((await load("tools/appPlugin.ts")).appPlugin());
const { loadTexts, TEXTS_LANGUAGES } = await load("src/content/texts/index.ts");
await Promise.all(TEXTS_LANGUAGES.map(loadTexts));
const { recordingName, voiceId } = await load("src/lib/voiceName.ts");
const { spokenLines } = await load(join(ADVENTURE, "voiceId.ts"));
const { RECORDED_GAMES, RECORDED_LANGUAGES } = await load("src/content/recordedLines.ts");
const { DEFAULT_TURN, translateLines } = await load(join(STORIES, "story.ts"));
/** The languages asked for with --lang, or null for all. */
const LANGUAGES = values.lang ? new Set(values.lang.split(",")) : null;

/** The stories and games asked for with --only (by name, "treasureIsland", "zaehne"), or null for all. */
const ONLY = values.only ? new Set(values.only.split(",")) : null;

/** Every story and recorded game in every language: its lines and the folder of their recordings. */
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
  for (const game of RECORDED_GAMES) {
    for (const language of RECORDED_LANGUAGES) {
      const lines = game.lines(language);
      if (!lines.length) continue;
      const folder = language === "de" ? game.folder : join(game.folder, language);
      found.push({ name: language === "de" ? game.name : `${game.name}/${language}`, language, folder, lines });
    }
  }
  return found.filter((story) => (!LANGUAGES || LANGUAGES.has(story.language)) && (!ONLY || ONLY.has(story.name.split("/")[0])));
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

/**
 * Makes an Instant Voice Clone of Tapsi from recordings (`clone "<name>" <file.mp3>...`) in the key's account and prints
 * its id for `--voice`. A voice made with Voice Design stays in its own workspace, so a second account whose credits are
 * used meanwhile needs a clone of it (November 2026). It sounds close, not the same: use it for whole languages only.
 */
async function clone() {
  const [name, ...files] = rest;
  if (!name || files.length === 0) fail('bun run voice clone "Tapsi Coach (Klon)" <file.mp3>...');
  const form = new FormData();
  form.append("name", name);
  form.append("remove_background_noise", "false");
  form.append("description", "Clone of Tapsi Coach (Voice Design, first account), made from its own recordings.");
  for (const file of files) form.append("files", new Blob([readFileSync(file)], { type: "audio/mpeg" }), file.split("/").pop());
  const response = await fetch(`${API}/voices/add`, { method: "POST", headers: { "xi-api-key": apiKey() }, body: form });
  if (!response.ok) fail(`/voices/add: ${response.status} ${await response.text()}`);
  const { voice_id } = await response.json();
  console.log(`Cloned "${name}" (${voice_id}). Next: bun run voice try "Look, a tower!" --lang en --voice ${voice_id}`);
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
  // Keeps the Mac from falling asleep by itself while recording (`caffeinate` ends with this process). Closing the lid
  // still puts it to sleep: let a run finish first.
  if (process.platform === "darwin") spawn("caffeinate", ["-i", "-w", String(process.pid)], { stdio: "ignore" }).unref();
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
  // English first, then the other languages by their speakers in the world, German before Russian (user decisions,
  // November 2026): a run stopped halfway (credits, network) leaves the languages most players hear done.
  const rank = (language) => (RECORDING_ORDER.includes(language) ? RECORDING_ORDER.indexOf(language) : RECORDING_ORDER.length);
  todo.sort((a, b) => rank(a.story.language) - rank(b.story.language));
  const characters = todo.reduce((sum, line) => sum + spoken(line).length, 0);
  const byStory = Object.entries(Object.groupBy(todo, (line) => line.story.name)).map(
    ([name, lines]) => `${name} ${lines.reduce((sum, line) => sum + spoken(line).length, 0)}`,
  );
  console.log(
    `${todo.length} lines to record, ${characters} characters, ≈ ${Math.ceil(characters * CREDITS_PER_CHARACTER)} credits${byStory.length > 1 ? ` (characters: ${byStory.join(", ")})` : ""}`,
  );
  if (flags.has("dry")) {
    for (const line of todo) console.log(`  ${line.story.name}/${recordingName(line.text, line.story.language)}  ${spoken(line)}`);
    return;
  }
  if (!todo.length) return;
  const needed = Math.ceil(characters * CREDITS_PER_CHARACTER);
  const before = await credits();
  if (!before) console.log('The key may not read the credits ("User: Read" on elevenlabs.io), so they are not checked.');
  else if (before.left < needed) fail(`Only ${before.left} credits left this month, ${needed} needed`);
  // A few requests at once (`--parallel`, default 4), taken from the list in its order, so a language is done before
  // the next one is far along; each file is written as it comes, so a run stopped halfway goes on where it stopped.
  // The subscription allows 5 requests at once for the whole account: run one recording at a time (two runs side by
  // side, 4 + 3, ran out of retries on „concurrent_limit_exceeded“ in November 2026) and keep --parallel at 5 or less.
  let next = 0;
  let made = 0;
  const worker = async () => {
    while (next < todo.length) {
      const line = todo[next++];
      mkdirSync(line.story.folder, { recursive: true });
      writeFileSync(line.file, await record(config, spoken(line), Number.parseInt(voiceId(line.text), 16), line.story.language));
      console.log(`${++made}/${todo.length}  ${line.story.name}  ${line.text}`);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Number(values.parallel ?? 4)) }, worker));
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
  clone,
  try: tryLine,
  make,
};
if (!COMMANDS[command]) fail(`bun run voice ${Object.keys(COMMANDS).join(" | ")} – see scripts/elevenlabs-voice.mjs`);
await COMMANDS[command]();
