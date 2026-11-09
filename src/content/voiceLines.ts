// Every line the games say (in German, or in another language for recordedLines.ts), gathered from their own data:
// the list of what still has to be recorded with ElevenLabs, now that the browser's voice no longer speaks (root
// CLAUDE.md). Shown on /management/ (VoiceList, loaded only there, since it pulls in the
// data of every game). Read from the data itself, so it stays true when lines change; the
// few lines written inline in a component are copied here, and voiceLines.test.ts checks
// that they are still in that file.

import { AGAIN_ONLY, AGAIN_OR_NEXT } from "@/components/GameEnd";
import { languageFor } from "@/content/languages";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { ANIMALS, ANIMAL_TEXTS, GIFT_TEXTS, giverOf, GIVERS } from "@/games/animals/content";
import { GIFTS } from "@/games/animals/gifts";
import { GROW_TEXTS, GROWTHS } from "@/games/animals/growth";
import { HOMES } from "@/games/animals/homes";
import { KIND_ORDER } from "@/games/animals/levels";
import { KIND_QUESTIONS } from "@/games/animals/RoundTopic";
import { PAIRS, TOGETHER_TEXTS } from "@/games/together/pairs";
import { STORIES, texts as elevatorTexts } from "@/games/elevator/content";
import { FILMS } from "@/games/elevator/film/films";
import type { Film } from "@/games/elevator/film/types";
import { TRAIL_LEVELS } from "@/games/elevator/trail/levels";
import type { Station, Way } from "@/games/elevator/trail/types";
import { FEELINGS } from "@/games/feelings/bear";
import { DAYS } from "@/games/feelings/days";
import { SITUATIONS } from "@/games/feelings/kita";
import { SELF_SITUATIONS } from "@/games/feelings/selbst";
import { comfortsIn, dayIn, feelingIn, situationIn } from "@/games/feelings/localized";
import { MOOD_SAID } from "@/games/feelings/mood";
import { NEEDS_SAID } from "@/games/feelings/needs";
import { PRAISE as FEELINGS_PRAISE } from "@/games/feelings/shared";
import type { Beat } from "@/games/feelings/story";
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
import { PICTURE_LINES, SOON_LINE, TURN_LINES } from "@/games/timer/voice";
import { STOMP_INVITE } from "@/games/letters/MovePlay";
import { type Localized, pick } from "@/lib/language";
import { voiceId } from "@/lib/voiceName";
import goodNightFiles from "../components/stimme/*.mp3?glob";
import animalsFiles from "../games/animals/stimme/*.mp3?glob";
import elevatorFiles from "../games/elevator/stimme/*.mp3?glob";
import feelingsFiles from "../games/feelings/stimme/*.mp3?glob";
import lettersFiles from "../games/letters/stimme/*.mp3?glob";
import marblesFiles from "../games/marbles/stimme/*.mp3?glob";
import pottyFiles from "../games/potty/stimme/*.mp3?glob";
import shadowsFiles from "../games/shadows/stimme/*.mp3?glob";
import socksFiles from "../games/socks/stimme/*.mp3?glob";
import teethFiles from "../games/teeth/stimme/*.mp3?glob";
import togetherFiles from "../games/together/stimme/*.mp3?glob";

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
  /**
   * Set when the game's lines are parked (user decision): why, for the management page. A parked game is never
   * recorded – not in RECORDED_GAMES, so `bun run voice make` passes it by – until the user orders exactly its
   * recording, and its lines count neither as open nor in the credits still needed.
   */
  parked?: string;
}

