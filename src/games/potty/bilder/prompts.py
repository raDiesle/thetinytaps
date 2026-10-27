"""All prompts of the potty story (only Tapsi the fox). python3 prompts.py <stage> fox > jobs.json"""
import json, sys

STYLE = ("Children's picture-book illustration for 2–4 year olds. Soft, flat, rounded shapes with thick dark-purple outlines (#2a1e5c), "
         "bright friendly colours, gentle shading. Simple, uncluttered background. No text, no letters, no numbers, no speech bubbles, no frames. ")
WIDE = "Wide picture: all characters stay in the middle, with calm wall and floor all around the edges (the edges may be cut off on some screens). "
END = "No text, no letters, no speech bubbles."

CAST = {
 "fox": dict(
   kid="Tapsi, the little fox cub in a light blue T-shirt and blue trousers",
   kid_short="Tapsi",
   mama="Mama fox, a grown-up fox with a yellow sweater and a small red flower behind one ear",
   papa="Papa fox, a grown-up fox with a green sweater and round glasses",
   first=("Tapsi, a little fox cub (a toddler), orange fur, white muzzle and white belly, big dark eyes, pointy ears, a bushy tail with a white tip, "
          "wearing a light blue T-shirt and blue trousers")),
}

def cast(a, parents=True):
  c = CAST[a]
  if parents:
    return f"In the picture, each exactly once: {c['kid']}; {c['mama']}; {c['papa']}. Nobody else. "
  return f"In the picture, exactly once: {c['kid']}. Nobody else. "

KITCHEN_KEEP = ("Redraw this exact picture as a later moment of the same story. Keep the place exactly as it is: the same warm yellow kitchen walls, "
  "the window with the green curtain on the left, the wooden kitchen door on the right, the small round wooden table, the chair, the plate and the glass "
  "at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters' poses, faces and places change. ")
BATH_KEEP = ("Redraw this exact picture as a later moment of the same story. Keep the bathroom exactly as it is: the same light blue tiled walls, "
  "the white toilet, the toilet paper roll, the sink with the round mirror, the bathtub with the hand shower, the potted plant, the bath mat and the small turquoise potty at the same places, "
  "the same camera framing (no zoom, no shift), the same colours and line style. Only the characters' poses, faces and places change, and only things named below are added. ")
NO_NUDITY = "The trousers are down at the ankles, the T-shirt covers the tummy, only fur shows, nothing else. "

def kitchen(a):
  k = CAST[a]["kid_short"]
  return {
   "essen": STYLE + WIDE + "A cozy family kitchen: warm yellow walls, a window with a green curtain on the left, a wooden kitchen door on the right, a small round wooden table in the middle. "
            + CAST[a]["first"] + f", sits on a small chair at the table and happily eats a plate of noodles with a fork. A big glass of water stands next to the plate. {k} is the only character in the picture.",
   "trinken": KITCHEN_KEEP + cast(a, False) + f"Now this happens: {k} still sits on the chair, holds the big glass of water with both paws and drinks a big gulp, eyes happily closed. The plate is empty now. " + END,
   "blase": KITCHEN_KEEP + cast(a, False) + f"Now this happens: {k} has jumped off the chair and stands next to the table, knees pressed together and legs crossed, both paws held in front of the trousers, wiggling, eyes wide and surprised – {k} suddenly needs to pee. The plate and the glass are empty. " + END,
   "bauch": KITCHEN_KEEP + cast(a, False) + f"Now this happens: {k} has jumped off the chair and stands next to the table, holding its round tummy with both paws, eyes wide, mouth a small surprised 'o' – {k}'s tummy rumbles, {k} needs to poo. The plate and the glass are empty. " + END,
   "rufen": KITCHEN_KEEP + "The kitchen door on the right is open now. " + cast(a) + f"Now this happens: {k} stands next to the table, both bare paws cupped around its open mouth, calling loudly (no megaphone, nothing in its paws). Mama and Papa have just come in through the open door and now stand together side by side inside the kitchen, between the table and the door, fully visible from head to feet, smiling warmly at {k}. The plate and the glass are empty. " + END,
  }

