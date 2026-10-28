import type { SceneTranslation } from "../types";

// The English words of the Bauernhof picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case; plural names are marked `plural`.

/** „Bauernhof“ in English. */
export const EN: SceneTranslation = {
  title: "Farm",
  description: "Cow, tractor and pig on the farm.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "Rain is good for the flowers."] },
    schwalbe: { name: "swallow", sentences: ["The swallow flies very fast!", "Tweet-tweet! The swallow zooms through the air."] },
    windmuehle: { name: "windmill", sentences: ["The windmill turns in the wind.", "The mill makes flour."] },
    maehdrescher: { name: "combine harvester", sentences: ["The combine harvester cuts the grain.", "Vroom! The grain comes out at the top."] },
    bauernhaus: {
      name: "farmhouse",
      sentences: [
        "The farm family lives in the farmhouse.",
        "Hello! The farmer waves from the window.",
        "The door opens. Who is in there?",
        "The light turns on!",
      ],
    },
    storch: { name: "stork", sentences: ["Clack, clack! The stork clacks its beak.", "The stork lives up in the nest."] },
    katze: { name: "cat", sentences: ["Meow! The cat sits by the door.", "The cat is washing itself."] },
    scheune: { name: "barn", sentences: ["The doors open. There is hay in the barn!", "The barn is big and red."] },
    eule: { name: "owl", sentences: ["Hoo-hoo! The owl lives in the barn.", "The owl has big eyes."] },
    baum: { name: "apple tree", sentences: ["Plop! The apples fall into the grass.", "Red apples grow on the apple tree."] },
    hahn: { name: "rooster", sentences: ["Cock-a-doodle-doo! The rooster crows.", "The rooster sits on the fence."] },
    pferd: { name: "horse", sentences: ["Giddy-up! The horse rears up.", "The horse neighs.", "The horse is brown."] },
    heuballen: { name: "hay bale", sentences: ["The hay bale rolls!", "Hay is food for the cows."] },
    vogelscheuche: { name: "scarecrow", sentences: ["The scarecrow wobbles. Shoo, birds!", "The scarecrow has a hat."] },
    schaf: { name: "sheep", sentences: ["Baa! The sheep hops.", "The sheep has soft wool."] },
    kuh: { name: "cow", sentences: ["Moo! The cow gives milk.", "The cow eats grass.", "Ding, ding! The bell rings."] },
    ziege: { name: "goat", sentences: ["Maa! The goat stands up tall.", "The goat has a beard."] },
    bauer: { name: "farmer", sentences: ["Hello! The farmer waves.", "The farmer has a pitchfork."] },
    schubkarre: { name: "wheelbarrow", sentences: ["There are pumpkins in the wheelbarrow.", "Oops, the pumpkins are bouncing!"] },
    gans: { name: "goose", sentences: ["Honk, honk! The goose is all excited.", "The goose is white."] },
    traktor: { name: "tractor", sentences: ["The tractor chugs off!", "Chug, chug, chug! The tractor is red.", "The tractor has big wheels."] },
    hund: { name: "dog", sentences: ["Woof, woof! The dog guards the farm.", "The dog jumps up."] },
    pumpe: { name: "water pump", sentences: ["Pump, pump! Here comes the water.", "The water splashes into the bucket."] },
    huhn: { name: "hen", sentences: ["Cluck, cluck! The hen pecks at grain.", "The hen has laid an egg!"] },
    ente: { name: "duck", sentences: ["Quack, quack! The duck swims in the pond.", "The duck dips its head into the water."] },
    hase: { name: "rabbit", sentences: ["Hop, hop! The rabbit hops.", "The rabbit likes carrots."] },
    schwein: { name: "pig", sentences: ["Oink, oink! The pig rolls in the mud.", "The pig is pink."] },
    frosch: { name: "frog", sentences: ["Ribbit! The frog jumps up.", "The frog sits on the lily pad."] },
    kueken: { name: "chick", sentences: ["Peep, peep! The chick has hatched from the egg.", "The chick is small and yellow."] },
    ferkel: { name: "piglet", sentences: ["The piglet is the pig's baby.", "Oink! The piglet hops."] },
    biene: { name: "bee", sentences: ["Buzz, buzz! The bee flies to the flower.", "The bee makes honey."] },
    schnecke: { name: "snail", sentences: ["The snail crawls very slowly.", "The snail carries its house on its back."] },
  },
  chains: [
    ["The goose gets a fright: Honk, honk!", "And the goat jumps up!"],
    ["Good morning! The farmer wakes up.", "And the cow says: Moo!"],
    ["The piglet jumps into the mud too!", "Eek, the hen is getting all wet!"],
  ],
};
