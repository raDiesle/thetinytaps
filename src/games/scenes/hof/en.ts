import type { SceneTranslation } from "../types";

// The English words of the Hof am Teich picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case; plural names are marked `plural`.

/** „Hof am Teich“ in English. */
export const EN: SceneTranslation = {
  title: "Farm Pond",
  description: "Duck, frog and piglets by the pond on the farm.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "Rain is good for the plants."] },
    windmuehle: { name: "windmill", sentences: ["The wind turns the windmill.", "The mill makes flour."] },
    vogelscheuche: { name: "scarecrow", sentences: ["The scarecrow wobbles. Shoo, crows!", "The scarecrow keeps watch over the field."] },
    bauernhaus: { name: "farmhouse", sentences: ["The farm family lives in the farmhouse.", "The farmer waves from the window. Hello!"] },
    scheune: { name: "barn", sentences: ["The barn doors open.", "The hay is in the barn.", "A swallow flies out!"] },
    storch: { name: "stork", sentences: ["Clack, clack! The stork clacks its beak.", "The stork lives up in the nest."] },
    apfelbaum: { name: "apple tree", sentences: ["Red apples grow on the apple tree.", "Plop! An apple falls down."] },
    schaf: { name: "sheep", sentences: ["Baa! The sheep hops.", "The sheep has soft wool."] },
    lamm: { name: "lamb", sentences: ["Baa! The little lamb calls its mommy.", "The lamb is still very small."] },
    huehnerstall: { name: "henhouse", sentences: ["The hens sleep in the henhouse.", "The door opens. An egg rolls out!"] },
    hahn: { name: "rooster", sentences: ["Cock-a-doodle-doo! The rooster crows.", "The rooster wakes everyone up."] },
    kuh: { name: "cow", sentences: ["Moo! The cow gives milk.", "The cow eats grass.", "Ding, ding, goes the bell."] },
    ziege: { name: "goat", sentences: ["Maa, maa! The goat nudges with its head.", "The goat has a beard."] },
    pferd: { name: "horse", sentences: ["Neigh! The horse rears up.", "The horse has a long mane.", "The horse runs very fast."] },
    hund: { name: "dog", sentences: ["Woof, woof! The dog is called Buddy.", "The dog guards the farm."] },
    huhn: { name: "hen", sentences: ["Cluck, cluck! The hen pecks at grain.", "The hen lays eggs."] },
    gans: { name: "goose", sentences: ["Honk, honk! The goose stretches its long neck.", "The goose has a blue bow."] },
    kueken: { name: "chicks", plural: true, sentences: ["Peep, peep! The chicks are hopping.", "The chicks are small and yellow."] },
    bauer: { name: "farmer", sentences: ["The farmer whistles a song.", "There are vegetables in the wheelbarrow.", "Hello! The farmer waves his hat."] },
    traktor: { name: "tractor", sentences: ["Chug, chug, chug! The tractor drives off.", "The tractor is red.", "The tractor has big wheels."] },
    heuballen: { name: "hay bale", sentences: ["Hay is food for the animals.", "The hay bale is round."] },
    katze: { name: "cat", sentences: ["Meow! The cat woke up.", "The cat likes to sleep in the hay."] },
    kuerbis: { name: "pumpkin", sentences: ["The pumpkin is big and orange.", "The pumpkin grows in the garden."] },
    schwein: { name: "pig", sentences: ["Oink, oink! The pig plays in the mud.", "The pig loves the mud.", "The pig has a curly tail."] },
    ente: { name: "duck", sentences: ["Heads in the water, tails up high!", "Quack, quack! The duck swims in the pond."] },
    frosch: { name: "frog", sentences: ["Ribbit! The frog jumps up.", "The frog sits on a lily pad."] },
    bienenkorb: { name: "beehive", sentences: ["The bees live in the beehive.", "Buzz, buzz! The bees fly out."] },
    biene: { name: "bee", sentences: ["Buzz, buzz! The bee is flying.", "The bee makes honey."] },
    blumen: { name: "flowers", plural: true, sentences: ["The flowers bloom in the meadow.", "Red, blue, yellow and white."] },
    schmetterling: { name: "butterfly", sentences: ["The butterfly is yellow like a lemon.", "The butterfly flutters from flower to flower."] },
    ferkel: { name: "piglets", plural: true, sentences: ["The piglets are the pig's babies.", "Oink! The piglets are hopping."] },
    hase: { name: "rabbit", sentences: ["Hop, hop! The rabbit hops.", "The rabbit nibbles a carrot."] },
    schnecke: { name: "snail", sentences: ["The snail crawls very slowly.", "The snail carries its house on its back."] },
    maus: { name: "mouse", sentences: ["Squeak! The mouse found an ear of grain.", "Hello, little mouse!"] },
  },
  chains: [
    ["The hen clucks: Good morning!", "And the chicks peep along!"],
    ["The cat wakes up: Meow!", "And the mouse squeaks: Help, the cat!"],
    ["The duck dips its head into the water.", "And the stork clacks: Where is the frog?"],
  ],
};
