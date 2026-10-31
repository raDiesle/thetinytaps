import type { PageText, SeoTranslation } from "./seo";

// The search engine texts in English, for the pages under /en/ (see seo.ts), by German address. Written for what
// English-speaking parents search: "toddler games", "free", "no ads", "offline" (see the
// domain research on /management/). Imported only by texts-en.ts and tools/build.ts. No `@/` imports: the build reads it.

const scene = (title: string, things: string): PageText => ({
  title: `${title} Look-and-Find for Toddlers`,
  description: `A living ${title.toLowerCase()} picture to tap: ${things} move and make sounds. For toddlers, free and without ads.`,
  text: `A look-and-find picture that comes alive: ${things} – every tap brings something to life, with a sound and a movement. Plus finding, coloring and free exploring.`,
});

/** The English texts of every page. */
export const SEO_EN: SeoTranslation = {
  locale: "en_US",
  promise: "Free, no ads, no sign-up, works offline. With touch or keyboard, best played together with a grown-up.",
  imageAlt: "A fox family and a bear family read a picture book together on a picnic blanket.",
  pages: {
    "/": {
      title: "Toddler Games – Free, No Ads, Offline",
      description: "Learning games for toddlers: look-and-find pictures, tooth brushing with a song, movement games, letters and animals. Free, no ads.",
      text: "Books for Both is a shelf of picture books to play, for grown-ups and little ones together: every tap and every key does something right away, nothing is ever wrong and there is nothing to read. Look-and-find pictures, tooth brushing with a song, movement adventures, feelings, letters and numbers, matching and more.",
    },
    "/spiele/lebendige-welten/": {
      title: "Living Pictures and Stories for Toddlers",
      description: "Living look-and-find pictures, movement games, feelings and little adventures that answer every tap. For toddlers, without ads.",
      text: "Pictures and stories that answer every tap: Living Pictures, movement adventures to join in, feelings, chain reactions and Little Adventures.",
    },
    "/spiele/zuordnen/": {
      title: "Matching Games for Toddlers",
      description: "What goes together? Feed the animals, find the shadow and pair the socks – first matching games for toddlers, free and without ads.",
      text: "First matching games: bring food to the animal, find the right shadow, hang pairs of socks on the line. Tap or drag, and nothing is ever wrong.",
    },
    "/bilder/": {
      title: "Interactive Look-and-Find Pictures for Toddlers",
      description:
        "Over 20 look-and-find pictures for toddlers: construction site, farm, zoo, fire station and more. Everything moves and makes sounds – no ads.",
      text: "Look-and-find pictures that come alive: diggers dig, cows moo, the fire engine drives off. With finding, coloring, drawing roads and exploring, for toddlers.",
    },
    "/abenteuer/": {
      title: "Indoor Movement Games for Toddlers",
      description:
        "Movement adventures to join in: Tapsi the fox shows jumping, stretching and sneaking, and the child moves along in front of the screen. No ads.",
      text: "A movement story for indoors: Tapsi jumps, ducks and stretches, the child joins in, and the world answers. No reading needed, Tapsi says it all.",
    },
    "/gefuehle/": {
      title: "Feelings for Toddlers – an Emotions Game",
      description:
        "Angry, sad, happy: the little bear has feelings at home and at daycare, and the child helps him. A playful way to explain emotions to toddlers.",
      text: "Little stories about the bear: he is angry, sad or happy, and the child decides what helps him. For talking about feelings with toddlers.",
    },
    "/kettenreaktion/": {
      title: "Chain Reaction and Marble Run for Kids",
      description: "A marble rolls off and sets a machine going: marble runs and chain reactions to tap and marvel at, for toddlers, without ads.",
      text: "Twenty runs and machines: marbles roll over wood, snow, water slides and conveyor belts, dominoes fall, one thing pushes the next. One tap starts the chain reaction – to marvel at and play again.",
    },
    "/kleine-abenteuer/": {
      title: "Little Adventures – Picture Stories for Toddlers",
      description: "Short picture adventures for toddlers: ride the elevator, walk along a path, collect things. Every tap moves the story on.",
      text: "Adventures of a few minutes: ride the elevator and discover something on every floor, or walk along a path and celebrate at the end.",
    },
    "/tiere/": {
      title: "Feed the Animals – Animal Game for Toddlers",
      description:
        "What does the animal want? Drag food to the hungry animal or bring the animal home, with animal sounds. For toddlers, free and without ads.",
      text: "The rabbit wants a carrot, the dog a bone: drag or tap the food to the animal, and it is happy and makes its sound.",
    },
    "/schatten/": {
      title: "Find the Shadow – Matching Game for Toddlers",
      description: "Which shadow belongs to the giraffe? A picture looks for its shadow among two to six – first matching for toddlers, without ads.",
      text: "Animals, vehicles, food and things look for their shadow. Tap or drag; a wrong shadow briefly shows who it is. First two very different shadows, then more and more alike as the child gets sure.",
    },
    "/socken/": {
      title: "Sock Pairs – Matching Game for Toddlers",
      description: "The washing machine is done: find pairs of socks and hang them on the line. A first pairs game for toddlers, without ads.",
      text: "The socks tumble out of the washing machine. Matching socks sound the same; a pair hops onto the line. First a few pairs in bright colors, then more, with patterns and under laundry baskets like memory – as the child gets sure.",
    },
    "/buchstaben/": {
      title: "Letters and Numbers – Keyboard Game",
      description: "Every key shows its letter with a picture and a voice. Plus counting, “Where is the B?” and typing first words. For toddlers, without ads.",
      text: "Free typing on the keyboard or the screen: letters with a picture and a word, numbers with things to count, finding letters and typing first words, colors and action words.",
    },
    "/zaehne/": {
      title: "Tooth Brushing for Kids – Song and Timer",
      description:
        "Brush teeth with a song: step by step, the sugar monsters disappear, and a star for morning and evening. A tooth brushing timer for toddlers.",
      text: "A tooth brushing buddy: a brushing song, seven steps (chewing surfaces, outside, inside), sugar monsters on the teeth and a week chart with sun and moon.",
    },
    "/toepfchen/": {
      title: "Potty Training Game for Toddlers",
      description: "Tapsi needs to pee or poop: call mom and dad, pants down, sit, flush, wash hands – one tap per step. A star when it really works.",
      text: "A potty game for toddlers in moving pictures: Tapsi the fox eats and drinks, notices he needs to go, calls mom and dad and goes to the potty step by step. While he sits, mom and dad play silly, water the flowers or squeeze toothpaste – until a green tick says “done”: the grown-up taps whether pee, poop or both came. At the end a week chart celebrates real successes with a star.",
    },
    "/belohnungstafel/": {
      title: "Reward Chart for Toddlers – Make and Print",
      description:
        "Make your own reward chart for toddlers: day, week, month or a path of stars, with pictures, a name and a reward. Use it on a tablet or print it.",
      text: "A reward chart for toddlers, just as you like it: a week chart with tasks and days, a month chart as a calendar, a day chart for morning or evening, or a path of stars to the reward. Tasks as pictures (brushing teeth, potty, getting dressed, sleeping in their own bed …), the child’s name and a reward, best of all time together. A helper leads step by step to your own chart and shows every choice as a picture. On a tablet a grown-up holds a field and the child taps the star in; to print, landscape or portrait, in color or black and white, with fields to color and stars to cut out. No punishments, nothing is taken away. On the same page: a daily plan in pictures.",
    },
    "/tagesplan/": {
      title: "Visual Schedule for Toddlers – Day and Week",
      description:
        "Daily routine, morning and bedtime routine or a week plan for toddlers in pictures: the child taps off what is done. With picture cards to print.",
      text: "A daily plan in pictures (a visual schedule) for toddlers: the steps of the day as big picture cards – what is next lights up, the child taps it off when it is done, and the next card lights up. Templates for the morning routine, the bedtime routine, a day with daycare and a first-then board; a week plan shows what happens on which day, with a moon for every sleep until then. A helper leads in pictures to your own plan, and to print there are pages with every picture as a card to cut out for a Velcro board. On the same page: a reward chart to collect stars.",
    },
    "/laut-leise/": {
      title: "Loud and Quiet – Voice Game for Toddlers",
      description: "Roaring makes the lion jump, whispering makes the mouse squeak: practice loud and quiet voices in play. Nothing is recorded, no ads.",
      text: "The microphone only measures how loud it is: loud calls the lion, quiet the mouse. Tapping works too. Nothing is recorded.",
    },
    "/bilder/baustelle/": scene("Construction Site", "excavator, crane and cement mixer"),
    "/bilder/stadt/": scene("City", "bus, traffic light and police car"),
    "/bilder/bauernhof/": scene("Farm", "cow, pig and tractor"),
    "/bilder/hof/": scene("Pond Farmyard", "duck, hen and windmill"),
    "/bilder/zoo/": scene("Zoo", "lion, giraffe, elephant and monkey"),
    "/bilder/unterwasser/": scene("Underwater", "whale, dolphin, octopus and turtle"),
    "/bilder/badezimmer/": scene("Bathroom", "bathtub, shower and toothbrush"),
    "/bilder/wald/": scene("Forest", "fox, deer, hedgehog and owl"),
    "/bilder/feuerwache/": scene("Fire Station", "fire engine, siren and helmets"),
    "/bilder/weltall/": scene("Space", "rocket, astronaut and moon buggy"),
    "/bilder/spielplatz/": scene("Playground", "slide, swing and ice cream van"),
    "/bilder/kueche/": scene("Kitchen", "toaster, kettle and fridge"),
    "/bilder/supermarkt/": scene("Supermarket", "shopping cart, checkout and baker"),
    "/bilder/flughafen/": scene("Airport and Train Station", "plane, train and baggage belt"),
    "/bilder/winterbaustelle/": scene("Winter Construction", "snowplow, excavator and site trailer"),
    "/bilder/kita/": scene("Daycare", "coat hooks, doll stroller and birthday train"),
    "/bilder/kinderarzt/": scene("Pediatrician", "stethoscope, scales and bandage"),
    "/bilder/strand/": scene("Beach", "sandcastle, lighthouse, seagull and sailboat"),
    "/bilder/dinotal/": scene("Dino Valley", "T. rex, brachiosaurus and volcano"),
    "/bilder/gutenacht/": scene("Good Night", "moon, stars, teddy and music box"),
    "/bilder/winter/": scene("Winter", "snowman, sled and squirrel"),
    "/bilder/herbst/": scene("Autumn", "hedgehog, chestnuts, kite and tractor"),
    "/bilder/ostern/": scene("Easter", "Easter bunny, lamb and cherry tree"),
  },
};
