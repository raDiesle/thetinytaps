import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Wolkenreise“ in English: the lines of lines.ts, step by step.
// The little cloud Wolle is "Woolly".

/** „Die Wolkenreise“ in English. */
export const TRANSLATION: StoryTranslation = {
  defaultTurn: "Your turn!",
  opening: ["Oh! Where is the sun?", "It's hiding behind the big rain cloud.", "Let's get it out! Are you coming along?"],
  steps: [
    // 👋
    {
      situation: "Hello! I'm Tapsi. And this is Woolly, my cloud!",
      instruction: "Here comes Kiki! We wave – like this!",
      turn: "Can you wave to Kiki too?",
      again: "Hello, Kiki!",
      praise: "Kiki is flying with us!",
    },
    // 🐦
    {
      situation: "Woolly wants to fly. Let's help!",
      instruction: "Flap your arms like a bird – like this!",
      turn: "Your turn – flap along!",
      again: "Flap, flap – up, up high!",
      praise: "We're flying way up high!",
    },
    // ✈️
    {
      situation: "Oh, here come little planes!",
      instruction: "When one comes, we duck – like this!",
      turn: "Watch out! Duck!",
      again: "And duck again!",
      praise: "All the planes have gone by.",
    },
    // 🎈
    {
      situation: "So many balloons!",
      instruction: "We tap them – pop! Like this!",
      turn: "Your turn – tap them!",
      again: "Pop! And pop!",
      praise: "So much confetti!",
    },
    // 🪑
    { instruction: "Now it gets fast! Sit down with me – like this!", praise: "Hold on tight!" },
    // ⭐
    {
      situation: "Look at all the stars!",
      instruction: "Lean to the side and grab the star – like this!",
      turn: "Your turn – lean to the side!",
      again: "And to the other side!",
      praise: "We got all the stars!",
    },
    // 🧍
    { instruction: "There's the rain cloud! Stand up with me – like this!", praise: "Now let's get the sun!" },
    // 🌧️
    {
      situation: "It's raining here! The sun is up there.",
      instruction: "Push the cloud up with both arms – like this!",
      turn: "Your turn – push with me!",
      again: "Up, up – here comes the sun!",
      praise: "There's the sun!",
    },
    // 🌈
    {
      situation: "Now we just need the rainbow.",
      instruction: "Paint a big arc with your arm – like this!",
      turn: "Your turn – paint with me!",
      again: "One more colour!",
      praise: "A rainbow!",
    },
    // 🙌
    {
      situation: "The sun is smiling!",
      instruction: "Arms up – hooray!",
      turn: "You too – hooray!",
      praise: "The sun is back!",
    },
    // 🏡
    {
      situation: "Woolly flies us home.",
      instruction: "We wave bye-bye – like this!",
      turn: "Will you wave too?",
      again: "Bye-bye, sun! Bye-bye, Kiki!",
      praise: "Thanks for flying with us! See you soon!",
    },
  ],
};
