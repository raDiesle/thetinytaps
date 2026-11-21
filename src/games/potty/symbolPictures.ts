import type { QueuedPicture } from "@/content/pictureQueue";

// The small pictures of the grown-ups' strips at the bottom of „Aufs Töpfchen“ and „Zähne putzen“ (user request,
// 21 November 2026: the emoji in the row of steps and on the buttons looked poor). Cut out, four to a sheet; each is
// one plain thing that still reads at the size of a fingertip. They leave the queue in the commit that adds them.

const DATE = "2026-11-21";

/** What every symbol's prompt ends with, so all of them read as one set of icons. */
const ICON =
  "Drawn as a small icon: one simple, bold, chunky shape centred with empty room on every side, seen straight from the front, nothing else in the picture, no shadow on the ground, no white outline, sticker edge or halo round it – its dark plum ink line is its outer edge.";

const symbol = (folder: "potty" | "teeth", id: string, use: string, what: string): QueuedPicture => ({
  id: `symbol-${folder}-${id}`,
  file: `src/games/${folder}/bilder/symbole/${id}.webp`,
  use,
  prompt: `${what} ${ICON}`,
  aspect: "1:1",
  size: "256",
  transparent: true,
  date: DATE,
});

/** The symbols waiting to be made. */
export const SYMBOL_PICTURE_QUEUE: QueuedPicture[] = [
  symbol("potty", "essen", "Töpfchen: Schritt Essen und Trinken", "A round plate of spaghetti with a fork in it, a small glass of water beside the plate."),
  symbol(
    "potty",
    "pipi",
    "Töpfchen: Pipi (Schritte, Knöpfe)",
    "One big shiny light-blue water drop, round at the bottom and pointed at the top, with a small white shine.",
  ),
  symbol(
    "potty",
    "kaka",
    "Töpfchen: Kaka (Schritte, Knöpfe)",
    "A cute brown swirl of poop, three soft rounded coils with a little curl on top, two dot eyes and a friendly smile.",
  ),
  symbol(
    "potty",
    "rufen",
    "Töpfchen: Schritt Mama und Papa rufen",
    "A red and yellow toy megaphone pointing to the right, with three short curved sound lines coming out of it.",
  ),
  symbol(
    "potty",
    "bad",
    "Töpfchen: Schritt ins Bad gehen",
    "A light wooden door standing a little open, with a round brass knob, light blue tiles seen through the gap.",
  ),
  symbol(
    "potty",
    "hose",
    "Töpfchen: Schritte Hose runter und hoch",
    "A pair of children's blue denim trousers lying flat, with a brown button and two pockets.",
  ),
  symbol(
    "potty",
    "toepfchen",
    "Töpfchen: Schritt Hinsetzen, Knopf „nichts“",
    "An empty children's potty in turquoise plastic with a rounded rim and a little splash guard at the front, seen from the front and a little above.",
  ),
  symbol("potty", "klopapier", "Töpfchen: Schritt Abwischen", "A roll of soft white toilet paper with a short piece hanging down from the front."),
  symbol(
    "potty",
    "klo",
    "Töpfchen: Schritt Abziehen",
    "A white toilet with its seat down and the cistern behind it, a big round flush button on top of the cistern.",
  ),
  symbol("potty", "seife", "Töpfchen: Schritt Hände waschen", "A pink bar of soap with a few round soap bubbles rising from it."),
  symbol("potty", "party", "Töpfchen: Schritt Party", "Three round balloons, red, yellow and blue, tied together with curly strings."),
  symbol("potty", "stern", "Töpfchen: Schritt Sterne der Woche", "One plump golden star with rounded points and a small shine."),
  symbol("potty", "spielen", "Töpfchen: Schritt Spielen (wenn nichts kam)", "Three wooden toy blocks stacked into a little tower, red, yellow and green."),
  symbol(
    "teeth",
    "bonbon",
    "Zähne putzen: Anfang der Leiste (Süßes, Geschichte)",
    "A wrapped sweet: a round pink and white striped candy in shiny wrapping twisted at both ends.",
  ),
  symbol(
    "teeth",
    "zahnbuerste",
    "Zähne putzen: Zahnbürste, die auf der Leiste mitläuft",
    "A child's toothbrush lying horizontally with its head on the right: a green rubber grip, a white handle, white and light-blue bristle tufts pointing up with a pea-sized dab of white and blue striped toothpaste on them.",
  ),
  symbol(
    "teeth",
    "zahn",
    "Zähne putzen: Ziel am Ende der Leiste",
    "One happy, shiny clean white tooth with two little roots, two dot eyes, a big smile and two small sparkle shines on it.",
  ),
];
