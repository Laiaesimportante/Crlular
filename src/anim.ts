import { Easing, interpolate, spring } from 'remotion';
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** progreso 0..1 entre dos instantes (s) con easing opcional */
export const prog = (t: number, a: number, b: number, e: (x: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
export const outExpo = Easing.out(Easing.exp);
export const inOut = Easing.inOut(Easing.cubic);
export const pop = (frame: number, fps: number, delayS: number, damping = 12, mass = 0.7) =>
  spring({ frame: frame - Math.round(delayS * fps), fps, config: { damping, mass, stiffness: 160 } });
