// Every German line the games say, gathered from their own data: the list of what still has
// to be recorded with ElevenLabs, now that the browser's voice no longer speaks (root
// CLAUDE.md). Shown on /management/ (VoiceList, loaded only there, since it pulls in the
// data of every game). Read from the data itself, so it stays true when lines change; the
// few lines written inline in a component are copied here, and voiceLines.test.ts checks
// that they are still in that file.

import { de } from "@/content/de";
import { ANIMALS, ANIMAL_TEXTS } from "@/games/animals/content";
import { HOMES } from "@/games/animals/homes";
import { STORIES, texts as elevatorTexts } from "@/games/elevator/content";
import { FILMS } from "@/games/elevator/film/films";
import type { Film } from "@/games/elevator/film/types";
import { TRAIL_LEVELS } from "@/games/elevator/trail/levels";
import type { Station, Way } from "@/games/elevator/trail/types";
import { COMFORTS, FEELINGS } from "@/games/feelings/bear";
import { SITUATIONS } from "@/games/feelings/kita";
import { MOOD_ANSWER, MOOD_QUESTION } from "@/games/feelings/mood";
import { PRAISE as FEELINGS_PRAISE } from "@/games/feelings/shared";
import type { Beat } from "@/games/feelings/story";
import { NUDGES, SAYS, STATION_TEXTS } from "@/games/loud/texts";
import { buildBath } from "@/games/marbles/bath";
import { buildBuilding } from "@/games/marbles/building";
import { buildCircus } from "@/games/marbles/circus";
import { LEVEL_TEXTS as MARBLE_LEVELS } from "@/games/marbles/content";
import { buildFarm } from "@/games/marbles/farm";
import { buildGarden } from "@/games/marbles/garden";
import { buildKitchen } from "@/games/marbles/kitchen";
import { buildLight } from "@/games/marbles/light";
import { buildMachine } from "@/games/marbles/machine";
import { buildNight } from "@/games/marbles/night";
import { buildSpace } from "@/games/marbles/space";
import { buildTidy } from "@/games/marbles/tidy";
import { buildWater } from "@/games/marbles/water";
import { POTTY_TEXTS, STEPS as POTTY_STEPS, TAPSI, WAIT_SCENES } from "@/games/potty/content";
import { ACTIVITIES, REWARDS, TASKS } from "@/games/rewards/catalog";
import { SCENES } from "@/games/scenes";
import { SURPRISES } from "@/games/scenes/hideout";
import { SCENE_PHRASES } from "@/games/scenes/phrases";
import { ROADS } from "@/games/scenes/roads";
import { ITEMS as SHADOW_ITEMS, PEEK_ITEMS, SHADOW_TEXTS } from "@/games/shadows/content";
import { SOCK_TEXTS } from "@/games/socks/content";
import { DAYTIME } from "@/games/teeth/daytime";
import { STEPS as TEETH_STEPS } from "@/games/teeth/steps";
import { DONE_SAY, PRELUDE, TIDY_SAY } from "@/games/teeth/TeethPlay";
import { voiceId } from "@/lib/voiceName";
import goodNightFiles from "../components/stimme/*.mp3?glob";
import elevatorFiles from "../games/elevator/stimme/*.mp3?glob";
import teethFiles from "../games/teeth/stimme/*.mp3?glob";

/** Lines of one kind in a game, each once. */
export interface VoiceGroup {
  /** What they are, for the grown-up: „Satz beim Antippen eines Dings“. */
  label: string;
  lines: string[];
  /**
   * Set when the game builds these sentences at play time from parts (a name put into „Wo ist …?“):
   * how. The list holds every whole sentence that can come out.
   */
  built?: string;
  /** What else to know before recording them. */
  note?: string;
}

/** One game and everything it says. */
export interface VoiceGame {
  /** The game's route, as in `CATEGORIES` (src/content/games.ts). */
  href: string;
  groups: VoiceGroup[];
}

/** A line copied from a component, where it is written inline: voiceLines.test.ts checks it is still there. */
export interface InlineLine {
  text: string;
  /** The file it is written in, from the repository root. */
  file: string;
}

