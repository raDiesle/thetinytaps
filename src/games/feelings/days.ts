// „Alltagssituationen“ told as days (user idea, November 2026): the scenes of feelings put together into one day of
// the little bear, from getting up to going to sleep, with a page of the story between two scenes that tells how the
// one leads to the next. Such a page only tells – a picture and a few sentences, no question, no cards – and looks
// like a page of a picture book, so it is never taken for a scene to choose in (`DayPage`). Every scene is in exactly
// one day (`feelings.test.ts`), and the menu numbers the days: Tag 1, Tag 2 …
//
// A page of the story is told in a way that fits whichever step of its scene was played before it: a scene asks
// another of its choices each time it comes (`FeelingsSettings.steps`), so a page never says how the scene before
// ended („Der Turm steht wieder“), only what comes next.

import { PROD } from "@/lib/buildInfo";
import type { Localized } from "@/lib/language";
import { bearImages, imageFor, storyImages } from "./images";
import { STORIES, type Story } from "./stories";

/** A page of the story between two scenes: its picture and what is told (in German; `days.<lang>.ts` hold the other languages). */
export interface StoryPage {
  /** Name of its picture in bilder/ (`tag1-1` …), see `dayImages`. */
  image: string;
  text: string;
}

/** One scene of a day, with the page of the story that leads to it. */
export interface DayScene {
  /** An id from `STORIES`. */
  story: string;
  /** Told before the scene: how the day goes on to it (before the first scene, the morning). */
  before: StoryPage;
  /**
   * How many of the scene's first beats the page already tells (where the place or what happens comes in both): the
   * scene leaves them unsaid after the page, so nothing is said twice in a row (`afterPage` in `rounds.ts`; user
   * feedback, November 2026). Checked in `feelings.test.ts`.
   */
  told?: number;
}

/** One day of the little bear: its scenes in the order of the day, and how it ends. */
export interface Day {
  id: string;
  /** On its card in the menu, beside „Tag 1“. */
  emoji: string;
  scenes: DayScene[];
  /** Told on the last page, the house at night (`NIGHT_IMAGE`): how the day ends. */
  end: string;
}

/**
 * A day's words in another language (`days.<lang>.ts`, by day id): its pages of the story in the order of its scenes,
 * and its end. `dayIn` in `localized.ts` lays them over the German.
 */
export interface DayText {
  /** One per scene, like `Day.scenes[i].before.text`. */
  pages: string[];
  /** Like `Day.end`. */
  end: string;
}

/** The last page of every day: the little bear's house at night. */
export const NIGHT_IMAGE = "tag-nacht";

/** The picture of the page before the `scene`-th scene of day `day` (both counted from 1): "tag1-1", "tag1-2" … */
export const dayImage = (day: number, scene: number) => `tag${day}-${scene}`;

const page = (day: number, scene: number, story: string, text: string, told?: number): DayScene => ({
  story,
  before: { image: dayImage(day, scene), text },
  ...(told ? { told } : {}),
});

