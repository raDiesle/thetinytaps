import type { SceneTranslation } from "../types";

// The English words of the Strand picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except family words said like names („Grandpa“),
// which the engine says without „the“; plural names are marked `plural`.

/** „Strand“ in English. */
export const EN: SceneTranslation = {
  title: "Beach",
  description: "Waves, sandcastle, crab and lighthouse.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining warmly!", "The sun is smiling over the sea."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "After the rain comes a rainbow."] },
    flugzeug: {
      name: "airplane",
      sentences: ["The airplane pulls a banner. It says: Hello!", "Vroom! The propeller turns.", "The pilot waves."],
    },
    drachen: { name: "kite", sentences: ["The kite flies in the wind!", "Whee! The kite zooms back and forth.", "The kite is laughing."] },
    leuchtturm: {
      name: "lighthouse",
      sentences: [
        "The lighthouse flashes! That is how the ships find their way.",
        "The door opens. Hello, lighthouse keeper!",
        "The lighthouse is red and white.",
      ],
    },
    segelboot: {
      name: "sailboat",
      sentences: ["The sailboat rocks on the waves.", "The wind blows into the sails. Whee!", "Ahoy! The sailor waves."],
    },
    schiff: { name: "ship", sentences: ["Toot, toot! The big ship sails across the sea.", "Smoke comes out of the chimney.", "The captain waves."] },
    delfin: { name: "dolphin", sentences: ["Hop! The dolphin jumps out of the water.", "Ee-ee-ee! The dolphin laughs.", "Splash! There it dives back in."] },
    boot: { name: "boat", sentences: ["The boat rocks back and forth.", "The fisherman rows. Splash, splash!", "Oh, there is a fish on the line!"] },
    boje: { name: "buoy", sentences: ["The buoy wobbles in the water.", "Bing, bong! The bell rings.", "The buoy is red."] },
    schwimmring: {
      name: "child in the swim ring",
      sentences: ["The child splashes in the swim ring.", "Yippee! The water splashes.", "The swim ring is red and white."],
    },
    badeente: {
      name: "rubber duck",
      sentences: ["Quack, quack! The big rubber duck is swimming.", "The rubber duck nods its head.", "The rubber duck is yellow."],
    },
    luftmatratze: {
      name: "air mattress",
      sentences: ["Daddy lies on the air mattress.", "Oops! The air mattress wobbles.", "Oh, the hat flies away!"],
    },
    wellen: { name: "waves", plural: true, sentences: ["The waves roll onto the beach.", "Swoosh, swoosh! Splash!", "The waves make white foam."] },
    rettungsturm: { name: "lifeguard tower", sentences: ["The lifeguard keeps a close watch.", "Whistle: Tweeeet!", "The flag waves in the wind."] },
    pommesbude: {
      name: "fries stand",
      sentences: ["The fries stand opens!", "Sizzle, sizzle! The fries are hot.", "The cook waves with a bag of fries."],
    },
    strandhaus: { name: "beach hut", sentences: ["The door of the beach hut opens.", "Hello! Who is looking out?", "The beach hut is blue and white."] },
    strandzelt: { name: "beach tent", sentences: ["A baby is sitting in the beach tent.", "The baby claps its hands.", "Peekaboo! The tent opens."] },
    strandkorb: {
      name: "beach chair",
      sentences: ["Grandpa sits in the beach chair.", "Yaaawn! Grandpa yawns and stretches.", "Grandpa lifts his hat. Good morning!"],
    },
    sonnenschirm: {
      name: "sun umbrella",
      sentences: ["The sun umbrella spins. Whee!", "There is shade under the umbrella.", "The sun umbrella is red and white."],
    },
    hund: { name: "dog", sentences: ["Woof, woof! The dog jumps in the sand.", "The dog wags its tail."] },
    mama: { name: "Mommy", sentences: ["Mommy is sunbathing.", "Mommy pushes up her sunglasses.", "Hello! Mommy waves."] },
    pommes: { name: "fries", plural: true, sentences: ["Mmm, fries with ketchup!", "The fries hop out of the tray."] },
    moewe: { name: "seagull", sentences: ["Squawk! The seagull steals a fry!", "The cheeky seagull flies up.", "The seagull is white and gray."] },
    kind: { name: "child with the net", sentences: ["The child has a fishing net.", "Hey! The child shouts and waves.", "Hop! The child jumps."] },
    ball: { name: "beach ball", sentences: ["Boing! The beach ball bounces up high.", "The beach ball is red, blue and yellow."] },
    krebs: { name: "crab", sentences: ["The crab walks sideways. Tip, tip, tip!", "Pinch, pinch! The crab has claws.", "The crab is red."] },
    sonnencreme: { name: "sunscreen", sentences: ["Squirt! The sunscreen squirts out.", "Sunscreen keeps you from getting sunburned."] },
    seestern: { name: "starfish", sentences: ["The starfish has five arms.", "The starfish wiggles and laughs."] },
    eimer: { name: "bucket", sentences: ["There is water in the bucket.", "Splash! A little fish jumps out.", "The bucket is blue."] },
    sandburg: { name: "sandcastle", sentences: ["The sandcastle grows! A tower, another tower!", "A flag waves on top.", "What a big sandcastle!"] },
    windrad: { name: "pinwheel", sentences: ["The pinwheel spins fast!", "The wind blows. Whee!"] },
    schaufel: { name: "shovel", sentences: ["The shovel digs in the sand.", "Heave-ho! The sand flies.", "The shovel is green."] },
    sandhaufen: { name: "sand pile", sentences: ["Who lives in the sand pile?", "Peekaboo! A little worm peeks out.", "The worm crawls back in."] },
    schatztruhe: {
      name: "treasure chest",
      sentences: ["A treasure chest in the sand!", "The lid opens. Gold sparkles!", "Oh, so many coins! And who is sitting inside?"],
    },
    kuehlbox: { name: "cooler", sentences: ["The cooler opens. Brrr, cold!", "There is an ice cream inside!", "The ice cubes clink."] },
    muschel: { name: "clam", sentences: ["The clam opens.", "Oh, a pearl!", "The clam snaps shut again."] },
  },
  chains: [
    ["Hey, seagull! Those are Mommy's fries!", "Woof, woof! The dog barks at the seagull."],
    ["Whee! The wave rocks the child.", "Oops! Daddy wobbles on the air mattress."],
    ["The ship sees the light. Toot!", "And the little boat rocks."],
  ],
};
