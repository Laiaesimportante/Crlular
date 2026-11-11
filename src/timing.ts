import voice from './voice.json';
export const FPS = voice.fps;
export const TOTAL_FRAMES = Math.ceil(voice.total * FPS);
export const frags = voice.frags;
export const sec = (s: number) => Math.round(s * FPS);
/** Segundo de inicio de la palabra `i` del fragmento `f` (1..5). */
export const wStart = (f: number, i: number) => frags[f - 1].words[i].start;
export const wEnd = (f: number, i: number) => frags[f - 1].words[i].end;
export const fStart = (f: number) => frags[f - 1].start;
export const fEnd = (f: number) => frags[f - 1].end;
// Límites de escena (s): cada escena arranca un poco antes de su primera palabra.
export const SCENE = {
  s1: { from: 0, to: fStart(2) - 0.15 },
  s2: { from: fStart(2) - 0.35, to: fStart(3) - 0.15 },
  s3: { from: fStart(3) - 0.35, to: fStart(4) - 0.15 },
  s4: { from: fStart(4) - 0.35, to: fStart(5) - 0.15 },
  s5: { from: fStart(5) - 0.35, to: voice.total },
};
