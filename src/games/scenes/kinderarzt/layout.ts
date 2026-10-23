import { ground } from "../layout";

// A children's doctor's practice, seen from the middle of the room. The back wall stands on the
// horizon. Left is the waiting room: the jumping jack, the window with the waiting chairs and
// Papa below it, the water dispenser, the aquarium and the mobile, the reception desk with the
// clock above it, and the door. Right is the exam corner: the eye chart, the scale in front of
// the giraffe height chart, the sink under the wall cupboard, and the exam couch with the child
// and the lamp. On the floor in front: the pram, the toy box, the rocking horse and the toys on
// the round rug at the left; the doctor, the instrument trolley, the doctor's bag, the teddy
// and the bin at the right.

/** The reception desk; the receptionist stands behind it, telephone and sticker jar stand on it. */
export const DESK = ground(0, 0, 620, 470, 1.15);
/** The exam couch; the child sits on it. */
export const COUCH = ground(0, 0, 1470, 600);
/** The instrument trolley; stethoscope, otoscope and plaster box lie on its top. */
export const TROLLEY = ground(0, 0, 960, 730);