/** Each text once, in the order first said, without empty ones. */
const once = (texts: (string | undefined)[]) => [...new Set(texts.filter((t): t is string => !!t?.trim()).map((t) => t.trim()))];

/** A feelings beat is said as its narration and its line together. */
const beat = (b: Beat) => [b.narration, b.line].filter(Boolean).join(" ");

/** Lines written inline in components, by game route. */
export const INLINE_LINES: Record<string, InlineLine[]> = {
  "/kettenreaktion/": [
    { text: "Der Korb ist voll!", file: "src/games/marbles/TrackLevel.tsx" },
    { text: "Bumm! Alles umgefallen!", file: "src/games/marbles/ToppleLevel.tsx" },
    { text: "Hatschi!", file: "src/games/marbles/SneezeLevel.tsx" },
  ],
  "/belohnungstafel/": [
    { text: "Geschafft! Hurra!", file: "src/games/rewards/BoardScreen.tsx" },
    { text: "Geschafft! Jetzt gibt es:", file: "src/games/rewards/BoardScreen.tsx" },
    { text: "Super! Der Tag ist voll!", file: "src/games/rewards/BoardScreen.tsx" },
    { text: "Super!", file: "src/games/rewards/BoardScreen.tsx" },
    { text: "Alles geschafft! Hurra!", file: "src/games/rewards/PlanScreen.tsx" },
    { text: "Super! Jetzt:", file: "src/games/rewards/PlanScreen.tsx" },
    { text: "Schon fertig:", file: "src/games/rewards/PlanScreen.tsx" },
    { text: "Hier kommt rein, was fertig ist.", file: "src/games/rewards/PlanScreen.tsx" },
    { text: "Noch einmal schlafen:", file: "src/games/rewards/PlanScreen.tsx" },
  ],
};

const inline = (href: string) => INLINE_LINES[href].map((l) => l.text);

function scenes(): VoiceGroup[] {
  const words = SCENE_PHRASES.de;
  const items = SCENES.flatMap((s) => s.items);
  const traits = Object.values(words.traits);
  const places = (id: string) => words.places[id];
  return [
    { label: "Sätze beim Antippen eines Dings (Entdecken, Ausmalen)", lines: once(items.flatMap((i) => i.sentences)) },
    { label: "Kettenreaktionen", lines: once(SCENES.flatMap((s) => s.chains ?? []).flatMap((c) => c.steps.map((st) => st.sentence))) },
    { label: "Suchen: Frage", lines: once(items.map(words.whereIs)), built: "„Wo ist …?“ mit dem Namen jedes Dings" },
    { label: "Suchen: gefunden", lines: once(items.map(words.hereIs)), built: "„Das ist …!“ mit dem Namen, davor ein Lob" },
    { label: "Lob", lines: once(words.praise) },
    { label: "Fragen: Frage", lines: once(traits.flatMap((t) => [t.question, t.part])) },
    {
      label: "Fragen: richtig",
      lines: once(SCENES.flatMap((s) => s.items).flatMap((i) => (i.traits ?? []).map((t) => words.traits[t].praise(i)))),
      built: "„… ist rot!“ mit dem Namen jedes Dings, das die Eigenschaft hat",
    },
    { label: "Überraschung im Versteck", lines: once(SURPRISES.map((s) => words.peekaboo(s.found.de))), built: "„Guck-guck!“ und wer drin ist" },
    {
      label: "Fahrzeuge zwischen den Bildern",
      lines: once(
        ROADS.flatMap((road) => {
          const item = SCENES.find((s) => s.id === road.from)?.items.find((i) => i.id === road.item);
          if (!item) return [];
          return [words.drivesTo(item, places(road.to)), words.comesFrom(item, places(road.from)), words.backHome(item, places(road.from))];
        }),
      ),
      built: "Name des Fahrzeugs und Ort",
    },
    { label: "Am Ende", lines: once([words.allColoured, words.allFound, words.goodNight]) },
  ];
}

