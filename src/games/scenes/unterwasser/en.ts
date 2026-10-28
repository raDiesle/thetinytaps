import type { SceneTranslation } from "../types";

// The English words of the Unterwasser picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case; plural names are marked `plural`.

/** „Unterwasser“ in English. */
export const EN: SceneTranslation = {
  title: "Under the Sea",
  description: "Whale, octopus and treasure chest in the sea.",
  items: {
    leuchtturm: { name: "lighthouse", sentences: ["The lighthouse shines brightly.", "That is how the ships find their way."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "The rain falls into the sea."] },
    moewe: { name: "seagull", sentences: ["Squawk, squawk! The seagull flies over the sea.", "The seagull is looking for a fish."] },
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun makes the water warm."] },
    anker: { name: "anchor", sentences: ["Clank, clank! The anchor goes up.", "Plop! The anchor falls into the sand."] },
    boot: { name: "boat", sentences: ["Toot, toot! The boat rocks on the waves.", "The captain waves from the boat."] },
    wal: { name: "whale", sentences: ["Pfffff! The whale sprays a fountain.", "The whale sings: Oooooh!", "The whale is very big."] },
    delfin: { name: "dolphin", sentences: ["Whee! The dolphin jumps out of the water.", "Ee-ee-ee! The dolphin laughs."] },
    rochen: { name: "ray", sentences: ["The ray flies through the water.", "The ray flaps its fins."] },
    fische: { name: "fish", plural: true, sentences: ["The fish swim in a circle.", "Lots of little fish swim together."] },
    qualle: { name: "jellyfish", sentences: ["The jellyfish floats up.", "Wibble, wobble! The jellyfish is pink."] },
    schiff: {
      name: "shipwreck",
      sentences: ["Ding, dong! The bell on the shipwreck rings.", "A fish lives in the shipwreck.", "The shipwreck lies on the sea floor."],
    },
    uboot: { name: "submarine", sentences: ["Ping! The submarine dives through the sea.", "The submarine is yellow.", "The captain looks out of the window."] },
    seepferdchen: { name: "seahorse", sentences: ["Hop, hop! The seahorse bobs in the water.", "The seahorse is yellow."] },
    schildkroete: { name: "turtle", sentences: ["The turtle paddles with its flippers.", "The turtle swims very slowly."] },
    meerjungfrau: { name: "mermaid", sentences: ["The mermaid sings a song. La, la, la!", "The mermaid waves to you."] },
    taucher: { name: "diver", sentences: ["Blub, blub! The diver makes bubbles.", "The diver waves."] },
    schnecke: { name: "sea snail", sentences: ["The sea snail hides in its shell.", "Peekaboo! There is the sea snail again."] },
    koralle: { name: "coral", sentences: ["The coral sparkles.", "The coral is colorful."] },
    clownfisch: { name: "clownfish", sentences: ["Oh! The clownfish hides.", "The clownfish lives in the anemone."] },
    krake: { name: "octopus", sentences: ["The octopus waves with eight arms.", "Hello! The octopus is red."] },
    hai: { name: "shark", sentences: ["The shark swims around.", "The shark laughs. It is very friendly."] },
    hummer: { name: "lobster", sentences: ["Snip, snap! The lobster lifts its claws.", "The lobster is red."] },
    krabbe: { name: "crab", sentences: ["The crab walks sideways.", "Snip, snap! The crab clicks its claws."] },
    schatztruhe: { name: "treasure chest", sentences: ["The treasure chest opens. There is gold inside!", "Oh, how it sparkles!"] },
    seestern: { name: "starfish", sentences: ["The starfish dances in a circle.", "The starfish has five arms."] },
    flaschenpost: { name: "message in a bottle", sentences: ["Pop! The message in a bottle opens.", "There is a letter in the bottle."] },
    seegras: { name: "seaweed", sentences: ["The seaweed sways back and forth.", "Look! A little fish lives in the seaweed."] },
    flunder: { name: "flounder", sentences: ["Oh! The flounder was hiding in the sand.", "The flounder is very flat."] },
    kugelfisch: { name: "pufferfish", sentences: ["Pfff! The pufferfish puffs up big and round.", "The pufferfish is yellow."] },
    blauerfisch: { name: "blue fish", sentences: ["The blue fish swims back and forth.", "Blub! The blue fish makes bubbles."] },
    luftblasen: { name: "bubbles", plural: true, sentences: ["Blub, blub! The bubbles rise up.", "Pop! The bubbles burst."] },
    gruenerfisch: { name: "green fish", sentences: ["The green fish wiggles its fin.", "Blub! The green fish makes bubbles."] },
    seeigel: { name: "sea urchin", sentences: ["The sea urchin wiggles its spines.", "Hop! The sea urchin is purple."] },
    muschel: { name: "clam", sentences: ["The clam opens. There is a pearl inside!", "The pearl shines."] },
  },
  chains: [
    ["The dolphin jumps through the fountain!", "And the boat rocks on the waves."],
    ["The diver finds a treasure chest!", "The crab dances around the treasure."],
    ["The octopus waves to the shark.", "And the clownfish hides quickly!"],
  ],
};
