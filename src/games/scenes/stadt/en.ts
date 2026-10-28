import type { SceneTranslation } from "../types";

// The English words of the Stadt picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except family words said like names („Grandpa“),
// which the engine says without „the“; plural names are marked `plural`.

/** „Stadt“ in English. */
export const EN: SceneTranslation = {
  title: "Town",
  description: "Bus, fire engine and bakery in town.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "The cloud is white and soft."] },
    flugzeug: { name: "airplane", sentences: ["The airplane does a loop!", "Vroom! The airplane flies over the town."] },
    kirche: { name: "church", sentences: ["Ding, dong! The bell is ringing.", "A rooster sits on top of the tower.", "The clock shows what time it is."] },
    haus: { name: "house", sentences: ["Lots of people live in the house.", "The light turns on!", "Hello! The child waves from the window."] },
    katze: { name: "cat", sentences: ["Meow! The cat sits at the window.", "The cat looks down at the street."] },
    baeckerei: { name: "bakery", sentences: ["Yum, the bakery has fresh pretzels!", "The baker bakes bread and rolls."] },
    feuerwache: { name: "fire station", sentences: ["This is the fire station.", "The door opens. The fire engine lives here."] },
    baum: { name: "tree", sentences: ["Red apples grow on the tree.", "The wind rustles in the tree."] },
    vogel: { name: "bird", sentences: ["Tweet, tweet! The bird is flying.", "The bird lives in the tree."] },
    schaukel: { name: "swing", sentences: ["Whee! The child swings up high.", "Back and forth, back and forth."] },
    eiswagen: { name: "ice cream truck", sentences: ["Yummy, ice cream!", "Strawberry, chocolate or vanilla?"] },
    oma: { name: "Grandma", sentences: ["Hello! Grandma waves.", "Grandma sits on the bench."] },
    briefkasten: { name: "mailbox", sentences: ["A letter for you!", "The mailbox is yellow."] },
    spatz: { name: "sparrow", sentences: ["Cheep! The sparrow sits on the mailbox.", "The sparrow is small and brown."] },
    laterne: { name: "street lamp", sentences: ["The street lamp turns on. Now it is bright!", "The street lamp shines at night."] },
    hydrant: { name: "fire hydrant", sentences: ["Water for the fire engine comes out of the fire hydrant.", "Splish, splash!"] },
    bus: { name: "bus", sentences: ["The bus stops. All aboard!", "The doors open and close.", "Beep, beep! The bus drives off."] },
    polizei: { name: "police car", sentences: ["Nee-naw! The police are coming.", "The light flashes blue."] },
    fahrrad: { name: "bicycle", sentences: ["Ring, ring! Here comes the bicycle.", "A helmet keeps you safe."] },
    enten: { name: "ducks", plural: true, sentences: ["Quack, quack! The ducks cross the street.", "The cars wait for the ducks."] },
    auto: { name: "car", sentences: ["Beep, beep! The car honks.", "The car is red."] },
    feuerwehr: { name: "fire engine", sentences: ["Nee-naw! The fire engine drives off.", "The ladder goes way up high.", "The fire engine is red."] },
    muellauto: { name: "garbage truck", sentences: ["The garbage truck picks up the garbage.", "Up goes the can, and in it goes!"] },
    ampel: { name: "traffic light", sentences: ["Red man: stop and wait!", "Green man: now we can walk."] },
    muelleimer: { name: "trash can", sentences: ["The trash goes into the trash can.", "Oops, the trash can wobbles!"] },
    blumen: { name: "flowers", plural: true, sentences: ["The flowers bloom in many colors.", "Pink, yellow and purple."] },
    falter: { name: "butterfly", sentences: ["A butterfly flutters around.", "The butterfly likes the flowers."] },
    roller: { name: "scooter", sentences: ["The scooter rolls!", "The scooter goes fast."] },
    kinderwagen: { name: "stroller", sentences: ["A baby is lying in the stroller.", "The baby laughs. Hee-hee!"] },
    brunnen: { name: "fountain", sentences: ["The fountain sprays water way up high!", "Splish, splash!"] },
    luftballon: { name: "balloon", sentences: ["The balloon is red.", "Hold on to it tight!"] },
    hund: { name: "dog", sentences: ["Woof, woof! The dog wants to play.", "The dog wags its tail."] },
    marienkaefer: { name: "ladybug", sentences: ["The ladybug flies away!", "The ladybug has black spots."] },
    taube: { name: "pigeon", sentences: ["Coo, coo! The pigeon pecks at crumbs.", "The pigeon is gray."] },
    maus: { name: "mouse", sentences: ["Squeak! The mouse lives in the drain.", "Hello, little mouse!"] },
  },
  chains: [
    ["The cat at the window arches its back!", "And the bird flies away fast!"],
    ["Nee-naw! The fire engine drives off.", "Water on!"],
    ["Green! The ducks cross the street.", "The car waits and honks: Beep, beep!"],
  ],
};
