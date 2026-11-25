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

// --- extra cast for the long-form videos ---
export const CAPT: CharDef = { name: "Captain", outfit: { kind: "coat", color: "#1f2a4a", inner: "#e9edf2", pants: "#1f2a4a" }, hair: "cap", capColor: "#1f2a4a" };
export const FO: CharDef = { name: "First officer", outfit: { kind: "coat", color: "#1f2a4a", inner: "#e9edf2", pants: "#1f2a4a" }, hair: "tuft" };
export const FA: CharDef = { name: "Flight attendant", outfit: { kind: "tee", color: "#2f5aa8", pants: "#1f2a4a" }, hair: "bun" };
export const RANDY: CharDef = { name: "Randy (1964)", outfit: { kind: "tee", color: "#4a8ad8", pants: "#3a2c22" }, hair: "tuft" };