export const DAYS: Day[] = [
  {
    // The user's own example: grandma leaves in the morning, the kindergarten, dinner, bed.
    id: "tag-1",
    emoji: "👵",
    scenes: [
      page(1, 1, "selbst-miss", "Guten Morgen! Oma Bär ist zu Besuch. Heute fährt sie wieder nach Hause.", 1),
      page(1, 2, "kita-grab", "Dann bringt der große Bär den kleinen Bären in den Kindergarten. Er freut sich auf den Fuchs."),
      page(1, 3, "kita-fall", "Danach rennen alle auf die Wiese und spielen Fangen."),
      page(1, 4, "selbst-broccoli", "Am Abend holt der große Bär den kleinen Bären ab. Der Fuchs darf mit zum Abendessen.", 1),
      page(1, 5, "zuhause-tired", "Nach dem Essen wird der Fuchs abgeholt. Für den kleinen Bären ist es Zeit fürs Bett."),
    ],
    end: "Der kleine Bär schläft tief und fest. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-2",
    emoji: "🦔",
    scenes: [
      page(2, 1, "zuhause-angry", "Guten Morgen! Heute ist Kindergarten. Der kleine Bär will sich ganz allein anziehen."),
      page(2, 2, "kita-bye", "Dann gehen der große Bär und der kleine Bär zusammen zum Kindergarten.", 1),
      page(2, 3, "kita-new", "Im Spielzimmer wartet der Fuchs schon auf ihn."),
      page(2, 4, "selbst-join", "Später gehen alle nach draußen in den Sandkasten."),
      page(2, 5, "selbst-leave", "Am Nachmittag spielt der kleine Bär auf dem Spielplatz. Da kommt der große Bär zum Abholen."),
      page(2, 6, "selbst-hairwash", "Zu Hause ist der kleine Bär voller Sand. Ab in die Badewanne!", 1),
    ],
    end: "Sauber und müde kuschelt sich der kleine Bär ins Bett. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-3",
    emoji: "❄️",
    scenes: [
      page(3, 1, "selbst-snow", "Guten Morgen! Der kleine Bär ist gerade aufgewacht. Er tapst ins Wohnzimmer."),
      page(3, 2, "selbst-cookie", "Nach dem Schnee kommt der Fuchs zum Aufwärmen. Es gibt Kekse.", 1),
      page(3, 3, "selbst-screen", "Danach dürfen die beiden eine Sendung schauen.", 1),
      page(3, 4, "selbst-night", "Am Abend geht der Fuchs nach Hause. Der kleine Bär schläft ganz schnell ein."),
    ],
    end: "Bis zum Morgen schläft der kleine Bär tief und fest. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-4",
    emoji: "🌧️",
    scenes: [
      page(4, 1, "selbst-bored", "Heute regnet es den ganzen Tag. Der Fuchs ist zu Besuch.", 1),
      page(4, 2, "selbst-shy", "Am Nachmittag geht der Fuchs nach Hause. Der kleine Bär spielt allein im Flur."),
      page(4, 3, "selbst-baby", "Der Besuch ist wieder weg. Da wacht das Bärenbaby auf.", 1),
      page(4, 4, "selbst-pancake", "Jetzt haben alle Hunger. Der große Bär macht Pfannkuchen.", 1),
      page(4, 5, "zuhause-scared", "Nach dem Essen wird es draußen dunkel. Der Regen wird immer stärker."),
    ],
    end: "Das Gewitter ist vorbei. Der kleine Bär schläft ein. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-5",
    emoji: "🩺",
    scenes: [
      page(5, 1, "selbst-vacuum", "Guten Morgen! Heute räumt der große Bär die Wohnung auf."),
      page(5, 2, "selbst-jacket", "Danach geht es zum Kinderarzt. Der kleine Bär will die Jacke allein anziehen.", 1),
      page(5, 3, "selbst-doctor", "Beim Kinderarzt sind sie jetzt dran.", 1),
      page(5, 4, "selbst-checkout", "Nach dem Arzt gehen sie einkaufen."),
      page(5, 5, "selbst-dog", "Auf dem Heimweg gehen sie durch den Park.", 1),
      page(5, 6, "zuhause-sad", "Zu Hause ist der kleine Bär müde von dem langen Tag."),
    ],
    end: "Am Abend kuschelt sich der kleine Bär ins Bett. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-6",
    emoji: "🎂",
    scenes: [
      page(6, 1, "zuhause-happy", "Guten Morgen! Heute hat der kleine Bär Geburtstag."),
      page(6, 2, "selbst-empathy", "Dann bringt der kleine Bär Luftballons in den Kindergarten. Einen für sich und einen für den Fuchs.", 1),
      page(6, 3, "selbst-loud", "Am Mittag feiert der ganze Kindergarten ein Fest.", 1),
      page(6, 4, "selbst-startle", "Am Nachmittag kommt der Fuchs zu ihm nach Hause. Es gibt Geburtstagskuchen.", 1),
      page(6, 5, "selbst-lost", "Der Fuchs darf heute bei ihm schlafen. Beide ziehen ihre Schlafanzüge an."),
    ],
    end: "Was für ein schöner Geburtstag! Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-7",
    emoji: "🧱",
    scenes: [
      page(7, 1, "kita-angry", "Guten Morgen! Im Kindergarten holt der kleine Bär die Bauklötze."),
      page(7, 2, "selbst-oops", "Danach spielt der kleine Bär weiter im Spielzimmer.", 1),
      page(7, 3, "kita-slide", "Nach dem Mittagessen gehen alle auf den Spielplatz."),
      page(7, 4, "kita-kick", "Danach spielen der kleine Bär und der Fuchs auf der Wiese.", 1),
    ],
    end: "Am Abend holt der große Bär ihn ab. Zu Hause schläft der kleine Bär schnell ein. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-8",
    emoji: "🧗",
    scenes: [
      page(8, 1, "kita-want", "Guten Morgen! Im Kindergarten spielen heute alle draußen."),
      page(8, 2, "kita-push", "Dann rennt der kleine Bär zur großen Wiese mit dem Baum.", 1),
      page(8, 3, "kita-stop", "Unter dem Baum ruhen sich der kleine Bär und der Fuchs aus."),
      page(8, 4, "selbst-proud", "Am Nachmittag kommt der große Bär. Zum Schluss klettern alle noch aufs Klettergerüst.", 1),
    ],
    end: "Zu Hause erzählt der kleine Bär, wie hoch er geklettert ist. Dann schläft er ein. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    // Tag 9 to Tag 15 tell the everyday scenes of alltag.ts (ideas C-37 to C-72); German only until translated.
    id: "tag-9",
    emoji: "🌅",
    scenes: [
      page(9, 1, "alltag-morning", "Guten Morgen! Draußen wird es hell. Der kleine Bär wacht auf. Heute ist Kindergarten.", 1),
      page(9, 2, "alltag-bluecup", "Danach tapst der kleine Bär in die Küche. Der große Bär deckt den Tisch."),
      page(9, 3, "alltag-sticky", "Dann bringt der große Bär den kleinen Bären in den Kindergarten. Dort malt der Fuchs schon am Tisch."),
      page(9, 4, "alltag-accident", "Nach dem Malen baut der Fuchs im Spielzimmer einen hohen Turm."),
      page(9, 5, "alltag-nap", "Nach dem Mittagessen legen sich alle zum Mittagsschlaf hin. Der Fuchs und der Igel schlafen schnell ein.", 1),
      page(9, 6, "alltag-pickup", "Nach dem Schlafen spielen alle im Spielzimmer. Bald kommen die Großen zum Abholen."),
    ],
    end: "Zu Hause erzählt der kleine Bär vom Kindergarten. Dann schläft er ein. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-10",
    emoji: "🎨",
    scenes: [
      page(10, 1, "alltag-myself", "Guten Morgen! Der kleine Bär und der große Bär frühstücken zusammen.", 1),
      page(10, 2, "alltag-laughed", "Nach dem Frühstück geht es los. Am Maltisch sitzen schon der Hase und der Waschbär."),
      page(10, 3, "alltag-hit", "Später spielen alle draußen im Sandkasten."),
      page(10, 4, "alltag-worn", "Am Nachmittag holt der große Bär ihn ab. Der Tag war lang."),
      page(10, 5, "alltag-teeth", "Nach dem Abendessen ist Zeit fürs Zähneputzen. Ab ins Badezimmer!"),
    ],
    end: "Mit sauberen Zähnen kuschelt sich der kleine Bär ins Bett. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-11",
    emoji: "✂️",
    scenes: [
      page(11, 1, "alltag-barber", "Guten Morgen! Die Haare vom kleinen Bären sind ganz lang. Darum geht es heute zum Friseur.", 1),
      page(11, 2, "alltag-supermarket", "Danach gehen sie einkaufen. Der kleine Bär trägt seinen Kuschelhasen."),
      page(11, 3, "alltag-envy", "Am Nachmittag fährt der kleine Bär draußen Roller. Da kommt der Fuchs."),
      page(11, 4, "alltag-pointing", "Danach hat der kleine Bär großen Hunger. Der große Bär macht den Kühlschrank auf."),
      page(11, 5, "alltag-bedtime", "Am Abend spielt der kleine Bär im Schlafanzug mit seiner Eisenbahn.", 1),
    ],
    end: "Nach der Geschichte schläft der kleine Bär ein. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-12",
    emoji: "🦋",
    scenes: [
      page(12, 1, "alltag-race", "Guten Morgen! Heute kommt der Fuchs zum Spielen in den Garten."),
      page(12, 2, "alltag-butterfly", "Danach gießen der kleine Bär und der Fuchs die Blumen."),
      page(12, 3, "alltag-farewell", "Am Abend klingelt es an der Tür. Das ist der Papa vom Fuchs.", 1),
      page(12, 4, "alltag-excited", "Danach packt der kleine Bär seinen Koffer. Morgen geht es ans Meer!", 1),
    ],
    end: "Endlich schläft der kleine Bär. Morgen geht es ans Meer. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-13",
    emoji: "🌊",
    scenes: [
      page(13, 1, "alltag-car", "Guten Morgen! Heute fahren alle zu Oma Bär. Sie wohnt am Meer.", 1),
      page(13, 2, "alltag-bee", "Bei Oma Bär scheint die Sonne. Der kleine Bär und der große Bär machen Picknick auf der Wiese.", 1),
      page(13, 3, "alltag-homesick", "Am Abend fährt der große Bär mit dem Baby nach Hause. Der kleine Bär schläft heute zum ersten Mal bei Oma.", 1),
    ],
    end: "Oma Bär deckt ihn gut zu. Morgen bauen sie Sandburgen am Meer. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-14",
    emoji: "🤧",
    scenes: [
      page(14, 1, "alltag-sick", "Guten Morgen! Der kleine Bär hat Schnupfen. Heute bleibt er zu Hause."),
      page(14, 2, "alltag-phone", "Am Vormittag geht es ihm schon besser. Er malt ein Bild für den großen Bären."),
      page(14, 3, "alltag-puzzle", "Nach dem Mittagessen holt der kleine Bär sein Puzzle mit den Bauernhoftieren.", 1),
      page(14, 4, "alltag-nappy", "Danach spielt der kleine Bär mit seinem roten Auto. Das Baby krabbelt zu ihm.", 1),
      page(14, 5, "alltag-paintbrush", "Am Abend malt der kleine Bär am Tisch. Das Baby will auch malen.", 1),
    ],
    end: "Der Schnupfen ist fast weg. Der kleine Bär schläft tief und fest. Gute Nacht! Der Tag ist vorbei.",
  },
  {
    id: "tag-15",
    emoji: "☔",
    scenes: [
      page(15, 1, "alltag-socks", "Guten Morgen! Es hat die ganze Nacht geregnet. Der kleine Bär und der Fuchs gehen draußen spazieren.", 1),
      page(15, 2, "alltag-lick", "Auf dem Heimweg geht der kleine Bär durch den Park. Da kommt eine Füchsin mit einem kleinen Hund.", 1),
      page(15, 3, "alltag-bath", "Am Abend kommt der Fuchs zu Besuch. Beide sind ganz schmutzig vom Regen. Ab in die Badewanne!", 1),
    ],
    end: "Danach wird der Fuchs abgeholt. Frisch gebadet schläft der kleine Bär ein. Gute Nacht! Der Tag ist vorbei.",
  },
];