/** A line copied from a component, where it is written inline: voiceLines.test.ts checks it is still there. */
export interface InlineLine {
  text: string;
  /** Its translations, written there too, where the component says it in other languages. */
  translations?: Omit<Localized, "de">;
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
    {
      text: "Der Korb ist voll!",
      translations: { en: "The basket is full!", zh: "篮子满啦！", hi: "टोकरी भर गई!", es: "¡La cesta está llena!", ar: "السلة ممتلئة!", ru: "Корзина полна!" },
      file: "src/games/marbles/TrackLevel.tsx",
    },
    {
      text: "Bumm! Alles umgefallen!",
      translations: {
        en: "Boom! Everything fell over!",
        zh: "砰！全倒啦！",
        hi: "धड़ाम! सब गिर गया!",
        es: "¡Bum! ¡Todo se cayó!",
        ar: "بوم! سقط كل شيء!",
        ru: "Бум! Всё упало!",
      },
      file: "src/games/marbles/ToppleLevel.tsx",
    },
    {
      text: "Hatschi!",
      translations: { en: "Achoo!", zh: "阿嚏！", hi: "आछू!", es: "¡Achís!", ar: "أتشو!", ru: "Апчхи!" },
      file: "src/games/marbles/SneezeLevel.tsx",
    },
    {
      text: "Achtung, fertig – los!",
      translations: {
        en: "Ready, steady, go!",
        zh: "预备——出发！",
        hi: "एक, दो, तीन – चलो!",
        es: "¡A la una, a las dos y a las tres!",
        ar: "استعداد، انطلاق!",
        ru: "На старт, внимание, марш!",
      },
      file: "src/games/marbles/TrackLevel.tsx",
    },
    {
      text: "Der Schneemann ist fertig!",
      translations: {
        en: "The snowman is ready!",
        zh: "雪人堆好啦！",
        hi: "स्नोमैन तैयार है!",
        es: "¡El muñeco de nieve está listo!",
        ar: "رجل الثلج جاهز!",
        ru: "Снеговик готов!",
      },
      file: "src/games/marbles/snowTrack.tsx",
    },
    {
      text: "Alle sind im Becken!",
      translations: {
        en: "Everyone is in the pool!",
        zh: "大家都到水池里啦！",
        hi: "सब पानी में पहुँच गए!",
        es: "¡Todos están en la piscina!",
        ar: "الجميع في المسبح!",
        ru: "Все в бассейне!",
      },
      file: "src/games/marbles/slideTrack.tsx",
    },
    {
      text: "Voll! Der Kran hebt alles hoch!",
      translations: {
        en: "Full! The crane lifts everything up!",
        zh: "满啦！吊车把东西全吊起来啦！",
        hi: "भर गया! क्रेन सब कुछ ऊपर उठाती है!",
        es: "¡Lleno! ¡La grúa lo levanta todo!",
        ar: "امتلأ! الرافعة ترفع كل شيء!",
        ru: "Полный! Кран поднимает всё наверх!",
      },
      file: "src/games/marbles/siteTrack.tsx",
    },
    {
      text: "Alle sind auf dem Mond! Sternschnuppen!",
      translations: {
        en: "Everyone is on the moon! Shooting stars!",
        zh: "大家都到月亮上啦！流星来啦！",
        hi: "सब चाँद पर पहुँच गए! टूटते तारे!",
        es: "¡Todos están en la luna! ¡Estrellas fugaces!",
        ar: "الجميع على القمر! شهب!",
        ru: "Все на луне! Падающие звёзды!",
      },
      file: "src/games/marbles/spaceTrack.tsx",
    },
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
    { text: "Noch einmal schlafen", file: "src/games/rewards/PlanSheet.tsx" },
    { text: "Heute ist es so weit:", file: "src/games/rewards/PlanScreen.tsx" },
  ],
};

/** The lines written inline in a game's components, in `language` (German where they have no translation). */
const inline = (href: string, language: TargetLanguageId = "de") =>
  INLINE_LINES[href].map((l) => (language === "de" ? l.text : (l.translations?.[language] ?? l.text)));

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

function letters(language: TargetLanguageId): VoiceGroup[] {
  const de = languageFor(language).pack;
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
    {
      label: "Mitmachen mit Zahlen",
      lines: [pick(STOMP_INVITE, language)],
      note: "„Hüpf mit!“ und „Klatsch mit!“ kommen von den Tu-Wörtern; das Stampfen hat keins.",
    },
    { label: "Lob", lines: once(de.praise) },
    { label: "Zahlwörter beim Zählen", lines: once(de.numberWords.map((n) => `${n}!`)) },
    {
      label: "Zahl mit Dingen",
      lines: once([de.zero.sentence, ...de.countables.flatMap((c) => de.numberWords.slice(1).map((_, i) => de.countSentence(i + 1, c)))]),
      built: "Zahl und Ding: „drei Äpfel!“",
    },
  ];
}

