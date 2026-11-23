import guion from "./guion.json";
import dur from "./duraciones.json";
import { createTimeline } from "../lib/engine";

export const tl = createTimeline(guion, dur);
export const at = tl.at;
export const D = (id: string) => tl.frames(id);
