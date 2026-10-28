import type { SceneTranslation } from "../types";

// The English words of the Spielplatz picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except family words said like names („Grandpa“),
// which the engine says without „the“; plural names are marked `plural`.

/** „Spielplatz“ in English. */
export const EN: SceneTranslation = {
  title: "Playground",
  description: "Slide, swing, seesaw and sandbox.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "The cloud is white and soft."] },
    flugzeug: {
      name: "airplane",
      sentences: ["The airplane flies high in the sky.", "Vroom! The propeller turns.", "The pilot waves with the wings."],
    },
    drachen: { name: "kite", sentences: ["The kite flies in the wind!", "Whee! The kite zooms back and forth.", "The kite has a long tail."] },
    luftballon: { name: "balloon", sentences: ["The red balloon flies away!", "The balloon floats up."] },
    opa: { name: "Grandpa", sentences: ["Grandpa reads the newspaper.", "Hello, Grandpa! Grandpa tips his cap.", "Grandpa sits on the bench."] },
    muelleimer: { name: "trash can", sentences: ["Clack! The trash can opens.", "The trash goes into the trash can."] },
    eiswagen: { name: "ice cream truck", sentences: ["Ding-a-ling! The ice cream truck is here.", "Mmm, a strawberry ice cream!", "The ice cream man waves."] },
    baum: { name: "tree", sentences: ["The wind rustles in the tree.", "Red apples grow on the tree.", "The tree is big and green."] },
    vogel: { name: "bird", sentences: ["Tweet, tweet! The bird is flying.", "The bird sits on the branch."] },
    eichhoernchen: { name: "squirrel", sentences: ["Hop! The squirrel climbs up the tree.", "The squirrel nibbles a nut."] },
    schaukel: { name: "swing", sentences: ["Whee! The swing goes up high.", "Back and forth, high and low!", "Squeak, squeak, goes the swing."] },
    kletterturm: { name: "climbing tower", sentences: ["Ahoy! This is a pirate ship.", "The ladder goes up the tower.", "Who is looking out of the window?"] },
    rutsche: { name: "slide", sentences: ["Whee! Down the slide!", "The slide is yellow and smooth.", "Let's slide again!"] },
    katze: { name: "cat", sentences: ["Meow! The cat sits on the roof.", "The cat cleans its paw."] },
    seifenblasen: {
      name: "soap bubbles",
      plural: true,
      sentences: ["Whoo! Lots of soap bubbles are flying.", "The soap bubbles sparkle in many colors.", "Pop! The soap bubble burst."],
    },
    wippe: { name: "seesaw", sentences: ["Up and down on the seesaw!", "Two children sit on the seesaw.", "Up, down, hooray!"] },
    karussell: {
      name: "merry-go-round",
      sentences: ["The merry-go-round goes round and round!", "The children hold on tight.", "Round and round and round we go!"],
    },
    hund: { name: "dog", sentences: ["Woof, woof! The dog wants to play too.", "The dog wags its tail."] },
    schaukelpferd: {
      name: "rocking horse",
      sentences: ["Giddy-up! The rocking horse rocks.", "The horse has a purple mane.", "Clip, clop, little horse, off at a gallop!"],
    },
    ball: { name: "ball", sentences: ["Boing! The ball bounces up high.", "The ball is red, blue and yellow."] },
    mama: { name: "Mommy", sentences: ["Mommy pushes the stroller.", "Hello! Mommy waves."] },
    kinderwagen: { name: "stroller", sentences: ["A baby is lying in the stroller.", "The baby laughs and shakes the rattle.", "The stroller rolls."] },
    tauben: { name: "pigeons", plural: true, sentences: ["Coo, coo! The pigeons peck at crumbs.", "The pigeons are looking for food."] },
    roller: { name: "scooter", sentences: ["Whoosh! The scooter zooms off.", "Push off with your foot, and go!"] },
    laufrad: {
      name: "balance bike",
      sentences: ["The balance bike rolls. Run, run!", "Ring, ring! The bell on the balance bike.", "The child is wearing a helmet."],
    },
    pumpe: { name: "water pump", sentences: ["Pump, pump! Here comes the water.", "Splish, splash! The water runs into the stream."] },
    sandburg: { name: "sandcastle", sentences: ["This is a sandcastle!", "The gate opens. Who lives in there?", "The flag waves on the sandcastle."] },
    kind: { name: "child", sentences: ["The child digs in the sand.", "Hee-hee! The sand flies up.", "The child has a sun hat."] },
    schnecke: { name: "snail", sentences: ["The snail crawls very slowly.", "The snail carries its house on its back."] },
    blumen: { name: "flowers", plural: true, sentences: ["The flowers bloom in many colors.", "The flowers nod in the wind."] },
    schmetterling: { name: "butterfly", sentences: ["A butterfly flutters around.", "The butterfly likes the flowers."] },
    marienkaefer: { name: "ladybug", sentences: ["The ladybug flies away!", "The ladybug has black spots."] },
    eimer: { name: "bucket", sentences: ["The bucket tips over. The sand trickles out!", "The bucket is red."] },
    bagger: { name: "toy digger", sentences: ["The little digger digs sand.", "Vroom, vroom! The digger is yellow."] },
    foermchen: { name: "sand molds", plural: true, sentences: ["We bake sand cakes with the sand molds.", "A star, a fish and a heart!"] },
  },
  chains: [
    ["The cat gets a fright!", "And the bird flies away fast!"],
    ["Ice cream! The balance bike rides over fast.", "And the scooter zooms after it!"],
    ["Rain! The snail is happy.", "Quick, the stroller's hood closes."],
  ],
};
