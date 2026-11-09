import type { TogetherTranslation } from "./pairs";

// English sentences for "Was gehört zusammen?", by the ids of the pairs in pairs.tsx: things "go with" each other,
// helpers "need" their tools.

/** English, for the table of languages in pairs.tsx. */
export const ENGLISH: TogetherTranslation = {
  zahnbuerste: {
    name: "Toothbrush",
    partner: "Toothpaste",
    question: "Let's brush our teeth.",
    right: "The toothpaste goes with the toothbrush. Great!",
    belongs: "The toothpaste goes with the toothbrush!",
    caption: "Let's brush our teeth. What do we squeeze onto the brush?",
  },
  tuer: {
    name: "Door",
    partner: "Key",
    question: "The door is shut. We want to go in.",
    right: "The key goes with the door. Great!",
    belongs: "The key goes with the door!",
    caption: "The door is shut. We want to go in. What opens it?",
  },
  topf: {
    name: "Pot",
    partner: "Lid",
    question: "The pot is open. We want to close it.",
    right: "The lid goes with the pot. Great!",
    belongs: "The lid goes with the pot!",
    caption: "The pot is open. We want to close it. What fits on top?",
  },
  blume: {
    name: "Flower",
    partner: "Watering can",
    question: "The flower is thirsty.",
    right: "The watering can goes with the flower. Great!",
    belongs: "The watering can goes with the flower!",
    caption: "The flower is thirsty. What brings it water?",
  },
  papier: {
    name: "Paper",
    partner: "Crayon",
    question: "We want to draw a picture.",
    right: "The crayon goes with the paper. Great!",
    belongs: "The crayon goes with the paper!",
    caption: "We want to draw a picture. What makes the paper colorful?",
  },
  feuerwehr: {
    name: "Firefighter",
    partner: "Hose",
    question: "The firefighter wants to put out the fire.",
    right: "The firefighter needs the hose. Great!",
    belongs: "The firefighter needs the hose!",
    caption: "The firefighter wants to put out the fire. What sprays the water?",
  },
  aerztin: {
    name: "Doctor",
    partner: "Stethoscope",
    question: "The doctor wants to listen to your heart.",
    right: "The doctor needs the stethoscope. Great!",
    belongs: "The doctor needs the stethoscope!",
    caption: "The doctor wants to listen to your heart. What does she listen with?",
  },
  baecker: {
    name: "Baker",
    partner: "Bread roll",
    question: "The baker wants to bake something yummy for breakfast.",
    right: "The baker needs the bread roll. Great!",
    belongs: "The baker needs the bread roll!",
    caption: "The baker wants to bake something yummy for breakfast. What goes on the table then?",
  },
  friseurin: {
    name: "Hairdresser",
    partner: "Scissors",
    question: "The hairdresser wants to cut hair.",
    right: "The hairdresser needs the scissors. Great!",
    belongs: "The hairdresser needs the scissors!",
    caption: "The hairdresser wants to cut hair. What does she use?",
  },
};
