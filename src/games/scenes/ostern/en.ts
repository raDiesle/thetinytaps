import type { SceneTranslation } from "../types";

// The English words of the Ostern picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except „Easter Bunny“, a name the engine says without „the“;
// plural names are marked `plural`.

/** „Ostern“ in English. */
export const EN: SceneTranslation = {
  title: "Easter",
  description: "Easter Bunny, chicks and hidden eggs.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "The cloud is white and soft."] },
    gartentor: {
      name: "garden gate",
      sentences: ["Squeak! The garden gate opens.", "Who is coming into the garden?", "An Easter wreath hangs on the gate."],
    },
    mutterschaf: { name: "sheep", sentences: ["Baa! The sheep calls its little lamb.", "The sheep has soft wool."] },
    laemmchen: { name: "lamb", sentences: ["The lamb hops for joy!", "Ding-a-ling, goes the little bell.", "The lamb is still small."] },
    nistkasten: { name: "nesting box", sentences: ["Who lives in the nesting box? The blue tit!", "Tee-cher, tee-cher! The blue tit sings."] },
    kirschbaum: {
      name: "cherry tree",
      sentences: ["The cherry tree blooms pink.", "Whee! The blossoms fly through the air.", "The trees bloom in spring."],
    },
    amselnest: { name: "bird's nest", sentences: ["Peep, peep! The little blackbirds are hungry.", "The blackbird mommy brings a worm."] },
    gartenhaus: {
      name: "garden shed",
      sentences: ["The door of the garden shed opens.", "Who is in there?", "The garden things live in the garden shed."],
    },
    osterstrauch: {
      name: "egg tree",
      sentences: ["Colorful eggs hang on the egg tree.", "The eggs swing back and forth.", "How many eggs can you see?"],
    },
    schubkarre: { name: "wheelbarrow", sentences: ["There are flowers in the wheelbarrow.", "The wheelbarrow rolls off!"] },
    vogelbad: { name: "birdbath", sentences: ["The sparrow takes a bath. Splish, splash!", "The birdbath has water for the birds."] },
    henne: { name: "hen", sentences: ["Cluck, cluck! The hen has laid an egg.", "The hen sits in the nest."] },
    maltisch: { name: "painting table", sentences: ["Eggs are painted here.", "Red, yellow and blue. The egg gets colorful!"] },
    schokohase: {
      name: "chocolate bunny",
      sentences: ["The chocolate bunny shines like gold.", "Ding! The chocolate bunny has a little bell.", "Mmm, chocolate!"],
    },
    forsythie: { name: "yellow bush", sentences: ["The bush is all yellow with flowers.", "Rustle, rustle, goes the bush."] },
    gruenesei: { name: "green egg", sentences: ["There, under the bush! A green egg!", "The green egg rolls."] },
    hohlerbaum: {
      name: "old tree",
      sentences: ["Tock, tock! The woodpecker knocks on the tree.", "The tree has a hole. Who is peeking out?", "There are catkins on the branches."],
    },
    gelbesei: { name: "yellow egg", sentences: ["Hidden in the tree: a yellow egg!", "The yellow egg wobbles."] },
    eikueken: { name: "chick", sentences: ["Crack! The chick hatches from the egg.", "Peep, peep! Hello, little chick!"] },
    blauesei: { name: "blue egg", sentences: ["Behind the flowerpot! A blue egg!", "The blue egg has white dots."] },
    blumentopf: { name: "flowerpot", sentences: ["Primroses bloom in the flowerpot.", "The flowerpot wobbles."] },
    tulpen: { name: "tulips", plural: true, sentences: ["The tulips open.", "Red, yellow and purple tulips!"] },
    hummel: { name: "bumblebee", sentences: ["Buzz, buzz! The bumblebee flies to the flowers.", "The bumblebee is chubby and fluffy."] },
    bollerwagen: { name: "wagon", sentences: ["The wagon rolls.", "There are eggs and flowers in the wagon."] },
    osterglocken: { name: "daffodils", plural: true, sentences: ["Ding, dong! The daffodils ring like little bells.", "The daffodils are yellow."] },
    zitronenfalter: { name: "butterfly", sentences: ["The yellow butterfly flutters.", "The butterfly is yellow like a lemon."] },
    regenwurm: { name: "earthworm", sentences: ["Hello, earthworm!", "The earthworm lives in the soil."] },
    osterhase: { name: "Easter Bunny", sentences: ["Hello! I am the Easter Bunny.", "Hop, hop! The Easter Bunny brings the eggs.", "Happy Easter!"] },
    gartenzwerg: { name: "garden gnome", sentences: ["The garden gnome is tired. Yaawn!", "The garden gnome has a red hat."] },
    haeschen: { name: "bunny", sentences: ["Munch, munch! The bunny eats a carrot.", "The bunny wiggles its nose."] },
    korbkind: { name: "girl", sentences: ["Yippee! I found an egg!", "The girl is looking for Easter eggs."] },
    eierlauf: { name: "boy", sentences: ["Egg-and-spoon race! The egg wobbles on the spoon.", "Whoa! The egg almost falls off."] },
    osternest: { name: "egg basket", sentences: ["The egg basket is full of eggs!", "There is a chocolate egg in the egg basket too."] },
    giesskanne: { name: "watering can", sentences: ["The watering can waters the flowers.", "Splish, splash! Water for the tulips."] },
    osterei: { name: "red egg", sentences: ["There is a red egg in the grass!", "Who is peeking out from behind the egg?"] },
    glueckskaefer: { name: "ladybug", sentences: ["The ladybug flies away!", "The ladybug is red with black spots."] },
    pusteblume: { name: "dandelion", sentences: ["Blow on it! The seeds fly away.", "Whoooo! Like little parachutes."] },
  },
  chains: [
    ["The tulips drink and open up.", "Wet! The earthworm peeks out."],
    ["Crack! The chick hatches from the egg.", "The Easter Bunny is happy and hops."],
    ["The lamb hears its mommy and hops.", "There goes the butterfly, fluttering off."],
  ],
};
