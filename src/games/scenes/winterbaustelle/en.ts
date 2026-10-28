import type { SceneTranslation } from "../types";

// The English words of the Winter-Baustelle picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except „Christmas tree“; plural names are marked `plural`.

/** „Winter-Baustelle“ in English. */
export const EN: SceneTranslation = {
  title: "Winter Construction Site",
  description: "Snowplow, snowman and sled at the construction site in the snow.",
  items: {
    sonne: { name: "sun", sentences: ["The winter sun is shining!", "The sun is smiling, but it is cold."] },
    schneewolke: { name: "snow cloud", sentences: ["The cloud makes it snow!", "Snowflakes fall very quietly.", "The cloud is white and soft."] },
    heli: { name: "helicopter", sentences: ["The helicopter flies over the snow.", "Chop, chop, goes the helicopter."] },
    hase: { name: "rabbit", sentences: ["Look, a rabbit in the snowy bush!", "Hop, hop, goes the rabbit."] },
    klo: { name: "toilet", sentences: ["Knock, knock! The toilet is busy.", "There is snow on the toilet.", "The door opens. Who is in there?"] },
    bauwagen: {
      name: "site trailer",
      sentences: ["It is nice and warm in the site trailer.", "Yum, there is hot cocoa in the site trailer!", "A string of lights shines on the site trailer."],
    },
    schneetanne: {
      name: "fir tree",
      sentences: ["The fir tree shakes. The snow falls off!", "The fir tree is green in winter.", "Plop! Lots and lots of snow."],
    },
    eichhoernchen: { name: "squirrel", sentences: ["The squirrel sits in the fir tree.", "The squirrel nibbles a nut from its stash."] },
    container: { name: "container", sentences: ["The container is full of snow.", "Whump! The snow slides off."] },
    gabelstapler: { name: "forklift", sentences: ["The forklift lifts the boxes up.", "Up and down, in the snow too!"] },
    iglu: { name: "igloo", sentences: ["The igloo is made of snow.", "Who lives in the igloo? Hello!", "The light turns on in the igloo."] },
    haus: { name: "house", sentences: ["A house is being built here, even in winter!", "There is snow on the house.", "Soon someone will live here."] },
    eiszapfen: {
      name: "icicles",
      plural: true,
      sentences: ["Icicles hang at the window.", "The icicles sparkle. Drip, drip!", "Icicles are cold and slippery."],
    },
    katze: { name: "cat", sentences: ["Meow! The cat has cold paws.", "The cat sits on the wall in the snow."] },
    kran: { name: "crane", sentences: ["The crane lifts the bricks up!", "There is snow on the crane.", "Up, up, up with the crane!"] },
    weihnachtsbaum: {
      name: "Christmas tree",
      sentences: ["There is a Christmas tree on top of the crane!", "The lights on the Christmas tree twinkle.", "The star sparkles."],
    },
    radio: { name: "radio", sentences: ["The radio plays a winter song. La, la, la!", "Music keeps us warm."] },
    bagger: { name: "excavator", sentences: ["The excavator shovels snow!", "Vroom, vroom! The excavator makes a snow mountain.", "The excavator is yellow."] },
    karre: { name: "wheelbarrow", sentences: ["The wheelbarrow rolls!", "There is snow in the wheelbarrow."] },
    schild: { name: "sign", sentences: ["Watch out, construction site!", "Watch out, it is slippery!"] },
    teearbeiter: { name: "builder", sentences: ["The builder drinks hot tea. Blow, blow!", "He wears a warm hat.", "The fire warms the hands."] },
    feuertonne: { name: "fire barrel", sentences: ["A fire is burning in the barrel.", "Crackle, crackle! The fire is warm.", "Don't touch, it is hot!"] },
    vogelhaus: { name: "bird feeder", sentences: ["The bird feeder has seeds for the birds.", "The suet ball swings."] },
    meise: { name: "blue tit", sentences: ["Tweet! The blue tit pecks at seeds.", "The blue tit has a blue head and a yellow tummy."] },
    schneeschaufel: { name: "snow shovel", sentences: ["We shovel snow with the shovel.", "Heave-ho! The snow flies up."] },
    laterne: { name: "street lamp", sentences: ["The street lamp turns on. It gets dark early in winter.", "The street lamp has a snow hat."] },
    streuwagen: {
      name: "salt truck",
      sentences: ["The salt truck spreads salt on the road.", "Now the road is not slippery anymore.", "The disc spins fast."],
    },
    kipper: { name: "dump truck", sentences: ["The dump truck takes the snow away!", "Watch out, the dump truck tips out the snow!"] },
    schneepflug: {
      name: "snowplow",
      sentences: ["The snowplow pushes the snow away!", "Vroom! The snowplow clears the road.", "The snowplow is orange."],
    },
    winterfuchs: {
      name: "fox",
      sentences: ["Hop! The fox jumps into the snow.", "The fox hears a mouse under the snow.", "The fox has a bushy tail."],
    },
    schlitten: { name: "sled", sentences: ["Yippee! The child goes sledding.", "The sled zooms through the snow.", "Jingle, jingle, goes the bell."] },
    rotkehlchen: { name: "robin", sentences: ["The robin hops through the snow.", "Tweedle-dee! The robin sings."] },
    schneemann: { name: "snowman", sentences: ["Hello, snowman!", "The snowman has a carrot nose.", "The snowman tips his hat."] },
    schneeballkinder: { name: "children", plural: true, sentences: ["The children have a snowball fight!", "Splat! Missed!", "The children laugh."] },
    hund: { name: "dog", sentences: ["Woof, woof! The dog plays in the snow.", "The dog wags its tail."] },
    fussspuren: { name: "footprints", plural: true, sentences: ["Here are tracks in the snow. Who made them?", "Crunch, crunch! Tracks in the snow."] },
    huetchen: { name: "traffic cone", sentences: ["The traffic cone hops!", "The traffic cone has a snow hat."] },
    maus: { name: "mouse", sentences: ["Squeak! The mouse lives in the pipe.", "It is warm in the pipe, says the mouse."] },
  },
  chains: [
    ["Here comes the salt truck and spreads salt.", "And the dump truck takes the snow away."],
    ["Who made them? The fox! Hop, it jumps into the snow.", "The mouse quickly hides in the pipe."],
    ["The robin gets a fright and hops away.", "Plop! The traffic cone wobbles."],
  ],
};