function shadows(language: TargetLanguageId): VoiceGroup[] {
  const texts = pick(SHADOW_TEXTS, language);
  return [
    { label: "Wer sucht seinen Schatten", lines: once(SHADOW_ITEMS.map(texts.search)), built: "Satz mit dem Namen jedes Bilds" },
    { label: "Schatten gefunden", lines: once(SHADOW_ITEMS.map(texts.found)), built: "Satz mit dem Namen jedes Bilds" },
    { label: "Falscher Schatten: wer das ist", lines: once(SHADOW_ITEMS.map(texts.thatIs)), built: "„Das ist …“ mit dem Namen" },
  ];
}

function animals(language: TargetLanguageId): VoiceGroup[] {
  const texts = pick(ANIMAL_TEXTS, language);
  const gifts = pick(GIFT_TEXTS, language);
  const grow = pick(GROW_TEXTS, language);
  const peek = pick(SHADOW_TEXTS, language);
  const fed = ANIMALS.filter((a) => a.food);
  const housed = ANIMALS.filter((a) => a.home);
  const residents = Object.keys(HOMES).flatMap((id) => ANIMALS.find((a) => a.home === id) ?? []);
  return [
    {
      label: "Art der Runde",
      lines: once(KIND_ORDER.map((kind) => pick(KIND_QUESTIONS[kind], language))),
      note: "Einmal, wenn die Art der Runde wechselt (Z-24).",
    },
    { label: "Füttern: Hunger", lines: once(fed.map(texts.hungry)), built: "Satz mit dem Tier" },
    { label: "Füttern: Frage", lines: once(fed.map(texts.whatEats)), built: "Satz mit dem Tier", note: "Gleich nach „… hat Hunger!“ (Z-24)." },
    { label: "Füttern: richtig", lines: once(fed.map((a) => texts.yummy(a, a.food!))), built: "Satz mit Tier und Futter" },
    { label: "Füttern: falsch", lines: once(fed.map(texts.yuck)), built: "Satz mit dem Tier" },
    { label: "Was gibt uns das Tier?: Frage", lines: once(GIVERS.map(gifts.whatGives)), built: "Satz mit dem Tier" },
    { label: "Was gibt uns das Tier?: richtig", lines: once(GIVERS.map((a) => gifts.gives(a, GIFTS[a.gives!]))), built: "Satz mit Tier und Gabe" },
    {
      label: "Was gibt uns das Tier?: falsch, von wem es kommt",
      lines: once(Object.values(GIFTS).map((g) => gifts.comesFrom(g, giverOf(g)))),
      built: "Satz mit der Gabe und dem Tier, von dem sie kommt",
    },
    { label: "Was wird aus mir?: Frage", lines: once(GROWTHS.map(grow.whatBecomes)), built: "Satz mit dem Kleinen" },
    { label: "Was wird aus mir?: richtig", lines: once(GROWTHS.map(grow.becomes)), built: "Satz mit dem Kleinen und was daraus wird" },
    {
      label: "Was wird aus mir?: falsch, woraus es kommt",
      lines: once(GROWTHS.map(grow.comesFrom)),
      built: "Satz mit dem Großen und woraus es kommt",
    },
    { label: "Zuhause: Frage", lines: once(housed.map(texts.whereLives)), built: "Satz mit dem Tier" },
    { label: "Zuhause: richtig", lines: once(housed.map((a) => texts.movedIn(a, HOMES[a.home!]))), built: "Satz mit Tier und Zuhause" },
    { label: "Zuhause: falsch, wer da wohnt", lines: once(residents.map(texts.livesHere)), built: "Satz mit dem Tier, das dort wohnt" },
    {
      label: "Wer schaut da raus?",
      lines: once([peek.peek, ...PEEK_ITEMS.map(peek.there), ...PEEK_ITEMS.map(peek.thatIs)]),
    },
  ];
}

