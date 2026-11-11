import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';
import { Scene4 } from './scenes/Scene4';
import { Scene5 } from './scenes/Scene5';
import { Subtitles } from './components/Subtitles';
import { Grain } from './components/Backgrounds';
import { SCENE } from './timing';
import { prog, inOut } from './anim';
import { VOICE_FILE } from './assets';
import cues from './cues.json';

type TR = { type: 'whip' | 'circle' | 'zoom'; at: number; d: number; origin?: string };
// Transiciones: whip pan · máscara circular (cambio de mentalidad) · zoom · match cut (círculo del día prioritario)
const TRS: TR[] = [
  { type: 'whip', at: SCENE.s2.from, d: 0.3 },
  { type: 'circle', at: SCENE.s3.from, d: 0.6, origin: '540px 760px' },
  { type: 'zoom', at: SCENE.s4.from, d: 0.5 },
  { type: 'circle', at: SCENE.s5.from, d: 0.7, origin: '391px 893px' },
];
const FROM = [0, SCENE.s2.from, SCENE.s3.from, SCENE.s4.from, SCENE.s5.from];

const Shell: React.FC<{ k: number; t: number; children: React.ReactNode }> = ({ k, t, children }) => {
  const inn = k > 0 ? TRS[k - 1] : undefined;
  const out = k < 4 ? TRS[k] : undefined;
  const end = out ? out.at + out.d : Infinity;
  if (t < FROM[k] || t > end) return null;
  const s: React.CSSProperties = {};
  if (inn && t < inn.at + inn.d) {
    const p = prog(t, inn.at, inn.at + inn.d, inOut);
    if (inn.type === 'whip') { s.transform = `translateX(${(1 - p) * 1200}px)`; s.filter = `blur(${(1 - p) * 26}px)`; }
    if (inn.type === 'circle') { s.clipPath = `circle(${p * 2300}px at ${inn.origin})`; }
    if (inn.type === 'zoom') { s.transform = `scale(${0.55 + 0.45 * p})`; s.opacity = Math.min(1, p * 1.8); s.filter = `blur(${(1 - p) * 12}px)`; }
  }
  if (out && t > out.at) {
    const p = prog(t, out.at, out.at + out.d, inOut);
    if (out.type === 'whip') { s.transform = `translateX(${-p * 1200}px)`; s.filter = `blur(${p * 26}px)`; }
    if (out.type === 'circle') { s.transform = `scale(${1 + p * 0.06})`; }
    if (out.type === 'zoom') { s.transform = `scale(${1 + p * 1.3})`; s.opacity = 1 - p; s.filter = `blur(${p * 14}px)`; }
  }
  return <AbsoluteFill style={s}>{children}</AbsoluteFill>;
};

export const JirehDia01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const flash = Math.max(0, ...cues.hits.map((h) => (t >= h && t < h + 0.3 ? Math.exp(-(t - h) * 16) : 0))) * (t < SCENE.s3.from ? 0.32 : 0.14);
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <Shell k={0} t={t}><Scene1 t={t} /></Shell>
      <Shell k={1} t={t}><Scene2 t={t} /></Shell>
      <Shell k={2} t={t}><Scene3 t={t} /></Shell>
      <Shell k={3} t={t}><Scene4 t={t} /></Shell>
      <Shell k={4} t={t}><Scene5 t={t} /></Shell>
      <Subtitles />
      <AbsoluteFill style={{ background: '#fff', opacity: flash, pointerEvents: 'none' }} />
      <Grain opacity={t < SCENE.s3.from ? 0.13 : 0.06} />
      <Audio src={staticFile('audio/musica_sfx.wav')} volume={0.9} />
      {VOICE_FILE ? <Audio src={staticFile(`audio/${VOICE_FILE}`)} volume={1} /> : null}
    </AbsoluteFill>
  );
};
