import type { SceneTranslation } from "../types";

// The English words of the Kita picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case; plural names are marked `plural`.

/** „Kita“ in English. */
export const EN: SceneTranslation = {
  title: "Daycare",
  description: "Jackets on hooks, the block corner, story time, lunch and nap time.",
  items: {
    wimpelkette: { name: "bunting", sentences: ["The colorful little flags wiggle back and forth.", "Today there is a party at daycare!"] },
    bilder: { name: "pictures", plural: true, sentences: ["The children painted these!", "Look, a house, a rainbow and a cat."] },
    tuer: { name: "door", sentences: ["The door opens. Hello, Mommy!", "Mommy is coming to pick you up soon."] },
    geburtstagszug: { name: "birthday train", sentences: ["Choo-choo! The birthday train is moving.", "There is a cake with a candle on the train."] },
    uhr: { name: "clock", sentences: ["Tick, tock! The clock is ticking.", "Lunch is coming soon."] },
    garderobe: { name: "coat hooks", plural: true, sentences: ["The jackets hang here.", "Each child has a picture on its hook: sun, duck, star."] },
    rucksack: { name: "backpack", sentences: ["The backpack opens. There is an apple!", "And the teddy bear comes along to daycare."] },
    fenster: { name: "window", sentences: ["The window opens. Fresh air!", "Daddy waves in the garden: Bye-bye!"] },
    vogel: { name: "bird", sentences: ["Tweet, tweet! The bird pecks a seed.", "The little bird sits at the bird feeder."] },
    hamster: { name: "hamster", sentences: ["The hamster runs in its wheel.", "Look, it has chubby cheeks!", "The little door opens."] },
    schrank: {
      name: "craft cupboard",
      sentences: ["The craft cupboard opens.", "There are paints, brushes and glitter.", "Look who is sitting behind the paints!"],
    },
    rollo: { name: "blind", sentences: ["The blind goes down. Now it is nap time.", "And up again. Good morning!"] },
    gummistiefel: { name: "rain boots", plural: true, sentences: ["Splish, splash! The rain boots stomp.", "In rain boots we go into the puddles."] },
    winkekinder: { name: "children at the window", plural: true, sentences: ["Bye-bye, Daddy! The children wave.", "See you this afternoon!"] },
    schlafkind: { name: "sleeping child", sentences: ["Shhh! The child is sleeping.", "It dreams of a star."] },
    kisten: { name: "toy boxes", plural: true, sentences: ["The boxes open.", "There is a car, a duck and a ball."] },
    puppenwagen: { name: "doll stroller", sentences: ["The doll rocks in the doll stroller.", "Hello, dolly! She opens her eyes."] },
    trommel: { name: "drum", sentences: ["Boom, boom! The drum is loud.", "We drum a song."] },
    spieluhr: { name: "music box", sentences: ["The music box plays a lullaby.", "The little moon turns."] },
    erzieherin: {
      name: "teacher",
      sentences: ["The teacher reads a story.", "Once upon a time there was a little duck.", "Look, there is a frog on the next page!"],
    },
    junge: { name: "boy", sentences: ["The boy hugs his teddy bear.", "The teddy bear is listening too."] },
    baukind: { name: "child with blocks", sentences: ["Click, clack! The child builds with blocks.", "Up, way up high!"] },
    maedchen: { name: "girl", sentences: ["The girl claps her hands.", "The story is funny!"] },
    aufwachkind: { name: "sleepy child", sentences: ["Yaaawn! The child woke up.", "It stretches out long."] },
    turm: { name: "tower", sentences: ["The tower wobbles. Whoa!", "The tower is very tall."] },
    nudelkind: { name: "child with noodles", sentences: ["Munch! The child eats noodles.", "Slurp! The noodle is gone."] },
    becherkind: { name: "child with a cup", sentences: ["Blub, blub! The child drinks juice.", "It blows bubbles with the straw."] },
    kipplaster: { name: "dump truck", sentences: ["Vroom, vroom! The dump truck drives.", "It tips out the blocks."] },
    bilderbuch: { name: "picture book", sentences: ["The book opens. Ribbit! A frog!", "The frog jumps out of the book."] },
    kuscheltier: { name: "toy bunny", sentences: ["The toy bunny hops.", "It is very soft and cuddly."] },
    tisch: { name: "table", sentences: ["Clatter, clatter! The table wobbles.", "Lunch is served at the table."] },
    topf: { name: "soup pot", sentences: ["Mmm, the soup smells good!", "The lid hops. A carrot jumps out."] },
    pudding: { name: "pudding", sentences: ["Wobble, wobble! The pudding wobbles.", "There is a cherry on top."] },
    kanne: { name: "water jug", sentences: ["Glug, glug! Water into the cup.", "Now the cup is full."] },
    xylophon: { name: "xylophone", sentences: ["Ping, pang, pong! The xylophone plays.", "Every note has a color."] },
    ball: { name: "ball", sentences: ["Boing, boing! The ball bounces.", "The ball is very colorful."] },
    spielzeugkiste: { name: "toy chest", sentences: ["The chest opens. Boing! A clown!", "The clown jumps up and waves."] },
    hausschuhe: { name: "slippers", plural: true, sentences: ["Tip, tap! The slippers are hopping.", "At daycare we wear slippers."] },
  },
  chains: [
    ["Daddy waves back: Bye-bye!", "And the bird sings: Tweet, tweet!"],
    ["Whoa, the tower wobbles! The child keeps building.", "The dump truck brings new blocks."],
    ["The child hears the lullaby and dreams.", "And the toy bunny snuggles up."],
  ],
};