/** The day's name on its card and under „Weiter“: „Tag 1“, „Tag 2“ … */
export const dayTitle = (day: Day): Localized => {
  const n = DAYS.indexOf(day) + 1;
  return { de: `Tag ${n}`, en: `Day ${n}`, zh: `第${n}天`, hi: `दिन ${n}`, es: `Día ${n}`, ar: `اليوم ${n}`, ru: `День ${n}` };
};

/** The day with this id, or the first. */
export const dayById = (id: string): Day => DAYS.find((d) => d.id === id) ?? DAYS[0];

/** The first picture of a story, where the page before it leads (and which its picture is drawn from). */
export const firstImage = (storyId: string): string => {
  const [place, id] = [storyId.slice(0, storyId.indexOf("-")), storyId.slice(storyId.indexOf("-") + 1)];
  return place === "zuhause" ? bearImages.feeling(id) : storyImages.problem(id);
};

/** Every picture a day's own pages show (not its scenes'). */
export const dayImages = (day: Day): string[] => [...day.scenes.map((s) => s.before.image), NIGHT_IMAGE];

/** The day's scenes as stories; a scene the built site leaves out (pictures still planned) is missing here. */
export const dayStories = (day: Day): Story[] => day.scenes.map((s) => STORIES.find((story) => story.id === s.story)).filter((s): s is Story => !!s);

/**
 * The days that can be played. The built site leaves out a day whose pages' pictures are not all made, or one of whose
 * scenes it leaves out, so players never see a placeholder or a gap in the story; the dev server shows them all.
 */
export const playableDays = (): Day[] => DAYS.filter((day) => !PROD || (dayStories(day).length === day.scenes.length && dayImages(day).every(imageFor)));

/** The day „Weiter“ brings after this one: the next, after the last the first. */
export function dayAfter(day: Day): Day {
  const days = playableDays();
  return days[(days.indexOf(day) + 1) % days.length] ?? day;
}
