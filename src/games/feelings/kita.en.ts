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
        caption: "Show the two halves",
        question: "Little Bear is still a little sad. What can he do?",
        beats: [{ narration: "He looks at the halves. One, two!", line: "Now I have two cookies!" }],
        instead: { caption: "Crumble the cookie", answer: "Hmm, now the cookie is all gone. Look instead: now you have two!" },
      },
      {
        caption: "Share with Little Fox",
        question: "Little Fox has no cookie left. What can Little Bear do?",
        beats: [{ narration: "Little Bear gives Little Fox one half.", line: "For you!" }, { line: "Thank you, Little Bear!" }],
        instead: { caption: "Stick out the tongue", answer: "Hmm, now Little Fox is sad. Share with him instead." },
      },
    ],
    outro: [{ narration: "Great! Being sad is okay. Squeeze the cuddly toy, look again, share." }],
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
};
