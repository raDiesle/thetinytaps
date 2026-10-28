import type { SceneTranslation } from "../types";

// The English words of the Herbst picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except family words said like names („Grandpa“),
// which the engine says without „the“; plural names are marked `plural`.

/** „Herbst“ in English. */
export const EN: SceneTranslation = {
  title: "Autumn",
  description: "Colorful leaves, a pumpkin and a kite in the wind.",
  items: {
    sonne: { name: "sun", sentences: ["The autumn sun is shining!", "The sun is smiling.", "The sun is still a little bit warm."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "It often rains in autumn."] },
    herbstwind: { name: "wind", sentences: ["The wind blows: Whoooo!", "The wind blows the leaves away.", "Whoosh! It is windy today."] },
    wildgaense: { name: "wild geese", plural: true, sentences: ["The wild geese fly south.", "Honk, honk! Bye-bye, geese!"] },
    herbstdrachen: { name: "kite", sentences: ["The kite flies way up high!", "The kite dances in the wind.", "The kite has a smiling face."] },
    pflugtraktor: { name: "tractor", sentences: ["The tractor plows the field.", "Chug, chug, chug, goes the tractor."] },
    kraehe: { name: "crow", sentences: ["Caw, caw! The crow calls.", "The crow sits on the post."] },
    schuppen: { name: "shed", sentences: ["The rake and the broom live in the shed.", "Creak! The door opens. Who is in there?"] },
    spinnennetz: { name: "spiderweb", sentences: ["Dewdrops sparkle in the spiderweb.", "The spider climbs down its thread."] },
    baeuerin: { name: "farmer", sentences: ["Hello! Would you like a pumpkin?", "The farmer sells pumpkins."] },
    kuerbisstand: {
      name: "pumpkin stand",
      sentences: ["There are lots of pumpkins at the pumpkin stand.", "Yellow, green and orange pumpkins!", "What is in the box?"],
    },
    apfelkorb: { name: "apple basket", sentences: ["The basket is full of apples.", "Red, green and yellow apples. Mmm!"] },
    ahorn: {
      name: "maple tree",
      sentences: ["The maple tree has red leaves.", "The seeds fly like little helicopters!", "Rustle! The leaves are falling."],
    },
    drachenjunge: { name: "boy", sentences: ["The boy flies the kite.", "Yippee! The boy holds the string very tight."] },
    laubopa: { name: "Grandpa", sentences: ["Grandpa rakes up the leaves.", "Scratch, scratch, goes the rake.", "Grandpa says: Hello!"] },
    laubhaufen: {
      name: "leaf pile",
      sentences: ["Whee! The leaves fly up.", "You can hide in the leaf pile.", "Rustle, rustle! Who is in the leaves?"],
    },
    strickoma: { name: "Grandma", sentences: ["Grandma is knitting a scarf.", "Click, clack, go the needles.", "The scarf gets long and warm."] },
    bankkatze: { name: "cat", sentences: ["Meow! The cat plays with the yarn.", "The cat sits on the bench."] },
    kastanienbaum: {
      name: "chestnut tree",
      sentences: ["Plop! Chestnuts fall down.", "The leaves are yellow and brown.", "The chestnut tree is big."],
    },
    herbsthoernchen: { name: "squirrel", sentences: ["The squirrel gathers nuts for the winter.", "Nibble, nibble! Yummy, a nut."] },
    laubigel: { name: "hedgehog", sentences: ["The hedgehog carries an apple on its back.", "Sniff, sniff! The hedgehog looks for a bed of leaves."] },
    kuerbiswagen: { name: "wagon", sentences: ["There are pumpkins in the wagon.", "Rumble, tumble, the wagon rolls."] },
    laubhund: { name: "dog", sentences: ["Woof, woof! The dog wants to catch the leaf.", "The dog jumps up!"] },
    kastanie: { name: "chestnut", sentences: ["The chestnut is brown and shiny.", "The shell is prickly. Ouch!"] },
    steinpilze: { name: "mushrooms", plural: true, sentences: ["Pop, pop! The mushrooms are growing.", "The mushrooms have brown caps."] },
    kastanienmann: { name: "chestnut man", sentences: ["The chestnut man is dancing!", "He is made of chestnuts."] },
    herbstwindrad: { name: "pinwheel", sentences: ["The pinwheel spins in the wind.", "Red, yellow, blue and green. Whirr!"] },
    amsel: { name: "blackbird", sentences: ["The blackbird nibbles red berries.", "The blackbird sings a song."] },
    riesenkuerbis: {
      name: "pumpkin",
      sentences: ["The pumpkin hops! Rustle, rustle!", "The pumpkin is big and round.", "A mouse lives behind the pumpkin."],
    },
    martinslaterne: {
      name: "lantern",
      sentences: ["Lantern, lantern, sun and moon and stars!", "The lantern shines brightly.", "The child sings a lantern song."],
    },
    matschpfuetze: { name: "puddle", sentences: ["Splash! The puddle splashes.", "A leaf floats like a boat."] },
    pfuetzenkind: {
      name: "girl",
      sentences: ["Hop! The girl jumps into the puddle.", "The girl has an umbrella.", "In rain boots you can jump in puddles!"],
    },
    apfelwurm: { name: "worm", sentences: ["Hello, little worm!", "The worm lives in the apple. Munch, munch!"] },
    herbststiefel: {
      name: "rain boots",
      plural: true,
      sentences: ["The rain boots are hopping!", "Red rain boots with white dots.", "Who is hiding in the boot?"],
    },
    regenschnecke: { name: "snail", sentences: ["The snail likes the rain.", "The snail crawls very slowly."] },
  },
  chains: [
    ["The wind blows the kite way up high!", "And the pinwheel spins.", "The leaves fly off the tree."],
    ["Rain! The girl jumps into the puddle.", "The snail comes out.", "After the rain the mushrooms grow."],
    ["Plop! A chestnut falls down.", "The squirrel saw it!"],
  ],
};