function letters(): VoiceGroup[] {
  const words = de.letters.flatMap((l) => l.words.map((w) => ({ l, w })));
  return [
    { label: "Buchstabe mit Wort", lines: once(words.map(({ l, w }) => de.letterSentence(l, w))), built: "Buchstabe, „wie“ und ein Wort dazu" },
    { label: "Buchstabe allein", lines: once(de.letters.map((l) => `${l.spoken}!`)) },
    {
      label: "Wort allein",
      lines: once([...words.map(({ w }) => w.word), ...de.colors.map((c) => c.word), ...de.actions.map((a) => a.word)].map((w) => `${w}!`)),
    },
    { label: "Suchen: Frage", lines: once(de.letters.map(de.findPrompt)), built: "„Wo ist das …?“ mit dem Buchstaben" },
    { label: "Mitmachen", lines: once(de.actions.map(de.joinIn)) },
    { label: "Lob", lines: once(de.praise) },
    { label: "Zahlwörter beim Zählen", lines: once(de.numberWords.map((n) => `${n}!`)) },
    {
      label: "Zahl mit Dingen",
      lines: once([de.zero.sentence, ...de.countables.flatMap((c) => de.numberWords.slice(1).map((_, i) => de.countSentence(i + 1, c)))]),
      built: "Zahl und Ding: „drei Äpfel!“",
    },
  ];
}

function shadows(): VoiceGroup[] {
  const texts = SHADOW_TEXTS.de;
  return [
    { label: "Wer sucht seinen Schatten", lines: once(SHADOW_ITEMS.map(texts.search)), built: "Satz mit dem Namen jedes Bilds" },
    { label: "Schatten gefunden", lines: once(SHADOW_ITEMS.map(texts.found)), built: "Satz mit dem Namen jedes Bilds" },
    { label: "Falscher Schatten: wer das ist", lines: once(SHADOW_ITEMS.map(texts.thatIs)), built: "„Das ist …“ mit dem Namen" },
  ];
}

function animals(): VoiceGroup[] {
  const texts = ANIMAL_TEXTS.de;
  const fed = ANIMALS.filter((a) => a.food);
  const housed = ANIMALS.filter((a) => a.home);
  const residents = Object.keys(HOMES).flatMap((id) => ANIMALS.find((a) => a.home === id) ?? []);
  return [
    { label: "Füttern: Hunger", lines: once(fed.map(texts.hungry)), built: "Satz mit dem Tier" },
    { label: "Füttern: richtig", lines: once(fed.map((a) => texts.yummy(a, a.food!))), built: "Satz mit Tier und Futter" },
    { label: "Füttern: falsch", lines: once(fed.map(texts.yuck)), built: "Satz mit dem Tier" },
    { label: "Zuhause: Frage", lines: once(housed.map(texts.whereLives)), built: "Satz mit dem Tier" },
    { label: "Zuhause: richtig", lines: once(housed.map((a) => texts.movedIn(a, HOMES[a.home!]))), built: "Satz mit Tier und Zuhause" },
    { label: "Zuhause: falsch, wer da wohnt", lines: once(residents.map(texts.livesHere)), built: "Satz mit dem Tier, das dort wohnt" },
    {
      label: "Wer schaut da raus? (dritte Karte)",
      lines: once([SHADOW_TEXTS.de.peek, ...PEEK_ITEMS.map(SHADOW_TEXTS.de.there), ...PEEK_ITEMS.map(SHADOW_TEXTS.de.thatIs)]),
    },
  ];
}