def bathroom_first(a):
  k = CAST[a]["kid_short"]
  return ("Use the reference picture only for the three characters and the drawing style: " + STYLE + WIDE +
    "New place: a bright, cozy family bathroom seen from the front: light blue tiled walls, a white toilet with a toilet paper roll on a holder next to it on the left, "
    "a white bathtub with a hand shower along the back wall, a small white sink with a round mirror on the right, a green potted plant in a corner, a yellow bath mat, "
    "and a small round turquoise potty standing on the floor in the middle. " + cast(a) +
    f"Now this happens: {k} walks into the bathroom holding Mama's paw, Papa walks next to them; all three smile. The potty waits in the middle. " + END)

SIT = lambda a: f"{CAST[a]['kid_short']} sits on the small turquoise potty in the middle, trousers down at the ankles, T-shirt covering the tummy, only fur shows. "

def bathroom(a):
  k = CAST[a]["kid_short"]
  return {
   "runter": BATH_KEEP + cast(a) + f"Now this happens: {k} stands right in front of the potty and pulls the trousers down to the ankles, a little proud; " + NO_NUDITY + "Mama and Papa stand together nearby and smile. " + END,
   "sitzen": BATH_KEEP + cast(a) + "Now this happens: " + SIT(a) + f"{k} smiles. Mama and Papa stand together beside the potty, happy, clapping their paws softly. " + END,
   "fertig-pipi": BATH_KEEP + cast(a) + f"Now this happens: {k} has stood up next to the potty and points proudly into it: inside the potty there is a little light yellow water (pee). " + NO_NUDITY + f"Mama and Papa cheer with their arms up, very happy. " + END,
   "fertig-kaka": BATH_KEEP + cast(a) + f"Now this happens: {k} has stood up next to the potty and points proudly into it: inside the potty there is a small brown swirl of poo, cute and simple, no face. " + NO_NUDITY + "Mama and Papa cheer with their arms up, very happy. " + END,
   "abwischen": BATH_KEEP + cast(a) + f"Now this happens: {k} stands next to the potty, bent forward a little, and wipes the bottom from behind with a piece of toilet paper, the long tail lifted; " + NO_NUDITY + "Papa holds out the toilet paper roll and smiles. Mama watches and smiles. " + END,
   "hoch": BATH_KEEP + cast(a) + f"Now this happens: {k} stands next to the potty and pulls the trousers up, big proud smile. Mama and Papa stand together and smile. " + END,
   "abziehen": BATH_KEEP + cast(a) + f"Now this happens: {k} stands on tiptoes at the toilet and presses the flush button on the toilet with one paw; Papa holds the empty potty, just emptied into the toilet, so there is no potty on the floor any more – only the one in Papa's paws; the water in the toilet swirls. Mama stands beside them and smiles. Trousers are up. " + END,
   "waschen": BATH_KEEP + cast(a) + f"Now this happens: {k} stands on a small step stool at the sink and washes the paws under running water with lots of white soap foam; Mama stands behind and helps, Papa holds a towel ready. Trousers are up. " + END,
   "party": BATH_KEEP + cast(a) + f"Now this happens: {k} jumps for joy in the middle of the bathroom with both arms up, Mama and Papa jump and cheer too, colourful confetti in the air. Trousers are up. " + END,
  }

# Waiting scenes: drawn from "sitzen", so the child keeps sitting on the one potty (drawn from "bad", the potty
# stayed empty in the middle and the child sat on nothing next to it); only the parents do something.
def sit_keep(a):
  k = CAST[a]["kid_short"]
  return ("Redraw this exact picture as a later moment of the same story. Keep the bathroom exactly as it is: the same light blue tiled walls, "
    "the white toilet, the toilet paper roll, the sink with the round mirror, the bathtub with the hand shower, the potted plant and the bath mats at the same places, "
    "the same camera framing (no zoom, no shift), the same colours and line style. "
    f"{k} keeps sitting on the small turquoise potty exactly where and how it sits now, trousers at the ankles; there is only this one potty in the picture. "
    f"Only Mama's and Papa's poses and places change, and {k}'s face; only things named below are added. ")

