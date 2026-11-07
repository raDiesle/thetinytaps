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
      text: "Fun for Both is a shelf of picture books to play, for grown-ups and little ones together: every tap and every key does something right away, nothing is ever wrong and there is nothing to read. Look-and-find pictures, tooth brushing with a song, movement adventures, feelings, letters and numbers, matching and more.",
    },
    "/spiele/lebendige-welten/": {
      title: "Living Pictures and Stories for Toddlers",
      description: "Living look-and-find pictures, movement games, chain reactions and little adventures that answer every tap. For toddlers, without ads.",
      text: "Pictures and stories that answer every tap: Living Pictures, movement adventures to join in, chain reactions and Little Adventures.",
    },
    "/spiele/gefuehle/": {
      title: "Feelings Games for Toddlers",
      description: "How are you? The child shows its feeling and how strong it is, says what it needs and helps the little bear. No ads.",
      text: "A picture book about feelings: the child shows how it feels and how strongly, and picks what does it good now. And the little bear meets everyday situations, where the child picks what helps.",
    },
    "/spiele/buchstaben-zahlen/": {
      title: "Letters and Numbers – Keyboard Games",
      description: "Free typing, counting and typing words: every key shows its letter with a picture and a voice, numbers come with things to count. No ads.",
      text: "Three games on the keyboard or the screen: free typing with a letter, a picture and a word, counting with numbers and things, and typing words with first words, colors, action words and “Where is the B?”.",
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
      title: "Feelings for Toddlers – Everyday Situations",
      description: "Angry, sad, scared, happy: the little bear meets everyday situations at home and at daycare, and the child picks what helps. No ads.",
      text: "Little stories of the bear, day by day from morning to night: he is angry, sad, scared or happy, and the child picks between two ideas what helps. The scenes also come sorted by feeling. For talking about feelings with toddlers.",
    },
    "/wie-gehts-dir/": {
      title: "How Are You? Showing Feelings for Toddlers",
      description: "Happy, proud, tired or angry: the child taps the picture that fits its feeling and slides how strong it is. No ads.",
      text: "Eight feelings in two groups, the pleasant and the unpleasant ones, each with the little bear in a moment children know. The child taps its feeling, then slides how strong it is – the bear shows it with his whole body. A start for talking about feelings.",
    },
    "/was-brauche-ich/": {
      title: "What Do I Need? Showing Needs for Toddlers",
      description: "A hug, time alone, romping, blowing, a drink or a rest: the child shows with a picture what does it good now. No ads.",
      text: "When a feeling is big, it helps to know what you need. The child taps a picture – a hug, time alone, romping, stamping and blowing, a drink, a snack, a rest or a song – and the parents see what does it good now.",
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
        "What does the animal need? Who peeks out of the bush, what does it eat, what does it give us, where does it live? With animal sounds, for toddlers, without ads.",
      text: "Who is peeking out of the bush? The rabbit wants a carrot, the cow gives us milk, the dog looks for its kennel, the caterpillar becomes a butterfly: spot the animal, tap the food, the milk, the egg or the home, and it is happy and makes its sound. The game gets easier or harder by itself.",
    },
    "/zusammen/": {
      title: "What Goes Together? – Matching Game for Toddlers",
      description:
        "Toothbrush and toothpaste, key and door, the fire fighter and the hose: toddlers find what goes together and see it work at once. Without ads.",
      text: "The toothbrush lies above, toothpaste, a key and a lid below: the child taps what belongs to it, and the two get going – the toothpaste squeezes a blob onto the brush, the key turns and the door opens. In between, helpers drawn as fox and bear need their tools: the fire fighter puts out the fire with the hose, the doctor listens with the stethoscope, the hairdresser snips with the scissors. The game gets easier or harder by itself.",
    },
    "/schatten/": {
      title: "Recognise – Shadows and Animals for Toddlers",
      description: "Which shadow belongs to the giraffe? Who is peeking out of the bush? First recognising for toddlers, without ads.",
      text: "A picture looks for its shadow among two to six; then an animal peeks out of a bush or the pond and the child taps who it is. Tap or drag; a wrong shadow briefly shows who it is. First a few very different pictures, then more and more alike as the child gets sure.",
    },
    "/socken/": {
      title: "Sock Pairs – Matching Game for Toddlers",
      description: "The washing machine is done: find pairs of socks and hang them on the line. A first pairs game for toddlers, without ads.",
      text: "The socks tumble out of the washing machine. Matching socks sound the same; a pair hops onto the line. First a few pairs in bright colors, then more, with patterns and under laundry baskets like memory – as the child gets sure.",
    },
    "/buchstaben/": {
      title: "Free Typing – Learning Letters on the Keyboard",
      description:
        "Every key shows its letter with a picture and a voice: B for bear. Numbers come with things to count. A keyboard game for toddlers, without ads.",
      text: "Free typing on the keyboard or the screen: every letter comes with a picture and a word, every number with things to count. If you like, capital and small letters, tracing with a finger and pictures on one theme.",
    },
    "/zaehlen/": {
      title: "Learning to Count – Number Game for Toddlers",
      description:
        "Every key brings a number with as many things to count: all at once, counted aloud, step by step or counted by tapping. For toddlers, without ads.",
      text: "A number game on the keyboard or the screen: every digit shows itself with as many things, any other key brings a number from 1 to 9. The things come all at once, are counted aloud, come step by step, or the child taps each one and counts.",
    },
    "/mitmachen/": {
      title: "Numbers to Join In – Hop, Clap, Stamp",
      description:
        "With every number a fox or bear child hops, claps or stamps just as often and counts aloud – and the child joins in. For toddlers, without ads.",
      text: "A number game to move along with: every digit on the keyboard or the screen, any other key brings a number from 1 to 9. A fox or bear child invites – “Hop along!” – and hops, claps or stamps as often as the number says, its grown-up beside it. Each one is counted aloud, with a short wait so the child can join in. So the number becomes an amount in the child's own body.",
    },
    "/woerter/": {
      title: "Typing Words – First Words for Toddlers",
      description:
        "Type first words letter by letter: bear, ball, colors and action words. Or “Where is the B?” – find the key for a letter. For toddlers, without ads.",
      text: "A picture and its word: the child types it letter by letter on the keyboard or the screen. Picture words, colors, action words or all mixed, in three lengths. Or just the first letter: “Where is the B?” – find its key.",
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
        "Make your own reward chart for toddlers: day, week, month or a path of stars, with pictures and a reward. Use it on a tablet or print it, also to color in.",
      text: "A reward chart for toddlers, just as you like it: a week chart with tasks and days, a month chart as a calendar, a day chart for morning or evening, or a path of stars to the reward. Tasks as pictures (brushing teeth, potty, getting dressed, sleeping in their own bed …), the child’s name and a reward, best of all time together. A helper leads step by step to your own chart and shows every choice as a picture. On a tablet a grown-up holds a field and the child taps the star in; to print, landscape or portrait, with fields to color and stars to cut out. It prints in color or in black and white, and black and white is more than a gray copy: every picture of the chart is drawn once more as a coloring page, with clear, thick lines. That saves ink, and the child colors their own chart. No punishments, nothing is taken away. On the same page: a daily plan in pictures.",
    },
    "/timer/": {
      title: "Visual Timer for Kids – Hourglass, Train and Candle",
      description: "A timer without numbers for toddlers: a train rolls to the station, an hourglass runs, a candle burns down. 10 seconds to 10 minutes.",
      text: "A visual timer for children who can’t read a clock yet: a grown-up sets 10 or 30 seconds or 1, 2, 3, 5 or 10 minutes, and the child watches the time go by – a little train rolls to the station where the bear family waits, sand runs through a big hourglass, or a candle burns down until the bear child blows it out, or ants carry a cookie to their hill crumb by crumb. When the child taps the picture, what is left lights up for a moment. For taking turns between siblings, a toy lies by the fox child until the hourglass is empty, then it travels to the bear child and the hourglass turns itself over. At the end a happy tune plays and the family waves. For “five more minutes of play”, waiting for dinner or tidying up; the screen stays on meanwhile, and the timer still runs when play time is over.",
    },
    "/tagesplan/": {
      title: "Visual Schedule for Toddlers – Day and Week",
      description:
        "Daily routine, morning and bedtime routine or a week plan for toddlers in pictures: the child taps off what is done. Picture cards to print and color.",
      text: "A daily plan in pictures (a visual schedule) for toddlers: the steps of the day as big picture cards – what is next lights up, the child taps it off when it is done, and the next card lights up. Templates for the morning routine, the bedtime routine, a day with daycare and a first-then board; a week plan shows what happens on which day, with a moon for every sleep until then. A helper leads in pictures to your own plan, and to print there are pages with every picture as a card to cut out for a Velcro board – in color, or in black and white with every card drawn as a coloring page in clear lines, so the child colors their own plan. On the same page: a reward chart to collect stars.",
    },
    "/wie-lange-warten/": {
      title: "Countdown for Kids – How Many More Sleeps?",
      description:
        "Until the birthday, the holiday or Grandma’s visit: a box with the fox or bear child asleep for every sleep, and each morning a star goes into it.",
      text: "Little children don’t understand “in five days” yet, but “five more sleeps” they do – so this countdown counts in nights. For every night until the big day there is a box with a picture in it, the fox or bear child asleep in its bed, and a circle beneath it just like on the reward chart. Beside them waits the picture of the day itself: a birthday, a holiday, Grandma and Grandpa, the first day at daycare. Each morning the box of the night just slept lights up, the child taps it, the rooster crows, and a star lands in the circle. So the stars grow and the nights until the big day get fewer, until its picture stands big. We set the day and the picture, tap ＋ for one more night and the bin for one less, and if you like, you print the nights – in color or to color in – and stick a sticker into the circle each morning. On the same shelf: the reward chart and the daily plan in pictures.",
    },
    "/schnullerfee/": {
      title: "Pacifier Fairy – Saying Goodbye to the Pacifier",
      description:
        "The pacifier fairy comes: gather the pacifiers into a box or tie them to a balloon, lights out – and in the morning a present waits. For weaning off the binky.",
      text: "A story for weaning off the pacifier, to play on the evening before: Tapsi the fox gathers his pacifiers and puts them into a little box on the windowsill – or ties them to a balloon that flies out of the window. Then the light goes out, mom gives a good-night kiss, and at night the pacifier fairy comes through the window, sparkles and swaps the pacifiers for a present. In the morning the child wakes Tapsi up, and the present waits on the windowsill. Parents choose which present it is and whether it is the box or the balloon, so the story matches the real goodbye.",
    },
    "/abstillen/": {
      title: "Weaning Story for Toddlers – Bye-bye, Mommy's Milk",
      description:
        "A picture story for weaning toddlers: Tapsi the fox says goodbye to mommy's milk, feels sad, cuddles with mom and falls asleep without nursing.",
      text: "A picture story to read aloud when breastfeeding comes to an end: Tapsi the fox was a baby and drank at mom's, now Tapsi is big, eats an apple and drinks from a cup. Mom tells Tapsi that her milk will soon be all gone, and Tapsi waves it goodbye. In the evening Tapsi still wants to nurse and is sad – mom stays close, holds Tapsi tight, reads a book and sings a lullaby until Tapsi falls asleep. In the morning mom and dad are proud. Every tap turns a page, and each page's sentence stands small below the picture for reading aloud. For gentle weaning of toddlers, without pressure or scolding.",
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