function timer(language: TargetLanguageId): VoiceGroup[] {
  const said = (line: Localized) => pick(line, language);
  const pictures = Object.values(PICTURE_LINES);
  return [
    { label: "Am Anfang eines Bildes", lines: once(pictures.map((p) => said(p.start))) },
    { label: "Kurz vor dem Ende", lines: [said(SOON_LINE)], note: "Zur Glocke, eine Minute vor dem Ende oder im letzten Fünftel einer kurzen Zeit (H-49)." },
    { label: "Am Ende eines Bildes", lines: once(pictures.map((p) => said(p.end))) },
    {
      label: "Abwechseln und Tennis",
      lines: once(TURN_LINES.map(said)),
      note: "„Wer fängt an?“, während die Lampen auslosen, dann wer anfängt; „Tauschen! …“ bei jedem Wechsel.",
    },
  ];
}

function together(language: TargetLanguageId): VoiceGroup[] {
  const texts = pick(TOGETHER_TEXTS, language);
  return [
    // Z-25: the question is the pair's wish, what the one above wants to do, never naming the partner.
    { label: "Was jemand vorhat", lines: once(PAIRS.map(texts.question)), built: "„Die Blume hat Durst.“ – ein Satz je Paar, ohne das Gegenstück zu nennen" },
    { label: "Richtig", lines: once(PAIRS.map(texts.right)), built: "Satz mit beiden" },
    { label: "Falsch: wozu es gehört", lines: once(PAIRS.map(texts.belongs)), built: "Satz mit dem Gewählten und wozu es gehört" },
  ];
}

