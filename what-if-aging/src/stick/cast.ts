import { CharDef } from "./Stick";

// Recurring cast. Each one is the same stick construction; only clothing colour, hair and accessories differ.
export const YOU: CharDef = { name: "You (protagonist)", outfit: { kind: "hoodie", color: "#f2c21b", pants: "#2c3d6b" }, hair: "tuft" };
export const MIA: CharDef = { name: "Mia (friend)", outfit: { kind: "tee", color: "#8f5bd8", pants: "#0b0a0c" }, hair: "buns" };
export const ZOE: CharDef = { name: "Zoe (friend)", outfit: { kind: "hoodie", color: "#e0452f", pants: "#0b0a0c" }, hair: "long" };
export const SAM: CharDef = { name: "Sam (friend)", outfit: { kind: "tee", color: "#f08a24", pants: "#0b0a0c" }, hair: "cap", capColor: "#b9864a" };
export const DR: CharDef = {
  name: "Dr. Reyes (scientist)",
  outfit: { kind: "coat", color: "#eef1f4", inner: "#2f8f9a", pants: "#26303f" },
  hair: "bun",
  glasses: true,
};
export const CAST = [YOU, MIA, ZOE, SAM, DR];
