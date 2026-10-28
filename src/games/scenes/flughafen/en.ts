import type { SceneTranslation } from "../types";

// The English words of the Flughafen & Bahnhof picture: names, what each item says and the chain sentences.
// Names are nouns without article, lower case; plural names are marked `plural`.

/** „Flughafen & Bahnhof“ in English. */
export const EN: SceneTranslation = {
  title: "Airport & Station",
  description: "Airplane, train and baggage belt at the airport and the train station.",
  items: {
    sonne: { name: "sun", sentences: ["The sun is shining!", "The sun is smiling."] },
    wolke: { name: "cloud", sentences: ["The cloud makes it rain. Pitter, patter!", "The cloud is white and soft."] },
    hubschrauber: { name: "helicopter", sentences: ["Whup, whup, whup! The helicopter is flying.", "The helicopter is yellow.", "The pilot waves to you."] },
    luftschiff: { name: "airship", sentences: ["The airship floats very slowly.", "The people in the cabin wave."] },
    tower: {
      name: "control tower",
      sentences: ["The air traffic controller sits in the control tower.", "She tells the airplanes when they can take off.", "The radar turns."],
    },
    lichter: { name: "runway lights", plural: true, sentences: ["The runway lights show the airplanes the way.", "One, two, three, four, five!"] },
    flugzeug: {
      name: "airplane",
      sentences: ["The airplane takes off! Whoosh!", "Up into the sky and back down again.", "The people look out of the window."],
    },
    windsack: { name: "windsock", sentences: ["The windsock shows where the wind is blowing from.", "Whoooo, the wind is blowing!"] },
    hangar: { name: "hangar", sentences: ["The airplanes sleep in the hangar.", "The door opens. Hello, little airplane!"] },
    hase: { name: "rabbit", sentences: ["The rabbit lives in the meadow by the airport.", "Hop, hop! The rabbit hops."] },
    signal: { name: "signal", sentences: ["Red means: Stop!", "Now the signal is green. The train can go."] },
    speisewagen: { name: "dining car", sentences: ["You can get food in the dining car.", "The cook makes pancakes. Yummy!"] },
    wagen: { name: "train car", sentences: ["The door opens. Who is getting off?", "Lots of people sit in the train car."] },
    lok: { name: "train", sentences: ["Choo, choo! The train pulls in.", "The engine is red.", "Toooot! The train is here."] },
    uhr: { name: "station clock", sentences: ["Tick, tock! The clock shows what time it is.", "The train is right on time."] },
    spatz: { name: "sparrow", sentences: ["Cheep! The sparrow sits on the clock.", "The sparrow sings a song."] },
    schaffner: { name: "conductor", sentences: ["Tweet! The conductor blows his whistle.", "All aboard, please!", "The green paddle means: Go!"] },
    tafel: { name: "departure board", sentences: ["Ding, dong! The train is leaving soon.", "The board shows where the trains are going."] },
    reisende: { name: "traveler", sentences: ["Hello! The woman is going on vacation.", "Her suitcase rolls behind her."] },
    automat: { name: "ticket machine", sentences: ["Beep, beep! You can get tickets here.", "Here comes the ticket!"] },
    treppenwagen: { name: "stairs", plural: true, sentences: ["The people climb the stairs into the airplane.", "Up go the stairs!"] },
    tankwagen: { name: "fuel truck", sentences: ["The fuel truck brings fuel for the airplane.", "The hose rolls out."] },
    followme: { name: "follow-me car", sentences: ["Follow me means: Come with me!", "The car shows the airplane the way."] },
    bus: { name: "bus", sentences: ["The bus takes the people to the airport.", "The doors open. All aboard!", "Beep, beep!"] },
    huetchen: { name: "traffic cone", sentences: ["The traffic cone is orange.", "Oops, the traffic cone wobbles!"] },
    einweiser: { name: "marshaller", sentences: ["The marshaller waves his paddles.", "Over here, airplane! Slowly, slowly!"] },
    taxi: { name: "taxi", sentences: ["Taxi! The taxi takes you home.", "Beep, beep! The taxi is yellow."] },
    gepaeckzug: { name: "baggage cart", sentences: ["The baggage cart takes the suitcases to the airplane.", "Bumpety-bump! The suitcases are bouncing."] },
    gepaeckband: { name: "baggage belt", sentences: ["The suitcases ride up the belt.", "Up, up, up!"] },
    kind: { name: "child", sentences: ["The child plays airplane. Vroom!", "The child is flying on vacation soon."] },
    tauben: { name: "pigeons", plural: true, sentences: ["Coo, coo! The pigeons peck at crumbs.", "Flutter, flutter!"] },
    kofferkuli: { name: "luggage trolley", sentences: ["The suitcases are on the luggage trolley.", "Roll along, luggage trolley!"] },
    katze: { name: "cat", sentences: ["Meow! The cat travels in its carrier.", "The cat looks out."] },
    hund: { name: "dog", sentences: ["Woof, woof! The dog is flying on vacation too.", "The dog wags its tail."] },
    pilotin: { name: "pilot", sentences: ["The pilot flies the airplane.", "Hello! The pilot says hi."] },
  },
  chains: [
    ["Green! Choo, choo, the train pulls in.", "The conductor whistles: All aboard!", "The door opens and closes."],
    ["The marshaller waves the paddles.", "The airplane can take off. Whoosh!"],
    ["The pigeons flutter up!", "The cat in the carrier gets a fright: Meow!"],
  ],
};
