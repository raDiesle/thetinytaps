import type { SceneTranslation } from "../types";

// The English words of the Weltall picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except the planets' proper names; plural names are marked `plural`.

/** „Weltall“ in English. */
export const EN: SceneTranslation = {
  title: "Outer Space",
  description: "Rocket, flying saucer and planets on the moon.",
  items: {
    erde: { name: "Earth", sentences: ["Hello, Earth! That is where we live.", "The Earth is turning.", "The Earth is blue and green."] },
    mars: { name: "Mars", sentences: ["Mars is red.", "Mars is turning. Its little moon flies along."] },
    saturn: { name: "Saturn", sentences: ["Saturn has a ring.", "The ring goes round and round.", "Saturn winks."] },
    sterne: { name: "stars", plural: true, sentences: ["The stars are twinkling.", "Twinkle, twinkle, little star!"] },
    stern: { name: "star", sentences: ["The star shines brightly.", "The star turns and winks."] },
    sternschnuppe: { name: "shooting star", sentences: ["Whoosh! The shooting star zooms past.", "Make a wish!"] },
    komet: { name: "comet", sentences: ["The comet has a long tail.", "Whoosh! The comet flies through space."] },
    asteroid: { name: "asteroid", sentences: ["The asteroid tumbles through space.", "Rumble, tumble!"] },
    satellit: { name: "satellite", sentences: ["Beep, beep! The satellite sends messages.", "The satellite folds its wings."] },
    raumstation: { name: "space station", sentences: ["Astronauts live in the space station.", "The windows light up. Hello!"] },
    astronaut: { name: "astronaut", sentences: ["The astronaut floats in space.", "The astronaut waves to you!"] },
    ufo: {
      name: "flying saucer",
      sentences: ["Woo-woo! The flying saucer lights up.", "A little alien sits in the flying saucer.", "The flying saucer floats."],
    },
    flagge: { name: "flag", sentences: ["The flag flutters.", "There is a star on the flag."] },
    solarzellen: { name: "solar panels", plural: true, sentences: ["The solar panels catch sunlight.", "That makes electricity."] },
    antenne: { name: "antenna", sentences: ["The antenna sends greetings to Earth.", "Ping! The antenna turns."] },
    landefaehre: { name: "lunar lander", sentences: ["The lunar lander has landed on the moon.", "The door opens. Who is looking out?"] },
    mondbasis: {
      name: "moon base",
      sentences: ["Ding, dong! Astronauts live in the moon base.", "The door opens and someone waves.", "The windows are glowing."],
    },
    rakete: {
      name: "rocket",
      sentences: ["Three, two, one – blast off! The rocket flies.", "The rocket flies way up high and lands again.", "The rocket is red and white."],
    },
    weltraumblume: { name: "space flower", sentences: ["The space flower turns its blossoms.", "The flower laughs. Sparkle, sparkle!"] },
    gewaechshaus: { name: "greenhouse", sentences: ["Tomatoes grow in the greenhouse.", "Splish, splash! The plants get water."] },
    ausserirdischer: { name: "alien", sentences: ["Bleep, blop! The alien says hello.", "The alien hops and waves.", "It has two antennae."] },
    mondbagger: { name: "moon digger", sentences: ["Vroom! The moon digger digs moon dust.", "The moon digger is yellow."] },
    alienbaby: { name: "alien baby", sentences: ["The alien baby laughs.", "Rattle, rattle! The alien baby is playing."] },
    buggy: { name: "moon buggy", sentences: ["The moon buggy drives across the moon.", "Bumpety-bump! Beep, beep!"] },
    mondhase: {
      name: "moon bunny",
      sentences: ["Hop! The moon bunny hops way up high.", "You can hop very high on the moon.", "The moon bunny has a carrot."],
    },
    krater: { name: "crater", sentences: ["This is a crater. A hole in the moon.", "Hop, hop! The rocks are hopping."] },
    roboterhund: { name: "robot dog", sentences: ["Woof, beep! The robot dog barks.", "The robot dog wags its tail."] },
    kristall: { name: "crystal", sentences: ["The crystal sparkles blue.", "The crystal glows."] },
    helm: { name: "helmet", sentences: ["Peekaboo! A little alien lives behind the helmet.", "The helmet wobbles."] },
    mondball: { name: "ball", sentences: ["Boing, boing! The ball bounces.", "On the moon the ball bounces very high."] },
    kiste: { name: "box", sentences: ["The box opens. What is inside?", "A star jumps out!"] },
    maus: { name: "mouse", sentences: ["Squeak! The mouse nibbles the moon cheese.", "The moon is made of cheese – says the mouse."] },
    astronautin: { name: "space explorer", sentences: ["The space explorer hops across the moon.", "The space explorer waves. Hello!"] },
    fernrohr: { name: "telescope", sentences: ["You can see the stars with the telescope.", "The telescope looks up."] },
    roboter: { name: "robot", sentences: ["Beep, boop, beep! The robot talks.", "The robot lifts its arms.", "The robot is blue."] },
  },
  chains: [
    ["The alien waves to the flying saucer!", "And the alien baby laughs and hops."],
    ["You can see Saturn in the telescope!", "And there goes a comet."],
    ["The moon bunny gets a fright and hops way up high!", "The mouse peeks out of the cheese."],
  ],
};
