import { PAINTED } from "./src/games/together/painted";
const ids = process.argv.slice(2);
for (const p of PAINTED.filter((p) => ids.includes(p.id))) console.log(`## ${p.id}\nB: ${p.before}\nA: ${p.after}\nP: ${p.part ?? "-"}\n`);