function feelings(): VoiceGroup[] {
  return [
    { label: "Wie geht's dir?", lines: once([MOOD_QUESTION.de, MOOD_ANSWER.de]) },
    { label: "Zu Hause: Fragen", lines: once(FEELINGS.flatMap((f) => f.questions)) },
    { label: "Zu Hause: liebe Dinge", lines: once(FEELINGS.flatMap((f) => f.comforts.map((c) => COMFORTS[c].narration))) },
    { label: "Zu Hause: nicht so gute Ideen", lines: once(FEELINGS.flatMap((f) => f.instead.map((i) => i.answer))) },
    { label: "Zu Hause: Ende", lines: once(FEELINGS.map((f) => `${f.end.narration} ${f.end.line}`)) },
    { label: "Kindergarten: Geschichte", lines: once(SITUATIONS.flatMap((s) => [...s.intro, ...s.steps.flatMap((st) => st.beats), ...s.outro].map(beat))) },
    { label: "Kindergarten: Fragen", lines: once(SITUATIONS.flatMap((s) => s.steps.map((st) => st.question))) },
    { label: "Kindergarten: nicht so gute Ideen", lines: once(SITUATIONS.flatMap((s) => s.steps.map((st) => st.instead.answer))) },
    { label: "Lob", lines: once(FEELINGS_PRAISE.de) },
  ];
}

function elevator(): VoiceGroup[] {
  const house = STORIES.flatMap((story) => [
    story.need.say,
    ...story.steps.flatMap((step) => [step.ask, step.done, ...(step.tasks ?? []).flatMap((task) => [task.wish?.ask, task.done])]),
  ]);
  const trail: (string | undefined)[] = [];
  const station = (s: Station) => {
    trail.push(s.ask, s.done);
    if (s.kind === "obstacle" && s.befriends) trail.push(s.befriends.say);
  };
  const way = (w: Way) => {
    trail.push(w.say);
    w.stations.forEach(station);
  };
  for (const level of TRAIL_LEVELS) {
    trail.push(level.away.say, level.finale.say);
    for (const s of level.stations) {
      if (s.kind === "fork") {
        trail.push(s.ask);
        s.ways.forEach(way);
      } else station(s);
    }
  }
  return [
    { label: "Aufzug-Geschichten", lines: once(house) },
    { label: "Weg-Abenteuer", lines: once(trail) },
    { label: "Filme", lines: once(FILMS.flatMap(filmLines)) },
    { label: "In allen Geschichten", lines: once(Object.values(elevatorTexts)) },
  ];
}

/** Everything a film says, along every way the child's picks can take it. */
function filmLines(film: Film): (string | undefined)[] {
  const lines: (string | undefined)[] = [film.end];
  const walk = (picks: string[]) => {
    const scenes = film.scenes(picks);
    for (const scene of scenes) lines.push(...scene.beats.flatMap((b) => [b.ask, b.say]));
    // A choice not picked yet (the last scene's): go on along each of its options.
    const choice = scenes.at(-1)?.choice;
    if (!choice || scenes.filter((s) => s.choice).length <= picks.length) return;
    lines.push(choice.ask);
    for (const option of choice.options) {
      lines.push(option.say);
      walk([...picks, option.id]);
    }
  };
  walk([]);
  return lines;
}

function marbles(): VoiceGroup[] {
  const machines = [buildMachine, buildKitchen, buildGarden, buildBuilding, buildCircus, buildSpace, buildLight, buildBath, buildFarm, buildNight, buildTidy];
  const events = [...machines.flatMap((build) => build().events), ...buildWater().stretches.flatMap((s) => s.events)];
  return [
    { label: "Erster Satz jedes Levels", lines: once(Object.values(MARBLE_LEVELS).map((l) => l.intro.de)) },
    { label: "Sätze der Maschinen", lines: once([...events.map((e) => e.say?.de), ...inline("/kettenreaktion/")]) },
  ];
}

function teeth(): VoiceGroup[] {
  const daytimes = Object.values(DAYTIME);
  return [
    { label: "Vor dem Putzen", lines: once([...daytimes.flatMap((d) => [d.hello, d.grow]), ...Object.values(PRELUDE).map((p) => p.cue?.de)]) },
    { label: "Am Ende", lines: once([DONE_SAY.de, TIDY_SAY.de, ...daytimes.map((d) => d.after)]) },
    { label: "Putzschritte", lines: once(TEETH_STEPS.map((s) => s.cue)), note: "Nur wenn das Lied nicht lädt: sonst singt das Lied die Schritte." },
  ];
}

