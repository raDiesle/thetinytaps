import type { PageText, SeoTranslation } from "./seo";

// The search engine texts in English, for the pages under /en/ (see seo.ts), by German address. Written for what
// English-speaking parents search: "toddler games", "free", "no ads", "offline" (see the
// domain research on /management/). Imported only by texts-en.ts and tools/build.ts. No `@/` imports: the build reads it.

const scene = (title: string, things: string, more: string): PageText => ({
  title: `${title} Look-and-Find for Toddlers`,
  description: `A living ${title.toLowerCase()} picture to tap: ${things} move and make sounds. For toddlers, free and without ads.`,
  text: `A look-and-find picture that comes alive: ${things} – every tap brings something to life, with a sound and a movement. ${more} Besides free exploring, the picture can be colored in, searched, explored with questions or discovered in the dark with a flashlight – or you draw roads for a car, a tractor or a steam train to drive along.`,
});

/** The English texts of every page. */
export const SEO_EN: SeoTranslation = {
  locale: "en_US",
  promise: "Free, no ads, no sign-up, works offline, in seven languages. With touch or keyboard, best played together with a grown-up.",
  imageAlt: "A fox family and a bear family read a picture book together on a picnic blanket.",
  pages: {
    "/": {
      title: "Toddler Games & Everyday Helpers – Free, No Ads",
      description:
        "Learning games & everyday helpers for toddlers: look-and-find pictures, feelings, letters, timer, toothbrushing, potty, reward chart, weaning, hair washing.",
      text: "Fun for Both is a shelf of picture books to play, for grown-ups and little ones together: every tap and every key does something right away, nothing is ever wrong and there is nothing to read. In the books wait look-and-find pictures, movement adventures, chain reactions and little adventures, feelings, letters and numbers, matching and recognizing. And because a day with a little child has its own small hurdles, our everyday helpers stand right beside them: a timer that shows time in pictures, tooth brushing with a song, the potty game, a reward chart, a daily plan in pictures and a “how many more sleeps?” countdown – on a tablet or to print – and read-aloud stories in chapters for weaning, for saying goodbye to the pacifier with the pacifier fairy, for starting daycare and for hair washing. Whoever plays a game or a story to its end gets a little trophy of its own for it, and all the trophies gather at the bottom of the shelf beside the books.",
    },
    "/spiele/lebendige-welten/": {
      title: "Living Pictures and Stories for Toddlers",
      description: "Living look-and-find pictures, movement games, chain reactions and little adventures that answer every tap. For toddlers, without ads.",
      text: "Pictures and stories that answer every tap: more than twenty Living Pictures, Move-Along Adventures with Tapsi the fox, twenty Chain Reactions and marble runs, and Little Adventures in the elevator, along paths and in little films – with the fire brigade, at the bakery, with a letter for Grandma or in our own garden.",
    },
    "/spiele/gefuehle/": {
      title: "Feelings Games for Toddlers",
      description:
        "Everyday situations with the little bear, How are you? and What Happened? – the child shows its feeling, how strong it is, what helps and why.",
      text: "A picture book about feelings with three games: in Everyday Situations the little bear lives through what children know, day by day – anger, sadness, fear and joy – and the child picks what helps. In “How are you?” the child shows its own feeling and how strong it is, and in “What do I need?” what does it good now. In “What Happened?” the little bear cries, laughs or gets a fright, and the child taps the one of two pictures that shows what happened.",
    },
    "/spiele/buchstaben-zahlen/": {
      title: "Letters and Numbers – Keyboard Games",
      description:
        "Free typing, counting, joining in and typing words: every key shows its letter with a picture and a voice, numbers come to count and to hop.",
      text: "Four games on the keyboard or the screen: free typing with a letter, a picture and a word, counting with numbers and things, Join In, where a fox or bear child hops, claps or stamps every number, and typing words with first words, colors, action words and “Where is the B?”.",
    },
    "/spiele/zuordnen/": {
      title: "Matching Games for Toddlers",
      description:
        "What does the animal need, what goes together, which shadow fits, which socks match? First matching games for toddlers, free and without ads.",
      text: "Four first matching games: in “What Does the Animal Need?” the animal gets its food and its home, in “What goes together?” toothbrush and toothpaste or the fire fighter and the hose find each other, in “Recognize” the child spots shadows and animals in the bush, and in “Sock Pairs” matching socks go on the line. Tap or drag, nothing is ever wrong – and every game gets easier or harder by itself.",
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
      text: "Little stories of the bear, told as days from morning to night: he is angry, sad, scared or happy, and the child picks between two ideas what helps. The scenes also come sorted by feeling. The whole text stands under the pictures: if you would rather tell the story yourself or read it aloud, one tap turns the voice off. For talking about feelings with toddlers.",
    },
    "/wie-gehts-dir/": {
      title: "How Are You? Showing Feelings for Toddlers",
      description: "Happy, proud, tired or angry: the child taps the picture that fits its feeling and shows how strong it is right now. No ads.",
      text: "Eight feelings in two groups, the pleasant and the unpleasant ones, each with the little bear in a moment children know. The child taps its feeling, then three pictures show the same feeling a little, quite a lot and a whole lot, and the child picks how strong it is right now. From there it goes on to “What do I need?”. A start for talking about feelings.",
    },
    "/was-ist-passiert/": {
      title: "What Happened? Understanding Feelings for Toddlers",
      description: "The little bear cries, laughs or gets a fright, and the child taps what happened: the balloon flies away, Grandma comes. No ads.",
      text: "Thirty small scenes with the little bear: he is sad, angry, scared, happy, proud or finds something yucky. Two pictures show what might have happened just before – his ice cream falls down, the raccoon takes his spade, Papa tickles him – and the child taps the one that fits. Below them, grown-ups read what to ask the child and why the bear feels this way. So the child sees that feelings have a reason – a start for talking with toddlers about why.",
    },
    "/kettenreaktion/": {
      title: "Chain Reaction and Marble Run for Kids",
      description: "A marble rolls off and sets a machine going: marble runs and chain reactions to tap and marvel at, for toddlers, without ads.",
      text: "Twenty-one runs and machines: marbles roll over wood, snow, water slides and conveyor belts, dominoes and everyday things topple, one thing pushes the next. On the colour run the child picks red, yellow or blue for each marble, and at the bottom it drops into the tube of its colour and is counted. One tap starts the chain reaction, and at one point the machine waits until the child lets it run on with a tap – to marvel at and play again.",
    },
    "/kleine-abenteuer/": {
      title: "Little Adventures – Picture Stories for Toddlers",
      description:
        "Short picture adventures for toddlers: ride the elevator, walk along paths and watch little films like the bakery. Every tap moves the story on.",
      text: "Adventures of a few minutes: ride the elevator and discover something on every floor, walk along a path – after the ball, the kite or the little train – and celebrate at the end, or live a little film: drive out with the fire brigade, take a letter to Grandma, bake rolls, a pretzel or a cake at the bakery, or sow a sunflower, carrots or strawberries in the garden, water them and watch them grow. On the way the child decides too.",
    },
    "/tiere/": {
      title: "Feed the Animals – Animal Game for Toddlers",
      description:
        "What goes with the animal? What does it eat, what does it give us, where does it live, what does the caterpillar become? With animal sounds, no ads.",
      text: "The rabbit wants a carrot, the elephant peanuts, the cow gives us milk, the beaver looks for its lodge, the caterpillar becomes a butterfly and the seed a sunflower: tap the food, the milk, the egg or the home, and the animal is happy and makes its sound. Many animals from the farm, the forest, the zoo and the sea. And behind a little curtain something moos, barks or roars: who was it? The game gets easier or harder by itself.",
    },
    "/zusammen/": {
      title: "What Goes Together? – Matching Game for Toddlers",
      description:
        "Toothbrush and toothpaste, key and door, the fire fighter and the hose: toddlers find what goes together and see it work at once. Without ads.",
      text: "The toothbrush lies above, toothpaste, a key and a lid below: the child taps what belongs to it, and the two get going – the toothpaste squeezes a blob onto the brush, the key turns and the door opens. In between, helpers drawn as fox and bear need their tools: the fire fighter puts out the fire with the hose, the doctor listens with the stethoscope, the hairdresser snips with the scissors. Nearly 200 pairs in more than twenty topics, from the bathroom and daycare to the farm. The game gets easier or harder by itself.",
    },
    "/schatten/": {
      title: "Recognize – Shadows and Animals for Toddlers",
      description: "Which shadow belongs to the giraffe? Who is peeking out of the bush? First recognizing for toddlers, without ads.",
      text: "A picture looks for its shadow among two to six – animals, vehicles, food and things; then an animal peeks out of a bush or the pond and the child taps who it is. Tap or drag; a wrong shadow briefly shows who it is. First a few very different pictures, then more and more alike as the child gets sure, later turned and mirrored shadows and some under paper flaps to remember.",
    },
    "/socken/": {
      title: "Sock Pairs – Matching Game for Toddlers",
      description: "The washing machine is done: find pairs of socks and hang them on the line. A first pairs game for toddlers, without ads.",
      text: "The socks tumble out of the washing machine. Matching socks sound the same; a pair hops onto the line. First a few pairs in bright colors, then more, with patterns and under laundry baskets like memory – as the child gets sure. Then come mittens, rain boots and bear slippers, each a left and a right one.",
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
    "/gross-klein/": {
      title: "Where Is Little b? – Capital and Small Letters",
      description: "A big letter with eyes looks for its little one: three small letters to choose from, and the right one walks over and holds its hand.",
      text: "A letter game about capital and small letters: a big letter with eyes looks for its child. Three small letters stand below, and only one belongs to it. Tapped, it walks over to the big one and they hold hands; a wrong one shakes its head. First the three look plainly different, later alike, like b, d and p.",
    },
    "/zaehne/": {
      title: "Tooth Brushing for Kids – Song and Timer",
      description:
        "Brush teeth with a song: step by step, the sugar monsters disappear, and a star for morning and evening. A tooth brushing timer for toddlers.",
      text: "A tooth brushing buddy as long as its song, about two minutes: first a little story shows where the sugar monsters come from, then seven steps (chewing surfaces, outside, inside) lead through the brushing and the monsters disappear. In the morning the sun rises, in the evening the moon, and a week chart collects the stars. The brushing song sings in the app’s language – English, German, Spanish, Russian, Chinese, Hindi or Arabic.",
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
      text: "A reward chart for toddlers, just as you like it: a week chart with tasks and days, a month chart as a calendar, a day chart for morning or evening, or collecting stars, each task on its own path to its own reward. Tasks as pictures (brushing teeth, potty, getting dressed, sleeping in their own bed …), the child’s name and a reward, best of all time together. A helper leads step by step to your own chart and shows every choice as a picture. On a tablet a grown-up holds a field and the child taps the star in; to print, landscape or portrait, with fields to color and stars to cut out. It prints in color or in black and white, and black and white is more than a gray copy: every picture of the chart is drawn once more as a coloring page, with clear, thick lines. That saves ink, and the child colors their own chart. No punishments, nothing is taken away. On the same page: a daily plan in pictures and the “how many more sleeps?” countdown.",
    },
    "/timer/": {
      title: "Visual Timer for Kids – Red Disc and Hourglass",
      description: "A timer without numbers for toddlers: the red disc shrinks, sand runs, candles burn, a train rolls to the station. 10 seconds to 3 hours.",
      text: "A visual timer for children who can’t read a clock yet – one of our everyday helpers. A grown-up sets 10 or 30 seconds or 1 to 10 minutes, any other time up to three hours or a clock time to end at, and the child watches the time go by: the red disc children know from daycare gets smaller, sand runs through a big hourglass, candles burn down, an apple tree grows, blossoms and bears apples, a pizza is eaten slice by slice, a children’s alarm clock counts down, a train rolls to the station, a caterpillar eats its leaf, a flower grows and blooms, or the sun rises. When the child taps the picture, what is left lights up for a moment, and small in the corner the time left stands for us grown-ups. For taking turns between siblings, the hourglass stands between two cushions: a lamp shows whose turn it is, the toy lies there until the sand is through, then it hops over and the hourglass turns itself over. Or two children play tennis: the ball lies on the racket of whoever’s turn it is, that half of the court is in the light, and at the change the ball flies slowly over the net. At the end a cheer and a happy tune sound. For “five more minutes of play”, waiting for dinner or tidying up; the screen stays on meanwhile, and the timer still runs when play time is over.",
    },
    "/tagesplan/": {
      title: "Visual Schedule for Toddlers – Day and Week",
      description:
        "Daily routine, morning and bedtime routine or a week plan for toddlers in pictures: the child taps off what is done. Picture cards to print and color.",
      text: "A daily plan in pictures (a visual schedule) for toddlers: the steps of the day as big picture cards – what is next lights up, the child taps it off when it is done, and the next card lights up. Templates for the morning routine, the bedtime routine, a day with daycare and a first-then board; a week plan shows what happens on which day, with a moon for every sleep until then. Plus cards with words for us parents – words of courage in the morning, telling about the day after daycare, good-night words – and the tooth brushing card starts the brushing with its song right away. A helper leads in pictures to your own plan, and to print there are pages with every picture as a card to cut out for a Velcro board – in color, or in black and white with every card drawn as a coloring page in clear lines, so the child colors their own plan. On the same page: a reward chart to collect stars and the “how many more sleeps?” countdown.",
    },
    "/wie-lange-warten/": {
      title: "Countdown for Kids – How Many More Sleeps?",
      description:
        "Until the birthday, the holiday or Grandma’s visit: a box with the fox or bear child asleep for every sleep, and each morning a star goes into it.",
      text: "Little children don’t understand “in five days” yet, but “five more sleeps” they do – so this countdown counts in nights. For every night until the big day there is a box with a picture in it, the fox or bear child asleep in its bed, and a circle beneath it just like on the reward chart. Beside them waits the picture of the day itself: a birthday, a holiday, Grandma and Grandpa, the first day at daycare. Each morning the box of the night just slept lights up, the child taps it, the rooster crows, and a star lands in the circle. So the stars grow and the nights until the big day get fewer, until its picture stands big. We set the day and the picture, tap ＋ for one more night and the bin for one less, and if you like, you print the nights – in color or to color in – and stick a sticker into the circle each morning. On the same shelf: the reward chart and the daily plan in pictures.",
    },
    "/schnullerfee/": {
      title: "Pacifier Fairy – A Story for Giving Up the Pacifier",
      description: "A read-aloud story in chapters: Tapsi the fox gathers three pacifiers, and at night the pacifier fairy swaps them for a present.",
      text: "A story to read aloud, chapter by chapter, when the pacifier is to go. Tapsi the fox has three pacifiers, a red, a blue and a yellow one, and with a pacifier in the mouth mom only hears “mmm-mmm”. Mom and dad tell of the pacifier fairy, who takes pacifiers to the little babies. First the pacifier stays in bed and is only for falling asleep. Then Tapsi says the fairy may come, dad sticks three stars on the window, and every morning Tapsi takes one down. On the big day Tapsi gathers all the pacifiers into a box, kisses each goodbye and puts them on the windowsill with a drawing. The first night is hard, Tapsi cries, and mom and dad stay close, comfort and sing. At night the fairy flies in, takes the box and leaves a present: a cuddly bunny that now helps with falling asleep. Tapsi may miss the pacifier and be sad, and mom and dad love Tapsi, with a pacifier or without. The book opens on its table of contents, the sentence to read aloud stands below every picture, and every tap turns the page.",
    },
    "/kita/": {
      title: "Starting Daycare – A Story for Settling In and Goodbyes",
      description: "A read-aloud story in chapters for settling into daycare and the morning goodbye: Tapsi the fox starts daycare, and mom always comes back.",
      text: "A story to read aloud, chapter by chapter, when daycare begins or the morning goodbye is hard. Mom and dad tell Tapsi the fox about daycare, dad and Tapsi look at it from outside, and together they pack the backpack with slippers and the cuddly bunny. In the first days mom stays at daycare, on a little chair, while Tapsi gets to know Mia, the teacher, and plays with Bruno. Then mom goes out for a short while for the first time and says beforehand that she will come back; Tapsi cries, Mia comforts, and mom is soon back. Mia helps at breakfast and blows on a sore knee, and every day mom stays away a little longer. One chapter is the goodbye ritual you can read every morning: the jacket on the hook with the star, one big squeeze, a kiss on the nose, “I’ll pick you up after nap time” and waving at the window – mom never sneaks away. Then Tapsi’s day with circle time, a block tower, the sandpit, lunch and nap time, and right after it mom stands in the door. The book opens on its table of contents, the sentence to read aloud stands below every picture, and every tap turns the page. Following the Berlin settling-in model.",
    },
    "/haare-waschen/": {
      title: "Hair Washing Without Tears – A Story for Toddlers",
      description:
        "A read-aloud story in chapters for hair washing: Tapsi the fox holds the washcloth, says “Now!” and gets a foam crown – and the eyes stay dry.",
      text: "A story to read aloud, chapter by chapter, when hair washing brings tears or fear. Tapsi the fox has porridge and sand in the hair, and mom says beforehand what will happen: first water, then foam, then water again, and then the warm towel – not every night, just tonight. Tapsi doesn’t like water in the eyes, and mom listens. First Tapsi washes the cuddly bunny’s hair with an empty cup, and then mom’s, with real water. Tapsi picks the red cup and the apple shampoo, feels whether the water is warm and holds the washcloth over the eyes all alone. In the bath the head goes back, the eyes look up at the sun on the ceiling, mom shapes a foam crown for the hand mirror, and when Tapsi says “Now!” mom counts to three and rinses down the back. One night a drop runs into an eye after all: mom stops at once, dries Tapsi’s face and comforts, and Tapsi decides how to go on. Then the warm towel, dad rubs the hair dry and says what Tapsi did all alone. The book opens on its table of contents, the sentence to read aloud stands below every picture, and every tap turns the page.",
    },
    "/abstillen/": {
      title: "Weaning Story for Toddlers – Tapsi's Milk Chain",
      description:
        "A read-aloud story in chapters for gentle weaning: first the daytime milk goes, then the evening's, the night's and last the morning's – with Tapsi the fox.",
      text: "A longer story to read aloud, chapter by chapter, when breastfeeding is to end slowly. Tapsi the fox drank at mom's breast as a baby and is big now. Mom explains why the milk may go: her breast has made milk for so long and would like to rest. Above Tapsi's bed hangs a chain with a milk drop for every nursing time, and chapter by chapter one goes: first the daytime milk, when play, food and a cup help, then the evening's, when Tapsi falls asleep with a book and a song, then the night's, when dad comforts, and last the morning's, with a goodbye. Tapsi may be angry and sad, and mom and dad stay close. Below every picture stands the sentence to read aloud. The book opens on its table of contents, where each of the eleven chapters can be opened directly, so the next evening you go on where you stopped. Every tap turns a page. For gentle weaning of toddlers, without pressure or scolding.",
    },
    "/bilder/baustelle/": scene(
      "Construction Site",
      "excavator, crane and cement mixer",
      "The excavator digs, the crane lifts the bricks up, the road roller makes the road smooth, and there is cocoa in the site trailer. Between the machines a hedgehog, a mole and a snail drop by, and the dump truck can drive over into the city.",
    ),
    "/bilder/stadt/": scene(
      "City",
      "bus, traffic light and police car",
      "The traffic light switches from red to green, the bus, the police car and the garbage truck drive through the streets, and Grandma, ducks and pigeons are out and about between the bakery, the church and the fountain. The fire engine can drive over to the fire station, and the bus to the zoo.",
    ),
    "/bilder/bauernhof/": scene(
      "Farm",
      "cow, pig and tractor",
      "The cow, the pig, the horse, the sheep and the goat make their sounds, the rooster crows, and the tractor and the combine harvester are out in the field. Around the farmer run a goose, a hen, chicks and a piglet, and the tractor can drive over into the forest.",
    ),
    "/bilder/hof/": scene(
      "Pond Farmyard",
      "duck, hen and windmill",
      "By the pond the frog croaks and the duck swims, the rooster crows at the henhouse, and the windmill turns. A lamb, piglets, chicks and the bees at the beehive are waiting to be found, and a pumpkin lies next to the scarecrow.",
    ),
    "/bilder/zoo/": scene(
      "Zoo",
      "lion, giraffe, elephant and monkey",
      "The lion with its cub, the elephant with its baby, the giraffe, the zebra and the penguins with their chick are waiting to be tapped. Plus a panda, a koala, a kangaroo, a rhino, a hippo, a flamingo, a seal and a little train – and sometimes the bus from the city comes to visit.",
    ),
    "/bilder/unterwasser/": scene(
      "Underwater",
      "whale, dolphin, octopus and turtle",
      "Under the sea swim a whale, a dolphin, a shark, a ray, an octopus, a seahorse and a clownfish, and a mermaid, a diver and a submarine are on their way. On the sea floor lie a treasure chest, a message in a bottle and an anchor, and up above shines the lighthouse.",
    ),
    "/bilder/badezimmer/": scene(
      "Bathroom",
      "bathtub, shower and toothbrush",
      "A mountain of bubbles grows in the bathtub, the rubber duck swims, the toilet flushes, and the toothbrush and toothpaste are ready. Plus a washing machine, a hair dryer, a potty, slippers and bath toys like a crocodile, a whale and a frog – a picture that goes well with the child's own bath in the evening.",
    ),
    "/bilder/wald/": scene(
      "Forest",
      "fox, deer, hedgehog and owl",
      "In the clearing by the stream live a fox, a deer with its fawn, a stag, a badger, a beaver and a wild boar with its piglets, the woodpecker knocks and the owl hoots. A bridge leads to the signpost, toadstools and ferns grow in the forest, and sometimes the tractor from the farm drives by.",
    ),
    "/bilder/feuerwache/": scene(
      "Fire Station",
      "fire engine, siren and helmets",
      "The siren wails, and the fire engine heads out – with the firewoman, the fireman and the fire dog. Around the station there is a fire pole, a hose tower, a hydrant, an ambulance and a practice dummy to discover, and the fire engine from the city can come to visit.",
    ),
    "/bilder/weltall/": scene(
      "Space",
      "rocket, astronaut and moon buggy",
      "On the moon wait a moon buggy, a moon digger, a lunar lander and a robot dog, while Earth, Mars and Saturn, a shooting star and a comet go by above them. An astronaut, the space station and a little alien with its baby are waiting to be found – and a space flower grows in the greenhouse.",
    ),
    "/bilder/spielplatz/": scene(
      "Playground",
      "slide, swing and ice cream van",
      "The swing, the slide, the seesaw and the climbing tower start to move, in the sandbox there are a sandcastle, a bucket, sand molds and a little toy digger, and the ice cream truck is here. Grandpa, Mom with the stroller, a kite and a balloon are there too – a picture like the playground around the corner.",
    ),
    "/bilder/kueche/": scene(
      "Kitchen",
      "toaster, kettle and fridge",
      "The pot bubbles, the toaster pops, the kettle boils, and the cake rises in the oven. Mom, Dad and the baby are in the kitchen, the cat and the dog too, and the kitchen timer, the rolling pin, the scale and the mixer are waiting to be tried out.",
    ),
    "/bilder/supermarkt/": scene(
      "Supermarket",
      "shopping cart, checkout and baker",
      "The register beeps, the shopping cart rolls, and the fruit gets weighed on the scale. The baker stands at the bread counter, there is milk and cheese in the fridge, and the gumball machine, the bottle machine and the tower of cans are waiting to be tapped – almost like shopping together.",
    ),
    "/bilder/flughafen/": scene(
      "Airport and Train Station",
      "plane, train and baggage belt",
      "On the apron the marshaller waves the plane in, the luggage rides along the baggage belt, and the fuel truck, the follow-me car, the bus and the taxi are on the move. At the train station next door stands the train with its dining car, the station clock ticks, and the conductor, the travelers and the pilot are waiting for their journey.",
    ),
    "/bilder/winterbaustelle/": scene(
      "Winter Construction",
      "snowplow, excavator and site trailer",
      "The construction site in the snow: the excavator, the crane, the dump truck and the forklift keep working while children build a snowman and go sledding. It is warm by the fire barrel, a blue tit and a robin sit at the bird feeder, and an igloo and the footprints in the snow are waiting to be found too.",
    ),
    "/bilder/kita/": scene(
      "Daycare",
      "coat hooks, doll stroller and birthday train",
      "A day at daycare: jackets on the hooks, playing in the block corner, reading a picture book, lunch with noodles and pudding and then nap time. The birthday train, the hamster, the drum, the xylophone and the music box are waiting to be tapped – lovely for talking about before the first day at daycare.",
    ),
    "/bilder/kinderarzt/": scene(
      "Pediatrician",
      "stethoscope, scales and bandage",
      "At the pediatrician's the child is measured and weighed, listened to with the stethoscope and checked with the ear light, and at the end there is a sticker. In the waiting room are Dad, a stroller, a marble run, a rocking horse and an aquarium – so the next real visit feels a little more familiar.",
    ),
    "/bilder/strand/": scene(
      "Beach",
      "sandcastle, lighthouse, seagull and sailboat",
      "The waves roll in, the seagull calls, and the sandcastle grows with a bucket and a shovel. Out at sea a boat and a ship sail by and a dolphin jumps, on the beach lie a crab, a starfish and a clam, and there are fries, sunscreen, a beach tent and the lifeguard tower.",
    ),
    "/bilder/dinotal/": scene(
      "Dino Valley",
      "T. rex, brachiosaurus and volcano",
      "The T. rex has to sneeze, the brachiosaurus stretches its long neck, and dino eggs lie in the nest. Plus a baby triceratops, an ankylosaurus, a baby pterosaur, a plesiosaur in the water, a cave, a piece of amber and giant ferns – prehistoric times to tap.",
    ),
    "/bilder/gutenacht/": scene(
      "Good Night",
      "moon, stars, teddy and music box",
      "The picture for the evening: everything that is tapped falls asleep – the teddy bear, the rocking horse, the goldfish, the robot and the toys – and when everyone is asleep, the room goes dark. The moon, the stars, fireflies, the music box and the bedtime book make it quiet and cozy.",
    ),
    "/bilder/winter/": scene(
      "Winter",
      "snowman, sled and squirrel",
      "In the snow children build a snowman and make a snow angel, an ice skater glides around the ice, and the horse-drawn sleigh goes by. By the log cabin are Grandpa, Mom with hot cocoa, a deer, a rabbit and a squirrel, and a blue tit and a robin sit at the birdhouse.",
    ),
    "/bilder/herbst/": scene(
      "Autumn",
      "hedgehog, chestnuts, kite and tractor",
      "The wind whirls the colorful leaves, the kite rises, and the wild geese fly across the picture. Grandma, Grandpa, a boy and the farmer are outside, and between chestnuts, mushrooms, a puddle and an apple basket live a hedgehog, a squirrel, a blackbird and a worm – there is even a little chestnut man.",
    ),
    "/bilder/ostern/": scene(
      "Easter",
      "Easter bunny, lamb and cherry tree",
      "The Easter Bunny has hidden colorful eggs in the garden – a red, a yellow, a green and a blue one are waiting to be found. Eggs are painted at the painting table, a lamb, a chick and a hen are there, and the bumblebee buzzes among tulips, daffodils and dandelions.",
    ),
  },
};
