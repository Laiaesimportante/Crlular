import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { frags, SCENE } from '../timing';
import { C, FONT, SAFE } from '../theme';

const KEY = new Set(['organizado', 'pendientes', 'cumplir', 'prioridad']); // ORGANIZADO / PENDIENTES / ACCIÓN (cumplir) / PRIORIDAD
const norm = (s: string) => s.toLowerCase().replace(/[.,¿?¡!]/g, '');

type Block = { words: { text: string; start: number; emph: boolean }[]; start: number; end: number };
const BLOCKS: Block[] = frags.flatMap((f) =>
  f.blocks.map((b, bi) => {
    const ws = f.words.slice(b.from, b.to + 1);
    const nextB = f.blocks[bi + 1];
    const endWord = ws[ws.length - 1].end;
    const nextStart = nextB ? f.words[nextB.from].start : endWord + 0.5;
    return { words: ws.map((w) => ({ text: w.text, start: w.start, emph: w.emph })), start: ws[0].start, end: Math.min(nextStart - 0.02, endWord + (f.id === 5 && !nextB ? 0.22 : 0.45)) };
  }),
);

/** Subtítulos dinámicos por bloques; palabra a palabra con pop; claves en píldora. Zona segura Reels/TikTok. */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < SCENE.s2.from - 0.05 || t >= SCENE.s5.from - 0.05) return null; // S1 y S5: el texto grande ya es el subtítulo
  const scrim = t < SCENE.s3.from + 0.1 ? <div style={{ position: 'absolute', left: 0, right: 0, top: SAFE.subTop - 140, height: 420, background: 'linear-gradient(180deg, transparent, rgba(10,9,12,.82) 45%, rgba(10,9,12,.82) 75%, transparent)' }} /> : null;
  const blk = BLOCKS.find((b) => t >= b.start - 0.04 && t < b.end);
  if (!blk) return scrim;
  const light = t >= SCENE.s3.from + 0.15; // mundo claro desde la escena 3
  const exit = interpolate(t, [blk.end - 0.1, blk.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enter = interpolate(t, [blk.start - 0.04, blk.start + 0.08], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <>{scrim}
    <div style={{ position: 'absolute', left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: SAFE.subTop, height: SAFE.subH, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '8px 18px',
      opacity: exit * enter, transform: `translateY(${(1 - exit) * -14}px) scale(${0.97 + 0.03 * exit})` }}>
      {blk.words.map((w, i) => {
        const key = KEY.has(norm(w.text));
        const p = spring({ frame: frame - Math.round((w.start - 0.03) * fps), fps, config: { damping: 11, mass: 0.6, stiffness: 190 } });
        const vis = t >= w.start - 0.03;
        const size = key ? 96 : w.emph ? 88 : 80;
        const color = key ? '#fff' : w.emph ? (light ? C.hot : C.pink) : light ? C.ink : '#fff';
        return (
          <span key={i} style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: '-0.03em', textTransform: 'uppercase', color,
            padding: key ? '6px 22px 12px' : '0', borderRadius: 0, background: key ? C.hot : 'transparent',
            textShadow: light ? 'none' : key ? 'none' : '0 4px 18px rgba(0,0,0,.7)',
            opacity: vis ? 1 : 0, transform: `translateY(${(1 - p) * 40}px) scale(${0.55 + 0.45 * p}) rotate(${key ? (1 - p) * -4 : 0}deg) scaleX(.92)`,
            boxShadow: key ? `6px 6px 0 ${light ? C.ink : '#fff'}` : undefined }}>{w.text.replace(/\.$/, '')}</span>
        );
      })}
    </div></>
  );
};