def waiting(a):
  k = CAST[a]["kid_short"]
  def w(what, kid): return sit_keep(a) + cast(a) + "Now this happens: " + what + " " + kid + " " + END
  laugh = f"{k} watches them and laughs."
  press = f"{k} watches and presses along a little, cheeks rosy, eyes squeezed, smiling."
  return {
   "warten-giesskanne": w("Papa waters the green potted plant with a small red watering can, a thin stream of water pours onto the plant. Mama stands next to Papa and watches (Mama only once).", laugh),
   "warten-wasserhahn": w("Mama has turned on the tap of the bathtub, water splashes down into the tub. Papa points at the water.", laugh),
   "warten-ballon": w("Mama holds a big blown-up red balloon and has just let it go: it whizzes up through the air with a little puff. Papa laughs.", laugh),
   "warten-krug": w("Papa pours water from a big glass jug into a small cup that Mama holds, the water splashes a little over the edge.", laugh),
   "warten-dusche": w("Papa holds the hand shower over the bathtub and makes rain on a yellow rubber duck that floats in the tub. Mama watches.", laugh),
   "warten-zahnpasta": w("Papa squeezes a big toothpaste tube with both paws, a long stripe of toothpaste comes out onto a toothbrush that Mama holds.", press),
   "warten-aufblasen": w("Mama blows up a big red balloon with puffed-up cheeks and a red face, pressing hard. Papa watches.", press),
   "warten-schieben": w("Papa pushes a big full laundry basket across the floor with all his might, leaning in, face red with effort. Mama cheers him on.", press),
   "warten-schwamm": w("Mama squeezes a big yellow wet sponge with both paws, water drips and splashes out into a bucket. Papa watches.", press),
   "warten-zug": w("Papa kneels on the floor and pushes a small wooden toy train into a cardboard tunnel; Mama holds the tunnel.", laugh),
   "warten-tanzen": w("Mama and Papa dance together, holding paws, swinging and laughing, one leg kicked up.", laugh),
   "warten-jonglieren": w("Papa juggles three toilet paper rolls in the air. Mama claps.", laugh),
   "warten-kuckuck": w("Mama hides her face behind a big fluffy towel, only her ears show above it. Papa points at her and grins.", laugh),
   "warten-seifenblasen": w("Papa blows lots of shiny soap bubbles with a bubble wand, they float through the bathroom. Mama tries to catch one.", laugh),
  }

# Second frames: the small movement of each picture.
MOVE = {
 "essen": "the fork with noodles is now at the mouth, cheeks full, chewing",
 "trinken": "the glass is tipped a bit more and the eyes are open, happy",
 "blase": "the knees are bent the other way, wiggling to the other side",
 "bauch": "the paws rub the tummy, the eyes look down at it",
 "rufen": "the child waves one arm high; Mama and Papa wave back",
 "bad": "everyone has taken one step further, the other foot forward",
 "sitzen": "Mama and Papa's paws are now together mid-clap, smiling wider",
 "fertig-pipi": "Mama and Papa jump a little, the child's arm points higher",
 "fertig-kaka": "Mama and Papa jump a little, the child's arm points higher",
 "abziehen": "the water in the toilet swirls further, the child's paw is lifted from the button",
 "waschen": "the paws rub the other way, more foam bubbles",
 "party": "everyone is in the air a bit higher, the confetti has moved",
 "warten-giesskanne": "the watering can is tipped further, more water pours, the plant has a new flower",
 "warten-wasserhahn": "more water in the tub and a bigger splash",
 "warten-ballon": "the balloon is further up near the ceiling, smaller, twisting",
 "warten-krug": "the cup is fuller and overflows, a splash on the floor",
 "warten-dusche": "the rubber duck bobs and more drops fall",
 "warten-zahnpasta": "the stripe of toothpaste is much longer, curling",
 "warten-aufblasen": "the balloon is much bigger, the cheeks even rounder",
 "warten-schieben": "the basket has moved a bit further, Papa leans in more",
 "warten-schwamm": "the sponge is squeezed flat, more water pours out",
 "warten-zug": "the toy train comes out of the other end of the tunnel, Mama and Papa cheer",
 "warten-tanzen": "Mama and Papa swing to the other side, the other leg kicked up",
 "warten-jonglieren": "the three rolls are at other places in the air",
 "warten-kuckuck": "Mama lowers the towel and shows her laughing face: peekaboo!",
 "warten-seifenblasen": "the bubbles have floated further, one pops near Mama's paw",
}
def second(name):
  return ("Redraw this exact picture as the second frame of a tiny two-frame animation. Keep EVERYTHING identical: same characters at exactly the same places and sizes, "
          "same clothes, colours, background, every object where it is, same camera framing (no zoom, no shift), same composition and line style. "
          f"Nothing appears, disappears or moves except this small movement: {MOVE[name]}. No text, no letters.")

