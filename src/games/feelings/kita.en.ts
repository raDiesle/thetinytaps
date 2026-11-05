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
};
