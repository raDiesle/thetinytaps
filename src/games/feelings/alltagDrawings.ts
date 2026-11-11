import type { QueuedPicture } from "@/content/pictureQueue";
import { type StoryDrawing, storyPictures } from "./storyPictures";

// How the pictures of the everyday scenes in alltag.ts are drawn, one entry per story in the same order. The frame
// sentences every prompt shares are added by storyPictures.ts; here stands only what is particular to each story.

/** The drawings of the everyday scenes. */
export const ALLTAG_DRAWINGS: StoryDrawing[] = [
  // C-37
  {
    id: "puzzle",
    place: "Wohnzimmer: niedriger Tisch mit einem Holzpuzzle mit Bauernhoftieren (die Kuh passt nicht), der große Bär liest auf dem Sofa.",
    cast: ["bear", "bigBear"],
    first:
      "A cosy living room. The little bear sits on a small chair at a low wooden table in front of a wooden farm-animal puzzle board: a pig, a sheep, a horse and a hen already sit in their holes, one cow-shaped hole is still empty. He holds exactly one wooden cow piece and presses it crookedly onto its hole, where it doesn't fit; his face is cross and frustrated, brows down, lower lip out, cheeks a little red. A few steps behind him the big bear sits on a sofa reading a book. Nothing else on the table.",
    keep: "Exactly one wooden farm-animal puzzle board on the low table, with the pig, the sheep, the horse and the hen in their holes, and exactly one wooden cow piece. The big bear's one book.",
    steps: [
      "„Fäuste drücken“ – The little bear himself sits up straight on his chair, turned a little away from the table, and squeezes both fists tight in front of his chest, eyes shut, letting his breath out: he looks calmer, a small relieved smile, plain brown face, NO red or pink patches at all. The cow piece lies on the table beside the board. The big bear reads on the sofa.",
      "„Teil umdrehen“ – The little bear himself holds the wooden cow piece turned the other way round and lowers it into its hole, where it fits snugly; he looks surprised and delighted, plain brown face, NO red or pink patches at all. The big bear reads on the sofa.",
      "„„Hilf mir bitte!“ sagen“ – The little bear himself has turned round on his chair towards the big bear and asks him, one paw held out open, a hopeful face. The big bear has come to the table and bends beside him, pointing with one finger at the corner of the empty cow hole, smiling. His book lies on the sofa, the sofa is empty now: only ONE big bear in the whole picture.",
    ],
    instead: [
      "„Puzzle vom Tisch fegen“ – The little bear sweeps the puzzle board off the table with one arm: the board and the wooden animals tumble through the air towards the floor, the cow piece too; the table is empty. The big bear looks up from his book, startled.",
      "„Teil reinhauen“ – The little bear bangs the wooden cow piece down onto its hole with his fist: the puzzle board cracks, a crack runs across it, the other animals hop out of their holes. The big bear looks up from his book.",
      "„Den großen Bären anbrüllen“ – The little bear himself has turned round on his chair and shouts at the big bear on the sofa, mouth wide open, fists down, short shout lines, no speech bubble; the big bear flinches back, ears flat, his book sinking. Nothing flies.",
    ],
    end: "The puzzle is finished: the wooden cow sits in its hole with the pig, the sheep, the horse and the hen. The little bear beams and claps, plain brown face, NO red or pink patches at all; the big bear sits beside him at the table, smiling. The sofa is empty: only ONE big bear in the whole picture.",
  },
  // C-38
  {
    id: "race",
    place: "Garten: Wiese, ein niedriger Holzzaun, ein Apfelbaum; der Fuchs ist zuerst am Baum, der kleine Bär bleibt mitten auf der Wiese stehen.",
    cast: ["bear", "fox"],
    first:
      "A sunny garden with a wide lawn, a low wooden fence at the back and exactly one apple tree with red apples on the right. The fox has just reached the apple tree first: he touches its trunk with one paw and throws the other paw up, cheering. In the middle of the lawn, a few steps behind him, the little bear has stopped running, arms hanging, lower lip pushed out, cross and disappointed. The lawn around the little bear is empty.",
    keep: "Exactly one apple tree on the right, the low wooden fence at the back.",
    steps: [
      "„Fest stampfen“ – The little bear himself, in the middle of the lawn, stamps with both feet at once, seen whole from head to both feet: both soles hit the grass together, little impact lines under both feet, knees bent, fists down; nothing lies near his feet. Dressed exactly as in the picture: light-blue t-shirt and dark blue-purple trousers. His face lets the anger out, cheeks puffed, no longer pouting. The fox by the tree watches, calm.",
      "„„Nochmal!“ rufen“ – The little bear himself calls to the fox, one paw beside his mouth holding nothing, the other pointing back over the lawn to where they started, eager and smiling; the fox by the tree turns to him, smiling happily (NOT worried), and nods.",
      "„Abklatschen“ – The little bear himself has walked up to the fox by the apple tree and they high-five: their paws meet high in the air, both smile happily. Only ONE little bear: the middle of the lawn is empty now.",
    ],
    instead: [
      "„Den Fuchs schubsen“ – The little bear has run up to the fox by the apple tree and pushes him with both paws; the fox stumbles sideways, surprised and hurt. Only ONE little bear: the middle of the lawn is empty now.",
      "„„Gilt nicht!“ schreien und weglaufen“ – The little bear stomps away towards the left edge, away from the fox, turning his head back and shouting, mouth wide open, short shout lines, no speech bubble; the fox stands alone by the tree, sad, ears down.",
      "„Den Fuchs am Ohr ziehen“ – The little bear stands right beside the fox at the apple tree and pulls one of the fox's ears; the fox winces and cries out. Only ONE little bear: the middle of the lawn is empty now.",
    ],
    end: "The little bear and the fox run across the lawn side by side, holding paws, both laughing, feet off the ground mid-stride; the apple tree behind them.",
  },
  // C-39
  {
    id: "farewell",
    place:
      "Flur an der offenen Haustür, daneben ein großes Fenster zum Weg: der Fuchs setzt seine Mütze auf, draußen wartet sein Papa, der große Bär steht im Flur.",
    cast: ["bear", "fox", "the fox's dad: a grown-up fox, taller than the bears, orange fur, white muzzle, a brown jacket", "bigBear"],
    first:
      "A hallway at home. On the right the front door stands open; outside on the garden path waits the fox's dad. Just inside the door the fox pulls a blue woolly cap onto his head, ready to go. Left of the door, in the same wall, a big low window looks out onto the path and a street corner. In the middle the little bear stands holding exactly one small red toy car in both paws, crying, big tears, ears down. Behind him the big bear stands in the hallway, kind face. Nothing on the floor.",
    keep: "The fox wears his blue woolly cap. Exactly one small red toy car. The big low window beside the door, looking out onto the path and the street corner.",
    steps: [
      "„Fest umarmen“ – The little bear himself hugs the fox tight just inside the open door, eyes closed, a small warm smile, the red toy car held in one paw behind the fox's back; the fox hugs back, smiling. The fox's dad waits outside, smiling; the big bear smiles.",
      "„Auto fest drücken“ – The little bear himself presses the red toy car against his tummy with both paws, eyes closed, calmer, a small smile, no tears now; the fox waves goodbye from the doorway.",
      "„Am Fenster winken“ – The little bear himself stands on tiptoe at the big window and waves with one paw high, smiling; outside, seen through the window, the fox walks along the path beside his dad, turning and waving back. The doorway is empty now: only ONE fox, outside.",
    ],
    instead: [
      "„Dem Fuchs die Mütze wegnehmen“ – The little bear pulls the blue woolly cap off the fox's head and holds it behind his own back; the fox cries, reaching for it; the fox's dad looks worried.",
      "„Auto hinterherwerfen“ – The little bear has just thrown the red toy car towards the open door: his arm stretched out, the car has hit the floor by the door and one wheel flies off it; the fox and his dad look back, startled.",
      "„Gegen die Tür treten“ – The little bear kicks the door frame with one foot and pulls the foot back at once, wincing, holding it; the fox and his dad look back, startled.",
    ],
    end: "Outside, seen through the big window, the fox stands on the path holding his dad's paw and waves back with a big smile. Inside, the little bear stands at the window waving, smiling, the red toy car in his other paw, no tears; the big bear stands beside him with a paw on his shoulder, smiling. The doorway is empty: only ONE fox, outside.",
  },
  // C-40
  {
    id: "myself",
    place: "Küche am Frühstückstisch: zwei Becher (der des kleinen Bären voll Saft, der des großen Bären leer), eine kleine Saftkanne.",
    cast: ["bear", "bigBear"],
    first:
      "A sunny kitchen at breakfast. At a wooden table the little bear sits on a booster chair; in front of him stands his cup, full to the brim with orange juice. The big bear sits beside him and has just put down a small glass jug of orange juice; in front of the big bear stands his own cup, empty. The little bear clenches both fists on the table, frowning, cheeks puffed and red, cross because he wanted to pour it himself. On the table exactly two cups (one full, one empty) and exactly one small jug, nothing else. Behind the table a window.",
    keep: "Exactly two cups on the table – the little bear's and the big bear's – and exactly one small glass jug of orange juice.",
    steps: [
      "„„Ich will selber!“ sagen“ – The little bear himself says it loudly to the big bear, one paw on his chest, a firm but calmer face; the big bear listens, nodding kindly. The little bear's cup is full, the big bear's empty.",
      "„Tief pusten“ – The little bear himself has turned on his chair away from the table, his back to the cups and the jug, facing the left edge; he blows out a long breath, cheeks round, and a soft little cloud of breath rises straight upwards into the empty air high above him, far from the table, the juice and the big bear. Eyes softly closed, a calm relieved face, plain brown face, NO red or pink patches at all. The big bear watches, calm.",
      "„Selbst einschenken“ – The little bear himself holds the small jug with both paws and pours orange juice into the big bear's cup, tongue out in concentration, proud, plain brown face, NO red or pink patches at all; the big bear only steadies the bottom of the jug with one finger, smiling.",
    ],
    instead: [
      "„Saftbecher umkippen“ – The little bear knocks his full cup over with the back of his paw: the cup lies on its side and orange juice spreads across the table and drips over the edge; the big bear leans back, surprised.",
      "„Den großen Bären hauen“ – The little bear swats at the big bear's arm with his paw; the big bear pulls his arm back, hurt and surprised.",
      "„Kanne runterwerfen“ – The little bear has just thrown the small glass jug down: it lies broken on the kitchen floor in a puddle of orange juice; the table has no jug on it now. The big bear looks shocked.",
    ],
    end: "The little bear and the big bear each drink orange juice from their own cup at the table, the little bear beaming with pride, plain brown face, NO red or pink patches at all; the jug stands between them.",
  },
  // C-41
  {
    id: "homesick",
    place:
      "Omas Gästezimmer bei Nacht: Gästebett mit Flickendecke, ein Mond-Nachtlicht auf dem Nachttisch, ein gerahmtes Bild an der Wand, eine geschlossene Tür; Oma Bär auf der Bettkante. Der große Bär ist schon nach Hause gefahren.",
    cast: ["bear", "grandma"],
    first:
      "Grandma bear's small guest room at night, soft dark blue, lit warmly by exactly one small moon-shaped night light glowing on a bedside table. The little bear, in light-blue pyjamas with little white stars, lies in a guest bed under a patchwork quilt, his head on the pillow; his small white plush bunny lies beside him on the quilt. He looks sadly towards the closed door, ears down, eyes wet, homesick. Grandma bear sits on the edge of the bed, kind face. On the wall above the bed hangs exactly one framed picture of a flower meadow.",
    keep: "Night. The little bear wears his light-blue pyjamas with little white stars. Exactly one moon-shaped night light glowing on the bedside table, exactly one framed picture of a flower meadow on the wall above the bed, exactly one small white plush bunny, the closed door.",
    steps: [
      "„Kuschelhase drücken“ – The little bear himself, lying in bed, hugs the small white plush bunny tight against his cheek with both arms, eyes closed, calmer, a small smile, no tears now; Grandma bear smiles.",
      "„„Ich vermisse mein Zuhause“ sagen“ – The little bear himself, sitting up a little against the pillow, tells Grandma bear, one paw on his chest, sad but calm; Grandma bear nods and gently strokes his head.",
      "„Langsam atmen“ – The little bear himself lies flat on his back, eyes softly closed, one paw resting on his tummy, breathing slowly and calmly (no breath cloud), a peaceful relieved face; Grandma bear sits quietly on the edge of the bed.",
    ],
    instead: [
      "„Nachtlicht runterwerfen“ – The little bear sweeps the moon night light off the bedside table with his arm: it lies broken on the floor, its glow gone, the room darker; Grandma bear startles. The bedside table is empty now.",
      "„Oma wegschubsen“ – The little bear pushes Grandma bear with both paws; she tips back on the edge of the bed, surprised and hurt.",
      "„Bild von der Wand reißen“ – The little bear stands on the bed and pulls the framed picture off the wall; it falls, its glass cracks; Grandma bear reaches out, worried. The wall above the bed is empty now.",
    ],
    end: "The little bear sleeps peacefully in the guest bed, hugging the white plush bunny, a little smile; Grandma bear tucks the quilt round him, smiling, in the warm glow of the night light.",
  },
  // C-42
  {
    id: "barber",
    place:
      "Friseursalon: hoher Friseurstuhl mit Armlehnen vor einem großen Spiegel, eine Ablage mit einer Sprühflasche, die Friseurin (Füchsin) mit Kamm und Schere, der große Bär auf dem Wartestuhl.",
    cast: ["bear", "the hairdresser: a grown-up fox lady, taller than the bears, orange fur, white muzzle, a teal apron over a white blouse", "bigBear"],
    first:
      "A bright, friendly hairdresser's salon. The little bear sits on a tall hairdresser's chair with two armrests, a big blue-and-white striped cape round his neck that covers him down to his knees, in front of a big wall mirror that shows his reflection; he looks scared, ears flat, eyes wide, shoulders up. Behind him stands the hairdresser holding exactly one comb in one paw and exactly one small pair of scissors in the other, smiling kindly. On a shelf under the mirror stands exactly one spray bottle of water. A little to the side the big bear sits on a waiting chair, smiling at him. Nothing on the floor yet.",
    keep: "The little bear wears the big blue-and-white striped cape round his neck. Exactly one tall hairdresser's chair with two armrests in front of the big wall mirror, which shows the little bear's reflection (only a reflection, not a second bear). Exactly one spray bottle on the shelf under the mirror. The hairdresser holds the comb and the small scissors.",
    steps: [
      "„Armlehnen fest drücken“ – The little bear himself grips both armrests tight with his paws and sits very still and straight, braver, a small brave smile, plain brown face, NO red or pink patches at all; the hairdresser combs his head gently, smiling.",
      "„Im Spiegel zuschauen“ – The little bear himself watches in the mirror, curious and smiling, as the hairdresser snips with the small scissors and one little tuft of brown fur falls through the air onto the cape.",
      "„„Kurz Pause, bitte!“ sagen“ – The little bear himself turns his head to the hairdresser and holds up one open paw from under the cape, asking for a pause, a calm face; the hairdresser has stepped back and lowered comb and scissors, nodding kindly; on the waiting chair the big bear waves at him, smiling.",
    ],
    instead: [
      "„Die Friseurin treten“ – The little bear wriggles on the chair and kicks out with one foot from under the cape; his foot bumps the hairdresser's leg, she steps back, wincing, holding comb and scissors up away from him.",
      "„Sprühflasche runterwerfen“ – The little bear sweeps the spray bottle off the shelf with his paw from under the cape: it lies broken on the floor in a splash of water; the hairdresser startles. The shelf is empty now: only ONE spray bottle in the whole picture.",
      "„Die Friseurin anbrüllen“ – The little bear himself turns and shouts at the hairdresser, mouth wide open, fists down, short shout lines, no speech bubble; she leans back startled, ears flat. Nothing flies.",
    ],
    end: "The haircut is done: the cape is off, the little bear in his light-blue t-shirt and dark blue-purple trousers sits on the chair and laughs at his reflection in the mirror, touching a neat little tuft on top of his head; a few small tufts of brown fur lie on the floor. The hairdresser smiles; the big bear stands beside the chair, laughing too. The waiting chair is empty: only ONE big bear in the whole picture.",
  },
  // C-43
  {
    id: "accident",
    place: "Spielzimmer im Kindergarten: Teppich, ein umgestoßener Turm aus bunten Bauklötzen (zwei stehen noch), der Fuchs sitzt daneben. Keine Erwachsenen.",
    cast: ["bear", "fox"],
    first:
      "A kindergarten playroom with a soft round rug. On the rug the fox sits beside what is left of his tower of big colourful wooden blocks: only two blocks still stand stacked, about ten blocks lie scattered across the rug, just fallen. The fox looks at them, sad, ears down. Right beside them the little bear has just stopped running, one foot still lifted, and holds both paws over his mouth, startled, eyes wide, guilty. No grown-ups.",
    keep: "The colourful wooden blocks of the fallen tower lie scattered on the rug, two of them still stacked.",
    steps: [
      "„„Entschuldigung!“ sagen“ – The little bear himself bends towards the fox, both paws on his chest, saying sorry with an honest, sorry face; the fox looks up at him and smiles a little.",
      "„Tief pusten“ – The little bear himself kneels beside the fox, turned away from him and from the blocks, facing the left edge; he blows out a long breath, cheeks round, and a soft little cloud of breath rises straight upwards into the empty air high above him, far from the fox and the blocks. Eyes softly closed, a calm relieved face; the fox watches, calm.",
      "„Zusammen neu bauen“ – The little bear himself kneels by the fox and hands him one red block; the fox takes it, smiling happily; a new small tower of three blocks stands between them, the other blocks lie around.",
    ],
    instead: [
      "„Restliche Klötze umtreten“ – The little bear kicks the two blocks still stacked; they fly apart over the rug; the fox cries.",
      "„Lachen und weiterrennen“ – The little bear runs on towards the right edge, laughing, looking back over his shoulder; the fox sits alone among the scattered blocks, crying.",
      "„Mit Klötzen werfen“ – The little bear has just thrown a block: his arm stretched out, the block flying close to his paw and bumping the fox's shoulder; the fox flinches, hurt.",
    ],
    end: "A new tower of colourful blocks, taller than the sitting fox, stands on the rug; the little bear and the fox sit on either side of it, laughing. No blocks lie scattered any more.",
  },
  // C-44
  {
    id: "laughed",
    place:
      "Malecke im Kindergarten: niedriger Tisch mit einem Becher Stifte, das Bild des kleinen Bären (bunte Kringel), das Bild des Waschbären (ein Haus), der Hase malt daneben, eine leere Pinnwand an der Wand. Keine Erwachsenen.",
    cast: ["bear", "raccoon", "bunny"],
    first:
      "A kindergarten painting corner. At a low table sit three children. The little bear holds up his own drawing – colourful round scribbles that are meant to be the big bear – but his face falls: hurt, lower lip trembling, ears down. Opposite him the raccoon points at the drawing and laughs; in front of the raccoon lies his own drawing of a simple house. Beside the little bear the bunny paints quietly on her own sheet. On the table exactly one pot of crayons. On the wall behind the table an empty cork pinboard. No grown-ups.",
    keep: "Exactly three drawings: the little bear's colourful round scribbles, the raccoon's simple house and the bunny's sheet. Exactly one pot of crayons on the table. The empty cork pinboard on the wall.",
    steps: [
      "„„Das mag ich nicht!“ sagen“ – The little bear himself stands up and says it firmly to the raccoon, one paw held up flat like a stop sign, his drawing in the other paw, a firm calm face; the raccoon stops laughing and looks a little sorry.",
      "„Fäuste drücken und pusten“ – The little bear himself, turned away from the table and the others, facing the left edge, squeezes both fists and blows out a long breath; a soft little cloud of breath rises straight upwards into the empty air high above him, far from the others and the drawings. Eyes softly closed, a calm relieved face.",
      "„Beim Hasen weitermalen“ – The little bear himself sits close beside the bunny and paints on his own drawing with a crayon, smiling; the bunny smiles at his picture.",
    ],
    instead: [
      "„Das Bild vom Waschbären zerreißen“ – The little bear tears the raccoon's house drawing in two; the raccoon cries.",
      "„Mit Stiften werfen“ – The little bear has just thrown a handful of crayons: his arm stretched out, the crayons flying close to his paw and bumping the raccoon, who flinches and holds up his arms. The pot of crayons lies tipped over.",
      "„Eigenes Bild zerknüllen“ – The little bear crumples his own colourful drawing into a ball in both paws, sad, tears; the bunny looks at him, sad.",
    ],
    end: "The little bear's colourful drawing hangs on the cork pinboard on the wall; the little bear stands proudly beside it, beaming; the raccoon looks at it, smiling and nodding; the bunny claps. Only ONE drawing of colourful scribbles in the whole picture.",
  },
  {
    id: "excited",
    place:
      "Kinderzimmer bei Nacht: der kleine Bär im Schlafanzug im Bett, Kuschelhase, Nachttisch mit Lampe, gepackter Kinderkoffer, Eimer mit Schaufel, die Tür zum Nebenzimmer angelehnt",
    cast: ["bear"],
    first:
      "A child's bedroom at night, soft blue moonlight through a window. The little bear wears pyjamas instead of his day clothes: light-blue pyjamas with small white stars. He lies in his bed under a blanket, head on the pillow, eyes wide open, a big excited smile, wriggling, far too excited to sleep; his small white plush bunny lies beside him on the pillow. Next to the bed stand exactly one small packed children's suitcase, closed, and exactly one red sand bucket with one yellow toy spade in it – tomorrow he goes to the seaside. On the bedside table exactly one small lamp, switched off. In the back wall a door stands ajar onto a dark next room; nobody is seen there.",
    keep: "The little bear wears his light-blue pyjamas with small white stars, not his day clothes. Exactly one small suitcase, one red sand bucket, one yellow toy spade, one small white plush bunny and one bedside lamp in the whole picture. The door to the dark next room stays ajar, nobody in it. It stays night, with moonlight through the window.",
    steps: [
      "„Pfote auf den Bauch legen“ – The little bear himself lies on his back in bed, one paw resting on his tummy, eyes half closed, breathing out slowly; a soft small breath cloud rises straight upwards into the empty air above him. He looks calm and relieved, a soft smile. The lamp stays off.",
      "„Dem Kuschelhasen flüstern“ – The little bear himself lies on his side in bed, holding the small white plush bunny close to his face and whispering into its long ear, one paw beside his mouth, a happy, calm smile. The bunny is in his arms now, nowhere else. The lamp stays off.",
      "„Augen zu, an die Wellen denken“ – The little bear himself lies on his back under the blanket, eyes closed, a peaceful smile, paws folded on the blanket; above his head a small soft thought cloud shows only blue sea waves, no text in it. The lamp stays off.",
    ],
    instead: [
      "„Koffer auskippen“ – Out of bed, the little bear has tipped the open suitcase upside down with both paws: clothes, a sun hat and a towel tumble out onto the floor in a heap. The bed is empty now.",
      "„Auf den Eimer trommeln“ – The little bear sits up in bed and bangs the yellow spade hard on the upturned red bucket, mouth wide open, wild; motion lines round the bucket. The door to the next room stays ajar and dark; nobody comes in.",
      "„Licht an und spielen“ – The bedside lamp is switched on, bright warm light; the little bear sits wide awake on the floor beside the bed and plays wildly with the red bucket and the yellow spade. The bed is empty now.",
    ],
    end: "The little bear sleeps peacefully in his bed, eyes closed, a happy smile, hugging the yellow spade and the small white plush bunny in his arms; the red bucket stands empty beside the suitcase, the spade is only in his arms. The lamp is off.",
  },
  {
    id: "envy",
    place: "Gehweg vor einer Hecke und Häusern: der Fuchs mit seinem neuen roten Laufrad mit Klingel, der kleine Bär mit seinem alten blauen Roller",
    cast: ["bear", "fox"],
    first:
      "A quiet sidewalk in front of a low hedge and a few houses, sunny. The fox stands astride his shiny new red balance bike with a small silver bell on the handlebar, beaming proudly, one paw on the bell. Next to him the little bear stands holding the handlebar of his old, scuffed blue kick scooter and stares at the balance bike with a dark, envious frown, lower lip out, eyebrows down. Exactly one red balance bike and exactly one blue kick scooter.",
    keep: "Exactly one shiny red balance bike with one silver bell and exactly one old blue kick scooter in the whole picture; the balance bike is always red, the scooter always blue.",
    steps: [
      "„Fäuste drücken“ – The little bear himself, standing beside his blue scooter, squeezes both fists tight in front of his chest, eyes shut, mouth open saying something, no speech bubble; he looks calmer, plain brown face, NO red or pink patches at all. The fox sits on his red balance bike and smiles.",
      "„„Darf ich mal?“ fragen“ – The little bear himself asks the fox politely, one open paw held out towards the red balance bike, head tilted, a hopeful, friendly face; he does NOT touch the bike. The fox smiles and nods.",
      "„Tauschen“ – The little bear himself sits on the red balance bike and the fox stands on the blue scooter right beside him, both laughing. Exactly one balance bike and one scooter in the whole picture.",
    ],
    instead: [
      "„Laufrad umschubsen“ – The little bear pushes the red balance bike over with both paws; it falls on its side onto the sidewalk and the silver bell breaks off; the fox has jumped off in time and gasps.",
      "„Den Fuchs vom Laufrad ziehen“ – The little bear pulls the fox off the red balance bike by his t-shirt; the fox tumbles onto the sidewalk and cries, the bike tips over.",
      "„Roller wegtreten“ – The little bear kicks his own blue scooter hard; it flies away from him along the empty sidewalk, away from the fox, and lands on its side, a wheel broken off. The fox looks startled.",
    ],
    end: "The little bear rides the red balance bike and rings its silver bell, laughing; the fox rides the blue scooter right beside him, both happy, side by side along the sidewalk.",
  },
  {
    id: "supermarket",
    place:
      "Gang im Supermarkt zwischen hohen Regalen: der kleine Bär allein mit seinem Kuschelhasen, vor ihm eine Kiste Äpfel und ein Dosenturm, hinten eine Ecke",
    cast: ["bear"],
    first:
      "A supermarket aisle between two tall shelves full of colourful packets and boxes; no toys and no plush animals on the shelves. The little bear stands alone in the middle of the aisle, his small white plush bunny held tight in one arm, looking around, scared, eyes wide, shoulders hunched. In front of him on the floor stands exactly one low wooden crate full of red apples, and beside it exactly one neat tower of tin cans stacked as a pyramid. At the far end of the aisle a corner, nobody there.",
    keep: "Exactly one wooden crate of red apples, one tower of tin cans and one small white plush bunny in the whole picture. The far end of the aisle and its corner stay empty, nobody there.",
    steps: [
      "„Stehen bleiben wie ein Baum“ – The little bear himself stands perfectly still in the middle of the aisle, feet firmly together on the floor, the plush bunny held to his tummy, turned away from the apples, breathing out slowly; a soft small breath cloud rises straight upwards into the empty air above his head. He looks calmer and braver.",
      "„„Papa!“ rufen“ – The little bear himself stands where he was and calls loudly towards the far end of the aisle, one paw cupped beside his mouth holding nothing, the plush bunny in his other arm, mouth wide open; no speech bubble, no sound word. The far end of the aisle is empty.",
      "„Kuschelhasen drücken und warten“ – The little bear himself stands right where he was and hugs the white plush bunny tight with both arms, eyes closed, a small brave smile, calm, waiting.",
    ],
    instead: [
      "„Regal hochklettern“ – The little bear climbs up the tall shelf like a ladder, the plush bunny dropped on the floor below; the shelf wobbles and a few packets tumble down.",
      "„Dosenturm umwerfen“ – The little bear knocks the tower of tin cans over with his arm; the cans tumble down and roll across the floor.",
      "„Äpfel rausrollen“ – The little bear tips the apple crate over with both paws; the red apples roll all over the aisle floor.",
    ],
    end: {
      shows:
        "The big bear has come round the corner at the far end of the aisle and kneels; the little bear has run into his arms and they hug tightly, both eyes closed, relieved and happy, the plush bunny between them. The apples lie in their crate, the tower of tin cans stands.",
      cast: ["bear", "bigBear"],
    },
  },
  {
    id: "pointing",
    place: "Küche: offener Kühlschrank mit einem Joghurt, einer Milchflasche und Gemüse, Tisch mit zwei Löffeln, der große Bär mit einem Apfel",
    cast: ["bear", "bigBear"],
    first:
      "A bright kitchen. The fridge door stands wide open: inside, on the middle shelf, exactly one small pink pot of strawberry yogurt, beside it one milk bottle and a few vegetables. The big bear stands in the middle of the kitchen holding up exactly one red apple in his paw, a puzzled, questioning face, eyebrows raised. The little bear stands in front of him, angry, frowning, red cheeks drawn flat, mouth wide open calling out, one arm flung out vaguely, not pointing at anything clearly. On the kitchen table lie two small spoons.",
    keep: "The fridge door stays wide open with exactly one small pink yogurt pot, one milk bottle and a few vegetables inside; exactly one red apple in the whole picture; two small spoons on the table.",
    steps: [
      "„Genau zeigen“ – The little bear himself stretches his arm out straight and points with one paw exactly at the pink yogurt pot in the open fridge, his whole arm one clear line towards it; plain brown face, NO red or pink patches at all, a hopeful look. The big bear follows the paw with his eyes and smiles, understanding, the apple lowered.",
      "„Stampfen und pusten“ – The little bear himself, seen whole down to both feet and dressed exactly as in the picture (light-blue t-shirt, dark blue-purple trousers), stamps both feet on the floor at once, small impact lines under both soles, and blows out a long breath; he has turned away from the fridge and from the big bear, and the soft breath cloud rises straight upwards into the empty air. He looks relieved, plain brown face, NO red or pink patches at all. The big bear waits calmly.",
      "„Zum Kühlschrank ziehen“ – The little bear himself takes the big bear by the paw and leads him towards the open fridge, walking ahead and looking back, a hopeful smile, plain brown face, NO red or pink patches at all; the big bear follows, smiling.",
    ],
    instead: [
      "„Apfel aus der Pfote schlagen“ – The little bear swats the big bear's paw hard; the red apple flies out of it and drops to the floor; the big bear pulls his paw back, hurt and surprised.",
      "„Gegen den Kühlschrank treten“ – The little bear kicks the bottom of the open fridge with his foot; inside, the milk bottle and the vegetables tip over and tumble off the shelf onto the floor; the yogurt pot stays.",
      "„Ganz laut schreien“ – The little bear screams with his mouth wide open, fists down, eyes squeezed shut; the big bear covers both ears with his paws, wincing. No speech bubble, no sound word.",
    ],
    end: "The little bear and the big bear sit together at the kitchen table, each spooning yogurt from the pink pot with one of the two spoons, both smiling happily. The yogurt pot stands on the table between them, so the fridge shelf no longer has it: exactly one yogurt pot in the whole picture.",
  },
  {
    id: "bee",
    place: "Wiese mit Picknickdecke: der rote Saftbecher des kleinen Bären, der grüne Teebecher des großen Bären, Brote, ein Ball, am Rand Blumen; eine Biene",
    cast: ["bear", "bigBear", "the bee: one small round cartoon honeybee, yellow and black stripes, little clear wings, a friendly face"],
    first:
      "A sunny meadow. On a checked picnic blanket sit the little bear and the big bear side by side. On the blanket: the little bear's red cup of orange juice right in front of him, the big bear's green mug of tea, a plate with two sandwiches, and one small blue-and-white ball. At the edge of the meadow, a few steps away, a patch of tall colourful flowers. The bee buzzes in the air close to the little bear's red cup. The little bear pulls up his shoulders and leans back, eyes wide, scared; the big bear sits calmly beside him.",
    keep: "Exactly one checked picnic blanket with one red cup of orange juice, one green mug of tea, one plate with two sandwiches and one small blue-and-white ball, and one patch of flowers at the meadow's edge. Exactly one bee in the whole picture.",
    steps: [
      "„Ganz still sitzen“ – The little bear himself sits perfectly still on the blanket like a little statue, paws in his lap, eyes on the bee, calm and brave; the bee hovers over the red cup; the big bear nods calmly.",
      "„Langsam weggehen“ – The little bear himself walks slowly away from the blanket over the grass, a few steps off, looking back, calm and relieved; his place on the blanket is empty now. The bee stays at the red cup; the big bear watches, smiling.",
      "„Zuschauen und ausatmen“ – The bee flies away from the blanket towards the flowers at the meadow's edge; the little bear himself, sitting on the blanket, watches it go and breathes out, the soft breath cloud rising straight upwards into the empty air, away from the food and from the big bear. He looks relieved and happy.",
    ],
    instead: [
      "„Nach der Biene schlagen“ – The little bear swats wildly at the bee with his paw; the bee has stung the paw, he pulls it back, wincing, a small swelling on it.",
      "„Saft umkippen“ – The little bear jerks back and knocks over his red cup; orange juice splashes across the picnic blanket.",
      "„Ball nach der Biene werfen“ – The little bear has just thrown the blue-and-white ball at the bee: arm stretched out, the ball just left his paw; the bee dodges, and the ball lands among the cups and knocks over the red cup and the green mug.",
    ],
    end: "The little bear and the big bear sit happily on the picnic blanket and eat their sandwiches, smiling; far away at the meadow's edge the bee buzzes among the flowers, nowhere near the blanket.",
  },
  {
    id: "phone",
    place: "Küche: der große Bär telefoniert an der Arbeitsplatte, der kleine Bär mit seinem Bild, Tisch mit Stiften, Stuhl mit dem Kuschelhasen",
    cast: ["bear", "bigBear"],
    first:
      "A kitchen. The big bear stands by the kitchen counter talking on a mobile phone held to his ear, busy, looking away. The little bear stands right beside him, holding up his new drawing (a sheet of paper with a colourful house and a tree on it) with one paw and tugging at the big bear's trouser leg with the other, an impatient, pleading frown. On the kitchen table lie a few crayons; on a kitchen chair beside the table sits the little bear's small white plush bunny.",
    keep: "Exactly one mobile phone, one drawing of a house and a tree, a few crayons on the table, one kitchen chair beside the table and one small white plush bunny in the whole picture.",
    steps: [
      "„Leise antippen“ – The little bear himself gently taps the big bear's arm with one finger, a quiet, patient face, the drawing in his other paw; the big bear, still holding the phone to his ear, looks down at him kindly and holds up one paw for „one moment“. The little bear looks calm, a small smile.",
      "„Mit dem Kuschelhasen zählen“ – The little bear himself sits on the kitchen chair hugging the white plush bunny with one arm and counts on the fingers of his other paw, fingers spread, calm and patient; the chair has only him and the bunny on it, exactly one bunny. The drawing lies on the table. The big bear talks on the phone.",
      "„Bild auf den Tisch legen“ – The little bear himself has laid his drawing neatly on the kitchen table and draws a yellow sun on it with a crayon, happy and concentrated; the big bear talks on the phone.",
    ],
    instead: [
      "„Telefon wegreißen“ – The little bear snatches the phone out of the big bear's paw; the phone falls and hits the floor, its screen cracking; the big bear looks surprised.",
      "„Laut dazwischenschreien“ – The little bear screams up at the big bear with his mouth wide open, fists down; the big bear winces and turns his free ear away, the phone at his other ear. No speech bubble, no sound word.",
      "„Bild zerknüllen“ – The little bear crumples his drawing into a ball with both paws, angry, tears in his eyes; the big bear talks on the phone.",
    ],
    end: "The big bear has laid the phone down on the counter and kneels at the table beside the little bear, looking at the drawing with the yellow sun for a long time, delighted; the little bear beams proudly.",
  },
  {
    id: "hit",
    place: "Sandkasten im Kindergarten: der Fuchs hält sich den Arm, zwischen ihnen eine rote Schaufel und ein gelber Eimer",
    cast: ["bear", "fox"],
    first:
      "A sandpit in a kindergarten garden with a low wooden edge, grass and a fence behind it. The fox sits in the sand holding his arm and crying, big tears. Between the two lies exactly one red toy shovel in the sand, and beside it exactly one yellow toy bucket. The little bear stands in front of the fox, one paw still raised from the hit, frozen, shocked at himself, eyes wide, mouth open. No grown-ups.",
    keep: "Exactly one red toy shovel and one yellow toy bucket in the whole picture. No grown-ups unless this picture names one.",
    steps: [
      "„Pfoten runter, tief pusten“ – The little bear himself has let both paws hang down and turned a little away from the fox, blowing out a long breath; the soft breath cloud rises straight upwards into the empty air, away from the fox. He looks calmer, sorry. The fox holds his arm.",
      "„„Entschuldigung!“ sagen“ – The little bear himself kneels in the sand in front of the fox, one paw on his own chest, a sorry, kind face, saying sorry, no speech bubble; the fox looks up at him, his tears drying, a small smile.",
      {
        shows:
          "„Zur Erzieherin gehen“ – The little bear himself leads the fox by his good paw to the sandpit's edge, where the teacher kneels and holds a small blue cold pack gently on the fox's arm; the fox smiles a little, the little bear looks relieved and caring. The shovel and the bucket lie in the sand.",
        cast: ["bear", "fox", "teacher"],
      },
    ],
    instead: [
      "„Nochmal hauen“ – The little bear swats the fox's arm again with his paw; the fox cries harder and pulls away.",
      "„Mit der Schaufel weiterbuddeln“ – The little bear has picked up the red shovel and digs in the sand, turned away from the fox, ignoring him; the fox sits beside him crying, holding his arm. The shovel is in the bear's paw now, nowhere else.",
      "„Den Fuchs auslachen“ – The little bear points at the crying fox and laughs; the fox cries harder, holding his arm.",
    ],
    end: {
      shows:
        "The little bear digs with the red shovel and the fox fills the yellow bucket with sand, side by side, both laughing; the teacher kneels at the sandpit's edge and smiles, a small blue cold pack beside her.",
      cast: ["bear", "fox", "teacher"],
    },
  },
  {
    id: "pickup",
    place:
      "Spielzimmer im Kindergarten am Nachmittag: der große Bär in der offenen Tür mit dem grünen Rucksack des kleinen Bären, Garderobe, der Fuchs mit einem Bausteinturm",
    cast: ["bear", "fox", "bigBear"],
    first:
      "A kindergarten playroom in the afternoon, warm light through a window. In the open door at the back stands the big bear, waving with one paw and holding the little bear's small green backpack in the other; beside the door a row of coat hooks. In the middle of the room the little bear has just seen him: he beams with joy, eyes bright, paws up. Between the little bear and the door the fox kneels on the rug beside a tall tower of colourful building blocks he has built. Exactly one tower and exactly one green backpack.",
    keep: "Exactly one green backpack, held by the big bear unless this picture says otherwise; exactly one tower of colourful building blocks on the rug, standing unless this picture says it falls.",
    steps: [
      "„Hüpfen und winken“ – The little bear himself hops on the spot, both feet off the floor, waving both paws high towards the door, mouth open calling, beaming; the big bear waves back from the door; the fox's tower stands untouched.",
      "„„Tschüss!“ zum Fuchs sagen“ – The little bear himself crouches beside the fox and waves him goodbye with a friendly smile; the fox waves back happily beside his standing tower; the big bear waits smiling in the door.",
      "„Ganz fest drücken“ – In the doorway the big bear kneels and the little bear himself hugs him tightly, arms round his neck, both eyes closed, both happy; the little bear's place in the middle of the room is empty now. The fox builds on beside his standing tower.",
    ],
    instead: [
      "„Den Fuchs umrennen“ – The little bear runs wildly towards the door and bumps into the fox, who tumbles over onto the rug and cries; the tower still stands.",
      "„Turm umrennen“ – The little bear runs through the room and knocks the fox's tower over with his leg; the blocks tumble across the rug; the fox looks shocked.",
      "„Tasche wegreißen“ – At the door, the little bear yanks the green backpack out of the big bear's paw; one strap rips off; the big bear looks surprised.",
    ],
    end: "The little bear and the big bear walk out of the door hand in hand, the little bear wearing his green backpack, both happy; the fox, beside his standing tower, waves goodbye.",
  },
  // C-56
  {
    id: "bath",
    place:
      "Badezimmer: Wanne voller Schaum mit dem kleinen Bären und dem Fuchs in Badeshirts, am Wannenrand eine Shampooflasche und ein Becher, der große Bär auf einem Hocker mit einem großen Handtuch, eine Badematte",
    cast: ["bear", "fox", "bigBear"],
    first:
      "A bright bathroom. The little bear and the fox sit together in a white bathtub full of white foam, both giggling loudly, eyes squeezed with laughter, paws up in the foam; the little bear looks wild with joy, about to splash. In the bath, instead of their t-shirts and trousers, both wear simple short-sleeved swim shirts and swim shorts – the little bear a light-blue one, the fox a mint-green one – and the foam reaches up to their chests, so only their swim shirts' shoulders, their arms and their heads show above it; nobody is bare. On the tub's rim exactly one blue shampoo bottle and exactly one small yellow plastic cup. The big bear sits on a low stool beside the tub, smiling, with exactly one big folded fluffy white towel on his lap. In front of the tub a small bath mat on the tiled floor; the floor is dry. Free air above the tub.",
    keep: "In the tub both children wear their swim shirts (the little bear light-blue, the fox mint-green), deep in white foam up to their chests; out of the tub the little bear wears his light-blue swim shirt and swim shorts, never nothing. Exactly ONE blue shampoo bottle, ONE small yellow cup and ONE big white towel in the whole picture.",
    steps: [
      "„Schaumbart machen“ – The little bear himself, big in front in the tub, has put a thick white foam beard on his chin with both paws and laughs, proud and silly; the fox beside him laughs with him, happy. No water splashes anywhere; the big bear smiles.",
      "„Schaum hochpusten“ – The little bear himself holds a small heap of foam on one flat paw, turned away from the fox, and blows on it slowly: the foam flakes float straight upwards into the empty air above the tub, away from everyone. His eyes are soft, he is calm and smiling; the fox watches the flakes, smiling.",
      "„Ins Handtuch kuscheln“ – The little bear himself, in his light-blue swim shirt and swim shorts, has climbed slowly out of the tub and stands on the bath mat, snuggling into the big white towel the big bear holds open round him, eyes happy and half closed. The fox still sits in the foam, smiling. The floor is dry.",
    ],
    instead: [
      "„Fuchs nass spritzen“ – The little bear sweeps one paw through the water and splashes a big wave straight into the fox's face; the fox squeezes his eyes shut and starts to cry, while the little bear still laughs wildly.",
      "„Shampoo ausleeren“ – The little bear holds the blue shampoo bottle upside down over the water and squeezes it empty: a thick stream of shampoo pours in, the foam swells high over the rim, and the fox rubs his stinging eyes and cries. The bottle's place on the rim is empty now: only ONE bottle, in the little bear's paw.",
      "„Aus der Wanne springen“ – The little bear has jumped out over the tub's rim and slipped on the wet tiles: he sits down hard on the floor beside the bath mat, wincing, water splashed round him; the big bear reaches out to him, worried. The fox stays in the tub.",
    ],
    end: "Both children sit snuggled together in the one big white towel on the bath mat, only their heads and the collars of their swim shirts peeking out, giggling softly; the big bear sits beside them on his stool, smiling. Foam is left in the tub behind them.",
  },
  // C-57
  {
    id: "butterfly",
    place: "Garten: eine einzelne große gelbe Blume mit einem Schmetterling darauf, dahinter ein Tulpenbeet, der Fuchs mit einer grünen Gießkanne, viel Rasen",
    cast: ["bear", "fox", "the butterfly: one small butterfly with bright-blue wings edged in orange"],
    first:
      "A sunny garden with a wide green lawn. In front, close to the little bear, one single tall yellow flower stands on its own in the lawn, and the butterfly sits on it with its wings open. The little bear stands right in front of it, bent a little towards it, eyes wide and round, mouth open in an amazed „oh“, paws in front of his chest – full of quiet wonder. One step behind him the fox holds exactly one green watering can and leans to see past the little bear, curious. Behind them a flower bed full of red and pink tulips with a low wooden edge. Free lawn on the other side of the little bear.",
    keep: "Exactly ONE butterfly in the whole picture, ONE tall yellow flower on its own in the lawn and ONE green watering can (the fox holds it unless this picture says otherwise); the flower bed of red and pink tulips stays behind them.",
    steps: [
      "„Ganz still stehen“ – The little bear himself stands perfectly still in front of the yellow flower, arms down at his sides, feet together, breathing quietly, a soft happy smile, eyes on the butterfly, which sits on the flower with its wings open; the fox stands still behind him, smiling.",
      "„Leise „Guck mal!“ flüstern“ – The little bear himself has stepped aside to make room, one paw pointing gently at the butterfly on the flower, the other paw held beside his mouth, whispering to the fox; the fox now stands beside him, close to the flower, delighted. Both smile.",
      "„Flattern wie ein Schmetterling“ – The little bear himself stands on the open lawn, away from the flower bed, flapping both arms out wide like wings, laughing; the butterfly flies high above him in the sky. The fox flaps his arms too, the watering can set down on the lawn. The tulips in the flower bed stand straight and whole.",
    ],
    instead: [
      "„Nach dem Schmetterling greifen“ – The little bear lunges forward and snatches at the butterfly with both paws; the butterfly flutters away from his paws up into the air, the yellow flower bends. The fox looks sad.",
      "„Fuchs wegschubsen“ – The little bear pushes the fox away from the flower with both paws on the fox's shoulder; the fox stumbles back, the watering can tips and water spills on the lawn, the fox looks hurt. The little bear bends to the butterfly alone.",
      "„Durchs Blumenbeet rennen“ – The little bear runs straight through the middle of the tulip bed after the butterfly, which flies away above; several tulips are bent and flattened under his feet. The fox, holding the watering can, looks sadly at the broken flowers.",
    ],
    end: "The butterfly has landed on the rim of the green watering can, which the fox holds out low; the little bear and the fox bend over it side by side, laughing softly, both happy. The yellow flower stands empty.",
  },
  // C-58
  {
    id: "morning",
    place:
      "Kinderzimmer am Morgen: Bett mit blauer Decke, Nachttisch mit einem roten Wecker, Hausschuhe vor dem Bett, ein zugezogener Vorhang, das Bärenbaby in der offenen Tür",
    cast: ["bear", "baby"],
    first:
      "A child's bedroom early in the morning, dim: the curtain at the window is drawn shut, only a thin line of sunlight at its edge. The little bear, in light-blue pyjamas with little stars instead of his t-shirt and trousers, sits up in his bed under a blue blanket, fur rumpled, eyes half closed, frowning and grumpy, arms crossed – very sleepy. On a small bedside table beside the bed exactly one round red alarm clock. On the rug in front of the bed exactly one pair of small blue slippers. Across the room the bear baby sits on the floor in the open doorway, wide awake, looking at him. Free floor between the bed and the door.",
    keep: "The little bear wears his light-blue pyjamas with little stars (never his t-shirt). Exactly ONE red alarm clock, ONE pair of blue slippers and ONE curtain at the window. The bear baby sits in the doorway unless this picture says otherwise.",
    steps: [
      "„Strecken und gähnen“ – The little bear himself, sitting in bed, stretches both arms high up over his head like a cat, back long, and yawns a big yawn upwards, eyes squeezed, a relaxed waking-up smile at the corners of his mouth; his arms are no longer crossed. The alarm clock stands on the bedside table.",
      "„Hausschuhe anziehen“ – The little bear himself sits on the edge of the bed and slips his feet into the blue slippers, one already on, the other just going on; he smiles and waves to the bear baby in the doorway, who laughs. The rug in front of the bed is empty: the slippers are on his feet.",
      "„Vorhang aufziehen“ – The little bear himself, in his blue slippers, stands at the window and pulls the curtain wide open with both paws; bright morning sunlight streams into the room over him, he blinks into the sun and smiles, happy. The bed behind him is empty.",
    ],
    instead: [
      "„Wecker runterwerfen“ – The little bear, sitting in bed, has just swept the red alarm clock off the bedside table: his arm stretched out, the clock falling close to his paw towards the floor; the bedside table is empty. The bear baby in the doorway startles.",
      "„Hausschuh nach dem Baby werfen“ – The little bear, sitting in bed, has just thrown one blue slipper: his arm stretched out, the slipper flying close to his paw towards the doorway; the bear baby in the doorway flinches and lifts its paws. Only ONE slipper is left on the rug.",
      "„Vorhang runterreißen“ – The little bear stands at the window and yanks the curtain down with both paws: the curtain rod hangs crooked and the curtain falls to the floor in a heap; the bear baby in the doorway looks shocked.",
    ],
    end: "Morning sunlight fills the room, the curtain open. The little bear, in his pyjamas and blue slippers, holds the bear baby's paw at the open door; both smile, about to go to breakfast. The bed is empty.",
  },
  // C-59
  {
    id: "worn",
    place:
      "Flur daheim nach dem Kindergarten: der kleine Bär liegt in Jacke auf dem Boden, neben ihm eine grüne Brotdose, das Bärenbaby baut einen kleinen Turm, der große Bär hängt seine Tasche auf, durch die offene Tür die Kuschelecke mit Kissen und dem Kuschelhasen",
    cast: ["bear", "baby", "bigBear"],
    first:
      "A hallway at home in the afternoon; on the right a wide open doorway shows the living room. The little bear lies flat on his back on the hallway floor, still in his orange kindergarten jacket over his clothes, arms and legs limp, a tired, whiny, worn-out face, eyes half shut. Beside him on the floor exactly one small green lunchbox. A little further along the floor the bear baby sits and builds a small tower of four wooden blocks. The big bear stands at a coat hook by the front door, hanging up his bag, looking kindly back at the little bear. Through the open doorway, clearly seen, a cosy cuddle corner on the living-room floor: two big soft cushions, and on one of them exactly one small white plush bunny. Bare wall above the little bear.",
    keep: "The little bear wears his orange jacket over his clothes unless this picture says it is off. Exactly ONE green lunchbox, ONE small tower of four wooden blocks by the bear baby, ONE small white plush bunny, and the cuddle corner with its two cushions through the doorway.",
    steps: [
      "„Liegen und tief atmen“ – The little bear himself lies flat on his back on the hallway floor, paws on his tummy, eyes softly closed, and breathes out slowly: a soft breath cloud rises straight upwards above his face into the empty air, away from everyone. He looks calmer, a small relieved smile. The bear baby builds on, the big bear smiles.",
      "„„Ich bin so geschafft“ sagen“ – The little bear himself sits up on the floor and tells the big bear how tired he is, mouth open, tired eyes, one paw lifted; the big bear has come and kneels beside him, listening kindly, one paw ready at the jacket's zip. The bag hangs on the hook.",
      "„In die Kuschelecke krabbeln“ – The little bear himself, in his jacket, crawls on all fours through the doorway into the cuddle corner and lays his head on a big cushion, a tired, content smile, his paw on the plush bunny. The hallway floor where he lay is empty; the lunchbox lies there.",
    ],
    instead: [
      "„Brotdose an die Wand werfen“ – The little bear, sitting on the floor, has just thrown the green lunchbox at the wall: his arm stretched out, the lunchbox hitting the bare wall and springing open, its lid flying off. The bear baby and the big bear look shocked.",
      "„Turm vom Baby umwerfen“ – The little bear sweeps the bear baby's block tower over with his paw; the four blocks tumble across the floor and the bear baby starts to cry.",
      "„Den großen Bären hauen“ – The big bear kneels and reaches for the zip of the little bear's jacket; the little bear swats at the big bear's arm with his paw, whiny, and the big bear pulls his arm back, surprised.",
    ],
    end: "In the cuddle corner the little bear, his orange jacket off and hanging on the hook by the front door, lies on the big cushions hugging the small white plush bunny, a tired, happy smile; the big bear sits beside him and the bear baby leans against the big bear. The hallway floor is empty but for the lunchbox.",
  },
  // C-60
  {
    id: "sick",
    place:
      "Wohnzimmer: Sofa mit blauer Decke, darauf der kranke kleine Bär mit Schal, ein Tischchen mit Teetasse und Bilderbuch, ein großes Fenster hinter dem Sofa, draußen der Fuchs mit einem roten Ball",
    cast: ["bear", "fox"],
    first:
      "A cosy living room. The little bear lies on a sofa under a soft blue blanket, a red striped knitted scarf round his neck, a runny nose and a tissue in his paw, droopy tired eyes, pale and sad – clearly ill. Beside the sofa a small round side table with exactly one white teacup of tea and exactly one closed picture book with a whale on its cover. Right behind the sofa a big window: outside on a sunny lawn the fox plays alone with exactly one red ball, not looking in. The fox is outside, behind the glass.",
    keep: "The little bear wears his red striped scarf and stays on the sofa with the blue blanket. Exactly ONE white teacup and ONE picture book with a whale on its cover. The fox stays OUTSIDE behind the window glass with ONE red ball – never inside the room.",
    steps: [
      "„In die Decke kuscheln“ – The little bear himself snuggles deep into the blue blanket, pulled up to his chin, eyes softly closed, breathing calmly, a small peaceful smile; the teacup and the picture book stand on the side table. Outside the fox plays with the ball.",
      "„Dem Fuchs winken“ – The little bear himself sits up on the sofa, turns to the window and waves to the fox with one paw, smiling; outside, behind the glass, the fox holds the red ball under one arm and waves back, laughing.",
      "„Bilderbuch anschauen“ – The little bear himself sits snuggled in the blanket with the picture book open on his lap, pointing at a big whale in it, delighted and calm. The side table holds only the teacup now: the book is on his lap. Outside the fox plays with the ball.",
    ],
    instead: [
      "„Teetasse runterschubsen“ – The little bear, grumpy, pushes the teacup off the side table with his paw; it falls and breaks on the floor, tea splashing out.",
      "„Gegen das Fenster hauen“ – The little bear kneels on the sofa and bangs on the window glass with his fist, angry, and pulls his paw back, wincing. Outside the fox turns round, startled. The glass stays whole.",
      "„Bilderbuch zerreißen“ – The little bear rips a page out of the picture book; the torn page hangs from his paw, the damaged book lies open on the blanket, and his face is sad and crying.",
    ],
    end: "The little bear sits snuggled in the blanket with the picture book open on his lap and waves to the window with a happy smile; outside, behind the glass, the fox holds up the red ball and waves back, laughing.",
  },
  // C-61
  {
    id: "car",
    place:
      "Im Auto auf der langen Fahrt zu Oma Bär, von der Seite aufgeschnitten: vorn fährt der große Bär, hinten der kleine Bär im Kindersitz mit Kuschelhase und Trinkflasche, daneben schläft das Bärenbaby in seinem Sitz, draußen eine Landstraße mit drei Autos",
    cast: ["bear", "baby", "bigBear"],
    first:
      "Inside a family car on a long drive along a country road, shown from the side as if the car's side were cut away, so all three are seen. In front the big bear drives, both paws on the steering wheel, eyes on the road. In the back seat behind him the little bear sits buckled into a child seat, slumped, whiny and bored, lower lip out. On his lap exactly one small white plush bunny and exactly one green drinking bottle. Beside him the bear baby sleeps peacefully in its own baby seat, eyes closed. Through the windows a country road with fields and exactly three small cars on the other lane: one red, one blue, one yellow.",
    keep: "The same car in the same cut-away side view; the big bear always drives with both paws on the wheel. Exactly ONE white plush bunny, ONE green drinking bottle, ONE child seat with the little bear and ONE baby seat with the bear baby; the three small cars (red, blue, yellow) on the road outside.",
    steps: [
      "„Kuschelhasen fest drücken“ – The little bear himself wraps both arms tightly round the small white plush bunny and squeezes it against his chest, eyes closed, a calm, relieved smile. The green bottle lies on his lap. The bear baby sleeps.",
      "„Autos zählen“ – The little bear himself looks out of the side window, nose near the glass, pointing with one paw at the three small cars outside – red, blue, yellow – counting, interested and happy. The bear baby sleeps.",
      "„Augen zumachen“ – The little bear himself leans his head against the side of his child seat, eyes closed, hugging the plush bunny loosely, falling asleep with a peaceful smile. The bear baby sleeps beside him.",
    ],
    instead: [
      "„Gegen den Sitz treten“ – The little bear kicks the back of the driver's seat in front of him with both feet; the big bear jolts forward and winces, holding the wheel. The bear baby stirs.",
      "„Trinkflasche nach vorne werfen“ – The little bear has just thrown the green bottle forwards: his arm stretched out, the bottle flying close to his paw past the big bear's head towards the dashboard; the big bear ducks a little, startled.",
      "„Das Baby wecken“ – The little bear leans over and pokes the sleeping bear baby; the bear baby is wide awake and cries, mouth open; the big bear glances back, worried.",
    ],
    end: "Both children sleep peacefully in their seats, the little bear hugging the plush bunny; the big bear drives on calmly with a small smile. Far ahead at the roadside a small house with a red roof comes into view.",
  },
  // C-62
  {
    id: "sticky",
    place:
      "Kindergarten, Maltisch: der kleine Bär mit blauen Farbpfoten vor seinem Blatt, der Fuchs mit seinem Sonnenbild, ein Farbbecher und ein Pinsel auf dem Tisch, hinten ein Waschbecken",
    cast: ["bear", "fox"],
    first:
      "A bright kindergarten room with a low painting table. The little bear sits at the table and holds both paws up in front of him, palms covered in sticky blue finger paint, and stares at them, disgusted: nose wrinkled, mouth pulled down, leaning back from his own paws. In front of him lies his own sheet of paper with a few blue finger smudges. Beside him the fox sits with his own finished painting of a big yellow sun, happy. On the table between them exactly one jar of blue paint and exactly one paintbrush lying beside it. At the back wall a small low sink with a tap. No grown-ups. Free air above the little bear.",
    keep: "Exactly ONE jar of blue paint, ONE paintbrush, the little bear's sheet with blue smudges and the fox's painting of a big yellow sun (two sheets in all), ONE sink at the back wall. No grown-ups. The little bear's paws are blue with paint unless this picture says they are washed.",
    steps: [
      "„Pfoten hoch und pusten“ – The little bear himself holds both blue paws up high, away from everything, turns away from the fox and blows out a long slow breath upwards: a soft breath cloud rises straight up into the empty air. His face calms into a small relieved smile; the fox smiles at him.",
      "„Pfoten waschen“ – The little bear himself stands at the sink at the back and washes his paws under the running tap, blue water running off, clean paws showing, happy. His chair at the table is empty; the fox sits at the table and paints.",
      "„Mit dem Pinsel malen“ – The little bear himself sits at the table and paints on his own sheet with the paintbrush, dipping it into the jar of blue paint, content and smiling; a blue tree and a blue sun grow on his sheet. The fox looks over, smiling. Only ONE paintbrush, in his paw.",
    ],
    instead: [
      "„Pfoten am Fuchs abwischen“ – The little bear wipes his blue paint paws on the fox's mint-green t-shirt; two blue paw smears on the fox's shirt, the fox looks down at it and starts to cry.",
      "„Farbbecher umwerfen“ – The little bear knocks the jar of blue paint over with his paw; it tips on its side and blue paint floods across the table and both sheets of paper; the fox pulls back, shocked.",
      "„Bild vom Fuchs zerknüllen“ – The little bear has grabbed the fox's painting of the yellow sun and crumples it into a ball in his paws; the fox reaches for it and starts to cry.",
    ],
    end: "The little bear and the fox both hold up their paintings side by side, beaming: the little bear's sheet with a blue tree and sun painted with the brush, the fox's sheet with the big yellow sun. The little bear's paws are clean.",
  },
  // C-63
  {
    id: "nappy",
    place:
      "Spielzimmer: der kleine Bär mit einem roten Spielzeugauto auf dem Teppich, daneben das Bärenbaby mit stinkender Windel, ein Regal mit einer frischen Windel, ein geschlossenes Fenster, der große Bär in der Tür mit einer Wickelunterlage",
    cast: ["bear", "baby", "bigBear"],
    first:
      "A playroom with a soft rug. The little bear kneels on the rug with exactly one small red toy car and turns his face away, nose wrinkled, disgusted. Next to him sits the bear baby in its pale-yellow romper with a nappy, smiling; one small wavy green smell swirl rises from the baby's nappy (only this one swirl, no other marks). On a low shelf beside the little bear lies exactly one fresh folded white nappy. On the far side of the room a closed window. In the open door at the back the big bear comes in carrying a soft changing mat, smiling. Free rug round the children.",
    keep: "Exactly ONE red toy car, ONE fresh white nappy (on the low shelf unless this picture says otherwise), ONE window and ONE door. The green smell swirl over the bear baby's nappy stays until the baby is changed.",
    steps: [
      "„Nase zuhalten und lachen“ – The little bear himself pinches his nose shut with one paw and laughs, eyes squeezed with fun; the bear baby laughs along. The green smell swirl rises from the nappy.",
      "„Fenster aufmachen“ – The little bear himself stands at the window and pushes it wide open; fresh air streams in, he breathes in deeply, face relieved and happy. The rug where he knelt is empty but for the red car.",
      "„Frische Windel reichen“ – The little bear himself holds the fresh white nappy up to the big bear, who now kneels on the rug beside the bear baby with the changing mat, smiling and taking it. The low shelf is empty now: only ONE nappy, in the little bear's paw.",
    ],
    instead: [
      "„Baby wegschubsen“ – The little bear pushes the bear baby away with both paws; the bear baby tips over onto its side on the soft rug and cries.",
      "„Auto nach dem Baby werfen“ – The little bear has just thrown the red toy car: his arm stretched out, the car flying close to his paw towards the bear baby, who flinches; the big bear in the door hurries in.",
      "„Wegrennen und Tür zuknallen“ – The big bear has stepped into the room beside the bear baby. The little bear runs out through the door and slams it hard behind him, only his back still seen as the door bangs shut; the bear baby startles and cries.",
    ],
    end: "The bear baby, freshly changed in a clean nappy, lies on the changing mat on the rug and laughs; the little bear kneels beside it and laughs with it, the big bear smiles. No smell swirl any more. The window stands open.",
  },
  // C-64
  {
    id: "socks",
    place:
      "Draußen nach dem Regen: ein Weg mit einer tiefen Pfütze, nasses Gras, eine leere Holzbank am Rand; der kleine Bär in gelben Gummistiefeln, der Fuchs daneben",
    cast: ["bear", "fox"],
    first:
      "Outside after the rain: a path through a little park, wet grass, a grey-blue sky clearing up, one empty wooden bench at the edge of the path. In the middle of the path one big, deep brown puddle. The little bear wears exactly two yellow rubber boots and white-and-blue striped socks. He stands with one boot deep in the puddle: water has run into that boot and sloshes over its top, the top of his wet striped sock showing above it. He lifts the other foot a little, his whole face screwed up in disgust: nose wrinkled, eyes squeezed, mouth pulled down at the corners, paws held stiffly away from his body. The fox, in small red rubber boots, stands dry on the path beside the puddle and looks at him.",
    keep: "The little bear wears yellow rubber boots and white-and-blue striped socks, the fox small red rubber boots. Exactly ONE big puddle on the path and ONE wooden bench, empty unless the picture says someone sits on it. The ground is wet after the rain.",
    steps: [
      "„Fuß schütteln“ – The little bear himself stands beside the puddle on one leg and shakes the other foot hard, the yellow boot still on it, a few drops flying off it down to the ground, away from the fox; he laughs, eyes crinkled with fun. The fox laughs with him. Only ONE little bear, beside the puddle now.",
      "„Stiefel auskippen“ – The little bear himself sits on the wooden bench, one foot only in its striped sock, and holds his yellow boot upside down with both paws: a stream of water pours out of it onto the ground in front of the bench. He looks relieved, a small smile. His other boot is still on his other foot. The fox stands beside the bench, smiling. Only ONE little bear, on the bench: nobody stands in the puddle.",
      "„Socke auswringen“ – The little bear himself stands on the path beside the puddle, one foot bare, and wrings out his wet striped sock with both paws, drops falling from it to the ground; its empty yellow boot stands upright beside him. He grins, relieved. The fox watches, smiling. Only ONE little bear, beside the puddle now.",
    ],
    instead: [
      "„Den Fuchs in die Pfütze schubsen“ – The little bear has just pushed the fox with both paws: the fox has tumbled down and sits in the puddle, water splashing up round him, and starts to cry. The little bear stands at the edge of the puddle, still cross.",
      "„Stiefel nach dem Fuchs werfen“ – The little bear, one foot only in its striped sock, has just thrown his yellow boot: arm stretched out towards the fox, the boot has just left his paw and flies through the air, a few water drops trailing; the fox flinches and lifts his paws. Only two yellow boots in the whole picture: one on the bear's other foot, one in the air.",
      "„Den Fuchs nass spritzen“ – The little bear kicks the puddle water on purpose towards the fox: a big splash flies from his boot onto the fox, whose t-shirt is soaked; the fox starts to cry.",
    ],
    end: "The little bear, both yellow boots on again, and the fox walk on along the path side by side, round the puddle, laughing together. The little bear's face is happy and relaxed.",
  },
  // C-65
  {
    id: "lick",
    place: "Ein Weg im Park mit Gras und Bäumen: ein kleiner, freundlicher Hund an der Leine einer Füchsin, ein Stock auf dem Weg, der kleine Bär",
    cast: [
      "bear",
      "the dog's owner: a grown-up fox lady, much taller than the little bear, orange fur, white muzzle, a long dark-blue coat and a red scarf",
      "the dog: a small friendly dog, no bigger than the little bear, white fur with light-brown patches, floppy ears, a short tail, a red collar on a red leash",
    ],
    first:
      "A park path with grass, a few trees and a flower bed. The little bear stands on the path, leaning back; the small dog stands up on its hind legs with its front paws on his tummy and licks right across his face with its pink tongue, wagging its tail, friendly. The little bear squeezes his eyes shut and pulls his mouth into a disgusted grimace, arms held stiffly away from his body. The dog's owner stands beside them holding the red leash, a little surprised. One stick lies on the path near the little bear.",
    keep: "Exactly ONE small dog with its red collar on the red leash, which the dog's owner holds the whole time. Exactly ONE stick, lying on the path unless the picture says it is thrown. Nobody else in the park.",
    steps: [
      "„„Nicht schlecken!“ sagen“ – The little bear himself turns his face away from the dog and holds one paw up flat between them like a little stop sign, saying it firmly, calm now, no longer disgusted. The dog sits on the path, its tongue in its mouth, looking up at him; the owner holds the leash short and nods kindly.",
      "„Gesicht abwischen“ – The little bear himself wipes his wet cheek with the back of his paw and laughs, eyes crinkled with fun. The dog sits beside him, wagging; the owner smiles.",
      "„Am Rücken streicheln“ – The little bear himself crouches by the sitting dog and strokes it very gently along its back with one paw, smiling; the dog wags happily, eyes half closed. The owner bends down a little and points at the dog's back, smiling.",
    ],
    instead: [
      "„Den Hund hauen“ – The little bear swats at the small dog with his paw; the dog yelps and ducks back; the owner pulls the leash and gasps.",
      "„An den Ohren ziehen“ – The little bear pulls the small dog by both floppy ears; the dog whimpers and pulls its head back; the owner reaches out, worried.",
      "„Stock nach dem Hund werfen“ – The little bear has just thrown the stick: arm stretched out towards the dog, the stick has just left his paw and flies through the air; the dog flinches and ducks; the owner startles. The stick no longer lies on the path: only ONE stick, in the air.",
    ],
    end: "The little bear stands on the path and waves goodbye, smiling; the small dog walks away on its leash beside its owner, looks back at him and wags its tail; the owner waves back.",
  },
  // C-67
  {
    id: "paintbrush",
    place:
      "Zu Hause am Esstisch: der kleine Bär vor seinem Bild, das Bärenbaby im Hochstuhl mit seinem eigenen Blatt und dem Pinsel des Bären, ein Malkasten, ein Becher mit Farbwasser, ein paar Buntstifte; dahinter ein Sofa mit einem Kissen",
    cast: ["bear", "baby"],
    first:
      "A living room at home. At a low wooden table the little bear kneels on a chair in front of his painting: a sheet with a half-painted yellow sun and a red flower. Next to him the bear baby sits in a high chair at the table with its own sheet; the baby has grabbed the little bear's paintbrush and happily smears a big blue blob with it on its own sheet. On the table: one small paint box, one cup of coloured paint water and a few crayons lying in a row. Behind them stands a sofa with exactly one round cushion on it. The little bear is angry: brows down, mouth open shouting, red cheeks drawn flat, fists clenched, one paw pointing at his paintbrush in the baby's paw.",
    keep: "Exactly ONE paintbrush in the whole picture (the little bear's), ONE paint box, ONE cup of paint water, the same few crayons, ONE round cushion on the sofa. The little bear's painting with the sun and the flower and the baby's own sheet with its blue blob stay on the table.",
    steps: [
      "„„Das ist meiner!“ sagen“ – The little bear himself says it out loud, one paw on his chest, the other held out open, palm up, towards the baby; the baby holds the paintbrush out to him, giving it back, curious. He looks calm now, plain brown face, NO red or pink patches at all.",
      "„Ins Kissen boxen“ – The little bear himself kneels on the sofa and punches the round cushion with both fists, the cushion squashed under them, little motion lines round it; the anger is going out of his face, relieved, plain brown face, NO red or pink patches at all. His chair at the table is empty now: only ONE little bear in the whole picture. The baby in the high chair watches, the paintbrush in its paw.",
      "„Buntstift geben“ – The little bear himself holds out one crayon to the baby; the baby takes the crayon in one paw and lets go of the paintbrush, which the little bear now holds in his other paw. Both smile, the little bear with a plain brown face, NO red or pink patches at all.",
    ],
    instead: [
      "„Pinsel wegreißen“ – The little bear yanks the paintbrush out of the baby's paw; the baby bursts into tears, its empty paws up.",
      "„Farbbecher werfen“ – The little bear has just thrown the cup of paint water: arm stretched out, the cup tumbling through the air past the high chair, coloured water splashing out over the table and the floor; the baby startles. The cup is no longer on the table.",
      "„Blatt vom Baby zerreißen“ – The little bear tears the baby's sheet with the blue blob in two halves; the baby cries.",
    ],
    end: "The little bear and the bear baby paint together side by side and smile: the little bear with his paintbrush on his painting, the baby with the crayon on its own sheet. The little bear's face is happy, plain brown face, NO red or pink patches at all.",
  },
  // C-69
  {
    id: "bluecup",
    place:
      "Küche am Morgen: Frühstückstisch mit einem roten Becher voll Milch, einer Schüssel Haferbrei und einem Löffel; ein leerer blauer Becher an der Spüle; der große Bär mit dem Milchkrug",
    cast: ["bear", "bigBear"],
    first:
      "A bright kitchen in the morning. At the breakfast table the little bear sits on a chair; in front of him exactly one red cup full of milk, one bowl of porridge and one spoon. Beside the table stands the big bear holding a milk jug: he has just poured the milk into the red cup and looks surprised. Behind them on the counter beside the sink stands exactly one empty blue cup, plainly seen. The little bear is angry: he points at the blue cup by the sink, brows down, mouth open shouting, red cheeks drawn flat, leaning away from the red cup.",
    keep: "Exactly ONE red cup and ONE blue cup in the whole picture, ONE bowl of porridge, ONE spoon, ONE milk jug. Morning light.",
    steps: [
      "„„Ich will den blauen!“ sagen“ – The little bear himself, sitting at the table, says it out loud and points at the blue cup by the sink, calm now, plain brown face, NO red or pink patches at all; the big bear nods kindly and smiles.",
      "„Ganz fest stampfen“ – The little bear himself stands beside his chair, seen whole down to both feet, dressed exactly as in the picture: light-blue t-shirt and dark blue-purple trousers. Both his feet stamp on the floor together, little impact lines under both soles, arms down, fists loose; nothing lies in front of his feet. The anger is going out of him, relieved, plain brown face, NO red or pink patches at all. His chair is empty now: only ONE little bear. The big bear watches calmly.",
      "„Selbst umgießen“ – The little bear himself, sitting at the table, pours the milk from the red cup into the blue cup with both paws, careful and proud, plain brown face, NO red or pink patches at all; the big bear stands beside him and holds the blue cup steady with one paw, smiling. The counter by the sink is empty now: only ONE blue cup, on the table.",
    ],
    instead: [
      "„Roten Becher umkippen“ – The little bear knocks the red cup over with his paw: it lies on its side, the milk running across the table and dripping onto the floor; the big bear lifts his paws in surprise.",
      "„Mit dem Löffel hauen“ – The little bear bangs the spoon hard on the table, porridge splashing up out of the bowl in little blobs; the big bear covers one ear.",
      "„Brei runterschieben“ – The little bear pushes the bowl of porridge off the edge of the table with both paws: it has just tipped over the edge and is falling, porridge flying; the big bear reaches out too late. The bowl is no longer on the table.",
    ],
    end: "The little bear sits at the table and drinks happily from the blue cup, smiling, plain brown face, NO red or pink patches at all; the empty red cup stands beside the porridge bowl; the big bear sits beside him, smiling.",
  },
  // C-70
  {
    id: "nap",
    place:
      "Schlafraum im Kindergarten am Mittag: drei Matten mit Decken, Vorhänge zu, gedämpftes Licht; der Fuchs und der Igel schlafen, der kleine Bär liegt wach mit seinem Kuschelhasen, die Erzieherin sitzt leise auf einem Stuhl an der Tür",
    cast: ["bear", "fox", "hedgehog", "teacher"],
    first:
      "The nap room of a kindergarten at midday, curtains drawn, soft dim light. Three low mats lie in a row on the floor, each with a pillow and a blanket. On the left mat the fox lies fast asleep under a green blanket, eyes closed; on the right mat the little hedgehog sleeps curled up under a yellow blanket. On the middle mat the little bear lies wide awake under a blue blanket, eyes wide open, wriggling: legs kicking the blanket half off, arms flung about, a restless, unhappy face. Beside his pillow lies his cuddly toy, one small white plush bunny. At the door at the back the teacher sits quietly on a small chair, her hands in her lap, looking calmly over the room.",
    keep: "Exactly ONE small white plush bunny, the little bear's cuddly toy. The fox and the little hedgehog sleep on their mats, eyes closed, unless the picture says they wake. The teacher stays sitting on her chair at the door. Curtains drawn, soft dim light.",
    steps: [
      "„Kuschelhasen drücken“ – The little bear himself lies on his mat and hugs the white plush bunny tightly to his chest with both arms, eyes softly closing, a calm small smile; the blue blanket is back over his legs. The others sleep on.",
      "„Langsam pusten“ – The little bear himself lies on his back on his mat and blows out a long, slow breath, lips rounded as if blowing at a candle; a soft little cloud of breath rises straight upwards into the empty air above him, towards the ceiling, far from the sleeping children. Eyes half closed, a calm relieved face. The plush bunny lies beside his pillow.",
      "„An etwas Schönes denken“ – The little bear himself lies perfectly still on his back, paws folded on his tummy, the blanket smooth over him, eyes half open gazing upwards, a dreamy happy little smile, as if thinking of something lovely. The plush bunny lies tucked beside him. The others sleep on.",
    ],
    instead: [
      "„Den Fuchs anstupsen“ – The little bear leans over from his mat and pokes the sleeping fox in the side with one finger; the fox has woken up with a start and begins to cry, rubbing his eyes.",
      "„Laut singen“ – The little bear sits up on his mat and sings loudly, mouth wide open, arms flung wide; the fox and the little hedgehog have woken up and sit up, the hedgehog crying, paws over its ears; the teacher looks up from her chair. No music notes.",
      "„Durch den Raum rennen“ – The little bear has jumped up, run across the room and tripped over the little hedgehog's mat: he stumbles forwards, arms out; the hedgehog wakes up crying. His own mat is empty now: only ONE little bear in the whole picture.",
    ],
    end: "The little bear lies fast asleep on his mat under his blue blanket, eyes closed, a peaceful smile, the white plush bunny in his arms; the fox and the little hedgehog sleep too; at the door the teacher smiles.",
  },
  // C-71
  {
    id: "teeth",
    place:
      "Badezimmer am Abend: Waschbecken mit Spiegel und einem kleinen Tritthocker davor, auf dem Beckenrand ein Zahnputzbecher und eine kleine Sanduhr; der große Bär hält die Zahnbürste mit Zahnpasta, der kleine Bär im Schlafanzug",
    cast: ["bear", "bigBear"],
    first:
      "A small bathroom in the evening, warm lamp light, light tiles, one bath mat on the floor. A washbasin with a big mirror above it, the mirror showing only a soft shine, no reflection; in front of the basin a small wooden step stool. On the basin's edge stand exactly one toothbrush cup and exactly one small sand timer with blue sand. The big bear crouches beside the basin and holds out exactly one small toothbrush with a blob of toothpaste on it. The little bear, in light-blue pyjamas with little yellow stars and barefoot, stands on the bath mat in front of him with his mouth pressed tightly shut, lips pulled in, head turned away, arms crossed, brows down, cross and stubborn, red cheeks drawn flat.",
    keep: "The little bear wears light-blue pyjamas with little yellow stars instead of his t-shirt and trousers, barefoot. Exactly ONE toothbrush with toothpaste, ONE toothbrush cup, ONE small sand timer with blue sand, ONE step stool, ONE bath mat. The mirror shows only a soft shine, no reflection. Evening lamp light.",
    steps: [
      "„Ganz fest stampfen“ – The little bear himself stamps on the bath mat with both bare feet at once, seen whole down to both feet, little impact lines under both soles, fists loose at his sides, mouth open saying it out loud; the anger is going out of him, his face easing, plain brown face, NO red or pink patches at all. Nothing lies in front of his feet. The big bear, still holding out the toothbrush, nods calmly.",
      "„Sanduhr umdrehen“ – The little bear himself stands on the step stool and turns the small sand timer over with one paw, the blue sand starting to run down; he is curious and pleased, plain brown face, NO red or pink patches at all. The big bear watches, smiling, the toothbrush in his paw.",
      "„Selbst putzen“ – The little bear himself stands on the step stool and brushes his teeth with the toothbrush, a little foam at his mouth, proud, plain brown face, NO red or pink patches at all; the big bear stands beside him smiling, his paws empty. Only ONE toothbrush, in the little bear's paw.",
    ],
    instead: [
      "„Zahnbürste wegschlagen“ – The little bear swats the toothbrush out of the big bear's paw: it flies down towards the floor, the blob of toothpaste with it; the big bear pulls back his paw, surprised. Only ONE toothbrush, in the air.",
      "„Wegrennen“ – The little bear runs away from the basin towards the door and slips on the smooth tiles beside the bath mat, falling forwards with arms out; the big bear turns round, worried.",
      "„Becher runterwerfen“ – The little bear sweeps the toothbrush cup off the basin's edge with his paw: it is falling, just above the floor, a crack in it; the big bear lifts his paws. The cup is no longer on the basin.",
    ],
    end: "The little bear stands on the step stool in front of the mirror and grins widely, showing his clean teeth, proud, plain brown face, NO red or pink patches at all; the big bear beside him smiles. The sand timer has run through: all the blue sand is at the bottom.",
  },
  // C-72
  {
    id: "bedtime",
    place:
      "Wohnzimmer am Abend: eine Holzeisenbahn mit Schienen und einem Tunnel auf dem Teppich, ein niedriges Regal mit ein paar Bilderbüchern, ein Sofa; der große Bär mit einem grünen Bilderbuch, der kleine Bär im Schlafanzug",
    cast: ["bear", "bigBear"],
    first:
      "A cosy living room in the evening, a lamp glowing, dark blue night outside the window. On the rug a small wooden train set: one locomotive with two wagons on a ring of wooden track, and one wooden tunnel over the track. The little bear, in light-blue pyjamas with little yellow stars, kneels by the train with the locomotive in one paw and shakes his head angrily, brows down, mouth pouting, red cheeks drawn flat. The big bear stands beside the sofa holding one picture book with a green cover and beckons him with his other paw. Against the wall a low shelf with a few picture books; one of them, with a big yellow moon on its cover, stands face out.",
    keep: "The little bear wears light-blue pyjamas with little yellow stars instead of his t-shirt and trousers. Exactly ONE wooden locomotive with TWO wagons, ONE ring of wooden track, ONE wooden tunnel; the big bear's ONE picture book with a green cover; ONE low shelf with a few picture books, among them ONE with a big yellow moon on its cover. Evening lamp light, night outside the window.",
    steps: [
      "„Fäuste drücken“ – The little bear himself kneels by the train and squeezes both fists tight in front of his chest, eyes shut, saying it out loud; the anger is going out of him, his face easing, plain brown face, NO red or pink patches at all. The locomotive stands on the track. The big bear crouches near him, listening kindly.",
      "„Zug in den Tunnel fahren“ – The little bear himself lies on his tummy on the rug and pushes the locomotive with its two wagons into the wooden tunnel, only the last wagon still showing, a soft sleepy smile, plain brown face, NO red or pink patches at all. The big bear smiles, the green book in his paws.",
      "„Buch aussuchen“ – The little bear himself stands at the low shelf and holds up the picture book with the big yellow moon, showing it proudly to the big bear, smiling, plain brown face, NO red or pink patches at all; the big bear smiles, holding his green book. Its place on the shelf is empty now: only ONE moon book, in the little bear's paws. The train stands on the track.",
    ],
    instead: [
      "„Eisenbahn werfen“ – The little bear has just thrown the locomotive: arm stretched out towards the empty corner of the room, away from the big bear, the locomotive flying through the air, one wheel coming off; the big bear startles. The two wagons stay on the track.",
      "„Schienen kaputt treten“ – The little bear kicks the wooden track with one foot: the ring breaks apart, track pieces and the two wagons scattering across the rug, the tunnel knocked over; the big bear lifts his paws in surprise.",
      "„Buch zerreißen“ – The little bear tugs at the green picture book in the big bear's paws: one page tears in two; the big bear looks sad.",
    ],
    end: "The big bear sits on the sofa and reads the picture book with the big yellow moon aloud; the little bear, in his pyjamas, snuggles sleepily against him, smiling, plain brown face, NO red or pink patches at all. The green book lies on the sofa beside them, and the train rests in its tunnel on the rug.",
  },
];

/** Every picture of the everyday scenes still to be made, for the picture queue. */
export const ALLTAG_PICTURE_QUEUE: QueuedPicture[] = ALLTAG_DRAWINGS.flatMap(storyPictures);
