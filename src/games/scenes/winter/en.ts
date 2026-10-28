import type { SceneTranslation } from "../types";

// The English words of the Winter picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except „Grandpa“, „Mommy“ (said like names) and „Christmas tree“;
// plural names are marked `plural`.

/** „Winter“ in English. */
export const EN: SceneTranslation = {
  title: "Winter",
  description: "Snowman, sled, ice skating and a horse-drawn sleigh in the snow.",
  items: {
    sonne: { name: "sun", sentences: ["The winter sun is shining!", "The sun is smiling. But it is cold!"] },
    schneewolke: { name: "snow cloud", sentences: ["The cloud makes it snow!", "Snowflakes fall very quietly.", "The cloud is white and soft."] },
    schneeflocke: {
      name: "snowflake",
      sentences: ["The snowflake is spinning!", "Sparkle, sparkle! The snowflake twinkles.", "Every snowflake has six points."],
    },
    kirchturm: {
      name: "church tower",
      sentences: ["Ding, dong! The bell is ringing.", "A rooster turns on top of the tower.", "The clock on the tower shows the time."],
    },
    hase: { name: "rabbit", sentences: ["Look, a rabbit in the snowy bush!", "Hop, hop, goes the rabbit."] },
    schneetanne: {
      name: "fir tree",
      sentences: ["The fir tree shakes. The snow falls off!", "The fir tree is green in winter.", "Plop! Lots and lots of snow."],
    },
    eichhoernchen: { name: "squirrel", sentences: ["The squirrel sits in the fir tree.", "The squirrel nibbles a nut."] },
    futterkrippe: {
      name: "deer feeder",
      sentences: ["There is hay for the deer in the deer feeder.", "In winter the animals find little food.", "There are carrots and an apple too!"],
    },
    reh: { name: "deer", sentences: ["The deer comes to the deer feeder.", "Hop! The deer jumps through the snow.", "The deer has big ears."] },
    holzhaus: { name: "log cabin", sentences: ["It is warm and cozy in the log cabin.", "Smoke comes out of the chimney.", "The door opens. Who is there?"] },
    eiszapfen: {
      name: "icicles",
      plural: true,
      sentences: ["Icicles hang from the roof.", "The icicles sparkle. Drip, drip!", "Icicles are cold and slippery."],
    },
    tannenbaum: {
      name: "Christmas tree",
      sentences: ["The Christmas tree lights up!", "There is a star on top of the tree.", "There are presents under the tree."],
    },
    schneeopa: { name: "Grandpa", sentences: ["Grandpa pushes the snow away.", "Heave-ho! The path is clear.", "Phew, Grandpa is puffing."] },
    vogelhaus: { name: "birdhouse", sentences: ["The birdhouse has seeds for the birds.", "The suet ball swings."] },
    meise: { name: "blue tit", sentences: ["Tweet! The blue tit pecks at seeds.", "The blue tit has a blue head and a yellow tummy."] },
    eisente: { name: "duck", sentences: ["Whee! The duck slides on the ice.", "Quack! The ice is so slippery!", "The duck has a red scarf."] },
    eislaeuferin: { name: "ice skater", sentences: ["The girl is ice skating.", "She spins in a circle. How pretty!", "The ice sparkles."] },
    iglu: { name: "igloo", sentences: ["The igloo is made of snow.", "Who lives in the igloo? Hello!", "The light turns on in the igloo."] },
    skifahrer: { name: "skier", sentences: ["The boy is skiing. Whee!", "He pushes off with his poles.", "The snow puffs up."] },
    schlitten: { name: "sled", sentences: ["Yippee! The child goes sledding.", "The sled zooms down the hill.", "Jingle, jingle, goes the bell."] },
    rutscher: { name: "saucer sled", sentences: ["The child slides on the saucer sled.", "It spins in a circle. Yippee!", "The saucer sled is red."] },
    schlittschuhe: {
      name: "ice skates",
      plural: true,
      sentences: ["Here are some ice skates.", "With ice skates you can skate on the ice.", "Hop! The ice skates are hopping."],
    },
    schlittenmama: { name: "Mommy", sentences: ["Mommy pulls the sled.", "The baby waves. Hello!", "Crunch, crunch, goes the snow."] },
    parkbank: { name: "bench", sentences: ["There is snow on the bench.", "Plop! The snow falls off.", "You can have a rest here."] },
    kakao: { name: "hot cocoa", sentences: ["Mmm, hot cocoa!", "Blow, blow! The cocoa is hot.", "The cocoa warms the hands."] },
    rotkehlchen: { name: "robin", sentences: ["The robin sits on the bench.", "Tweedle-dee! The robin sings."] },
    pferdeschlitten: { name: "sleigh", sentences: ["The horse pulls the sleigh.", "Jingle, jingle! The little bells ring.", "Giddy-up, little horse, go!"] },
    laterne: { name: "street lamp", sentences: ["The street lamp turns on. It gets dark early in winter.", "The street lamp has a snow hat."] },
    handschuh: { name: "mitten", sentences: ["There is a mitten in the snow.", "Who lost the mitten?", "Look, someone lives in the mitten!"] },
    winterfuchs: {
      name: "fox",
      sentences: ["Hop! The fox jumps into the snow.", "The fox hears a mouse under the snow.", "The fox has a bushy tail."],
    },
    schneekugel: { name: "snowball", sentences: ["The child rolls a big snowball.", "The ball gets bigger and bigger!", "It will become a snowman."] },
    schneeengel: { name: "snow angel", sentences: ["The girl makes a snow angel.", "Arms up, arms down!", "Hee-hee, the snow tickles."] },
    schneemann: { name: "snowman", sentences: ["Hello, snowman!", "The snowman has a carrot nose.", "The snowman tips his hat."] },
    schneeballkinder: { name: "children", plural: true, sentences: ["The children have a snowball fight!", "Splat! Missed!", "The children laugh."] },
    hund: {
      name: "dog",
      sentences: ["Woof, woof! The dog plays in the snow.", "The dog wags its tail.", "The dog wants a snowball too!"],
    },
    fussspuren: { name: "footprints", plural: true, sentences: ["Here are tracks in the snow. Who made them?", "Crunch, crunch! Tracks in the snow."] },
  },
  chains: [
    ["The dog wants to play too. Woof, woof!", "Splat! A snowball hits the snowman. He tips his hat."],
    ["Who made them? The fox! Hop, it jumps into the snow.", "The robin gets a fright and hops away."],
    ["Now the saucer sled zooms down the hill.", "And the skier comes after it!"],
  ],
};
