// The days of „Alltagssituationen“ in English: the pages of the story of days.ts, by day id, one per scene in the
// same order, and how each day ends. Names as in kita.en.ts: Little Bear, Little Fox, Big Bear, Grandma Bear.

import type { DayText } from "./days";

/** The days' pages of the story in English. */
export const DAYS_EN: Partial<Record<string, DayText>> = {
  "tag-1": {
    pages: [
      "Good morning! Grandma Bear is visiting. Today she is going back home.",
      "Then Big Bear takes Little Bear to kindergarten. He is looking forward to seeing Little Fox.",
      "After that, everyone runs out onto the meadow and plays tag.",
      "In the evening, Big Bear picks Little Bear up. Little Fox may come along for dinner.",
      "After dinner, Little Fox is picked up. It's time for Little Bear to go to bed.",
    ],
    end: "Little Bear is fast asleep. Good night! The day is over.",
  },
  "tag-2": {
    pages: [
      "Good morning! Today is a kindergarten day. Little Bear wants to get dressed all by himself.",
      "Then Big Bear and Little Bear walk to kindergarten together.",
      "In the playroom, Little Fox is already waiting for him.",
      "Later, everyone goes outside to the sandbox.",
      "In the afternoon, Little Bear is playing at the playground. Then Big Bear comes to pick him up.",
      "At home, Little Bear is covered in sand. Into the bathtub!",
    ],
    end: "Clean and tired, Little Bear snuggles into bed. Good night! The day is over.",
  },
  "tag-3": {
    pages: [
      "Good morning! Little Bear has just woken up. He pads into the living room.",
      "After the snow, Little Fox comes over to warm up. There are cookies.",
      "After that, the two of them may watch a show.",
      "In the evening, Little Fox goes home. Little Bear falls asleep very quickly.",
    ],
    end: "Little Bear sleeps soundly until morning. Good night! The day is over.",
  },
  "tag-4": {
    pages: [
      "Today it rains all day long. Little Fox is visiting.",
      "In the afternoon, Little Fox goes home. Little Bear plays alone in the hallway.",
      "The visitor has gone again. Then the baby bear wakes up.",
      "Now everyone is hungry. Big Bear is making pancakes.",
      "After dinner, it gets dark outside. The rain gets heavier and heavier.",
    ],
    end: "The storm is over. Little Bear falls asleep. Good night! The day is over.",
  },
  "tag-5": {
    pages: [
      "Good morning! Today Big Bear is tidying up the house.",
      "After that, they are off to the doctor. Little Bear wants to put on his jacket by himself.",
      "At the doctor's, it's their turn now.",
      "After the doctor, they go shopping.",
      "On the way home, they walk through the park.",
      "At home, Little Bear is tired from the long day.",
    ],
    end: "In the evening, Little Bear snuggles into bed. Good night! The day is over.",
  },
  "tag-6": {
    pages: [
      "Good morning! Today is Little Bear's birthday.",
      "Then Little Bear brings balloons to kindergarten. One for himself and one for Little Fox.",
      "At noon, the whole kindergarten has a party.",
      "In the afternoon, Little Fox comes to his house. There is birthday cake.",
      "Little Fox may sleep over tonight. They both put on their pajamas.",
    ],
    end: "What a lovely birthday! Good night! The day is over.",
  },
  "tag-7": {
    pages: [
      "Good morning! At kindergarten, Little Bear gets the building blocks.",
      "After that, Little Bear keeps playing in the playroom.",
      "After lunch, everyone goes to the playground.",
      "After that, Little Bear and Little Fox play on the meadow.",
    ],
    end: "In the evening, Big Bear picks him up. At home, Little Bear falls asleep quickly. Good night! The day is over.",
  },
  "tag-8": {
    pages: [
      "Good morning! Today everyone at kindergarten is playing outside.",
      "Then Little Bear runs to the big meadow with the tree.",
      "Under the tree, Little Bear and Little Fox take a rest.",
      "In the afternoon, Big Bear comes. Last of all, everyone climbs the climbing frame.",
    ],
    end: "At home, Little Bear tells how high he climbed. Then he falls asleep. Good night! The day is over.",
  },
};
