import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { frags, SCENE } from '../timing';
import { C, FONT } from '../theme';

const KEY = new Set(['organizado', 'pendientes', 'cumplir', 'prioridad']); // ORGANIZADO / PENDIENTES / ACCIÓN (cumplir) / PRIORIDAD
const norm = (s: string) => s.toLowerCase().replace(/[.,¿?¡!]/g, '');

type Block = { words: { text: string; start: number; emph: boolean }[]; start: number; end: number };
const BLOCKS: Block[] = frags.flatMap((f) =>
  f.blocks.map((b, bi) => {
    const ws = f.words.slice(b.from, b.to + 1);
    const nextB = f.blocks[bi + 1];
    const endWord = ws[ws.length - 1].end;
    const nextStart = nextB ? f.words[nextB.from].start : endWord + 0.5;
    return { words: ws.map((w) => ({ text: w.text, start: w.start, emph: w.emph })), start: ws[0].start, end: Math.min(nextStart - 0.02, endWord + 0.45) };
  }),
);

/** Subtítulos dinámicos por bloques; palabra a palabra con pop; claves en píldora. Zona segura Reels/TikTok. */
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const blk = BLOCKS.find((b) => t >= b.start - 0.04 && t < b.end);
  if (!blk) return null;
  const light = t >= SCENE.s3.from + 0.15; // mundo claro desde la escena 3
  const exit = interpolate(t, [blk.end - 0.1, blk.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enter = interpolate(t, [blk.start - 0.04, blk.start + 0.08], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 60, width: 840, top: 1215, height: 300, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: '8px 18px',
      opacity: exit * enter, transform: `translateY(${(1 - exit) * -14}px) scale(${0.97 + 0.03 * exit})` }}>
      {blk.words.map((w, i) => {
        const key = KEY.has(norm(w.text));
        const p = spring({ frame: frame - Math.round((w.start - 0.03) * fps), fps, config: { damping: 11, mass: 0.6, stiffness: 190 } });
        const vis = t >= w.start - 0.03;
        const size = key ? 108 : w.emph ? 94 : 82;
        const color = key ? '#fff' : w.emph ? (light ? C.hot : C.pink) : light ? C.ink : '#fff';
        return (
          <span key={i} style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: '-0.03em', textTransform: 'uppercase', color,
            padding: key ? '10px 26px 14px' : '0', borderRadius: 22, background: key ? C.hot : 'transparent',
            textShadow: light && !key ? '0 3px 0 rgba(255,255,255,.7)' : key ? 'none' : '0 4px 18px rgba(0,0,0,.55)',
            opacity: vis ? 1 : 0, transform: `translateY(${(1 - p) * 40}px) scale(${0.55 + 0.45 * p}) rotate(${key ? (1 - p) * -4 : 0}deg)`,
            boxShadow: key ? '0 14px 30px rgba(232,70,127,.45)' : undefined }}>{w.text.replace(/\.$/, '')}</span>
        );
      })}
    </div>
  );
};
