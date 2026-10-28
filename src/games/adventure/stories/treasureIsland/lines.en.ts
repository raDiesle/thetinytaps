import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Schatzinsel“ in English: the lines of lines.ts, step by step.

/** „Die Schatzinsel“ in English. */
export const TRANSLATION: StoryTranslation = {
  title: "Treasure Island",
  defaultTurn: "Your turn!",
  opening: ["Look – over there is Treasure Island!", "And there's a treasure!", "Are you coming along?"],
  steps: [
    // 👋
    {
      name: "Wave to Kiki",
      situation: "Ahoy! I'm Tapsi. And here comes Kiki, my parrot!",
      instruction: "I wave hello to Kiki – like this!",
      turn: "Can you wave to Kiki too?",
      again: "Hello, Kiki!",
      praise: "Kiki is so happy you're here!",
    },
    // 🎣
    {
      name: "Cast the fishing rod",
      situation: "Now we go fishing!",
      instruction: "Swing back over your shoulder – and cast far, like this!",
      turn: "Your turn – cast the line!",
      again: "Swing back – and splash!",
      praise: "So many fish!",
    },
    // 🪑
    { name: "Sit down", instruction: "Sit down with me – like this!", praise: "Off we go!" },
    // 🛶
    {
      name: "Paddle",
      situation: "Ole swims off – to Treasure Island!",
      instruction: "Look: the paddle in the water on the right – and on the left.",
      turn: "Paddle with me!",
      again: "Paddle, paddle – the island comes closer!",
      praise: "We made it! Ole is on the beach.",
    },
    // 🧍
    { name: "Stand up", instruction: "We're on the island! Stand up with me – like this!", praise: "On we go!" },
    // 🦂
    {
      name: "Stomp on the scorpions",
      situation: "Oh no! Scorpions are crawling on Ole!",
      instruction: "Foot up – and stomp hard and fast, like this!",
      turn: "Your turn – stomp with me!",
      again: "Stomp, stomp – pop!",
      praise: "All the scorpions are gone!",
    },
    // 🌉
    {
      name: "Hop over the bridge",
      situation: "A little bridge! And lots of boxes are floating up there.",
      instruction: "Hop – and bump the box with your head, boom!",
      turn: "Your turn – jump with me!",
      again: "Hop, boom! Hop, boom!",
      praise: "We're across! Lots of golden stars!",
    },
    // 🪵
    {
      name: "Duck under the log",
      situation: "Watch out! A log is swinging up there.",
      instruction: "When it comes, we duck – like this!",
      turn: "Here it comes! Duck!",
      again: "And duck again!",
      praise: "Phew, the log is gone!",
    },
    // 🥁
    {
      name: "Drum",
      situation: "Oh, lots of birds are sitting on the path! And two drums are hanging there.",
      instruction: "Left – boom! And right – boom! Like this!",
      turn: "Your turn – drum with me!",
      again: "Boom, boom – the birds fly away!",
      praise: "The path is clear!",
    },
    // ⚙️
    {
      name: "Turn the crank",
      situation: "A gate! And there's a crank.",
      instruction: "We turn the crank – round and round, like this!",
      turn: "Your turn – turn it with me!",
      again: "Round and round – the gate goes up!",
      praise: "The gate is open!",
    },
    // 🥥
    {
      name: "Step aside",
      situation: "Oh, the monkey is dropping coconuts! They roll right to us.",
      instruction: "One big step to the side – and back. Like this!",
      turn: "Coconut! Big step to the side!",
      again: "And make room again!",
      praise: "All the coconuts rolled past.",
    },
    // 🦵
    {
      name: "Leg up, coconut under it",
      situation: "Now they roll on the left!",
      instruction: "Leg up – the coconut rolls underneath. Like this!",
      turn: "Your turn – leg up!",
      again: "Leg up!",
      praise: "Right underneath! Super.",
    },
    // 🦶
    {
      name: "Legs wide, coconut between them",
      situation: "And now they come in the middle!",
      instruction: "Legs wide apart – the coconut rolls through. Like this!",
      turn: "Your turn – legs wide!",
      again: "Legs wide!",
      praise: "Through your legs! The monkeys laugh.",
    },
    // 🐒
    {
      name: "Dodge the coconuts",
      situation: "Oh, monkeys! They're throwing coconuts!",
      instruction: "We move out of the way very slowly – to the side, like this!",
      turn: "Your turn – move aside!",
      again: "And to the other side!",
      praise: "Missed! The monkeys clap.",
    },
    // 🍎
    {
      name: "Pick an apple",
      situation: "An apple tree! And there's a basket.",
      instruction: "Stretch up high and pick – like this!",
      turn: "Your turn – pick an apple!",
      again: "Up high – and plop into the basket!",
      praise: "The basket is full!",
    },
    // 🧩
    {
      name: "Picture riddle",
      situation: "A door with three pictures. A riddle!",
      instruction: "We copy the pictures. First very tall – like this!",
      turn: "Your turn – very tall!",
      more: ["And now very wide, like a star!", "And now very small!", "Once more from the start: very tall!", "Very wide!", "And very small!"],
      praise: "Riddle solved! The door opens.",
    },
    // 🕸️
    {
      name: "Wave away the cobwebs",
      situation: "Oh, lots of cobwebs! We can't get through.",
      instruction: "Paw up high – and wave far to the side, like this!",
      turn: "Your turn – wave with me!",
      again: "Left – and right – away they go!",
      praise: "The path is clear! The spider waves.",
    },
    // 🪢
    {
      name: "Pull the chest in by the rope",
      situation: "There's the treasure chest, floating!",
      instruction: "Pull the rope hand over hand – like this!",
      turn: "Pull with me!",
      again: "Pull, pull – here it comes!",
      praise: "The chest is here!",
    },
    // 🔑
    {
      name: "Turn the key",
      situation: "Oh, a lock! Kiki brings the key.",
      instruction: "Pick it up, put it in and turn it – like this!",
      turn: "Your turn – turn the key!",
      again: "Click – and again!",
      praise: "The lock is open!",
    },
    // 💰
    {
      name: "Toss the gold",
      situation: "Oh! Gold! The crabs bring us the chest. I hop down!",
      instruction: "Reach in deep – and throw the coins up high! Like this!",
      turn: "Your turn – reach in and throw them up!",
      again: "Reach in – throw them up!",
      praise: "A shower of gold!",
    },
    // 🙌
    {
      name: "Hooray!",
      situation: "We found the treasure!",
      instruction: "Arms up – hooray!",
      turn: "You too – hooray!",
      again: "Hooray, a treasure!",
      praise: "So much gold! We're rich!",
    },
    // 🌅
    {
      name: "Wave goodbye",
      situation: "The sun is going down.",
      instruction: "I wave goodbye to Kiki – like this!",
      turn: "Will you wave too?",
      again: "Bye, Kiki! Bye, island!",
      praise: "Thanks for playing along! See you soon!",
    },
  ],
};
