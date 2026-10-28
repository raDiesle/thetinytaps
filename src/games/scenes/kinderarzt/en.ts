import type { SceneTranslation } from "../types";

// The English words of the Kinderarzt picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case except family words said like names („Grandpa“),
// which the engine says without „the“; plural names are marked `plural`.

/** „Kinderarzt“ in English. */
export const EN: SceneTranslation = {
  title: "Doctor",
  description: "Scale, stethoscope and a sticker at the end.",
  items: {
    mobile: { name: "mobile", sentences: ["The mobile turns. Ping, ping!", "Cloud, star and moon swing."] },
    fenster: { name: "window", sentences: ["The window opens. Fresh air!", "Tweet, tweet! A bird looks in."] },
    hampelmann: { name: "jumping jack", sentences: ["Pull the string! The jumping jack jumps.", "Arms up, legs up!"] },
    uhr: { name: "clock", sentences: ["Tick, tock! The clock is ticking.", "The hands go round and round."] },
    tuer: { name: "door", sentences: ["Knock, knock! Who is there?", "The door opens. Hello, come in!"] },
    sehtafel: { name: "eye chart", sentences: ["What do you see? A sun, a house, a car!", "The pictures get smaller and smaller."] },
    messlatte: { name: "measuring stick", sentences: ["The giraffe measures how tall you are.", "Whoosh! The stick slides down.", "You are so big already!"] },
    schrank: { name: "cabinet", sentences: ["The doors open. What is in the cabinet?", "There are band-aids and bandages."] },
    seifenspender: { name: "soap", sentences: ["Give it a push! Here comes the foam.", "First wash your hands!"] },
    lampe: { name: "lamp", sentences: ["Click! The lamp turns on.", "Now it is nice and bright."] },
    papa: { name: "Daddy", sentences: ["Daddy waits and reads a book.", "Yaaawn! Daddy yawns and stretches."] },
    waschbecken: { name: "sink", sentences: ["Splish, splash! The water is running.", "There are towels and a duck in the cupboard. And who else?"] },
    aquarium: { name: "aquarium", sentences: ["Blub, blub! The fish are swimming.", "The treasure chest opens.", "The fish food is in the cupboard below."] },
    waage: { name: "scale", sentences: ["Step on! Beep, beep!", "The needle turns. How heavy are you?"] },
    wasserspender: { name: "water cooler", sentences: ["Glug, glug! A cup of water.", "Blub! The bubbles rise up."] },
    arzthelferin: { name: "nurse", sentences: ["Hello! The nurse waves.", "She hums a song: La, la, la!"] },
    empfang: { name: "front desk", sentences: ["This is where you check in.", "The drawer opens. There are pencils!"] },
    telefon: { name: "telephone", sentences: ["Ring, ring! The telephone is ringing.", "Hello, this is the doctor's office!"] },
    aufkleber: { name: "stickers", plural: true, sentences: ["At the end you get a sticker!", "Stars and hearts fly out.", "Which one do you like?"] },
    liege: { name: "exam table", sentences: ["You lie down on the exam table.", "Rustle! The paper rolls.", "The drawer opens and closes."] },
    kind: { name: "child", sentences: ["The child sits on the exam table. Hee-hee!", "The child is very brave.", "There is a band-aid on the knee."] },
    kinderwagen: { name: "stroller", sentences: ["The stroller rocks.", "The baby laughs: Hee-hee!"] },
    spielkiste: { name: "toy box", sentences: ["The lid opens.", "Boing! A bunny jumps out.", "There is a ball and a duck in the box."] },
    aerztin: { name: "doctor", sentences: ["Hello! I am the children's doctor.", "The doctor waves and laughs.", "Here you will get well again."] },
    rollwagen: { name: "trolley", sentences: ["Squeak! The trolley rolls.", "The drawers open, one after another."] },
    stethoskop: { name: "stethoscope", sentences: ["Ba-bum, ba-bum! That is how your heart sounds.", "The doctor listens with the stethoscope."] },
    ohrenlampe: { name: "ear light", sentences: ["Ping! The light turns on.", "The doctor looks into the ear with the light.", "All clean!"] },
    pflaster: { name: "band-aids", plural: true, sentences: ["The box opens. Band-aids!", "A band-aid with stars. So colorful!"] },
    muelleimer: { name: "trash can", sentences: ["Step on it! The lid opens.", "The paper flies into the trash can."] },
    schaukelpferd: { name: "rocking horse", sentences: ["Giddy-up! The rocking horse rocks.", "Neeeigh! The horse nods its head."] },
    pflanze: { name: "plant", sentences: ["Rustle, rustle! The leaves wiggle.", "A ladybug is crawling there."] },
    arzttasche: { name: "doctor's bag", sentences: ["Clack! The doctor's bag opens.", "There is a little hammer inside. Tock, tock!"] },
    bauklotz: { name: "tower", sentences: ["Whoa! The tower wobbles.", "But it doesn't fall over!"] },
    teddy: {
      name: "teddy bear",
      sentences: ["The teddy bear has a bandage.", "The teddy bear waves. It doesn't hurt anymore!", "The teddy bear is well again."],
    },
    kugelbahn: { name: "marble run", sentences: ["The marble rolls back and forth.", "Click, clack! It made it to the bottom."] },
    ball: { name: "ball", sentences: ["Boing, boing! The ball bounces.", "The ball is very colorful."] },
    feuerwehr: { name: "fire engine", sentences: ["Nee-naw! The fire engine zooms off.", "The ladder goes up."] },
    bilderbuch: { name: "picture book", sentences: ["The pages turn. Rustle!", "There is a heart and a star in the book."] },
  },
  chains: [
    ["The nurse answers the telephone.", "And here comes the next child!"],
    ["The doctor listens: Ba-bum! All good.", "The child laughs: That tickles!"],
    ["Oh! The tower wobbles.", "And the fire engine zooms off: Nee-naw!"],
  ],
};
