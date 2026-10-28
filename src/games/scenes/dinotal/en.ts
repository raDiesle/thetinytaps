import type { SceneTranslation } from "../types";

// The English words of the Dinotal picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except „T. rex“, written as usual; plural names are marked `plural`.

/** „Dinotal“ in English. */
export const EN: SceneTranslation = {
  title: "Dino Valley",
  description: "Brachiosaurus, triceratops, dino eggs and a T. rex who has to sneeze.",
  items: {
    sonne: { name: "sun", sentences: ["The sun shines warmly into Dino Valley.", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "After the rain the ferns grow."] },
    flugsaurier: {
      name: "pterosaur",
      sentences: ["Whee! The pterosaur flies a big circle.", "The pterosaur has big wings made of skin.", "Squawk! The pterosaur calls."],
    },
    vulkan: {
      name: "volcano",
      sentences: ["Puff, puff! The volcano puffs out a cloud.", "The volcano rumbles in a friendly way.", "The volcano is a big mountain."],
    },
    baum: { name: "tree", sentences: ["The tree is gigantic.", "Rustle, rustle! The leaves rustle.", "Yummy fruits grow on the tree."] },
    urvogel: { name: "archaeopteryx", sentences: ["Tweet! The archaeopteryx sits on the branch.", "The archaeopteryx has feathers and claws on its wings."] },
    brachiosaurus: {
      name: "brachiosaurus",
      sentences: [
        "Munch, munch! The brachiosaurus eats from the top of the tree.",
        "The brachiosaurus has a very long neck.",
        "The brachiosaurus is gigantic.",
      ],
    },
    hoehle: { name: "cave", sentences: ["Who lives in the cave? Hee-hee!", "It is dark in the cave.", "A little dino peeks out: Hello!"] },
    flugbaby: { name: "baby pterosaur", sentences: ["Peep, peep! The baby pterosaur is hungry.", "The baby pterosaur lives in the nest on top of the rock."] },
    parasaurolophus: {
      name: "parasaurolophus",
      sentences: ["Toot, toot! The parasaurolophus toots.", "The parasaurolophus has a long tube on its head."],
    },
    wassersaurier: { name: "plesiosaur", sentences: ["Blub! The plesiosaur dives under.", "Splash! There it is again.", "The plesiosaur swims in the lake."] },
    libelle: { name: "dragonfly", sentences: ["Zzzzt! The dragonfly flies over the lake.", "The dragonfly is blue."] },
    fisch: { name: "fish", sentences: ["Splash! The fish jumps out of the water.", "The fish is orange. Blub!"] },
    seerose: { name: "water lily", sentences: ["The water lily opens its flower.", "The water lily floats on the water."] },
    frosch: { name: "frog", sentences: ["Ribbit! The frog sits on the water lily.", "Hop! The frog hops."] },
    schildkroete: { name: "turtle", sentences: ["The turtle pulls in its head.", "Peekaboo! There is the head again.", "The turtle sunbathes on the stone."] },
    palmfarn: { name: "palm", sentences: ["The palm has big green leaves.", "Rustle, rustle! The leaves wave."] },
    stegosaurus: {
      name: "stegosaurus",
      sentences: ["Ping, ping! The plates on its back wobble.", "The stegosaurus has spikes on its tail.", "The stegosaurus eats only leaves."],
    },
    triceratops: {
      name: "triceratops",
      sentences: ["The triceratops has three horns.", "Snort! The triceratops nods its head.", "The triceratops is yellow."],
    },
    babytri: { name: "baby triceratops", sentences: ["The baby triceratops hops to its mommy.", "The baby triceratops has very small horns."] },
    dinomama: {
      name: "dino mommy",
      sentences: ["The dino mommy looks after her eggs.", "The dino mommy hums a song.", "The dino mommy has a flower on her head."],
    },
    nest: { name: "nest", sentences: ["There are three dino eggs in the nest.", "Tock, tock! Who is knocking in the egg?"] },
    ankylosaurus: { name: "ankylosaurus", sentences: ["The ankylosaurus has armor.", "Boom! The ankylosaurus swings its tail club."] },
    baumstamm: { name: "log", sentences: ["The log is hollow inside.", "Knock, knock! Who lives in the log?"] },
    eidechse: { name: "lizard", sentences: ["The lizard sunbathes on the log.", "The lizard does push-ups. Hop, hop!"] },
    dinoei: { name: "dino egg", sentences: ["Crack! A little dino hatches from the egg.", "Hello, little dino!", "The dino egg wobbles."] },
    pfuetze: { name: "puddle", sentences: ["Splash! A dino jumped into the puddle.", "Here are big footprints."] },
    bernstein: { name: "amber", sentences: ["The amber sparkles like gold.", "There is a little leaf inside the amber."] },
    kaefer: { name: "beetle", sentences: ["Buzz! The beetle flies a little way.", "The beetle is red."] },
    pilze: { name: "mushrooms", plural: true, sentences: ["The mushrooms are hopping. Hop, hop, hop!", "Puff! The mushrooms puff out spores."] },
    trex: { name: "T. rex", sentences: ["The T. rex roars very softly: Rrr …", "Ah … ah … achoo! The T. rex has to sneeze.", "Bless you, dear T. rex!"] },
    blume: { name: "flower", sentences: ["The flower opens its petals.", "The flower is pink."] },
    schmetterling: { name: "butterfly", sentences: ["The butterfly is yellow.", "The butterfly flutters over the flower."] },
    schnecke: { name: "snail", sentences: ["The snail crawls very slowly.", "The snail has a pink house."] },
    farn: { name: "fern", sentences: ["The fern is very, very old.", "The fern unrolls a leaf."] },
    schachtelhalm: { name: "horsetail", sentences: ["The horsetail springs back and forth.", "Boing! The horsetail bounces."] },
  },
  chains: [
    ["Oh! The pterosaur gets a fright and flies a circle.", "And the archaeopteryx peeps: Bless you!"],
    ["Crack! The dino baby hatches from the egg.", "The dino mommy is happy: Hello, my little one!"],
    ["The parasaurolophus toots: Toot, toot!", "And the brachiosaurus looks: What is going on?"],
  ],
};
