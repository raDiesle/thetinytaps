// Zu Hause in English: the words of bear.ts, by id. The bear is „Little Bear“ (a he); nothing
// is said about the child that depends on boy or girl.

import type { ComfortId, FeelingId } from "./bear";
import type { ComfortText, FeelingText } from "./localized";

/** The kind things in English. */
export const COMFORTS_EN: Partial<Record<ComfortId, ComfortText>> = {
  stroke: { caption: "Stroke", narration: "You stroke Little Bear. Very gently." },
  hug: { caption: "Hug", narration: "You give Little Bear a big, tight hug." },
  teddy: { caption: "Give a teddy", narration: "You give Little Bear a teddy to cuddle." },
  stomp: { caption: "Stomp", narration: "Stomp, stomp! Let the anger out." },
  blow: { caption: "Take a deep breath", narration: "Breathe in deeply … and blow out: Phoooo." },
  blanket: { caption: "Tuck in", narration: "You tuck Little Bear in. Nice and warm." },
  lullaby: { caption: "Sing a lullaby", narration: "You sing a soft lullaby." },
  hand: { caption: "Hold his paw", narration: "You hold his paw. You are right here." },
  light: { caption: "Turn on the light", narration: "You turn on the light. Now it is bright." },
  dance: { caption: "Dance along", narration: "You dance together. Hop, hop!" },
  streamers: { caption: "Throw streamers", narration: "You throw colorful streamers. Hooray!" },
};

/** The bear's feelings in English. */
export const FEELINGS_EN: Partial<Record<FeelingId, FeelingText>> = {
  sad: {
    title: "Sad, crying",
    questions: [
      "Little Bear is sad and crying. What do you do?",
      "Little Bear is still sad. What do you do?",
      "Little Bear is still a little sad. What do you do?",
    ],
    intro: "Little Bear is sad. He is crying.",
    instead: [
      { caption: "Push away", answer: "Hmm, pushing hurts. Give him a hug instead." },
      { caption: "Break a toy", answer: "Hmm, now his toy is broken. Stroke him instead." },
      { caption: "Take the blocks", answer: "Hmm, now Little Bear cries even more. Give him his teddy instead." },
    ],
    end: { narration: "Now Little Bear is happy again!", line: "Thank you!" },
    endCaption: "Happy again",
  },
  angry: {
    title: "Angry, tower fell down",
    questions: [
      "The tower fell down, Little Bear is angry. What can he do?",
      "Little Bear is still angry. What can he do?",
      "Little Bear is still a little angry. What do you do?",
    ],
    intro: "Little Bear is angry! His tower fell down.",
    instead: [
      { caption: "Throw toys", answer: "Hmm, throwing breaks things. Let the anger out instead: stomp really hard!" },
      { caption: "Shout loudly", answer: "Hmm, shouting makes the anger even bigger. Take a deep breath and blow instead: Phoooo." },
      { caption: "Hit", answer: "Hmm, hitting hurts. Give him a hug instead." },
    ],
    end: { narration: "The anger is gone. Little Bear is calm again.", line: "Thank you!" },
    endCaption: "Calm again",
  },
  tired: {
    title: "Tired in the evening",
    questions: [
      "Little Bear is tired and yawning. What do you do?",
      "Little Bear is still awake. What do you do?",
      "Little Bear is almost asleep. What do you do?",
    ],
    intro: "Little Bear is tired. He is yawning.",
    instead: [
      { caption: "Pull the blanket away", answer: "Hmm, without a blanket Little Bear gets cold. Tuck him in instead." },
      { caption: "Drum loudly", answer: "Hmm, Little Bear can't sleep when it's so loud. Be very quiet instead." },
      { caption: "Show a tablet", answer: "Hmm, the bright screen wakes Little Bear up again. Give him his teddy instead." },
    ],
    end: { narration: "Little Bear falls happily asleep. Good night!", line: "Good night …" },
    endCaption: "Falling asleep",
  },
  scared: {
    title: "Scared of the storm",
    questions: ["It's thundering, Little Bear is scared. What do you do?", "Little Bear is still scared. What do you do?", "It is so dark. What do you do?"],
    intro: "Little Bear is scared. It's thundering!",
    instead: [
      { caption: "Say “Boo!”", answer: "Hmm, now Little Bear is even more scared. Give him a hug instead." },
      { caption: "Leave him alone", answer: "Hmm, all alone Little Bear is even more scared. Hold his paw instead." },
      { caption: "Turn off the light", answer: "Hmm, in the dark Little Bear is even more scared. Turn on the light instead." },
    ],
    end: { narration: "The storm is over. Little Bear is laughing again!", line: "Thank you!" },
    endCaption: "Happy again",
  },
  happy: {
    title: "Joy, birthday",
    questions: [
      "It's Little Bear's birthday! How do you celebrate with him?",
      "Little Bear is still celebrating. What do you do?",
      "Little Bear is so happy. What do you do?",
    ],
    intro: "It's Little Bear's birthday! He is so happy.",
    question: "How do you celebrate with him?",
    instead: [
      { caption: "Pop the balloon", answer: "Hmm, now his balloon is popped. Dance with him instead." },
      { caption: "Take the present", answer: "Hmm, that's his present. Now he is sad. Celebrate with him instead." },
      { caption: "Take the cake", answer: "Hmm, that's his birthday cake. Now he is sad. Celebrate with him instead." },
    ],
    end: { narration: "What a lovely birthday!", line: "Thank you! That was great!" },
    endCaption: "Birthday party",
  },
};
