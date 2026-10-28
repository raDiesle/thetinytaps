import type { SceneTranslation } from "../types";

// The English words of the Feuerwache picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except family words said like names („Grandpa“),
// which the engine says without „the“; plural names are marked `plural`.

/** „Feuerwache“ in English. */
export const EN: SceneTranslation = {
  title: "Fire Station",
  description: "Ladder truck, siren and fire dog at the fire station.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "The cloud helps the firefighters."] },
    hubschrauber: { name: "helicopter", sentences: ["The helicopter is flying. Whup, whup, whup!", "A bucket of water hangs underneath."] },
    turm: { name: "hose tower", sentences: ["The hoses hang in the tower to dry.", "The door opens. Hello!", "The tower is very tall."] },
    sirene: { name: "siren", sentences: ["Nee-naw! The siren wails.", "All firefighters, come quickly!"] },
    wache: {
      name: "fire station",
      sentences: ["This is the fire station. The fire engines live here.", "The windows open. Hello!", "The clock turns: Ding, dong!"],
    },
    tor: { name: "gate", sentences: ["The gate opens!", "The little fire engine is inside.", "The gate closes again."] },
    helme: { name: "helmets", plural: true, sentences: ["The jackets and the helmets hang here.", "Put them on quickly, and off we go!"] },
    rutschstange: { name: "fire pole", sentences: ["Whoosh! The fireman slides down the pole.", "That is the fastest way down."] },
    glocke: { name: "alarm bell", sentences: ["Brrring! The alarm bell rings.", "Alarm! The firefighters have to go."] },
    taube: { name: "pigeon", sentences: ["Coo, coo! The pigeon sits on the roof.", "The pigeon is gray."] },
    fahne: { name: "flag", sentences: ["The flag flutters in the wind.", "There is a helmet on the flag."] },
    vogel: { name: "bird", sentences: ["Tweet, tweet! The bird sings.", "The bird sits right on top of the flag."] },
    blumen: { name: "flowers", plural: true, sentences: ["The flowers bloom red and yellow.", "The firefighters water the flowers."] },
    schmetterling: { name: "butterfly", sentences: ["A butterfly flutters around.", "The butterfly likes the flowers."] },
    baum: { name: "tree", sentences: ["The wind rustles in the tree.", "Red apples grow on the tree."] },
    katze: { name: "cat", sentences: ["Meow! The cat sits up in the tree.", "The cat can't get down. The firefighters help!"] },
    eichhoernchen: { name: "squirrel", sentences: ["The squirrel nibbles a nut.", "Hello, squirrel!"] },
    kommandowagen: { name: "command car", sentences: ["The fire chief sits in the command car.", "The door opens. Beep, beep!"] },
    hydrant: { name: "fire hydrant", sentences: ["The water for the hose comes out of the fire hydrant.", "Blub, blub!"] },
    krankenwagen: { name: "ambulance", sentences: ["Nee-naw! The ambulance helps when someone is sick.", "The door opens. The teddy bear waves!"] },
    grill: { name: "grill", sentences: ["Grandpa is grilling sausages. Yum!", "The grill smokes a little."] },
    opa: { name: "Grandpa", sentences: ["Grandpa turns the sausages over.", "Hello! Grandpa laughs."] },
    puppe: { name: "practice dummy", sentences: ["The firefighters practice with the dummy.", "Oops, the dummy wobbles!"] },
    feuerwehrauto: { name: "fire engine", sentences: ["Nee-naw! The fire engine is here.", "The ladder goes way up high.", "The fire engine is red."] },
    feuerwehrfrau: { name: "firewoman", sentences: ["Water on! The firewoman sprays.", "The hose is long and red."] },
    feuerwehrmann: { name: "fireman", sentences: ["Tweeeet! The fireman blows his whistle.", "The fireman waves. Hello!"] },
    huetchen: { name: "traffic cone", sentences: ["The traffic cone is orange and white.", "Hop! The traffic cone hops."] },
    hund: { name: "fire dog", sentences: ["Woof, woof! The fire dog wears a helmet.", "The dog has black spots."] },
    kind: { name: "child", sentences: ["The child visits the fire station.", "The child has a helmet too. Hooray!"] },
    luftballon: { name: "balloon", sentences: ["The balloon is yellow.", "Hold on to it tight!"] },
    feuerloescher: { name: "fire extinguisher", sentences: ["Pfffft! White foam comes out of the fire extinguisher.", "The fire extinguisher is red."] },
    bobbycar: { name: "ride-on car", sentences: ["The ride-on car is a little fire engine.", "Beep, beep! The ride-on car drives."] },
    ente: { name: "duckling", sentences: ["Quack! The duckling swims in the puddle.", "The duckling is yellow."] },
    schlauchrolle: { name: "hose reel", sentences: ["The hose is rolled up on the reel.", "The reel turns. Rat-a-tat!"] },
    stiefel: { name: "boots", plural: true, sentences: ["The boots are ready. Jump in and go!", "Stomp, stomp!"] },
    maus: { name: "mouse", sentences: ["Squeak! The mouse lives in the boot.", "Hello, little mouse!"] },
    schnecke: { name: "snail", sentences: ["The snail crawls very slowly.", "The snail carries its house on its back."] },
  },
  chains: [
    ["Brrring! The grill is smoking. Alarm!", "Water on! The firewoman sprays.", "Grandpa laughs: Thank you, firefighters!"],
    ["The ladder goes up to the cat!", "Hooray! The cat is saved!"],
    ["Quick! The fireman slides down the pole.", "The gate opens!", "The fire dog barks: Woof, woof!"],
  ],
};
