import type { TargetLanguageId } from "@/content/targetLanguages";
import type { StepLines } from "../story";

// What Tapsi says in „Fire Rescue“: short English sentences, one set per step. Written English first
// (user decision, November 2026); other languages, German too, come as lines.<language>.ts when asked for.

/** The language these lines are in; the voice script (`bun run voice`) reads it too. */
export const LANGUAGE: TargetLanguageId = "en";

/** Said over the opening shots, `at` seconds into it. */
export const OPENING_LINES = [
  { at: 0.4, text: "Oh! Look, smoke over there!" },
  { at: 3.2, text: "And little kittens are up on the roof." },
  { at: 6.4, text: "We'll help! Are you coming?" },
];

/** One entry per step of the story, in the order of the steps; every step has its own `turn` (DEFAULT_TURN is German). */
export const LINES: StepLines[] = [
  {
    icon: "👋",
    situation: "Hi! I'm Tapsi. And this is Robo, my hover robot!",
    instruction: "Here comes Kiki! Let's wave – like this!",
    turn: "Can you wave to Kiki too?",
    again: "Hello, Kiki!",
    praise: "Kiki is coming along!",
  },
  {
    icon: "🔔",
    situation: "The gate is shut. We ring the fire bell!",
    instruction: "Reach up high and pull down – like this!",
    turn: "Your turn – pull!",
    again: "Ding dong! The gate goes up!",
    praise: "The gate is open. Off we go!",
  },
  {
    icon: "👕",
    situation: "Robo flies down the street. Look, washing lines!",
    instruction: "When one comes, we duck – like this!",
    turn: "Watch out! Duck!",
    again: "And duck again!",
    praise: "We made it through!",
  },
  {
    icon: "💦",
    situation: "There's the house with the smoke!",
    instruction: "Hold the hose and spray – left, and right! Like this!",
    turn: "Your turn – spray the water!",
    again: "Psssh! The smoke goes away!",
    praise: "All the smoke is gone!",
  },
  {
    icon: "🐱",
    situation: "The kittens are up on the roof. Robo flies up!",
    instruction: "Open your arms and catch – like this!",
    turn: "Here comes a kitten – catch!",
    again: "And another one!",
    praise: "All the kittens are safe!",
  },
  {
    icon: "🎉",
    situation: "We did it!",
    instruction: "Arms up – hooray!",
    turn: "You too – hooray!",
    praise: "Hooray for the fire rescue!",
  },
  {
    icon: "👋",
    situation: "Robo takes the kittens home.",
    instruction: "Let's wave goodbye – like this!",
    turn: "Will you wave too?",
    again: "Bye-bye, kittens! Bye, Kiki!",
    praise: "Thank you for helping! See you soon!",
  },
];
