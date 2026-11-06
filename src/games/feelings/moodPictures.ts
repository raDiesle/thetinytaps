import type { QueuedPicture } from "@/content/pictureQueue";

// The cards of „Wie geht's dir?“ and „Was brauche ich?“ (user feedback, November 2026), as the picture queue takes them
// until they are made (`/bild-erzeugen`, never made on your own); a made one leaves the list, its prompt kept in
// `bilder/README.md`. Always the same little bear in his clothes, alone (only the hug needs a grown-up, dressed too),
// close and big in front of a calm background, in a moment that brings the feeling or does what he needs; drawn from
// `baer-sad-gut` as the only `--ref`, so he stays the same. Plain data, with no picture imports, so the management page
// that lists the queue doesn't load the game's pictures.

const DIR = "src/games/feelings/bilder";

/** One card, drawn from the little bear at home. */
const card = (id: string, use: string, prompt: string): QueuedPicture => ({
  id,
  file: `${DIR}/${id}.webp`,
  use,
  prompt,
  aspect: "4:3",
  size: "800x600",
  quality: 65,
  ref: [`${DIR}/baer-sad-gut.webp`],
  date: "2026-11-06",
});

/** Every card of the two games still to make. */
export const MOOD_PICTURE_QUEUE: QueuedPicture[] = [
  card(
    "gefuehl-froh",
    "Gefühle, „Wie geht's dir?“: Karte „Fröhlich – ein Geburtstagskuchen vor ihm“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is the only character: no grown-up, nobody else, no hands or arms come in from the edges. He is close to the front and big, filling most of the picture; the background is simple and calm, only what the moment needs, so nothing draws the eye away from him. His face and body show the feeling clearly – the feeling is the biggest thing in the picture. He is happy: a birthday cake with three lit candles stands on a small table right in front of him; he beams at it, laughing with his mouth wide open, eyes squeezed into happy arcs, both arms up. He does not blow, nothing flies about.",
  ),
  card(
    "gefuehl-stolz",
    "Gefühle, „Wie geht's dir?“: Karte „Stolz – neben dem Turm, den er gebaut hat“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is the only character: no grown-up, nobody else, no hands or arms come in from the edges. He is close to the front and big, filling most of the picture; the background is simple and calm, only what the moment needs, so nothing draws the eye away from him. His face and body show the feeling clearly – the feeling is the biggest thing in the picture. He is proud: beside him stands a tall tower of colourful wooden blocks he has just built, as tall as he is; he stands tall, chest out, chin up, paws on his hips, a proud closed-mouth smile.",
  ),
  card(
    "gefuehl-aufgeregt",
    "Gefühle, „Wie geht's dir?“: Karte „Aufgeregt – wartet an der offenen Haustür“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is the only character: no grown-up, nobody else, no hands or arms come in from the edges. He is close to the front and big, filling most of the picture; the background is simple and calm, only what the moment needs, so nothing draws the eye away from him. His face and body show the feeling clearly – the feeling is the biggest thing in the picture. He is excited: he stands at the wide open front door of a house, a bright garden path outside, waiting for someone who has not come yet – nobody else is there; he is up on his tiptoes, eyes wide, mouth open in a big excited „oh“, paws clenched in front of his chest.",
  ),
  card(
    "gefuehl-ruhig",
    "Gefühle, „Wie geht's dir?“: Karte „Ruhig – auf der Wiese, ein Schmetterling auf seiner Pfote“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is the only character: no grown-up, nobody else, no hands or arms come in from the edges. He is close to the front and big, filling most of the picture; the background is simple and calm, only what the moment needs, so nothing draws the eye away from him. His face and body show the feeling clearly – the feeling is the biggest thing in the picture. He is calm: he sits cross-legged in soft grass on a quiet sunny meadow, a single butterfly resting on his raised paw; eyes half closed, a gentle smile.",
  ),
  card(
    "gefuehl-muede",
    "Gefühle, „Wie geht's dir?“: Karte „Müde – liegt auf dem Bett und gähnt“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is the only character: no grown-up, nobody else, no hands or arms come in from the edges. He is close to the front and big, filling most of the picture; the background is simple and calm, only what the moment needs, so nothing draws the eye away from him. His face and body show the feeling clearly – the feeling is the biggest thing in the picture. He is tired: he lies on his bed on top of the blanket, head on the pillow, yawning wide, eyes half closed, one paw rubbing an eye; the room behind him softly dim in the evening light.",
  ),
  card(
    "gefuehl-traurig",
    "Gefühle, „Wie geht's dir?“: Karte „Traurig – sein Spielzeugflugzeug ist kaputtgegangen“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is the only character: no grown-up, nobody else, no hands or arms come in from the edges. He is close to the front and big, filling most of the picture; the background is simple and calm, only what the moment needs, so nothing draws the eye away from him. His face and body show the feeling clearly – the feeling is the biggest thing in the picture. He is sad: he sits on the floor holding his toy aeroplane, one wing has just come off and lies in front of him; mouth turned down, brows raised in the middle, one tear on his cheek, head hanging. Nothing sharp, no splinters.",
  ),
  card(
    "gefuehl-wuetend",
    "Gefühle, „Wie geht's dir?“: Karte „Wütend – der Lutscher liegt zu hoch im Regal“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is the only character: no grown-up, nobody else, no hands or arms come in from the edges. He is close to the front and big, filling most of the picture; the background is simple and calm, only what the moment needs, so nothing draws the eye away from him. His face and body show the feeling clearly – the feeling is the biggest thing in the picture. He is angry: he stands in front of a tall shelf; high up on its top board, far out of his reach, lies a big round rainbow lollipop; he looks up at it with his brows pulled down hard, a tight frown, red cheeks, fists clenched at his sides, stamping one foot. He does not climb, nothing falls.",
  ),
  card(
    "gefuehl-angst",
    "Gefühle, „Wie geht's dir?“: Karte „Ängstlich – draußen blitzt und donnert es“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is the only character: no grown-up, nobody else, no hands or arms come in from the edges. He is close to the front and big, filling most of the picture; the background is simple and calm, only what the moment needs, so nothing draws the eye away from him. His face and body show the feeling clearly – the feeling is the biggest thing in the picture. He is scared: he sits on the floor by a big window with his knees pulled up, hugging them; outside it is dark, with a bright bolt of lightning and heavy rain; his eyes wide, brows raised and drawn together, mouth a small „o“, shoulders pulled up. Inside the room is dry and safe.",
  ),
  card(
    "brauche-kuscheln",
    "Gefühle, „Was brauche ich?“: Karte „In den Arm nehmen“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is in front and big, the picture is about him; the background is simple and calm, so nothing draws the eye away from him. No hands, no arms come in from the edges. Anyone else in the picture wears clothes too. Exactly two characters, each once: the little bear and Mama Bear, a big brown grown-up bear in a green knitted sweater. She kneels and holds him in a warm, gentle hug; his face is in front and clearly seen, eyes softly closed, smiling. He is the biggest thing in the picture.",
  ),
  card(
    "brauche-allein",
    "Gefühle, „Was brauche ich?“: Karte „Ein bisschen allein sein“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is in front and big, the picture is about him; the background is simple and calm, so nothing draws the eye away from him. No hands, no arms come in from the edges. Anyone else in the picture wears clothes too. Only the little bear, nobody else. He sits alone, calm and content, in a small cosy cave of blankets in the corner of his room, holding his teddy, eyes half closed, a soft smile.",
  ),
  card(
    "brauche-toben",
    "Gefühle, „Was brauche ich?“: Karte „Toben“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is in front and big, the picture is about him; the background is simple and calm, so nothing draws the eye away from him. No hands, no arms come in from the edges. Anyone else in the picture wears clothes too. Only the little bear, nobody else. He jumps from the rug into a heap of big soft cushions, both arms up, laughing. Nothing breaks, nothing flies about.",
  ),
  card(
    "brauche-trinken",
    "Gefühle, „Was brauche ich?“: Karte „Etwas trinken“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is in front and big, the picture is about him; the background is simple and calm, so nothing draws the eye away from him. No hands, no arms come in from the edges. Anyone else in the picture wears clothes too. Only the little bear, nobody else. He sits on the rug and drinks from a big cup of water he holds in both paws, close to the front, content. Only one cup.",
  ),
  card(
    "brauche-essen",
    "Gefühle, „Was brauche ich?“: Karte „Etwas essen“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is in front and big, the picture is about him; the background is simple and calm, so nothing draws the eye away from him. No hands, no arms come in from the edges. Anyone else in the picture wears clothes too. Only the little bear, nobody else. He sits at a small table and bites into a big red apple he holds in both paws, content and happy. Only one apple, nothing else to eat.",
  ),
  card(
    "brauche-ausruhen",
    "Gefühle, „Was brauche ich?“: Karte „Ausruhen“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is in front and big, the picture is about him; the background is simple and calm, so nothing draws the eye away from him. No hands, no arms come in from the edges. Anyone else in the picture wears clothes too. Only the little bear, nobody else. He lies on a soft sofa under a light blanket, his head on a cushion, eyes softly closed, a content smile, resting in the afternoon light.",
  ),
  card(
    "brauche-lied",
    "Gefühle, „Was brauche ich?“: Karte „Ein Lied singen“",
    "Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers. He is in front and big, the picture is about him; the background is simple and calm, so nothing draws the eye away from him. No hands, no arms come in from the edges. Anyone else in the picture wears clothes too. Only the little bear, nobody else. He stands on the rug and sings, mouth open in song, head swaying, one paw raised; three music notes float in the air above him. No instrument.",
  ),
];
