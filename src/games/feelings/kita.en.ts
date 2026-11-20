// Im Kindergarten in English: the words of kita.ts, by story id, beat for beat and
// step for step (the sounds stay the German beats'). Little Bear the bear, Little Fox
// the fox, Bunny the hare, Hedgehog the hedgehog, the teacher, and Big Bear who brings
// Little Bear. Nothing is said about the child that depends on boy or girl.

import type { SituationId } from "./kita";
import type { SituationText } from "./localized";

/** The kindergarten stories in English. */
export const SITUATIONS_EN: Partial<Record<SituationId, SituationText>> = {
  push: {
    title: "Pushed",
    caption: "Little Fox pushes Little Bear",
    intro: [{ narration: "Little Bear is playing outside." }, { narration: "Little Fox pushes Little Bear. Ouch!" }],
    steps: [
      {
        caption: "Say “Stop!”",
        question: "Little Fox pushes Little Bear. What can Little Bear do?",
        beats: [{ narration: "Little Bear says loudly:", line: "Stop! No! I don't want that!" }],
        instead: { caption: "Push back", answer: "Hmm, then it hurts even more. Say it loudly instead: Stop!" },
      },
      {
        caption: "Walk away",
        question: "Little Fox is still there. What can Little Bear do?",
        beats: [{ narration: "Then he walks away. Now there is space between them." }],
        instead: { caption: "Throw sand", answer: "Hmm, sand in the eyes hurts. Walk away instead." },
      },
      {
        caption: "Get the teacher",
        question: "Little Bear needs help. What can he do?",
        beats: [
          { narration: "He gets the teacher.", line: "Little Fox pushed me!" },
          { line: "Stop, Little Fox. Pushing hurts." },
          { line: "Sorry, Little Bear." },
        ],
        instead: { caption: "Break the bucket", answer: "Hmm, now the bucket is broken and Little Fox is crying. Get help instead." },
      },
    ],
    outro: [{ narration: "Great! Say stop, walk away, get help." }],
    endCaption: "Little Bear and Little Fox are happy again",
  },
  kick: {
    title: "Kicked",
    caption: "Little Fox kicks Little Bear",
    intro: [{ narration: "Little Bear and Little Fox are outside." }, { narration: "Little Fox kicks Little Bear in the leg. Ouch!" }],
    steps: [
      {
        caption: "Say “Stop!”",
        question: "Little Fox kicks Little Bear. What can Little Bear do?",
        beats: [{ narration: "Little Bear says loudly:", line: "Stop! No kicking!" }],
        instead: { caption: "Kick back", answer: "Hmm, then it hurts both of them. Say it loudly instead: Stop!" },
      },
      {
        caption: "Walk away",
        question: "Little Fox is still there. What can Little Bear do?",
        beats: [{ narration: "He takes a few steps away." }],
        instead: { caption: "Pull an ear", answer: "Hmm, pulling hurts too. Walk away instead." },
      },
      {
        caption: "Call the teacher",
        question: "Little Bear needs help. What can he do?",
        beats: [
          { narration: "He calls the teacher.", line: "Help! Little Fox kicked me." },
          { line: "Little Fox, kicking hurts. We don't do that." },
          { line: "Sorry." },
        ],
        instead: { caption: "Throw the hat away", answer: "Hmm, then Little Fox is sad and there is a fight. Call the teacher instead." },
      },
    ],
    outro: [{ narration: "Well done! Say stop, keep away, get help." }],
    endCaption: "Little Bear and Little Fox are happy again",
  },
  grab: {
    title: "Taken away",
    caption: "Little Fox takes the tractor",
    intro: [{ narration: "Little Bear is playing with his tractor." }, { narration: "Then Little Fox just takes the tractor away!" }, {}],
    steps: [
      {
        caption: "Say “That's mine!”",
        question: "Little Fox takes the tractor. What can Little Bear do?",
        beats: [{ narration: "Little Bear says loudly:", line: "Stop! That's my tractor!" }],
        instead: { caption: "Snatch the tractor", answer: "Hmm, then both of them pull and there is a fight. Say instead: Stop, that's mine!" },
      },
      {
        caption: "Ask for the tractor",
        question: "Little Fox still has the tractor. What can Little Bear do?",
        beats: [{ line: "Please give it back to me." }, { line: "Here. Sorry." }, {}],
        instead: { caption: "Hit", answer: "Hmm, hitting hurts. Say instead: Please give it back to me." },
      },
      {
        caption: "Play together",
        question: "Little Bear has the tractor again. What can he do?",
        beats: [{ line: "Do you want to play too? You can have the bucket." }, { line: "Oh yes!" }],
        instead: { caption: "Send away", answer: "Hmm, now Little Fox is alone and sad. Ask instead: Do you want to play too?" },
      },
    ],
    outro: [{ narration: "Great! And if he doesn't give it back, you get the teacher." }],
    endCaption: "Little Bear holds up the tractor, Little Fox claps",
  },
  slide: {
    title: "Slide is full",
    caption: "The slide is full, Little Bear wants to go now",
    intro: [{ narration: "Everyone wants to slide." }, { narration: "Little Bear wants to slide right now. But the slide is full!" }],
    steps: [
      {
        caption: "Line up",
        question: "The slide is full. What can Little Bear do?",
        beats: [{ narration: "He gets in line at the back.", line: "I'm after Little Fox." }],
        instead: { caption: "Push in front", answer: "Hmm, someone can fall off the slide. Get in line at the back instead." },
      },
      {
        caption: "Wait",
        question: "Little Bear is in line. What can he do?",
        beats: [{ narration: "He waits. First Bunny slides …" }, { narration: "… then Little Fox." }],
        instead: { caption: "Shout and kick", answer: "Hmm, shouting doesn't make it faster. Wait instead, it's your turn soon." },
      },
      {
        caption: "Slide down",
        question: "It's Little Bear's turn. What can he do?",
        beats: [{ narration: "Now it's Little Bear's turn!" }, { line: "Wheee!" }],
        instead: { caption: "Stay at the top", answer: "Hmm, then nobody else can slide. Slide down instead, then it's the next one's turn." },
      },
    ],
    outro: [{ narration: "Great waiting! Everyone gets a turn." }],
    endCaption: "Little Bear, Little Fox and Bunny cheer",
  },
  want: {
    title: "Wanting it",
    caption: "Bunny plays with a car, Little Bear wants it",
    intro: [{ narration: "Bunny is playing with a great car." }, { narration: "Little Bear wants the car too!" }],
    steps: [
      {
        caption: "Ask",
        question: "Little Bear wants the car. What can he do?",
        beats: [{ narration: "He asks:", line: "Can I have a turn?" }, { line: "Soon. I'm still playing." }],
        instead: { caption: "Take the car", answer: "Hmm, then Bunny is sad. Ask instead: Can I have a turn?" },
      },
      {
        caption: "Wait, play ball",
        question: "Bunny is still playing. What can Little Bear do?",
        beats: [{ narration: "Little Bear waits. Meanwhile he plays with the ball." }],
        instead: { caption: "Shout at Bunny", answer: "Hmm, shouting makes Bunny sad. Wait instead and play with the ball for now." },
      },
      {
        caption: "Swap",
        question: "Little Bear has the ball. What can he do?",
        beats: [{ line: "Now it's your turn. Shall we swap?" }, { line: "Yes! Thank you!" }],
        instead: { caption: "Keep everything", answer: "Hmm, now Bunny has nothing at all. Swap instead: the car for the ball." },
      },
    ],
    outro: [{ narration: "Well done! Ask, wait, swap." }],
    endCaption: "Little Bear drives the car, Bunny has the ball",
  },
  angry: {
    title: "Feeling angry",
    caption: "Little Fox knocks the tower over, Little Bear is angry",
    intro: [
      { narration: "Little Bear is building a tall tower." },
      { narration: "Crash! Little Fox knocks the tower over. Little Bear is sooo angry. He wants to push!" },
    ],
    steps: [
      {
        caption: "Stomp",
        question: "Little Bear is angry. What can he do?",
        beats: [{ narration: "But he stomps instead. Stomp, stomp!" }],
        instead: { caption: "Push", answer: "Hmm, pushing hurts. Let the anger out instead: stomp really hard!" },
      },
      {
        caption: "Take a deep breath",
        question: "Little Bear is still angry. What can he do?",
        beats: [{ narration: "He breathes in deeply and blows: Phoooo." }],
        instead: { caption: "Kick the tower over", answer: "Hmm, now Little Fox is crying too. Take a deep breath and blow instead: Phoooo." },
      },
      {
        caption: "Say “I'm angry!”",
        question: "Little Bear is still a little angry. What can he do?",
        beats: [{ narration: "Then he says:", line: "I'm angry! My tower is broken!" }, { line: "Oh, sorry! I'll help you." }, {}],
        instead: { caption: "Hit", answer: "Hmm, hitting hurts. Say instead: I'm angry!" },
      },
    ],
    outro: [{ narration: "Great! Being angry is okay. Stomp, blow, say it – no hitting." }],
    endCaption: "The tower stands again, both laugh",
  },
  bye: {
    title: "Goodbye at the door",
    caption: "Little Bear holds on to Big Bear",
    intro: [{ narration: "Little Bear arrives at kindergarten." }, { narration: "Big Bear has to go now. Little Bear is crying. He doesn't want him to go!" }],
    steps: [
      {
        caption: "Hug tight",
        question: "Big Bear has to go. What can Little Bear do?",
        beats: [{ narration: "Little Bear gives Big Bear a big, tight hug.", line: "Bye! I love you!" }, { line: "I'll pick you up later." }],
        instead: { caption: "Run after him", answer: "Hmm, there are cars outside, that's dangerous. Give him a big hug goodbye instead." },
      },
      {
        caption: "Wave at the window",
        question: "Big Bear is leaving now. What can Little Bear do?",
        beats: [{ narration: "Then he waves at the window.", line: "Bye!" }, { narration: "Big Bear waves back." }],
        instead: { caption: "Hide", answer: "Hmm, it's sad all alone in a hiding place. Wave at the window instead." },
      },
      {
        caption: "Join in",
        question: "Little Bear is still sad. What can he do?",
        beats: [{ line: "Come on, let's build a tower with Little Fox." }, { narration: "Little Bear stops crying. He joins in." }],
        instead: { caption: "Alone in the corner", answer: "Hmm, it's boring alone in the corner. Join in instead." },
      },
    ],
    outro: [{ narration: "Great! Hug, wave, join in. And later Big Bear comes back." }],
    endCaption: "Pick-up time, both happy",
  },
  new: {
    title: "New at kindergarten",
    caption: "Hedgehog is new and alone",
    intro: [{ narration: "Someone new is here today: little Hedgehog." }, { narration: "He stands all alone by the door. He is shy." }],
    steps: [
      {
        caption: "Say hello",
        question: "Hedgehog is new and alone. What can Little Bear do?",
        beats: [{ narration: "Little Bear goes over and waves.", line: "Hello! I'm Little Bear." }, { line: "Hello. I'm Hedgehog." }],
        instead: { caption: "Laugh at him", answer: "Hmm, now Hedgehog is sad. Say instead: Hello!" },
      },
      {
        caption: "Show the blocks",
        question: "Hedgehog is still shy. What can Little Bear do?",
        beats: [{ line: "Look, here are the blocks." }, { narration: "Hedgehog looks. He smiles a little." }],
        instead: { caption: "Hide the blocks", answer: "Hmm, then Hedgehog can't play. Show him the blocks instead." },
      },
      {
        caption: "Let him join in",
        question: "Hedgehog wants to play too. What can Little Bear do?",
        beats: [{ line: "Do you want to play with us?" }, { line: "Yes!" }],
        instead: { caption: "Play only with Little Fox", answer: "Hmm, now Hedgehog is all alone. Ask him instead: Do you want to play with us?" },
      },
    ],
    outro: [{ narration: "Great! Say hello, show, let him join in. Now Hedgehog has friends." }],
    endCaption: "Little Bear, Little Fox and Hedgehog cheer",
  },
  fall: {
    title: "Fell down",
    caption: "Little Bear fell down, his knee hurts",
    intro: [{ narration: "Little Bear runs very fast." }, { narration: "Bump! He falls down. Ouch, his knee hurts!" }],
    steps: [
      {
        caption: "Call for help",
        question: "Little Bear fell down. What can he do?",
        beats: [{ narration: "Little Bear calls:", line: "Ouch! Help!" }, { line: "I'm coming! Let me see." }],
        instead: { caption: "Kick and scream", answer: "Hmm, then nobody can help him. Call the teacher instead." },
      },
      {
        caption: "Put on a bandage",
        question: "The teacher has a bandage. What does Little Bear do?",
        beats: [{ narration: "The teacher puts on a bandage and blows on it." }, { line: "There. It will feel better soon." }],
        instead: { caption: "Pull off the bandage", answer: "Hmm, then it hurts again. Leave the bandage on instead." },
      },
      {
        caption: "Play slowly again",
        question: "The knee doesn't hurt anymore. What can Little Bear do?",
        beats: [{ narration: "Little Fox helps him up.", line: "Come on, let's play slowly." }, { narration: "They roll the ball to each other." }],
        instead: { caption: "Run wild right away", answer: "Hmm, then he falls down again. Play slowly first instead." },
      },
    ],
    outro: [{ narration: "Great! Call for help, bandage on, go on slowly. The ouchie goes away." }],
    endCaption: "Little Bear proudly shows his bandage",
  },
  stop: {
    title: "Won't stop",
    caption: "Little Fox tickles, Little Bear has had enough",
    intro: [
      { narration: "Little Fox tickles Little Bear. At first it's fun." },
      { narration: "But now Little Bear doesn't want it anymore. And Little Fox won't stop!" },
    ],
    steps: [
      {
        caption: "Say “Stop!”",
        question: "Little Fox won't stop. What can Little Bear do?",
        beats: [
          { narration: "Little Bear says loudly:", line: "Stop! I don't want that anymore!" },
          { narration: "Little Fox stops.", line: "Oh. Okay." },
        ],
        instead: { caption: "Bite", answer: "Hmm, biting hurts. Say it loudly instead: Stop! I don't want that!" },
      },
      {
        caption: "Suggest tag",
        question: "Little Fox has stopped. What can Little Bear do?",
        beats: [{ line: "Shall we play tag instead?" }, { line: "Oh yes!" }],
        instead: { caption: "Tickle back", answer: "Hmm, now Little Fox doesn't want that. Stop means stop, for everyone. Ask instead: Shall we play tag?" },
      },
      {
        caption: "Play tag",
        question: "Both want to play tag. What can Little Bear do?",
        beats: [{ narration: "They run and laugh.", line: "Catch me!" }],
        instead: { caption: "Walk off in a huff", answer: "Hmm, now both are alone. Play tag together instead." },
      },
    ],
    outro: [{ narration: "Well done! Stop means stop. And then you play something you both like." }],
    endCaption: "Little Bear and Little Fox high-five",
  },
  // The stories of more feelings (selbst.ts), played like the kindergarten's.
  cookie: {
    title: "Disappointed, the cookie broke",
    caption: "Cookie broken, Little Bear is sad",
    intro: [
      { narration: "Little Bear and Little Fox are eating cookies." },
      { narration: "Crack! Little Bear's cookie breaks in two. He is so disappointed!" },
    ],
    steps: [
      {
        caption: "Squeeze the cuddly toy",
        question: "The cookie is broken, Little Bear is sad. What can he do?",
        beats: [{ narration: "Little Bear squeezes his cuddly toy really tight.", line: "I'm sad." }],
        instead: { caption: "Knock over the cup", answer: "Hmm, now the milk is all over Little Fox. Squeeze your cuddly toy really tight instead." },
      },
      {
        caption: "Share with Little Fox",
        question: "Little Fox has no cookie left. What can Little Bear do?",
        beats: [{ narration: "Little Bear gives Little Fox one half.", line: "For you!" }, { line: "Thank you, Little Bear!" }],
        instead: { caption: "Stick out the tongue", answer: "Hmm, now Little Fox is sad. Share with him instead." },
      },
    ],
    outro: [{ narration: "Great! Being sad is okay. Squeeze the cuddly toy and share." }],
    endCaption: "Little Bear and Little Fox each eat a half",
  },
  baby: {
    title: "Jealous of the baby",
    caption: "Big Bear cuddles the baby, Little Bear is jealous",
    intro: [{ narration: "Big Bear is cuddling the baby bear." }, { narration: "Little Bear is watching. He wants a cuddle too! He is jealous." }],
    steps: [
      {
        caption: "Say “I want a cuddle too!”",
        question: "Big Bear is cuddling the baby. What can Little Bear do?",
        beats: [{ narration: "Little Bear says:", line: "I want a cuddle too!" }, { line: "Come here! There's room for you." }],
        instead: { caption: "Hit the baby", answer: "Hmm, hitting hurts. Say instead: I want a cuddle too!" },
      },
      {
        caption: "Fetch a diaper",
        question: "The baby needs a fresh diaper. What can Little Bear do?",
        beats: [{ narration: "Little Bear fetches a diaper all by himself.", line: "Here!" }, { line: "Thank you! That helps me a lot." }],
        instead: { caption: "Take the rattle", answer: "Hmm, that's the baby's rattle. Now the baby is crying. Fetch a diaper instead." },
      },
      {
        caption: "Sing to the baby",
        question: "The baby is tired. What can Little Bear do?",
        beats: [{ narration: "Little Bear sings the baby a song." }, { narration: "The baby laughs. And Big Bear cuddles them both." }],
        instead: { caption: "Drum loudly", answer: "Hmm, the noise makes the baby cry. Sing the baby a song instead." },
      },
    ],
    outro: [{ narration: "Super! Say what you need, help, sing. Now all three are cuddling." }],
    endCaption: "Big Bear cuddles them both",
  },
  broccoli: {
    title: "Yuck, broccoli",
    caption: "Broccoli on the plate, Little Bear doesn't like it",
    intro: [
      { narration: "Little Bear, Little Fox and Big Bear are eating together." },
      { narration: "There is broccoli on the plate. Yuck! Little Bear doesn't like it." },
    ],
    steps: [
      {
        caption: "Say “No, thank you”",
        question: "Little Bear doesn't like broccoli. What can he do?",
        beats: [{ narration: "Little Bear says:", line: "No, thank you. I don't like that." }, { line: "Okay. You don't have to." }],
        instead: { caption: "Throw the plate down", answer: "Hmm, now the plate is broken. Say instead: No, thank you." },
      },
      {
        caption: "Smell it first",
        question: "The broccoli is still there. What can Little Bear do?",
        beats: [{ narration: "Little Bear sniffs it very carefully. Sniff, sniff." }, { line: "Hm. It smells like a little tree." }],
        instead: { caption: "Spit on the table", answer: "Hmm, spitting is yucky for everyone. Smell it first instead." },
      },
      {
        caption: "Put it at the edge",
        question: "Today Little Bear doesn't want to eat it. What can he do?",
        beats: [{ narration: "He puts the broccoli at the edge of his plate.", line: "Maybe another time." }, { narration: "And eats his potatoes." }],
        instead: { caption: "Throw broccoli at Little Fox", answer: "Hmm, now Little Fox is all dirty. Put it at the edge instead." },
      },
    ],
    outro: [{ narration: "Well done! Say no thank you, give it a sniff, put it at the edge. Nobody has to like everything." }],
    endCaption: "Little Bear eats potatoes, the broccoli at the edge",
  },
  oops: {
    title: "Oops, wet pants",
    caption: "A little puddle, Little Bear is embarrassed",
    intro: [{ narration: "Little Bear is playing at kindergarten." }, { narration: "Oops! He wet his pants. He feels embarrassed." }],
    steps: [
      {
        caption: "Tell the teacher",
        question: "His pants are wet. What can Little Bear do?",
        beats: [{ narration: "Little Bear goes to the teacher.", line: "Oops! My pants are wet." }, { line: "That's okay. It happens to everyone." }],
        instead: { caption: "Keep playing in wet pants", answer: "Hmm, in wet pants he gets cold. Tell the teacher instead." },
      },
      {
        caption: "Get fresh pants",
        question: "Little Bear needs dry pants. What can he do?",
        beats: [{ narration: "He gets fresh pants from his cubby all by himself." }, { line: "Great, you can already do that by yourself!" }],
        instead: { caption: "Smear the puddle", answer: "Hmm, now the whole floor is wet and slippery. Get dry pants instead." },
      },
      {
        caption: "Pack the wet pants",
        question: "The wet pants are off. What can Little Bear do?",
        beats: [{ narration: "He puts the wet pants in the bag. Done!" }],
        instead: { caption: "Throw the pants in the corner", answer: "Hmm, now they lie around wet. Put them in the bag instead." },
      },
    ],
    outro: [{ narration: "Super! Say it, change, pack up. An oops is no big deal." }],
    endCaption: "Little Bear in fresh pants plays again",
  },
  snow: {
    title: "Excited, it's snowing",
    caption: "First snow, Little Bear is so excited",
    intro: [{ narration: "Little Bear looks out of the window." }, { narration: "It's snowing! The first snow! Little Bear is so excited." }],
    steps: [
      {
        caption: "Cheer loudly",
        question: "It's snowing! Little Bear is so excited. What can he do?",
        beats: [{ narration: "Little Bear cheers really loudly:", line: "Yay! Snow!" }],
        instead: { caption: "Romp on the armchair", answer: "Hmm, now the lamp has fallen over. Cheer really loudly instead: Yay!" },
      },
      {
        caption: "Put on boots and jacket",
        question: "Little Bear wants to go out in the snow. What can he do?",
        beats: [{ narration: "First he puts on his boots and jacket all by himself.", line: "Ready! Come outside with me!" }, { line: "I'm coming!" }],
        instead: { caption: "Run out in pajamas", answer: "Hmm, in pajamas it's freezing outside. Put on your boots and jacket instead." },
      },
      {
        caption: "Make a snow angel",
        question: "There is snow outside. What can Little Bear do?",
        beats: [{ narration: "He lies down in the snow and makes a snow angel." }],
        instead: { caption: "Throw a snowball in the face", answer: "Hmm, a snowball in the face hurts. Make a snow angel instead." },
      },
    ],
    outro: [{ narration: "Yay! Cheer, get dressed, snow angel. Joy can be really big." }],
    endCaption: "Little Bear and Big Bear build a snowman",
  },
  leave: {
    title: "Angry, time to go home",
    caption: "Big Bear waits at the gate, Little Bear doesn't want to go",
    intro: [
      { narration: "Little Bear is sitting at the top of the slide." },
      { narration: "Big Bear is waiting at the gate.", line: "Come on, let's go home!" },
      { narration: "Little Bear doesn't want to. He is angry." },
    ],
    steps: [
      {
        caption: "Wave “Bye, slide!”",
        question: "Little Bear doesn't want to go home. What can he do?",
        beats: [{ narration: "He slides down one last time." }, { narration: "Then he waves.", line: "Bye, slide! See you tomorrow!" }],
        instead: { caption: "Run away", answer: "Hmm, the street is right over there. That's dangerous. Wave instead: Bye, slide!" },
      },
      {
        caption: "Pocket a treasure stone",
        question: "Little Bear is still a little angry. What can he do?",
        beats: [{ narration: "He finds a pretty stone and puts it in his pocket.", line: "My treasure! I'm taking it with me." }],
        instead: { caption: "Throw the shovel", answer: "Hmm, the shovel hits Big Bear. Put a pretty stone in your pocket instead." },
      },
      {
        caption: "Push the balance bike",
        question: "The balance bike is at the gate. What can Little Bear do?",
        beats: [{ narration: "Little Bear pushes his balance bike all by himself.", line: "I'll do it!" }, { line: "Great! Off we go." }],
        instead: { caption: "Throw sand", answer: "Hmm, sand in the eyes hurts. Push your balance bike yourself instead." },
      },
    ],
    outro: [{ narration: "Super! Say bye, take a treasure along, push by yourself. And off we go home!" }],
    endCaption: "Little Bear rides off proudly on his balance bike",
  },
  screen: {
    title: "Sad, the show is over",
    caption: "The show is over, Little Bear is sad and angry",
    intro: [{ narration: "Little Bear and Little Fox are watching a show." }, { narration: "Now it's over. Little Bear is sad and angry." }],
    steps: [
      {
        caption: "Say bye and close it",
        question: "The show is over. What can Little Bear do?",
        beats: [{ narration: "Little Bear waves.", line: "Bye! See you tomorrow!" }, { narration: "Then he closes the tablet all by himself." }],
        instead: { caption: "Throw the tablet", answer: "Hmm, now the tablet is broken. Say bye and close it instead." },
      },
      {
        caption: "Squeeze the pillow tight",
        question: "Little Bear is still angry. What can he do?",
        beats: [{ narration: "He squeezes his pillow really tight. And once more." }, { line: "Phew. That's better." }],
        instead: { caption: "Kick the table", answer: "Hmm, that hurts your foot. Squeeze your pillow really tight instead." },
      },
      {
        caption: "Play with the train",
        question: "Little Bear wants to keep playing. What can he do?",
        beats: [{ narration: "He gets his train and plays the show himself.", line: "Choo-choo!" }, { line: "I'll play too!" }],
        instead: { caption: "Throw the pillow at Little Fox", answer: "Hmm, the pillow hits Little Fox in the face. Play with your train instead." },
      },
    ],
    outro: [{ narration: "Well done! Say bye, squeeze the pillow, keep playing yourself." }],
    endCaption: "Little Bear and Little Fox play with the train",
  },
  checkout: {
    title: "Mad at the checkout",
    caption: "Little Bear wants a lollipop, Big Bear says no",
    intro: [
      { narration: "Little Bear is sitting in the shopping cart. There are lollipops at the checkout." },
      { narration: "Big Bear says:", line: "No lollipop today." },
      { narration: "Little Bear is mad!" },
    ],
    steps: [
      {
        caption: "Say “I'm mad!”",
        question: "Little Bear doesn't get a lollipop. What can he do?",
        beats: [{ narration: "Little Bear says really loudly:", line: "I'm mad!" }, { line: "Yes, I understand." }],
        instead: { caption: "Sweep the lollipops down", answer: "Hmm, now all the lollipops are on the floor. Say loudly instead: I'm mad!" },
      },
      {
        caption: "Squeeze the fists tight",
        question: "Little Bear is still mad. What can he do?",
        beats: [{ narration: "He squeezes his fists really tight. And opens them again." }, { line: "Phew. That's better." }],
        instead: { caption: "Kick", answer: "Hmm, kicking hurts Big Bear. Squeeze your fists really tight instead." },
      },
      {
        caption: "Put the bananas on the belt",
        question: "The bananas go on the belt. What can Little Bear do?",
        beats: [
          { narration: "Little Bear puts the bananas on the belt all by himself." },
          { line: "Thank you! Do you want to press the button?" },
          { narration: "Beep!" },
        ],
        instead: { caption: "Pocket a lollipop", answer: "Hmm, the lollipop belongs to the store. Put the bananas on the belt instead." },
      },
    ],
    outro: [{ narration: "Great! Say how you feel, squeeze your fists, help out." }],
    endCaption: "Little Bear presses the button at the checkout",
  },
  jacket: {
    title: "Frustrated, the jacket is stuck",
    caption: "The jacket won't go on, Little Bear is angry",
    intro: [{ narration: "Little Bear wants to get dressed by himself." }, { narration: "But the sleeve is twisted. The jacket won't go on! He is angry." }],
    steps: [
      {
        caption: "Take a deep breath",
        question: "The jacket won't go on. What can Little Bear do?",
        beats: [{ narration: "Little Bear takes a deep breath and blows out: Phoooo." }, { narration: "A little calmer already." }],
        instead: { caption: "Throw the shoe", answer: "Hmm, now the vase is broken. Take a deep breath and blow instead." },
      },
      {
        caption: "The jacket trick",
        question: "The sleeve is twisted. What can Little Bear do?",
        beats: [{ narration: "He lays the jacket on the floor and puts his arms in." }, { narration: "Whee, over the head!", line: "I've got it on!" }],
        instead: { caption: "Tug at the jacket", answer: "Hmm, now the jacket is torn. Try the jacket trick instead." },
      },
      {
        caption: "Say “Help me, please!”",
        question: "The zipper is stuck. What can Little Bear do?",
        beats: [
          { narration: "Little Bear says:", line: "Help me, please!" },
          { line: "Sure. I'll hold the bottom, you pull it up." },
          { narration: "Zip! He pulls it up himself." },
        ],
        instead: { caption: "Hit Big Bear", answer: "Hmm, hitting hurts. Say instead: Help me, please!" },
      },
    ],
    outro: [{ narration: "Done! Blow, try another way, ask for help." }],
    endCaption: "Little Bear stands proudly in his jacket",
  },
  pancake: {
    title: "Impatient, waiting for food",
    caption: "Big Bear is making pancakes, Little Bear is hungry",
    intro: [{ narration: "Big Bear is making pancakes." }, { narration: "Little Bear is so hungry! Waiting is hard." }],
    steps: [
      {
        caption: "Sing a song",
        question: "The pancakes need a little longer. What can Little Bear do?",
        beats: [{ narration: "Little Bear sings a song." }, { line: "Lovely! They're almost ready." }],
        instead: { caption: "Push the plate off", answer: "Hmm, now the plate is broken. Sing a song instead." },
      },
      {
        caption: "Set out the spoons",
        question: "It takes a little longer. What can Little Bear do?",
        beats: [{ narration: "He puts the spoons on the table all by himself. One, two.", line: "I'm helping!" }],
        instead: { caption: "Touch the pan", answer: "Hmm, the pan is hot. Set out the spoons instead." },
      },
      {
        caption: "Look out of the window",
        question: "Just a tiny bit more waiting. What can Little Bear do?",
        beats: [{ narration: "He looks out of the window.", line: "There's a bird flying!" }, { narration: "And here comes the pancake!" }],
        instead: { caption: "Bang on the plate", answer: "Hmm, now the plate has a crack. Look out of the window instead." },
      },
    ],
    outro: [{ narration: "Yum! Sing, help, look. And the waiting is over." }],
    endCaption: "Little Bear eats pancakes",
  },
  vacuum: {
    title: "Scared of the vacuum cleaner",
    caption: "Big Bear is vacuuming, Little Bear gets a fright",
    intro: [{ narration: "Big Bear is vacuuming. Vroom!" }, { narration: "Little Bear gets a fright. So loud!" }],
    steps: [
      {
        caption: "Cover the ears",
        question: "The vacuum cleaner is so loud. What can Little Bear do?",
        beats: [{ narration: "Little Bear covers his ears." }, { line: "Quieter already." }],
        instead: { caption: "Kick the vacuum cleaner", answer: "Hmm, that hurts your foot. Cover your ears instead." },
      },
      {
        caption: "Get the cuddly toy",
        question: "Little Bear is still a little scared. What can he do?",
        beats: [{ narration: "He climbs onto the sofa and holds his cuddly toy really tight." }],
        instead: { caption: "Pull the cord", answer: "Hmm, pulling the cord is dangerous. Get your cuddly toy instead." },
      },
      {
        caption: "Switch it off",
        question: "Big Bear shows the button. What can Little Bear do?",
        beats: [{ line: "Do you want to press it? With your foot, here." }, { narration: "Click, off! Click, on! Little Bear laughs." }],
        instead: { caption: "Knock over the vacuum cleaner", answer: "Hmm, now the dust is everywhere. Press the button yourself instead." },
      },
    ],
    outro: [{ narration: "Great! Cover your ears, get the cuddly toy, press it yourself. Now the vacuum cleaner isn't so scary anymore." }],
    endCaption: "Little Bear presses the button, laughing",
  },
  dog: {
    title: "Scared of the big dog",
    caption: "A big dog barks, Little Bear gets a fright",
    intro: [{ narration: "Little Bear and Big Bear are going for a walk in the park." }, { narration: "Woof! A big dog barks. Little Bear gets a fright." }],
    steps: [
      {
        caption: "Stand like a tree",
        question: "The dog is barking. What can Little Bear do?",
        beats: [{ narration: "Little Bear stands still like a tree. Feet firm, arms on his tummy." }, { narration: "The dog just sniffs." }],
        instead: { caption: "Run away", answer: "Hmm, when you run, the dog wants to run after you. Stand still like a tree instead." },
      },
      {
        caption: "Go to Big Bear",
        question: "Little Bear is still scared. What can he do?",
        beats: [{ narration: "He goes to Big Bear and takes his paw." }, { line: "I'm here with you." }],
        instead: { caption: "Throw a stick", answer: "Hmm, the stick hits the dog. Go to Big Bear instead." },
      },
      {
        caption: "Wave “Hello, dog!”",
        question: "Now the dog is sitting nicely. What can Little Bear do?",
        beats: [{ narration: "He waves from far away.", line: "Hello, dog!" }, { narration: "The dog wags its tail." }],
        instead: { caption: "Pull its tail", answer: "Hmm, that hurts the dog. Wave from far away instead." },
      },
    ],
    outro: [{ narration: "Super! Stand like a tree, go to Big Bear, wave from far away." }],
    endCaption: "Little Bear waves, the dog wags its tail",
  },
  doctor: {
    title: "Scared at the doctor's",
    caption: "The doctor holds the stethoscope, Little Bear is scared",
    intro: [
      { narration: "Little Bear is at the doctor's. He is sitting on Big Bear's lap." },
      { narration: "The doctor wants to listen to his chest. Little Bear is scared." },
    ],
    steps: [
      {
        caption: "Squeeze the cuddly toy",
        question: "Little Bear is scared. What can he do?",
        beats: [{ narration: "Little Bear squeezes his cuddly toy really tight." }, { line: "You are very brave." }],
        instead: { caption: "Hit the doctor", answer: "Hmm, hitting hurts. Squeeze your cuddly toy really tight instead." },
      },
      {
        caption: "Take a deep breath",
        question: "The stethoscope is a little cold. What can Little Bear do?",
        beats: [{ narration: "He takes a deep breath and blows out: Phoooo." }, { line: "Great! I can hear your heart. Ba-boom, ba-boom." }],
        instead: { caption: "Knock the stethoscope away", answer: "Hmm, now the stethoscope is broken. Take a deep breath and blow instead." },
      },
      {
        caption: "Pick a bandage",
        question: "All done! Little Bear wants to leave quickly. What can he do?",
        beats: [{ narration: "He picks a bandage all by himself. One with stars!" }, { line: "You did really well!" }],
        instead: { caption: "Run away", answer: "Hmm, running off alone is dangerous. Pick a bandage instead." },
      },
    ],
    outro: [{ narration: "Done! Squeeze the cuddly toy, blow, pick a bandage." }],
    endCaption: "Little Bear proudly shows his star bandage",
  },
  hairwash: {
    title: "Scared of hair washing",
    caption: "Foam on his head, Little Bear is scared",
    intro: [
      { narration: "Little Bear is sitting in the bathtub. He has foam on his head." },
      { narration: "Water is coming soon. Little Bear is scared it will get in his eyes." },
    ],
    steps: [
      {
        caption: "Washcloth over the eyes",
        question: "Water is coming soon. What can Little Bear do?",
        beats: [{ narration: "He presses the washcloth over his eyes himself.", line: "Now nothing gets in!" }],
        instead: { caption: "Splash water out", answer: "Hmm, now the floor is wet and slippery. Hold the washcloth over your eyes instead." },
      },
      {
        caption: "Look up at the duck",
        question: "Little Bear is still a little scared. What can he do?",
        beats: [{ narration: "He tips his head back and looks up at the duck.", line: "Hello, duck!" }],
        instead: { caption: "Climb out of the tub", answer: "Hmm, wet and slippery, you can slip and fall. Look up at the duck instead." },
      },
      {
        caption: "Rinse it off",
        question: "The foam has to come off. What can Little Bear do?",
        beats: [{ narration: "He takes the cup and rinses all by himself. Splash!" }, { line: "I did it!" }],
        instead: { caption: "Throw the cup", answer: "Hmm, now all the bottles have fallen over. Rinse with the cup yourself instead." },
      },
    ],
    outro: [{ narration: "Super! Hold the washcloth, look up, rinse yourself. All clean!" }],
    endCaption: "Little Bear sits happily in the tub, hair clean",
  },
  night: {
    title: "Scared, awake at night",
    caption: "A shadow on the wall at night, Little Bear is awake",
    intro: [{ narration: "It is night. Little Bear wakes up." }, { narration: "There's a big shadow on the wall! Little Bear is scared." }],
    steps: [
      {
        caption: "Switch on the night light",
        question: "There's a shadow. What can Little Bear do?",
        beats: [{ narration: "He switches on the night light all by himself." }, { narration: "The shadow is only the coat stand!" }],
        instead: { caption: "Throw a block", answer: "Hmm, now the coat stand has fallen over. Switch on the night light instead." },
      },
      {
        caption: "Squeeze the cuddly toy and hum",
        question: "Little Bear is still a little restless. What can he do?",
        beats: [{ narration: "He squeezes his cuddly toy and hums softly." }],
        instead: {
          caption: "To the stairs in the dark",
          answer: "Hmm, in the dark you can fall on the stairs. Squeeze your cuddly toy and hum softly instead.",
        },
      },
      {
        caption: "Call Big Bear",
        question: "Little Bear doesn't want to be alone. What can he do?",
        beats: [
          { narration: "He calls:", line: "Can you come?" },
          { narration: "Big Bear comes and sits down by the bed.", line: "I'm here." },
        ],
        instead: { caption: "Throw out the cuddly toy", answer: "Hmm, now your cuddly toy is lying all alone on the floor. Call Big Bear instead." },
      },
    ],
    outro: [{ narration: "Well done! Light on, squeeze the cuddly toy, call. And now: sleep well." }],
    endCaption: "Little Bear is asleep again, Big Bear sits by the bed",
  },
  lost: {
    title: "Sad, the cuddly rabbit is gone",
    caption: "The cuddly rabbit is gone, Little Bear is crying",
    intro: [{ narration: "Little Bear wants to go to bed." }, { narration: "But his cuddly rabbit is gone! He is so sad." }],
    steps: [
      {
        caption: "Say “I'm sad”",
        question: "His cuddly rabbit is gone. What can Little Bear do?",
        beats: [{ narration: "Little Bear says:", line: "I'm sad. My cuddly rabbit is gone." }, { line: "Oh. That is sad." }],
        instead: { caption: "Tip out the toy box", answer: "Hmm, now everything is a big mess. Say how you feel instead." },
      },
      {
        caption: "Look for it",
        question: "Where can the cuddly rabbit be? What can Little Bear do?",
        beats: [{ narration: "He looks all by himself. Under the bed? No." }, { narration: "In the basket? There!" }],
        instead: { caption: "Take Little Fox's dog", answer: "Hmm, that's Little Fox's cuddly dog. Now he is sad. Look for your cuddly rabbit instead." },
      },
      {
        caption: "Squeeze it tight",
        question: "There's the cuddly rabbit! What can Little Bear do?",
        beats: [{ narration: "He squeezes it really tight.", line: "There you are!" }],
        instead: { caption: "Throw it in the corner", answer: "Hmm, now it's lying all alone in the corner again. Squeeze it really tight instead." },
      },
    ],
    outro: [{ narration: "Lovely! Say how you feel, look by yourself, squeeze tight." }],
    endCaption: "Little Bear cuddles his cuddly rabbit in bed",
  },
  join: {
    title: "Sad, can't join in",
    caption: "Little Fox and Bunny build a castle, Little Bear stands by",
    intro: [
      { narration: "At kindergarten, Little Fox and Bunny are building a sandcastle." },
      { narration: "Little Bear wants to play too. Hedgehog is playing alone." },
    ],
    steps: [
      {
        caption: "Ask",
        question: "Little Bear wants to play too. What can he do?",
        beats: [{ narration: "Little Bear asks:", line: "Can I play too?" }, { line: "No, not now." }],
        instead: { caption: "Kick the sandcastle down", answer: "Hmm, now the castle is broken, and everyone is sad. Ask instead: Can I play too?" },
      },
      {
        caption: "Say “That makes me sad”",
        question: "Little Fox says no. What can Little Bear do?",
        beats: [{ narration: "Little Bear says:", line: "That makes me sad." }, { line: "Oh. Maybe later." }],
        instead: { caption: "Throw sand", answer: "Hmm, sand in the eyes hurts. Say instead: That makes me sad." },
      },
      {
        caption: "Build with Hedgehog",
        question: "Hedgehog is playing alone. What can Little Bear do?",
        beats: [{ narration: "He builds a tall tower with Hedgehog." }, { narration: "Soon Little Fox and Bunny come and join them." }],
        instead: { caption: "Take Hedgehog's shovel", answer: "Hmm, now Hedgehog is sad too. Build with him instead." },
      },
    ],
    outro: [{ narration: "Great! Ask, say how you feel, play with someone else." }],
    endCaption: "All four build together",
  },
  loud: {
    title: "Too much and too loud",
    caption: "A loud party, Little Bear covers his ears",
    intro: [
      { narration: "There's a party at kindergarten. Music, balloons, everyone is dancing." },
      { narration: "It's all too much and too loud for Little Bear." },
    ],
    steps: [
      {
        caption: "Into the cozy cave",
        question: "Everything is so loud. What can Little Bear do?",
        beats: [{ narration: "He crawls into the cozy cave. It's quiet in there." }],
        instead: { caption: "Shout at everyone", answer: "Hmm, now everyone gets a fright. Crawl into the cozy cave instead." },
      },
      {
        caption: "Hold the cuddly toy and blow",
        question: "It's quiet in the cave. What can Little Bear do?",
        beats: [{ narration: "He holds the cuddly toy, takes a deep breath and blows out: Phoooo." }],
        instead: { caption: "Pop a balloon", answer: "Hmm, bang! Now it's even louder. Hold the cuddly toy and blow instead." },
      },
      {
        caption: "Come out slowly",
        question: "Little Bear is calm again. What can he do?",
        beats: [{ narration: "He comes out slowly and plays just with Bunny for now." }, { line: "I'm glad you're here!" }],
        instead: { caption: "Run off wildly", answer: "Hmm, he knocks Hedgehog over. Come out slowly instead." },
      },
    ],
    outro: [{ narration: "Super! Take a rest, blow, slowly join in again." }],
    endCaption: "Little Bear and Bunny play quietly at the edge of the party",
  },
  proud: {
    title: "Proud, right at the top",
    caption: "Little Bear is at the top of the climbing frame all by himself",
    intro: [{ narration: "Little Bear climbs up the climbing frame. All by himself!" }, { narration: "Now he's at the top. He is so proud!" }],
    steps: [
      {
        caption: "Call “Come on up too!”",
        question: "Little Bear is right at the top. What can he do?",
        beats: [{ narration: "He calls to Little Fox:", line: "Come on up too!" }, { line: "Oh yes, I'm coming!" }],
        instead: { caption: "Push Little Fox down", answer: "Hmm, pushing hurts. Call out instead: Come on up too!" },
      },
      {
        caption: "Cheer",
        question: "Little Bear is so happy. What can he do?",
        beats: [{ narration: "He holds on tight and cheers.", line: "Yay! I did it!" }],
        instead: { caption: "Laugh at Little Fox", answer: "Hmm, now Little Fox is sad. Cheer really loudly instead." },
      },
      {
        caption: "Help Little Fox",
        question: "Little Fox can't get up. What can Little Bear do?",
        beats: [{ narration: "He shows Little Fox where to put his foot.", line: "There! And now there!" }, { line: "I'm at the top!" }],
        instead: { caption: "Jump down", answer: "Hmm, jumping from so high hurts. Show Little Fox how instead." },
      },
    ],
    outro: [{ narration: "Yay! Call, cheer, help. Now they are both proud." }],
    endCaption: "Little Bear and Little Fox at the top together",
  },
  miss: {
    title: "Missing Grandma",
    caption: "Grandma is leaving, Little Bear is sad",
    intro: [{ narration: "Grandma Bear came to visit. Now she is going back home." }, { narration: "Little Bear misses her already." }],
    steps: [
      {
        caption: "Say “I miss Grandma”",
        question: "Grandma has left. What can Little Bear do?",
        beats: [{ narration: "Little Bear says:", line: "I miss Grandma." }, { line: "Me too. Come here." }],
        instead: { caption: "Throw down Grandma's cup", answer: "Hmm, now Grandma's cup is broken. Say instead: I miss Grandma." },
      },
      {
        caption: "Draw a picture",
        question: "Little Bear is thinking of Grandma. What can he do?",
        beats: [{ narration: "He draws a picture for Grandma. With a sun and a heart." }],
        instead: { caption: "Break the crayons", answer: "Hmm, now the crayons are broken. Draw a picture for Grandma instead." },
      },
      {
        caption: "Look at Grandma's photo",
        question: "There's Grandma's photo. What can Little Bear do?",
        beats: [{ narration: "He looks at Grandma's photo and gives it a kiss." }, { narration: "Then Grandma calls!", line: "Look, my picture!" }],
        instead: { caption: "Tear down the photo", answer: "Hmm, now the photo is ruined. Look at it instead." },
      },
    ],
    outro: [{ narration: "Lovely! Say it, draw, think of Grandma. She'll come again soon." }],
    endCaption: "Little Bear shows Grandma his picture on a video call",
  },
  shy: {
    title: "Shy, a visitor is here",
    caption: "A fox lady comes to visit, Little Bear hides",
    intro: [{ narration: "Ding-dong! A fox lady comes to visit.", line: "Hello, Little Bear!" }, { narration: "Little Bear doesn't know her. He is shy." }],
    steps: [
      {
        caption: "Just watch first",
        question: "The visitor is here. What can Little Bear do?",
        beats: [{ narration: "He holds on to Big Bear and just watches first." }, { line: "You can just watch for now." }],
        instead: { caption: "Shout “Go away!”", answer: "Hmm, now the fox lady got a fright. Just watch first instead." },
      },
      {
        caption: "Wave",
        question: "The fox lady smiles. What can Little Bear do?",
        beats: [{ narration: "He waves to her. Just a little." }, { line: "Hello! Nice to see you." }],
        instead: { caption: "Kick at her", answer: "Hmm, kicking hurts. Wave instead." },
      },
      {
        caption: "Show the car",
        question: "Little Bear feels a bit braver. What can he do?",
        beats: [{ narration: "He gets his favorite car and shows it to her." }, { line: "Oh, how lovely!" }],
        instead: { caption: "Snatch the present", answer: "Hmm, now the present is broken. Show her your car instead." },
      },
    ],
    outro: [{ narration: "Well done! First watch, then wave, then show something. You decide how close." }],
    endCaption: "Little Bear and the fox lady play with the car",
  },
  bored: {
    title: "Bored on a rainy day",
    caption: "It's raining outside, Little Bear is bored",
    intro: [{ narration: "It's raining outside. Little Bear is lying on the sofa." }, { narration: "He is so bored!" }],
    steps: [
      {
        caption: "Play cooking with Little Fox",
        question: "It's raining. What can Little Bear do?",
        beats: [{ narration: "He gets the pots and cooks a rain soup with Little Fox. Stir, stir!" }, { line: "Mmm, yummy! Now I'm cooking!" }],
        instead: { caption: "Pull Little Fox's ear", answer: "Hmm, that hurts Little Fox. Play something with him instead." },
      },
      {
        caption: "Build a den",
        question: "What can you play indoors? What can Little Bear do?",
        beats: [{ narration: "He builds a den out of a blanket and pillows." }, { line: "Come in!" }],
        instead: { caption: "Bang a pot on the window", answer: "Hmm, now the window has a crack. Build a den instead." },
      },
      {
        caption: "Drive a box car",
        question: "There's a big box. What can Little Bear do?",
        beats: [{ narration: "He sits in the box. It's his car! Vroom, vroom." }, { line: "Take me with you!" }],
        instead: { caption: "Stomp the box flat", answer: "Hmm, now the box is broken. Make a car out of it instead." },
      },
    ],
    outro: [{ narration: "Great! Boredom turns into ideas: cook together, build a den, drive a car." }],
    endCaption: "Little Bear and Little Fox ride in the box car",
  },
  empathy: {
    title: "Caring, Little Fox is crying",
    caption: "Little Fox's balloon popped, Little Fox is crying",
    intro: [{ narration: "Little Bear and Little Fox each have a balloon." }, { narration: "Bang! Little Fox's balloon has popped. Little Fox is crying." }],
    steps: [
      {
        caption: "Ask: “Are you sad?”",
        question: "Little Fox is crying. What can Little Bear do?",
        beats: [{ narration: "Little Bear goes over and asks:", line: "Are you sad?" }, { line: "Yes. My balloon is broken." }],
        instead: { caption: "Laugh and point", answer: "Hmm, laughing at him makes Little Fox even sadder. Go over and ask instead." },
      },
      {
        caption: "Stroke his back",
        question: "Little Fox is very sad. What can Little Bear do?",
        beats: [{ narration: "He strokes Little Fox's back." }, { line: "Thank you, Little Bear." }],
        instead: { caption: "Hold up his own balloon", answer: "Hmm, that makes Little Fox even sadder. Stroke his back instead." },
      },
      {
        caption: "Hold the balloon together",
        question: "Little Bear still has his balloon. What can he do?",
        beats: [{ narration: "He puts the string in Little Fox's paw too.", line: "Our balloon!" }, { narration: "Little Fox laughs." }],
        instead: { caption: "Run away", answer: "Hmm, now Little Fox is all alone. Hold the balloon with him instead." },
      },
    ],
    outro: [{ narration: "Lovely! Ask, comfort, share. Now Little Fox feels better." }],
    endCaption: "Little Bear and Little Fox hold the balloon together",
  },
  startle: {
    title: "Startled, a loud bang",
    caption: "A balloon pops, Little Bear gets a fright",
    intro: [
      { narration: "Little Bear is having a birthday party with Little Fox." },
      { narration: "Bang! A balloon pops right next to him. Little Bear gets a fright." },
    ],
    steps: [
      {
        caption: "Cover the ears",
        question: "That was so loud! What can Little Bear do?",
        beats: [{ narration: "He covers his ears." }, { line: "That's better." }],
        instead: { caption: "Pop all the balloons", answer: "Hmm, bang, bang! Now everyone gets a fright. Cover your ears instead." },
      },
      {
        caption: "Take a deep breath",
        question: "His heart is still beating really fast. What can Little Bear do?",
        beats: [{ narration: "He takes a deep breath and blows out: Phoooo." }, { narration: "His heart gets calmer." }],
        instead: { caption: "Knock over the cake", answer: "Hmm, now the cake is ruined. Take a deep breath and blow instead." },
      },
      {
        caption: "Eat cake with Little Fox",
        question: "Little Fox is waiting at the birthday table. What can Little Bear do?",
        beats: [{ narration: "He goes to Little Fox at the table. They eat cake together." }, { line: "Mmm, yummy!" }],
        instead: { caption: "Shout at Little Fox", answer: "Hmm, now Little Fox gets a fright too. Go to him and eat cake with him instead." },
      },
    ],
    outro: [{ narration: "Super! Cover your ears, take a deep breath, and then eat cake together." }],
    endCaption: "Little Bear and Little Fox eat cake together",
  },
  puzzle: {
    title: "Frustrated, the puzzle doesn't fit",
    caption: "The cow doesn't fit, Little Bear is angry",
    intro: [{ narration: "Little Bear is doing a puzzle with farm animals." }, { narration: "The cow doesn't fit in its hole! Little Bear is angry." }],
    steps: [
      {
        caption: "Squeeze the fists",
        question: "The cow doesn't fit. Little Bear is angry. What can he do?",
        beats: [{ narration: "Little Bear squeezes his fists really tight. And lets go." }, { line: "Phew. That's better." }],
        instead: { caption: "Sweep the puzzle off the table", answer: "Hmm, now all the pieces are on the floor. Squeeze your fists really tight instead." },
      },
      {
        caption: "Turn the piece around",
        question: "The cow doesn't fit in its hole. What can Little Bear do?",
        beats: [{ narration: "Little Bear turns the cow around and tries it the other way." }, { line: "Click! It fits!" }],
        instead: { caption: "Bang the piece in", answer: "Hmm, now the puzzle is broken. Turn the cow around and try it the other way instead." },
      },
      {
        caption: "Say “Help me, please!”",
        question: "Little Bear can't do it alone. What can he do?",
        beats: [{ narration: "Little Bear says to Big Bear:", line: "Help me, please!" }, { narration: "Big Bear points to the corner. And the cow fits." }],
        instead: { caption: "Shout at Big Bear", answer: "Hmm, now Big Bear got a fright. Say instead: Help me, please!" },
      },
    ],
    outro: [{ narration: "Super! Squeeze your fists, turn the piece, ask for help. The puzzle is done, and the cow says: Moo!" }],
    endCaption: "Puzzle done, Little Bear beams",
  },
  race: {
    title: "Lost the race",
    caption: "Little Fox gets to the tree first, Little Bear is cross",
    intro: [
      { narration: "Little Bear and Little Fox are having a race. To the apple tree!" },
      { narration: "Little Fox gets there first. Little Bear lost. He is cross." },
    ],
    steps: [
      {
        caption: "Stomp hard",
        question: "Little Fox won. Little Bear is cross. What can he do?",
        beats: [{ narration: "Little Bear stomps really hard on the ground. Stomp, stomp!" }, { line: "Phew. Now the anger is out." }],
        instead: { caption: "Push Little Fox", answer: "Hmm, pushing hurts. Stomp really hard on the ground instead." },
      },
      {
        caption: "Shout “Again!”",
        question: "Little Bear wants to win too. What can he do?",
        beats: [{ narration: "Little Bear shouts:", line: "Again! One more race!" }, { line: "Oh yes! Ready, steady, go!" }],
        instead: { caption: "Scream “Doesn't count!” and run off", answer: "Hmm, now Little Fox is standing all alone and he is sad. Shout instead: Again!" },
      },
      {
        caption: "High five",
        question: "Little Fox is happy. What can Little Bear do?",
        beats: [{ narration: "Little Bear holds out his paw to Little Fox.", line: "Good running!" }, { narration: "Clap! They give each other a high five." }],
        instead: { caption: "Pull Little Fox's ear", answer: "Hmm, that hurts Little Fox. Give him a high five instead." },
      },
    ],
    outro: [{ narration: "Super! Stomp, race again, high five. And now they both run hand in hand." }],
    endCaption: "Little Bear and Little Fox run hand in hand",
  },
  farewell: {
    title: "Sad, his friend goes home",
    caption: "Little Fox goes home, Little Bear is crying",
    intro: [{ narration: "Little Fox came over to play. Now his dad is picking him up." }, { narration: "Little Fox puts on his hat. Little Bear is crying." }],
    steps: [
      {
        caption: "Hug tight",
        question: "Little Fox is going home. Little Bear is sad. What can he do?",
        beats: [{ narration: "Little Bear hugs Little Fox really tight.", line: "Bye, Little Fox!" }, { line: "Bye, Little Bear!" }],
        instead: { caption: "Take Little Fox's hat", answer: "Hmm, now Little Fox is crying. He wants his hat. Give him a goodbye hug instead." },
      },
      {
        caption: "Hold the car tight",
        question: "Little Bear is holding the car they played with. He is sad. What can he do?",
        beats: [{ narration: "Little Bear holds the car tight against his tummy.", line: "We'll play with it again tomorrow." }],
        instead: { caption: "Throw the car after him", answer: "Hmm, now the car is broken. Hold it tight against your tummy instead." },
      },
      {
        caption: "Wave at the window",
        question: "Little Fox is leaving with his dad. What can Little Bear do?",
        beats: [{ narration: "Little Bear runs to the window and waves until Little Fox is around the corner." }, { narration: "Little Fox waves back." }],
        instead: { caption: "Kick the door", answer: "Hmm, that hurts your foot. Run to the window and wave instead." },
      },
    ],
    outro: [{ narration: "Super! Hug, hold the car, wave. And Big Bear says:", line: "See you tomorrow!" }],
    endCaption: "Little Fox waves from outside, Little Bear waves back",
  },
  myself: {
    title: "Angry, I want to do it myself",
    caption: "Juice already poured, Little Bear is angry",
    intro: [
      { narration: "Little Bear and Big Bear are having breakfast." },
      { narration: "Big Bear has already poured the juice. But Little Bear wanted to do it himself! He is angry." },
    ],
    steps: [
      {
        caption: "Say “I want to do it myself!”",
        question: "Big Bear poured the juice. Little Bear wanted to do that himself. What can he do?",
        beats: [{ narration: "Little Bear says loudly:", line: "I want to do it myself!" }, { line: "Good that you tell me. Then you pour now." }],
        instead: { caption: "Knock over the juice cup", answer: "Hmm, now all the juice is on the table. Say instead: I want to do it myself!" },
      },
      {
        caption: "Take a deep breath",
        question: "Little Bear is really angry. What can he do?",
        beats: [{ narration: "Little Bear turns away from the table, takes a deep breath and blows up high: Phoooo." }, { line: "That's better." }],
        instead: { caption: "Hit Big Bear", answer: "Hmm, hitting hurts. Take a deep breath and blow instead." },
      },
      {
        caption: "Pour it yourself",
        question: "Big Bear's cup is empty. What can Little Bear do?",
        beats: [{ narration: "Little Bear pours for Big Bear all by himself. Big Bear just helps hold the jug a little." }, { line: "I can do it!" }],
        instead: { caption: "Throw the jug down", answer: "Hmm, now the jug is broken. Pour it yourself instead." },
      },
    ],
    outro: [{ narration: "Super! Say what you want, take a deep breath, pour it yourself. Now they both drink." }],
    endCaption: "Little Bear and Big Bear drink juice, Little Bear beams",
  },
  homesick: {
    title: "Homesick, the first night at Grandma's",
    caption: "First night at Grandma's, Little Bear is homesick",
    intro: [
      { narration: "Today Little Bear is sleeping at Grandma Bear's for the first time." },
      { narration: "Big Bear has gone home. Little Bear is homesick." },
    ],
    steps: [
      {
        caption: "Squeeze the cuddly rabbit",
        question: "Little Bear is homesick. What can he do?",
        beats: [{ narration: "Little Bear squeezes his cuddly rabbit really tight. It came along from home." }, { line: "I'm glad you're here." }],
        instead: { caption: "Knock down the night light", answer: "Hmm, now the night light is broken. Squeeze your cuddly rabbit really tight instead." },
      },
      {
        caption: "Say “I miss home”",
        question: "Grandma is sitting by the bed. What can Little Bear do?",
        beats: [
          { narration: "Little Bear says to Grandma:", line: "I miss home." },
          { narration: "Grandma nods and strokes his head.", line: "Big Bear will pick you up tomorrow morning." },
        ],
        instead: { caption: "Push Grandma away", answer: "Hmm, pushing hurts Grandma. Tell her what you miss instead." },
      },
      {
        caption: "Breathe slowly",
        question: "Little Bear can't fall asleep. What can he do?",
        beats: [{ narration: "He closes his eyes and puts his paw on his tummy." }, { narration: "In. And out. Really slowly." }],
        instead: { caption: "Pull the picture off the wall", answer: "Hmm, now the picture is broken. Breathe really slowly instead, your paw on your tummy." },
      },
    ],
    outro: [{ narration: "Super! Squeeze the cuddly rabbit, say what you miss, breathe slowly. Now Little Bear is asleep." }],
    endCaption: "Little Bear sleeps at Grandma's, smiling",
  },
  barber: {
    title: "Scared at the hairdresser's",
    caption: "Little Bear in the hairdresser's chair is scared",
    intro: [
      { narration: "Little Bear is at the hairdresser's. He is sitting on the high chair." },
      { narration: "The hairdresser comes with a comb and scissors. Little Bear is scared." },
    ],
    steps: [
      {
        caption: "Hold the armrests tight",
        question: "Little Bear is scared of the scissors. What can he do?",
        beats: [{ narration: "Little Bear holds the armrests really tight with his paws. And keeps still." }, { line: "I'm holding on tight." }],
        instead: { caption: "Kick the hairdresser", answer: "Hmm, kicking hurts the hairdresser. Hold on to the armrests instead." },
      },
      {
        caption: "Watch in the mirror",
        question: "Snip, snip, it goes behind his ear. What can Little Bear do?",
        beats: [{ narration: "Little Bear looks in the mirror. A tuft of fur falls down." }, { line: "Oh! There goes my fur!" }],
        instead: { caption: "Knock down the spray bottle", answer: "Hmm, now the spray bottle is broken. Watch in the mirror instead." },
      },
      {
        caption: "Say “A little break, please!”",
        question: "This is quite a lot for Little Bear. What can he do?",
        beats: [
          { narration: "Little Bear says:", line: "A little break, please!" },
          { narration: "The hairdresser waits. And Big Bear waves to him.", line: "Sure! Tell me when we can go on." },
        ],
        instead: { caption: "Shout at the hairdresser", answer: "Hmm, now the hairdresser got a fright. Say instead: A little break, please!" },
      },
    ],
    outro: [{ narration: "Super! Hold on, watch in the mirror, ask for a break. And now Little Bear has a new haircut!" }],
    endCaption: "Little Bear laughs at his new haircut in the mirror",
  },
  accident: {
    title: "Oops, by accident",
    caption: "Little Fox's tower knocked over, Little Bear gets a fright",
    intro: [
      { narration: "Little Bear is running through the kindergarten." },
      { narration: "Crash! By accident he bumps into Little Fox's tower. The tower falls down. Little Bear gets a fright." },
    ],
    steps: [
      {
        caption: "Say “Sorry!”",
        question: "Little Fox's tower fell down. What can Little Bear do?",
        beats: [{ narration: "Little Bear says to Little Fox:", line: "Sorry! I didn't mean to." }, { line: "That's okay." }],
        instead: { caption: "Kick over the other blocks", answer: "Hmm, now everything has fallen down, and Little Fox is sad. Say instead: Sorry!" },
      },
      {
        caption: "Take a deep breath",
        question: "Little Bear got a big fright. What can he do?",
        beats: [
          { narration: "He kneels next to Little Fox, takes a deep breath and blows up high: Phoooo." },
          { narration: "Now his heart beats more calmly." },
        ],
        instead: { caption: "Laugh and run on", answer: "Hmm, now Little Fox is crying. Kneel down next to him and take a deep breath instead." },
      },
      {
        caption: "Build it again together",
        question: "The blocks are on the floor. What can Little Bear do?",
        beats: [{ narration: "He gives Little Fox a block.", line: "Shall we build together?" }, { line: "Oh yes!" }],
        instead: { caption: "Throw blocks", answer: "Hmm, the block hits Little Fox. That hurts. Build with him instead." },
      },
    ],
    outro: [{ narration: "Super! Say sorry, take a deep breath, build together. The new tower is even taller!" }],
    endCaption: "A new tall tower, Little Bear and Little Fox laugh",
  },
  laughed: {
    title: "Hurt, laughed at while drawing",
    caption: "The raccoon laughs at the picture, Little Bear is hurt",
    intro: [
      { narration: "Little Bear is drawing at kindergarten. Colorful squiggles. That's Big Bear!" },
      { narration: "The raccoon points at it and laughs. Little Bear feels hurt." },
    ],
    steps: [
      {
        caption: "Say “I don't like that!”",
        question: "The raccoon is laughing at Little Bear's picture. What can Little Bear do?",
        beats: [
          { narration: "Little Bear says loudly:", line: "Don't laugh! I don't like that!" },
          { narration: "The raccoon stops laughing.", line: "Okay. Sorry." },
        ],
        instead: {
          caption: "Tear up the raccoon's picture",
          answer: "Hmm, now the raccoon's picture is ruined, and he is crying. Say it loudly instead: I don't like that!",
        },
      },
      {
        caption: "Squeeze the fists and blow",
        question: "Little Bear feels really hurt. What can he do?",
        beats: [{ narration: "He squeezes his fists really tight. Then he takes a deep breath and blows up high. Phoooo." }, { line: "That's better." }],
        instead: { caption: "Throw crayons", answer: "Hmm, the crayons hit the raccoon. That hurts. Squeeze your fists and blow instead." },
      },
      {
        caption: "Keep drawing next to Bunny",
        question: "Bunny is drawing quietly. What can Little Bear do?",
        beats: [{ narration: "Little Bear sits down next to Bunny and keeps drawing." }, { line: "Lovely! That's Big Bear!" }],
        instead: { caption: "Crumple his own picture", answer: "Hmm, now your lovely picture is ruined. Sit with Bunny and keep drawing instead." },
      },
    ],
    outro: [{ narration: "Super! Say what you don't like, blow, keep drawing. Now the picture is hanging on the wall." }],
    endCaption: "Little Bear's picture hangs on the wall, the raccoon looks at it",
  },
  excited: {
    title: "Too excited to sleep",
    caption: "Suitcase packed, Little Bear is wide awake in bed",
    intro: [
      { narration: "Tomorrow Little Bear is going to the sea! His suitcase is already packed." },
      { narration: "He is lying in bed. He is so excited, he can't sleep." },
    ],
    steps: [
      {
        caption: "Paw on the tummy",
        question: "Little Bear is really excited. What can he do?",
        beats: [{ narration: "He puts his paw on his tummy and breathes really slowly. In and out." }],
        instead: {
          caption: "Tip out the suitcase",
          answer: "Hmm, crash! Now everything is on the floor. Put your paw on your tummy and breathe slowly instead.",
        },
      },
      {
        caption: "Whisper to the cuddly rabbit",
        question: "Little Bear keeps thinking about the sea. What can he do?",
        beats: [{ narration: "He whispers in his cuddly rabbit's ear:", line: "Tomorrow we'll build a sandcastle." }],
        instead: {
          caption: "Drum on the bucket",
          answer: "Hmm, so loud! Now the baby next door is awake. Whisper to your cuddly rabbit what you'll build tomorrow instead.",
        },
      },
      {
        caption: "Eyes shut, think of the waves",
        question: "It's already late. What can Little Bear do?",
        beats: [{ narration: "He closes his eyes and thinks of the waves." }, { narration: "Shh, shh. He gets really calm." }],
        instead: { caption: "Light on and play", answer: "Hmm, in the light you get wide awake. Close your eyes and think of the waves instead." },
      },
    ],
    outro: [{ narration: "Super! Breathe slowly, whisper to the cuddly rabbit, think of the waves. Good night!" }],
    endCaption: "Little Bear is asleep, the spade in his arms",
  },
  envy: {
    title: "Jealous of the balance bike",
    caption: "Little Fox shows his new balance bike, Little Bear is jealous",
    intro: [{ narration: "Little Fox has a new balance bike. Red, with a bell!" }, { narration: "Little Bear only has his old scooter. He is jealous." }],
    steps: [
      {
        caption: "Squeeze the fists",
        question: "Little Bear wants a balance bike like that too. What can he do?",
        beats: [{ narration: "Little Bear squeezes his fists really tight and says:", line: "I want one too!" }, { narration: "Phew. Now he feels better." }],
        instead: { caption: "Push over the balance bike", answer: "Hmm, now the bell is broken. Squeeze your fists really tight instead." },
      },
      {
        caption: "Ask “Can I have a turn?”",
        question: "Little Bear wants a ride on the balance bike too. What can he do?",
        beats: [{ narration: "Little Bear asks:", line: "Can I have a turn?" }, { line: "Yes! After my round." }],
        instead: { caption: "Pull Little Fox off the bike", answer: "Hmm, now Little Fox has fallen down. Ask instead: Can I have a turn?" },
      },
      {
        caption: "Swap",
        question: "Little Bear has a scooter. What can he do?",
        beats: [{ narration: "Little Bear asks:", line: "Shall we swap?" }, { narration: "Little Fox tries the scooter, Little Bear the balance bike." }],
        instead: { caption: "Kick the scooter away", answer: "Hmm, now your scooter is broken. Swap with Little Fox instead." },
      },
    ],
    outro: [{ narration: "Super! Squeeze your fists, ask, swap. Now they ride together." }],
    endCaption: "Little Bear and Little Fox ride side by side, Little Bear rings the bell",
  },
  supermarket: {
    title: "Scared, alone in the supermarket",
    caption: "Little Bear alone between the shelves, scared",
    intro: [{ narration: "Little Bear is at the supermarket." }, { narration: "Where is Big Bear? Little Bear can't see him anymore. He is scared." }],
    steps: [
      {
        caption: "Stand like a tree",
        question: "Little Bear is alone. What can he do?",
        beats: [{ narration: "Little Bear stands still like a tree. Feet firm on the floor." }, { narration: "He takes a deep breath in and out." }],
        instead: { caption: "Climb up the shelf", answer: "Hmm, the shelf wobbles, and everything falls down. Stand still like a tree instead." },
      },
      {
        caption: "Call “Daddy!”",
        question: "Little Bear can't see Big Bear. What can he do?",
        beats: [{ narration: "He calls really loudly:", line: "Daddy! I'm here!" }, { line: "I can hear you! I'm coming!" }],
        instead: { caption: "Knock over the tower of cans", answer: "Hmm, now all the cans are on the floor. Call really loudly instead: Daddy!" },
      },
      {
        caption: "Squeeze the cuddly rabbit and wait",
        question: "Big Bear is looking for him. What can Little Bear do?",
        beats: [{ narration: "He squeezes his cuddly rabbit really tight and waits right where he is." }],
        instead: { caption: "Roll the apples out", answer: "Hmm, now the apples are rolling everywhere. Squeeze your cuddly rabbit and wait here instead." },
      },
    ],
    outro: [{ narration: "There's Big Bear, coming around the corner!", line: "There you are!" }, { narration: "Super! Stand still, call loudly, wait." }],
    endCaption: "Big Bear is here, they hug",
  },
  pointing: {
    title: "Angry, nobody understands me",
    caption: "Big Bear holds up an apple, Little Bear wants the yogurt",
    intro: [
      { narration: "Little Bear wants the yogurt. He shouts:", line: "That! That!" },
      { narration: "Big Bear holds up an apple. No! Little Bear is so angry." },
    ],
    steps: [
      {
        caption: "Point exactly",
        question: "Big Bear is holding up an apple. What can Little Bear do?",
        beats: [{ narration: "Little Bear points his paw right at the yogurt." }, { line: "Ah, the yogurt!" }],
        instead: { caption: "Knock the apple out of his paw", answer: "Hmm, that hurts Big Bear. Point right at the yogurt instead." },
      },
      {
        caption: "Stomp and blow",
        question: "Little Bear is really angry. What can he do?",
        beats: [{ narration: "He stomps really hard. Boom, boom!" }, { narration: "Then he takes a deep breath and blows. Phoooo." }],
        instead: { caption: "Kick the fridge", answer: "Hmm, now everything in the fridge has fallen over. Stomp really hard and blow instead." },
      },
      {
        caption: "Pull him to the fridge",
        question: "Big Bear doesn't understand him. What can Little Bear do?",
        beats: [{ narration: "He takes Big Bear by the paw and pulls him to the fridge." }, { line: "Oh, the yogurt! Now I understand." }],
        instead: { caption: "Scream really loudly", answer: "Hmm, so loud! That hurts Big Bear's ears. Take him by the paw instead." },
      },
    ],
    outro: [{ narration: "Super! Point, stomp and blow, show the way. Now they both eat yogurt." }],
    endCaption: "Little Bear and Big Bear eat yogurt",
  },
  bee: {
    title: "Scared of the bee",
    caption: "A bee buzzes around the juice, Little Bear is scared",
    intro: [
      { narration: "Little Bear and Big Bear are having a picnic on the meadow." },
      { narration: "Buzz, buzz! A bee is flying around the juice. Little Bear is scared." },
    ],
    steps: [
      {
        caption: "Sit really still",
        question: "The bee is buzzing around the juice. What can Little Bear do?",
        beats: [{ narration: "Little Bear sits really still. Like a stone." }, { line: "That's good. The bee only wants the juice." }],
        instead: { caption: "Swat at the bee", answer: "Hmm, now the bee has stung. Sit really still instead." },
      },
      {
        caption: "Walk away slowly",
        question: "The bee stays at the cup. What can Little Bear do?",
        beats: [{ narration: "He slowly stands up and walks a few steps away." }, { narration: "There's no bee here. Phew!" }],
        instead: { caption: "Knock over the juice", answer: "Hmm, splash! Now the blanket is all wet. Walk a few steps away slowly instead." },
      },
      {
        caption: "Watch and breathe out",
        question: "The bee flies off. What can Little Bear do?",
        beats: [{ narration: "He watches the bee fly to the flowers." }, { narration: "Then he breathes out deeply. Phoooo." }],
        instead: { caption: "Throw the ball at the bee", answer: "Hmm, now the juice and the tea have tipped over. Watch the bee fly away instead." },
      },
    ],
    outro: [{ narration: "Super! Sit still, walk away, breathe out. Now the bee is buzzing in the flowers." }],
    endCaption: "They both sit on the blanket, the bee is at the flowers",
  },
  phone: {
    title: "Waiting, Big Bear is on the phone",
    caption: "Big Bear is on the phone, Little Bear wants to show his picture",
    intro: [
      { narration: "Big Bear is on the phone in the kitchen." },
      { narration: "Little Bear wants to show him his new picture. Right now! Waiting is so hard." },
    ],
    steps: [
      {
        caption: "Tap gently",
        question: "Big Bear is on the phone. What can Little Bear do?",
        beats: [{ narration: "Little Bear gently taps Big Bear on the arm." }, { narration: "Big Bear raises his paw and whispers:", line: "In a moment." }],
        instead: { caption: "Grab the phone", answer: "Hmm, now the phone fell down and broke. Tap Big Bear gently instead." },
      },
      {
        caption: "Count with the cuddly rabbit",
        question: "The phone call takes a long time. What can Little Bear do?",
        beats: [{ narration: "He sits on the chair with his cuddly rabbit in his arm and counts on his fingers." }, { line: "One, two, three, four, five!" }],
        instead: { caption: "Shout loudly over the call", answer: "Hmm, so loud! That hurts Big Bear's ears. Count on your fingers instead." },
      },
      {
        caption: "Put the picture on the table",
        question: "Little Bear is holding his picture. What can he do?",
        beats: [{ narration: "He lays his picture neatly on the table and draws a sun on it." }, { narration: "Now it's ready when Big Bear comes." }],
        instead: { caption: "Crumple the picture", answer: "Hmm, now your lovely picture is all crumpled. Lay it neatly on the table instead." },
      },
    ],
    outro: [
      { narration: "Big Bear hangs up and looks at the picture for a long time.", line: "Oh, how lovely!" },
      { narration: "Super! Tap gently, count, put the picture down." },
    ],
    endCaption: "Big Bear looks at the picture for a long time",
  },
  hit: {
    title: "Hit someone, what now?",
    caption: "Little Fox holds his arm, Little Bear gets a fright",
    intro: [
      { narration: "Little Bear and Little Fox are fighting over the shovel. Then Little Bear hits Little Fox." },
      { narration: "Little Fox is crying. Little Bear gets a fright." },
    ],
    steps: [
      {
        caption: "Paws down, take a deep breath",
        question: "Little Bear hit Little Fox. What can he do?",
        beats: [{ narration: "Little Bear puts his paws down and takes a deep breath. Phoooo." }, { narration: "Now he is calmer." }],
        instead: { caption: "Hit again", answer: "Hmm, that hurts Little Fox even more. Put your paws down and blow instead." },
      },
      {
        caption: "Say “Sorry!”",
        question: "Little Fox is crying. What can Little Bear do?",
        beats: [
          { narration: "Little Bear says:", line: "Sorry! I didn't mean to." },
          { narration: "Little Fox sniffs.", line: "Okay." },
        ],
        instead: { caption: "Keep digging with the shovel", answer: "Hmm, now Little Fox is crying even more. Tell him instead: Sorry!" },
      },
      {
        caption: "Go to the teacher",
        question: "Little Fox's arm hurts. What can Little Bear do?",
        beats: [
          { narration: "He goes to the teacher with Little Fox." },
          { narration: "She puts an ice pack on his arm.", line: "There. It will feel better soon." },
        ],
        instead: { caption: "Laugh at Little Fox", answer: "Hmm, laughing at him makes Little Fox even sadder. Go to the teacher with him instead." },
      },
    ],
    outro: [{ narration: "Super! Blow, say sorry, get help. Now they dig together." }],
    endCaption: "Little Bear and Little Fox dig together",
  },
  pickup: {
    title: "Happy at pickup",
    caption: "Big Bear waves at the door, Little Bear beams",
    intro: [{ narration: "It's afternoon at kindergarten. There's Big Bear at the door!" }, { narration: "Little Bear is so happy!" }],
    steps: [
      {
        caption: "Jump and wave",
        question: "Big Bear is here! What can Little Bear do?",
        beats: [{ narration: "Little Bear jumps for joy and waves.", line: "Daddy!" }, { line: "Hello, Little Bear!" }],
        instead: { caption: "Knock Little Fox over", answer: "Hmm, now Little Fox has fallen down. Jump and wave instead." },
      },
      {
        caption: "Say “Bye!” to Little Fox",
        question: "Little Fox is building a tower. What can Little Bear do?",
        beats: [{ narration: "First Little Bear goes to Little Fox.", line: "Bye, see you tomorrow!" }, { line: "Bye, Little Bear!" }],
        instead: { caption: "Run into the tower", answer: "Hmm, now Little Fox's tower is broken. Say to him first instead: Bye!" },
      },
      {
        caption: "Hug really tight",
        question: "Little Bear is so happy! What can he do?",
        beats: [{ narration: "He runs into Big Bear's arms and hugs him really tight." }, { line: "I missed you!" }],
        instead: { caption: "Yank the bag away", answer: "Hmm, rip! Now the strap is off. Run into his arms and hug him instead." },
      },
    ],
    outro: [{ narration: "Super! Jump and wave, say bye, hug really tight. Now it's time to go home." }],
    endCaption: "Little Bear and Big Bear walk hand in hand, Little Fox waves",
  },
  bath: {
    title: "Silly in the bath",
    caption: "Little Bear and Little Fox giggle in the tub",
    intro: [
      { narration: "Little Fox is visiting. He and Little Bear are taking a bath together." },
      { narration: "They giggle and giggle. Little Bear is so silly!" },
    ],
    steps: [
      {
        caption: "Make a foam beard",
        question: "Little Bear is really silly. What can he do?",
        beats: [{ narration: "Little Bear makes himself a foam beard.", line: "Ho, ho, ho!" }, { narration: "Little Fox laughs too." }],
        instead: { caption: "Splash Little Fox", answer: "Hmm, now Little Fox has water in his eyes and is crying. Make yourself a foam beard instead." },
      },
      {
        caption: "Blow the foam up high",
        question: "Little Bear is wild with joy. What can he do?",
        beats: [
          { narration: "He takes some foam on his paw and blows really slowly. Phoooo." },
          { narration: "The flakes fly up high. Little Bear gets calm and laughs softly." },
        ],
        instead: {
          caption: "Empty the shampoo",
          answer: "Hmm, now the shampoo is all gone, and the foam stings Little Fox's eyes. Blow foam up high really slowly instead.",
        },
      },
      {
        caption: "Snuggle into the towel",
        question: "Bath time is over. What can Little Bear do?",
        beats: [{ narration: "Little Bear climbs slowly out of the tub.", line: "Towel, please!" }, { narration: "He snuggles into the soft towel." }],
        instead: { caption: "Jump out of the tub", answer: "Hmm, on the wet floor you slip. Climb out slowly instead, into the towel." },
      },
    ],
    outro: [{ narration: "Super! Make a foam beard, blow the foam, snuggle into the towel. Now they both giggle very quietly." }],
    endCaption: "Little Bear and Little Fox giggle quietly in the towel",
  },
  butterfly: {
    title: "Amazed, a butterfly",
    caption: "A butterfly on the flower, Little Bear is amazed",
    intro: [{ narration: "Little Bear and Little Fox are in the garden." }, { narration: "Look! There's a butterfly on the flower. Little Bear is amazed." }],
    steps: [
      {
        caption: "Stand really still",
        question: "The butterfly is sitting very close. What can Little Bear do?",
        beats: [
          { narration: "Little Bear stands really still. He breathes very quietly." },
          { narration: "The butterfly stays and opens and closes its wings." },
        ],
        instead: {
          caption: "Grab at the butterfly",
          answer: "Hmm, butterflies are very delicate. Now it has flown away, and Little Fox is sad. Stand really still instead.",
        },
      },
      {
        caption: "Whisper “Look!”",
        question: "Little Fox wants to see the butterfly too. What can Little Bear do?",
        beats: [{ narration: "Little Bear makes room and points at the flower.", line: "Shh, look!" }, { line: "Oh, how pretty!" }],
        instead: { caption: "Push Little Fox away", answer: "Hmm, pushing hurts. Make room and whisper instead: Look!" },
      },
      {
        caption: "Flutter like a butterfly",
        question: "The butterfly flies off. What can Little Bear do?",
        beats: [{ narration: "Little Bear flaps his arms like a butterfly.", line: "Flutter, flutter!" }, { narration: "Little Fox flutters too." }],
        instead: { caption: "Run through the flower bed", answer: "Hmm, now the flowers are bent, and Little Fox is sad. Flutter like a butterfly instead." },
      },
    ],
    outro: [{ narration: "Super! Stand still, point quietly, flutter. And the butterfly lands on the watering can." }],
    endCaption: "The butterfly on the watering can, both laugh softly",
  },
  morning: {
    title: "Grumpy morning, getting up is hard",
    caption: "In bed in the morning, Little Bear is grumpy",
    intro: [{ narration: "It's morning. Little Bear wakes up." }, { narration: "He is so sleepy. Getting up is hard! He is grumpy." }],
    steps: [
      {
        caption: "Stretch and yawn",
        question: "Little Bear is sleepy and grumpy. What can he do?",
        beats: [{ narration: "Little Bear stretches out really long, like a cat." }, { narration: "Then he gives a big yawn. Aaaah! A bit more awake." }],
        instead: { caption: "Throw the alarm clock down", answer: "Hmm, now the alarm clock is broken. Stretch out really long like a cat instead." },
      },
      {
        caption: "Put on the slippers",
        question: "The slippers are in front of the bed. What can Little Bear do?",
        beats: [{ narration: "Little Bear slips into his slippers. First one, then the other." }, { line: "Good morning, baby!" }],
        instead: { caption: "Throw a slipper at the baby", answer: "Hmm, the slipper hits the baby. Put your slippers on instead." },
      },
      {
        caption: "Open the curtain",
        question: "The curtain is closed, the room is dark. What can Little Bear do?",
        beats: [{ narration: "Little Bear opens the curtain." }, { narration: "The sun shines in. He blinks and smiles.", line: "Hello, sun!" }],
        instead: { caption: "Pull the curtain down", answer: "Hmm, now the curtain is on the floor. Open it instead and let the sun in." },
      },
    ],
    outro: [{ narration: "Super! Stretch, put on the slippers, let the sun in. Good morning!" }],
    endCaption: "Little Bear in slippers goes to breakfast with the baby",
  },
  worn: {
    title: "Worn out after kindergarten",
    caption: "Little Bear lies in the hall in his jacket, worn out",
    intro: [{ narration: "Little Bear comes home from kindergarten." }, { narration: "He lies down on the floor in his jacket. He is so worn out and whiny." }],
    steps: [
      {
        caption: "Lie still and breathe deeply",
        question: "Little Bear is worn out and whiny. What can he do?",
        beats: [
          { narration: "Little Bear just stays lying there. He breathes in deeply and out really slowly. Phoooo." },
          { narration: "A little calmer already." },
        ],
        instead: { caption: "Throw the lunch box at the wall", answer: "Hmm, now the lunch box is broken. Stay lying down and breathe deeply instead." },
      },
      {
        caption: "Say “I'm so worn out”",
        question: "Everything is too much for Little Bear. What can he do?",
        beats: [{ narration: "Little Bear says to Big Bear:", line: "I'm so worn out." }, { line: "I believe you. Come, I'll help you with your jacket." }],
        instead: {
          caption: "Knock over the baby's tower",
          answer: "Hmm, now the baby's tower is broken, and the baby is crying. Say instead: I'm so worn out.",
        },
      },
      {
        caption: "Crawl into the cozy corner",
        question: "Little Bear needs some rest. What can he do?",
        beats: [
          { narration: "Little Bear crawls into the cozy corner by himself." },
          { narration: "He snuggles into the pillow and squeezes his cuddly rabbit." },
        ],
        instead: { caption: "Hit Big Bear", answer: "Hmm, hitting hurts. Big Bear only wants to help. Crawl into the cozy corner instead." },
      },
    ],
    outro: [{ narration: "Super! Breathe deeply, say how you feel, rest. Now he feels better." }],
    endCaption: "Little Bear lies in the cozy corner with his cuddly rabbit",
  },
  sick: {
    title: "Sick and weak",
    caption: "Little Bear is sick, Little Fox is playing outside",
    intro: [
      { narration: "Little Bear is sick. He is lying on the sofa, his nose is running." },
      { narration: "Outside, Little Fox is playing with the ball. Little Bear feels weak and sad." },
    ],
    steps: [
      {
        caption: "Snuggle into the blanket",
        question: "Little Bear is sick and really weak. What can he do?",
        beats: [{ narration: "Little Bear snuggles into the blanket and closes his eyes." }, { narration: "He breathes very calmly. Resting feels good." }],
        instead: { caption: "Push the teacup off", answer: "Hmm, now the cup is broken and the tea has spilled. Snuggle into the blanket instead." },
      },
      {
        caption: "Wave to Little Fox",
        question: "Little Bear wants to go out too, but he has to stay inside. What can he do?",
        beats: [{ narration: "Little Bear waves to Little Fox through the window." }, { narration: "Little Fox waves back and laughs." }],
        instead: { caption: "Bang on the window", answer: "Hmm, that hurts your paw, and the window can break. Wave to Little Fox instead." },
      },
      {
        caption: "Look at a picture book",
        question: "Little Bear gets bored on the sofa. What can he do?",
        beats: [{ narration: "Little Bear opens the picture book." }, { narration: "He looks at the pictures. A ship, a whale!" }],
        instead: { caption: "Tear the picture book", answer: "Hmm, now the lovely picture book is ruined. Look at the pictures instead." },
      },
    ],
    outro: [{ narration: "Super! Rest, wave, look at pictures. Soon Little Bear will be well again." }],
    endCaption: "Little Bear waves with the book, Little Fox waves outside",
  },
  car: {
    title: "Whiny in the car",
    caption: "A long drive to Grandma Bear, Little Bear is whiny",
    intro: [
      { narration: "Big Bear is driving Little Bear and the baby to Grandma Bear." },
      { narration: "The drive is so long! The baby is asleep. Little Bear is whiny." },
    ],
    steps: [
      {
        caption: "Squeeze the cuddly rabbit tight",
        question: "The drive is so long. What can Little Bear do?",
        beats: [{ narration: "Little Bear puts his arms really tight around his cuddly rabbit." }, { narration: "Squeeze tight. And let go. That's better." }],
        instead: {
          caption: "Kick the seat",
          answer: "Hmm, that hurts Big Bear's back, and he has to drive. Squeeze your cuddly rabbit really tight instead.",
        },
      },
      {
        caption: "Count cars",
        question: "Little Bear has been sitting in his car seat for so long. What can he do?",
        beats: [{ narration: "Little Bear looks out of the window and counts cars." }, { line: "A red car! A blue one! A yellow one!" }],
        instead: {
          caption: "Throw the water bottle forward",
          answer: "Hmm, the bottle flies forward to Big Bear. That's dangerous while driving. Count cars instead.",
        },
      },
      {
        caption: "Close the eyes",
        question: "Little Bear is tired and whiny. What can he do?",
        beats: [{ narration: "Little Bear leans his head back and closes his eyes." }, { narration: "Soon he's asleep, just like the baby." }],
        instead: { caption: "Wake the baby", answer: "Hmm, now the baby is awake and crying. Close your eyes instead." },
      },
    ],
    outro: [{ narration: "Super! Squeeze the cuddly rabbit, count cars, close your eyes. Soon they'll be at Grandma Bear's." }],
    endCaption: "Little Bear and the baby are asleep, Big Bear drives to Grandma's",
  },
  sticky: {
    title: "Yuck, sticky paws",
    caption: "Paws full of paint, Little Bear is disgusted",
    intro: [
      { narration: "Little Bear and Little Fox are painting with finger paint." },
      { narration: "Now Little Bear's paws are all sticky. Yuck! He is disgusted." },
    ],
    steps: [
      {
        caption: "Paws up and blow",
        question: "The paint is sticking to his paws. Yuck! What can Little Bear do?",
        beats: [
          { narration: "Little Bear holds his paws up.", line: "Yuck, it's sticky!" },
          { narration: "Then he breathes out really slowly. Phoooo. That's better." },
        ],
        instead: {
          caption: "Wipe the paws on Little Fox",
          answer: "Hmm, now Little Fox's T-shirt is full of paint, and he is crying. Hold your paws up and blow instead.",
        },
      },
      {
        caption: "Wash the paws",
        question: "Little Bear wants clean paws. What can he do?",
        beats: [{ narration: "Little Bear goes to the sink and washes his paws." }, { line: "All clean!" }],
        instead: { caption: "Knock over the paint cup", answer: "Hmm, now the paint is all over the table. Wash your paws instead." },
      },
      {
        caption: "Paint with the brush",
        question: "Little Bear doesn't like painting with his fingers. What can he do?",
        beats: [{ narration: "Little Bear takes the brush and keeps painting.", line: "This works too!" }, { narration: "A tree and a sun!" }],
        instead: {
          caption: "Crumple Little Fox's picture",
          answer: "Hmm, now Little Fox's picture is ruined, and he is crying. Keep painting with the brush instead.",
        },
      },
    ],
    outro: [{ narration: "Super! Paws up and blow, wash, paint with the brush. Now they both show their pictures." }],
    endCaption: "Little Bear and Little Fox hold up their pictures",
  },
  nappy: {
    title: "Phew, the diaper stinks",
    caption: "The baby's diaper stinks, Little Bear wrinkles his nose",
    intro: [{ narration: "Little Bear is playing with his car. The baby is sitting next to him." }, { narration: "Phew! The baby's diaper stinks. Yuck!" }],
    steps: [
      {
        caption: "Hold the nose and laugh",
        question: "The baby's diaper stinks. What can Little Bear do?",
        beats: [{ narration: "Little Bear holds his nose.", line: "Pheeew!" }, { narration: "He laughs. The baby laughs too." }],
        instead: { caption: "Push the baby away", answer: "Hmm, now the baby has tipped over and is crying. Hold your nose instead." },
      },
      {
        caption: "Open the window",
        question: "The room smells of diaper. What can Little Bear do?",
        beats: [{ narration: "Little Bear opens the window." }, { narration: "Fresh air comes in. Aaah!" }],
        instead: { caption: "Throw the car at the baby", answer: "Hmm, the car hits the baby. That hurts. Open the window instead." },
      },
      {
        caption: "Hand over a fresh diaper",
        question: "Big Bear wants to change the baby. What can Little Bear do?",
        beats: [{ narration: "Little Bear takes the fresh diaper and gives it to Big Bear.", line: "Here!" }, { line: "Thank you! That's a big help." }],
        instead: {
          caption: "Run away and slam the door",
          answer: "Hmm, the door bangs so loudly, and the baby gets a fright. Give Big Bear the fresh diaper instead.",
        },
      },
    ],
    outro: [{ narration: "Super! Hold your nose, open the window, help out. Now the baby smells nice and laughs." }],
    endCaption: "The baby freshly changed, laughing with Little Bear",
  },
  socks: {
    title: "Yuck, wet socks",
    caption: "Water in the boot, Little Bear is disgusted",
    intro: [
      { narration: "It has been raining. Little Bear and Little Fox are going for a walk outside." },
      { narration: "Splash! Little Bear steps into a deep puddle. Water in his boot! Yuck!" },
    ],
    steps: [
      {
        caption: "Shake the foot",
        question: "There's water in his boot. Yuck! What can Little Bear do?",
        beats: [{ narration: "Little Bear shakes his foot really hard.", line: "Yuck, all wet!" }, { narration: "That makes him laugh." }],
        instead: {
          caption: "Push Little Fox into the puddle",
          answer: "Hmm, now Little Fox is sitting in the puddle and crying. Shake your foot really hard instead.",
        },
      },
      {
        caption: "Tip out the boot",
        question: "The boot is full of water. What can Little Bear do?",
        beats: [{ narration: "He sits down on the bench and takes off the boot." }, { narration: "Then he tips it out. Splash!", line: "Out with the water!" }],
        instead: {
          caption: "Throw the boot at Little Fox",
          answer: "Hmm, the boot hits Little Fox. That hurts. Sit down on the bench and tip it out instead.",
        },
      },
      {
        caption: "Wring out the sock",
        question: "The sock is soaking wet. What can Little Bear do?",
        beats: [
          { narration: "He takes off the wet sock and wrings it out. Drip, drip!" },
          { narration: "Then he puts the boot back on.", line: "Much better!" },
        ],
        instead: { caption: "Splash Little Fox", answer: "Hmm, now Little Fox is wet too and crying. Wring out your sock instead." },
      },
    ],
    outro: [{ narration: "Super! Shake your foot, tip out the boot, wring out the sock. And on we go!" }],
    endCaption: "Little Bear and Little Fox walk on, laughing",
  },
  lick: {
    title: "Yuck, the dog licks",
    caption: "A dog licks Little Bear, Little Bear is disgusted",
    intro: [
      { narration: "Little Bear is in the park. A fox lady comes along with a little dog." },
      { narration: "Slurp! The dog licks him right across the face. Yuck!" },
    ],
    steps: [
      {
        caption: "Say “No licking!”",
        question: "The dog licks Little Bear's face. What can Little Bear do?",
        beats: [
          { narration: "Little Bear turns his face away and says loudly:", line: "No licking!" },
          { line: "Oh, sorry! Sit, dog!" },
          { narration: "The dog sits down nicely." },
        ],
        instead: { caption: "Hit the dog", answer: "Hmm, hitting hurts the dog. Turn your face away and say instead: No licking!" },
      },
      {
        caption: "Wipe the face",
        question: "His face is all wet. Yuck! What can Little Bear do?",
        beats: [{ narration: "Little Bear wipes his face with his paw.", line: "Yuck!" }, { narration: "Then he has to laugh." }],
        instead: { caption: "Pull its ears", answer: "Hmm, that hurts the dog. Wipe your face instead." },
      },
      {
        caption: "Stroke its back",
        question: "The little dog is very sweet. What can Little Bear do?",
        beats: [
          { narration: "The fox lady points at the dog's back.", line: "He likes it here." },
          { narration: "Little Bear strokes him very gently.", line: "So soft!" },
          { narration: "The dog wags its tail." },
        ],
        instead: { caption: "Throw a stick at the dog", answer: "Hmm, the stick hits the dog. Stroke his back very gently instead." },
      },
    ],
    outro: [{ narration: "Super! Say no, wipe your face, stroke gently. Bye, little dog!" }],
    endCaption: "The dog wags its tail, Little Bear waves goodbye",
  },
  paintbrush: {
    title: "Angry, the baby takes the brush",
    caption: "The baby has the brush, Little Bear is angry",
    intro: [
      { narration: "Little Bear is painting at the table. The baby bear is sitting next to him." },
      { narration: "Whoosh! The baby grabs Little Bear's brush and smears paint around with it. Little Bear is angry!" },
    ],
    steps: [
      {
        caption: "Say “That's mine!”",
        question: "The baby has Little Bear's brush. What can he do?",
        beats: [
          { narration: "Little Bear says loudly:", line: "That's mine! Give it to me, please." },
          { narration: "The baby looks. Then it gives him the brush." },
        ],
        instead: { caption: "Snatch the brush", answer: "Hmm, now the baby is crying. Say it loudly instead: That's mine!" },
      },
      {
        caption: "Punch the pillow",
        question: "Little Bear is so angry! What can he do?",
        beats: [
          { narration: "He goes to the sofa and punches the pillow. Boom, boom, boom!" },
          { narration: "The anger is out.", line: "Phew. That's better." },
        ],
        instead: { caption: "Throw the paint cup", answer: "Hmm, now there's paint everywhere, and the baby gets a fright. Punch the sofa pillow instead." },
      },
      {
        caption: "Give a crayon",
        question: "The baby wants to draw too. What can Little Bear do?",
        beats: [
          { narration: "Little Bear gives the baby a crayon.", line: "Here, this one is for you!" },
          { narration: "The baby lets go of the brush. Now they both draw." },
        ],
        instead: { caption: "Tear the baby's paper", answer: "Hmm, now the paper is torn and the baby is crying. Give it a crayon instead." },
      },
    ],
    outro: [{ narration: "Super! Say what's yours, punch the pillow, draw together." }],
    endCaption: "Little Bear and the baby draw together",
  },
  bluecup: {
    title: "Angry, the blue cup",
    caption: "Milk in the red cup, Little Bear is angry",
    intro: [{ narration: "Breakfast! Big Bear pours milk into the red cup." }, { narration: "But Little Bear wants the blue one! He is angry." }],
    steps: [
      {
        caption: "Say “I want the blue one!”",
        question: "Little Bear wants the blue cup. What can he do?",
        beats: [
          { narration: "Little Bear says loudly:", line: "I want the blue cup!" },
          { line: "Ah, the blue one. Good that you tell me!" },
          { narration: "Big Bear puts the blue cup next to it." },
        ],
        instead: { caption: "Knock over the red cup", answer: "Hmm, now the milk has spilled. Say it loudly instead: I want the blue one!" },
      },
      {
        caption: "Stomp really hard",
        question: "Little Bear is really angry. What can he do?",
        beats: [{ narration: "Little Bear stomps really hard with both feet. Stomp, stomp!" }, { line: "Phew. That's better." }],
        instead: {
          caption: "Bang with the spoon",
          answer: "Hmm, that's so loud, and the porridge splashes everywhere. Stomp really hard with your feet instead.",
        },
      },
      {
        caption: "Pour it into the blue cup",
        question: "The milk is in the red cup. What can Little Bear do?",
        beats: [
          { narration: "Little Bear fetches the blue cup. Big Bear holds it steady." },
          { narration: "And Little Bear pours the milk into it all by himself. Glug, glug!", line: "I did it!" },
        ],
        instead: {
          caption: "Push the porridge off",
          answer: "Hmm, now the bowl is broken and the porridge is on the floor. Pour the milk into the blue cup yourself instead.",
        },
      },
    ],
    outro: [{ narration: "Super! Say what you want, stomp really hard, pour it yourself. Enjoy your breakfast!" }],
    endCaption: "Little Bear happily drinks from the blue cup",
  },
  nap: {
    title: "Awake at nap time",
    caption: "Everyone is asleep, Little Bear is wide awake",
    intro: [
      { narration: "Nap time at kindergarten. Little Fox and Hedgehog are already asleep." },
      { narration: "Only Little Bear is wide awake. He wriggles and wriggles. He can't fall asleep." },
    ],
    steps: [
      {
        caption: "Squeeze the cuddly rabbit",
        question: "Everyone is asleep, only Little Bear is awake. What can he do?",
        beats: [
          { narration: "Little Bear holds his cuddly rabbit really close.", line: "Good night, rabbit." },
          { narration: "So soft and warm. He gets calmer." },
        ],
        instead: { caption: "Poke Little Fox", answer: "Hmm, now Little Fox is awake and crying. Squeeze your cuddly rabbit really tight instead." },
      },
      {
        caption: "Blow slowly",
        question: "Little Bear wriggles and wriggles. What can he do?",
        beats: [{ narration: "He blows really slowly, like at a candle. Phoooo." }, { narration: "And again. His arms get really heavy." }],
        instead: { caption: "Sing loudly", answer: "Hmm, now everyone is awake, and Hedgehog is crying. Blow really slowly instead." },
      },
      {
        caption: "Think of something nice",
        question: "Little Bear can't fall asleep. What can he do?",
        beats: [{ narration: "He lies really still and thinks of something nice." }, { narration: "Of the swing. Back and forth, back and forth." }],
        instead: { caption: "Run through the room", answer: "Hmm, he trips over Hedgehog. That hurts. Lie still and think of something nice instead." },
      },
    ],
    outro: [{ narration: "Super! Squeeze the cuddly rabbit, blow slowly, think of something nice. And now he's asleep." }],
    endCaption: "Little Bear sleeps with his cuddly rabbit",
  },
  teeth: {
    title: "Angry at toothbrushing",
    caption: "Mouth shut, Little Bear doesn't want to brush",
    intro: [
      { narration: "It's evening. Little Bear already has his pajamas on." },
      { narration: "Big Bear holds out the toothbrush. But Little Bear doesn't want to! He shuts his mouth really tight." },
    ],
    steps: [
      {
        caption: "Stomp really hard",
        question: "Little Bear doesn't want to brush his teeth. What can he do?",
        beats: [
          { narration: "Little Bear stomps really hard with both feet.", line: "I don't want to!" },
          { line: "I know. Go ahead, stomp really hard." },
          { narration: "Phew. Now the anger is out." },
        ],
        instead: {
          caption: "Knock the toothbrush away",
          answer: "Hmm, now the toothbrush is on the floor. Stomp really hard instead and say: I don't want to!",
        },
      },
      {
        caption: "Turn the sand timer",
        question: "Brushing teeth takes so long. What can Little Bear do?",
        beats: [
          { narration: "Little Bear turns the sand timer over himself.", line: "Here we go!" },
          { narration: "The sand trickles down. Now we brush until it's all at the bottom." },
        ],
        instead: { caption: "Run away", answer: "Hmm, he slips on the smooth tiles. Turn the sand timer over yourself instead." },
      },
      {
        caption: "Brush by yourself",
        question: "Big Bear holds out the toothbrush. What can Little Bear do?",
        beats: [
          { narration: "Little Bear takes the toothbrush and brushes by himself. Scrub, scrub!" },
          { narration: "Then he shows his teeth to the mirror.", line: "Look, all clean!" },
        ],
        instead: { caption: "Throw the cup down", answer: "Hmm, now the cup is broken. Brush by yourself and show the mirror your teeth instead." },
      },
    ],
    outro: [{ narration: "Super! Stomp, turn the sand timer, brush by yourself. Sparkling clean!" }],
    endCaption: "Little Bear shows his clean teeth in the mirror",
  },
  bedtime: {
    title: "Angry, not bedtime yet",
    caption: "Bedtime, Little Bear wants to keep playing",
    intro: [
      { narration: "It's evening. Little Bear is playing with his train in his pajamas." },
      { narration: "Big Bear is holding a picture book.", line: "Come on, it's bedtime!" },
      { narration: "Little Bear shakes his head. He is angry." },
    ],
    steps: [
      {
        caption: "Squeeze the fists",
        question: "Little Bear wants to keep playing. What can he do?",
        beats: [
          { narration: "Little Bear squeezes his fists really tight and says:", line: "I want to keep playing!" },
          { line: "I know. One more round, then it's bedtime." },
          { narration: "He opens his fists. Phew." },
        ],
        instead: { caption: "Throw the train", answer: "Hmm, now the engine is broken. Squeeze your fists instead and say: I want to keep playing!" },
      },
      {
        caption: "Drive the train into the tunnel",
        question: "It's bedtime for the train. What can Little Bear do?",
        beats: [
          { narration: "Little Bear drives the train into the tunnel by himself.", line: "Good night, train!" },
          { narration: "Choo-choo. Now it's asleep." },
        ],
        instead: { caption: "Kick the tracks apart", answer: "Hmm, now the tracks are broken. Drive the train into the tunnel instead: Good night, train!" },
      },
      {
        caption: "Pick a book",
        question: "Story time is coming. What can Little Bear do?",
        beats: [
          { narration: "Little Bear picks a book from the shelf by himself.", line: "This one! With the moon." },
          { line: "Oh, that's a lovely one. Come, I'll read it to you." },
        ],
        instead: { caption: "Tear the book", answer: "Hmm, now the book is torn. Pick a book yourself instead." },
      },
    ],
    outro: [{ narration: "Super! Squeeze your fists, say good night to the train, pick a book. Now it's story time." }],
    endCaption: "Big Bear reads aloud, Little Bear snuggles up",
  },
};
