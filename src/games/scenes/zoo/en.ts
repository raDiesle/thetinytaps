import type { SceneTranslation } from "../types";

// The English words of the Zoo picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case; plural names are marked `plural`.

/** „Zoo“ in English. */
export const EN: SceneTranslation = {
  title: "Zoo",
  description: "Lion, elephant and penguins at the zoo.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "The animals get wet."] },
    luftballon: { name: "balloon", sentences: ["The balloon flies away!", "The balloon is red."] },
    giraffe: { name: "giraffe", sentences: ["The giraffe eats leaves way up in the tree.", "Munch, munch! The giraffe has a long neck."] },
    strauss: { name: "ostrich", sentences: ["The ostrich runs very fast!", "The ostrich is a big bird."] },
    zebra: { name: "zebra", sentences: ["Whee! The zebra jumps.", "The zebra has black and white stripes."] },
    elefant: { name: "elephant", sentences: ["Toot-toot! The elephant sprays water.", "The elephant has a long trunk.", "The elephant is very big."] },
    elefantenbaby: { name: "baby elephant", sentences: ["The baby elephant sprays too!", "Toot! The baby elephant flaps its ears."] },
    papagei: { name: "parrot", sentences: ["Hello! The parrot can talk.", "The parrot is red and colorful."] },
    affe: { name: "monkey", sentences: ["Whee! The monkey swings on the rope.", "Ooh, ooh, ah, ah! The monkey is funny."] },
    aeffchen: { name: "little monkey", sentences: ["The little monkey eats a banana.", "Mmm, yummy! The little monkey claps."] },
    panda: { name: "panda", sentences: ["The panda munches bamboo.", "Munch, munch! The panda is black and white."] },
    loewe: { name: "lion", sentences: ["Roooar! The lion yawns very loudly.", "The lion lies on its rock.", "The lion has a big mane."] },
    loewenbaby: { name: "lion cub", sentences: ["The lion cub is playing.", "The lion cub roars very softly: Rrr!"] },
    nashorn: { name: "rhino", sentences: ["Snort! The rhino stomps its foot.", "The rhino has a horn on its nose."] },
    kaenguru: { name: "kangaroo", sentences: ["Hop, hop! The kangaroo hops.", "The baby kangaroo lives in the pouch."] },
    koala: { name: "koala", sentences: ["The koala wakes up and waves.", "The koala likes to sleep in the tree."] },
    flamingo: { name: "flamingo", sentences: ["The flamingo stands on one leg.", "The flamingo is pink."] },
    bimmelbahn: { name: "little train", sentences: ["Ding, ding! The little train rides through the zoo.", "The children wave from the little train."] },
    pfau: { name: "peacock", sentences: ["Look! The peacock fans out its tail.", "The peacock has beautiful feathers."] },
    tierpfleger: { name: "zookeeper", sentences: ["Hello! The zookeeper brings the food.", "The zookeeper throws a fish."] },
    taube: { name: "pigeon", sentences: ["Coo, coo! The pigeon pecks at crumbs.", "The pigeon flutters."] },
    kind: { name: "child", sentences: ["The child has an ice cream. Yummy!", "The child jumps for joy."] },
    eiswagen: { name: "ice cream truck", sentences: ["Ding, ding! The ice cream truck is here.", "There is strawberry ice cream and chocolate ice cream."] },
    pinguin: { name: "penguin", sentences: ["Wheee! The penguin slides into the water.", "The penguin is a good swimmer."] },
    pinguinkueken: { name: "penguin chick", sentences: ["The penguin chick waddles.", "The penguin chick is very fluffy."] },
    fisch: { name: "fish", sentences: ["Splash! The fish jumps out of the water.", "The fish is blue."] },
    seehund: { name: "seal", sentences: ["Ow, ow! The seal plays with the ball.", "The seal claps its flippers."] },
    erdmaennchen: { name: "meerkat", sentences: ["Oh! The meerkat peeks out of the hole.", "The meerkat keeps a close watch."] },
    schmetterling: { name: "butterfly", sentences: ["The butterfly flies to the flowers.", "The butterfly is yellow."] },
    schildkroete: { name: "turtle", sentences: ["The turtle hides in its shell.", "Hello! There it is again."] },
    krokodil: { name: "crocodile", sentences: ["Snap! The crocodile opens and shuts its mouth.", "The crocodile is green."] },
    nilpferd: { name: "hippo", sentences: ["The hippo opens its mouth very wide.", "Blub! The hippo takes a bath in the river."] },
    pelikan: { name: "pelican", sentences: ["Swoosh! The pelican catches a fish.", "The pelican has a big beak."] },
  },
  chains: [
    ["The seal catches the fish. Ow, ow!", "And the penguin slides quickly after it!"],
    ["Oh! The ostrich runs away fast.", "And the lion cub roars too – very softly."],
    ["The baby elephant sprays back!", "Oh! The rhino gets all wet."],
  ],
};