# The moments before "runter" and "sitzen", played once before them as a tiny animation (Step.moves in content.ts).
# Drawn from the end picture itself, so only the child's trousers and pose change and the room stays the same.
def earlier(what):
  return ("Redraw this exact picture as an earlier moment of the same tiny animation. Keep EVERYTHING identical: the same bathroom, every object where it is, "
          "the small turquoise potty exactly where it stands, Mama and Papa exactly as they are (same places, poses and faces), the same camera framing (no zoom, no shift), "
          f"the same colours and line style. Tapsi stays at the same place and size. Nothing appears, disappears or moves except Tapsi: {what} No text, no letters.")

MOVES = {
 "runter-1": "the blue trousers are still up at the waist, fully on; Tapsi holds the waistband with both paws, ready to pull them down, smiling.",
 "runter-2": "Tapsi bends forward a little and pushes the blue trousers down with both paws, the trousers are halfway down at the knees; the T-shirt covers the tummy, only fur shows.",
 "sitzen-1": "Tapsi stands upright right in front of the potty, back to it, about to sit down, trousers down at the ankles, the T-shirt covering the tummy, only fur shows; the empty potty is seen behind Tapsi's legs.",
 "sitzen-2": "Tapsi bends the knees and lowers the bottom onto the potty, halfway down, just above it, not touching it yet, paws stretched forward for balance, trousers at the ankles, the T-shirt covering the tummy, only fur shows.",
}

def job(a, name, prompt, ref=None):
  j = dict(out=f"src/games/potty/bilder/{a}-{name}.webp", prompt=prompt, aspect="16:9", size="1376", quality=65)
  if ref: j["ref"] = [ref]
  return j

raw = lambda a, n: f".image-raw/{a}-{n}.png"

def stage(st, a):
  if st == "kitchen-first": return [job(a, "essen", kitchen(a)["essen"])]
  if st == "kitchen": return [job(a, n, p, raw(a, "essen")) for n, p in kitchen(a).items() if n != "essen"]
  if st == "bath-first": return [job(a, "bad", bathroom_first(a), raw(a, "rufen"))]  # a new room
  if st == "bath": return [job(a, n, p, raw(a, "bad")) for n, p in bathroom(a).items()]
  if st == "wait": return [job(a, n, p, raw(a, "sitzen")) for n, p in waiting(a).items()]
  if st == "frames-kitchen": return [job(a, n + "-b", second(n), raw(a, n)) for n in ["essen", "trinken", "blase", "bauch", "rufen"]]
  if st == "frames-bath": return [job(a, n + "-b", second(n), raw(a, n)) for n in MOVE if n not in ["essen", "trinken", "blase", "bauch", "rufen"] and not n.startswith("warten-")]
  if st == "frames-wait": return [job(a, n + "-b", second(n), raw(a, n)) for n in MOVE if n.startswith("warten-")]
  # From the game's own pictures: the raw ones of the first round are gone.
  if st == "moves": return [job(a, n, earlier(p), f"src/games/potty/bilder/{a}-{n.split('-')[0]}.webp") for n, p in MOVES.items()]
  raise SystemExit("unknown stage")

if __name__ == "__main__":
  print(json.dumps([j for a in sys.argv[2].split(",") for j in stage(sys.argv[1], a)], indent=1))