function feelings(language: TargetLanguageId): VoiceGroup[] {
  const comforts = comfortsIn(language);
  const feelings = FEELINGS.map((f) => feelingIn(f, language));
  const situations = SITUATIONS.map((s) => situationIn(s, language));
  const selfSituations = SELF_SITUATIONS.map((s) => situationIn(s, language));
  const days = DAYS.map((d) => dayIn(d, language));
  return [
    // „Wie geht's dir?“ and „Was brauche ich?“ are games of their own in the book, but share this game's recordings
    // (stimme/).
    { label: "Wie geht's dir?", lines: once(MOOD_SAID.map((line) => pick(line, language))) },
    { label: "Was brauche ich?", lines: once(NEEDS_SAID.map((line) => pick(line, language))) },
    { label: "Zu Hause: Fragen", lines: once(feelings.flatMap((f) => f.questions)) },
    { label: "Zu Hause: liebe Dinge", lines: once(feelings.flatMap((f) => f.comforts.map((c) => comforts[c].narration))) },
    { label: "Zu Hause: nicht so gute Ideen", lines: once(feelings.flatMap((f) => f.instead.map((i) => i.answer))) },
    { label: "Zu Hause: Ende", lines: once(feelings.map((f) => `${f.end.narration} ${f.end.line}`)) },
    { label: "Kindergarten: Geschichte", lines: once(situations.flatMap((s) => [...s.intro, ...s.steps.flatMap((st) => st.beats), ...s.outro].map(beat))) },
    { label: "Kindergarten: Fragen", lines: once(situations.flatMap((s) => s.steps.map((st) => st.question))) },
    { label: "Kindergarten: nicht so gute Ideen", lines: once(situations.flatMap((s) => s.steps.map((st) => st.instead.answer))) },
    {
      label: "Mehr Gefühle: Geschichte",
      lines: once(selfSituations.flatMap((s) => [...s.intro, ...s.steps.flatMap((st) => st.beats), ...s.outro].map(beat))),
    },
    { label: "Mehr Gefühle: Fragen", lines: once(selfSituations.flatMap((s) => s.steps.map((st) => st.question))) },
    { label: "Mehr Gefühle: nicht so gute Ideen", lines: once(selfSituations.flatMap((s) => s.steps.map((st) => st.instead.answer))) },
    { label: "Lob", lines: once(pick(FEELINGS_PRAISE, language)) },
    { label: "Tagesgeschichten", lines: once(days.flatMap((d) => [...d.scenes.map((s) => s.before.text), d.end])) },
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

function marbles(language: TargetLanguageId): VoiceGroup[] {
  const machines = [buildMachine, buildKitchen, buildGarden, buildBuilding, buildCircus, buildSpace, buildLight, buildBath, buildFarm, buildNight, buildTidy];
  const events = [...machines.flatMap((build) => build().events), ...buildWater().stretches.flatMap((s) => s.events)];
  return [
    { label: "Erster Satz jedes Levels", lines: once(Object.values(MARBLE_LEVELS).map((l) => l.intro[language])) },
    { label: "Sätze der Maschinen", lines: once([...events.map((e) => e.say?.[language]), ...inline("/kettenreaktion/", language)]) },
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

function potty(language: TargetLanguageId): VoiceGroup[] {
  const texts = pick(POTTY_TEXTS, language);
  const name = pick(TAPSI.name, language);
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

function socks(language: TargetLanguageId): VoiceGroup[] {
  const texts = pick(SOCK_TEXTS, language);
  return [{ label: "Alle Sätze", lines: once([texts.start, ...texts.pair, texts.done]) }];
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
    {
      label: "Countdown: wie oft noch schlafen",
      lines: ["Noch einmal schlafen, dann", "Noch 2-mal schlafen, dann", "Noch 3-mal schlafen, dann", "Noch 4-mal schlafen, dann", "Noch 5-mal schlafen, dann"],
      built: "Wie oft noch schlafen, danach der Name des großen Tages (Geburtstag, Urlaub, Oma und Opa)",
    },
  ];
}

/** The German recordings of the games in src/content/recordedLines.ts, by file name (the hash of the line). */
const RECORDED = new Set(
  [
    goodNightFiles,
    elevatorFiles,
    teethFiles,
    animalsFiles,
    feelingsFiles,
    shadowsFiles,
    togetherFiles,
    marblesFiles,
    pottyFiles,
    socksFiles,
    lettersFiles,
  ].flatMap((files) => Object.keys(files).map((file) => file.slice(file.lastIndexOf("/") + 1, -4))),
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
 * Every game that speaks, with all it says in `language` (German for the list on /management/), recorded or not
 * (stillToRecord leaves out what is). In another language a game says what it has no translation of in German, so
 * those lines come out German here too; recordedLines.ts leaves them out. Lebendige Bilder, Zähne putzen, Kleine
 * Abenteuer, the Belohnungstafel and the lines of all games are listed in German only (the first is
 * parked, recordedLines.ts reads the others' translations itself). Bewegungsabenteuer is not here: its stories list
 * Tapsi's lines themselves.
 */
export function voiceLines(language: TargetLanguageId = "de"): VoiceGame[] {
  return [
    {
      href: "/bilder/",
      groups: scenes(),
      parked:
        "Geparkt (Entscheidung November 2026): Die Bilder antworten mit ihren Geräuschen, die gut passen, und erzählen nichts. Aufgenommen würden höchstens Sätze, die Menschen im Bild selbst sagen („Hallo, hier ist der Kinderarzt!“) – und auch die nur, wenn du es ausdrücklich für Lebendige Bilder sagst.",
    },
    { href: "/buchstaben/", groups: letters(language) },
    { href: "/schatten/", groups: shadows(language) },
    { href: "/tiere/", groups: animals(language) },
    { href: "/zusammen/", groups: together(language) },
    { href: "/gefuehle/", groups: feelings(language) },
    { href: "/kleine-abenteuer/", groups: elevator() },
    { href: "/kettenreaktion/", groups: marbles(language) },
    { href: "/zaehne/", groups: teeth() },
    { href: "/toepfchen/", groups: potty(language) },
    { href: "/socken/", groups: socks(language) },
    { href: "/belohnungstafel/", groups: rewards() },
    { href: "/timer/", groups: timer(language) },
    {
      href: "",
      groups: [
        {
          label: "Wenn die Spielzeit vorbei ist (alle Spiele)",
          lines: ["Gute Nacht! Die Spielzeit ist vorbei."],
          note: "Hier ist die Liste der einzige Ort des Satzes: der Gute-Nacht-Bildschirm (GameShell) spielt bis zur Aufnahme nur das Schlaflied.",
        },
        {
          label: "Am Ende eines Levels (alle Spiele)",
          lines: [AGAIN_OR_NEXT.de, AGAIN_ONLY.de],
          note: "Kurz nachdem „Nochmal“ und „Weiter“ erscheinen (GameEnd, A-24); „Nochmal?“ allein, wo es kein „Weiter“ gibt.",
        },
      ],
    },
  ];
}