function potty(): VoiceGroup[] {
  const texts = POTTY_TEXTS.de;
  const name = TAPSI.name.de;
  const which = ["pipi", "kaka", "both", "unsure"] as const;
  return [
    {
      label: "Schritte",
      lines: once(POTTY_STEPS.flatMap((s) => which.map((w) => texts.steps[s.id](name, w)))),
      built: "Satz mit Tapsis Namen, je nach Pipi oder Kaka",
    },
    { label: "Gedanken beim Warten", lines: once(WAIT_SCENES.map((s) => texts.scenes[s.id])) },
    { label: "Für die Großen", lines: once([texts.finish, texts.askSaid, texts.nothing, texts.star, ...Object.values(texts.said)]) },
  ];
}

function socks(): VoiceGroup[] {
  const texts = SOCK_TEXTS.de;
  return [{ label: "Alle Sätze", lines: once([texts.start, ...texts.pair, texts.done]) }];
}

function loud(): VoiceGroup[] {
  return [
    { label: "Löwe und Maus", lines: once([...SAYS.lion.de, ...SAYS.mouse.de]) },
    { label: "Ermuntern", lines: once(Object.values(NUDGES).flatMap((n) => [n.mic.de, n.tap.de])) },
    { label: "Pusten", lines: once(Object.values(STATION_TEXTS).flatMap((s) => [s.intro.mic.de, s.intro.tap.de, s.cheer.de])) },
  ];
}

function rewards(): VoiceGroup[] {
  return [
    {
      label: "Namen der Aufgaben, Schritte und Belohnungen",
      lines: once([...TASKS, ...ACTIVITIES, ...REWARDS].map((t) => t.label.de)),
      note: "Eigene Namen, die Eltern eintippen, lassen sich nicht vorher aufnehmen.",
    },
    {
      label: "Sätze auf der Tafel und im Tagesplan",
      lines: once([...inline("/belohnungstafel/"), "Noch 2-mal schlafen:", "Noch 3-mal schlafen:"]),
      built: "Ein Satzanfang, danach der Name einer Aufgabe oder Belohnung",
    },
  ];
}

/** The German recordings of the games in src/content/recordedLines.ts, by file name (the hash of the line). */
const RECORDED = new Set(
  [goodNightFiles, elevatorFiles, teethFiles].flatMap((files) => Object.keys(files).map((file) => file.slice(file.lastIndexOf("/") + 1, -4))),
);

/** The games and groups of `games` with only the lines that have no German recording yet. */
export const stillToRecord = (games: VoiceGame[]): VoiceGame[] =>
  games.flatMap((game) => {
    const groups = game.groups.flatMap((g) => {
      const lines = g.lines.filter((line) => !RECORDED.has(voiceId(line)));
      return lines.length ? [{ ...g, lines }] : [];
    });
    return groups.length ? [{ ...game, groups }] : [];
  });

/**
 * Every game that speaks, with all it says in German, recorded or not (stillToRecord leaves out what is).
 * Bewegungsabenteuer is not here: its stories list Tapsi's lines themselves.
 */
export function voiceLines(): VoiceGame[] {
  return [
    { href: "/bilder/", groups: scenes() },
    { href: "/buchstaben/", groups: letters() },
    { href: "/schatten/", groups: shadows() },
    { href: "/tiere/", groups: animals() },
    { href: "/gefuehle/", groups: feelings() },
    { href: "/kleine-abenteuer/", groups: elevator() },
    { href: "/kettenreaktion/", groups: marbles() },
    { href: "/zaehne/", groups: teeth() },
    { href: "/toepfchen/", groups: potty() },
    { href: "/socken/", groups: socks() },
    { href: "/laut-leise/", groups: loud() },
    { href: "/belohnungstafel/", groups: rewards() },
    {
      href: "",
      groups: [
        {
          label: "Wenn die Spielzeit vorbei ist (alle Spiele)",
          lines: ["Gute Nacht! Die Spielzeit ist vorbei."],
          note: "Hier ist die Liste der einzige Ort des Satzes: der Gute-Nacht-Bildschirm (GameShell) spielt bis zur Aufnahme nur das Schlaflied.",
        },
      ],
    },
  ];
}
