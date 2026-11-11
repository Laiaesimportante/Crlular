import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from 'remotion';
import { C, FONT } from '../theme';
import { CleanBG } from '../components/Backgrounds';
import { PhotoCard } from '../components/Photos';
import { wStart } from '../timing';
import { prog, inOut, outExpo, pop } from '../anim';
import { LOGO_FILE, CLIP_LUISA, agendaSrc } from '../assets';
import { useCurrentFrame } from 'remotion';
import voice from '../voice.json';

const Q: { w: number; text: string; size: number; color: string }[][] = [
  [{ w: 0, text: '¿ESTÁS', size: 112, color: C.ink }],
  [{ w: 3, text: 'ORGANIZANDO', size: 142, color: C.hot }],
  [{ w: 4, text: 'TUS DÍAS', size: 112, color: C.ink }],
  [{ w: 6, text: 'O SOLAMENTE', size: 100, color: C.taupe }],
  [{ w: 8, text: 'ANOTANDO COSAS?', size: 100, color: C.ink }],
];

export const Logo: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <Img src={staticFile(`assets/${LOGO_FILE}`)} style={{ width: 250 * size, height: 250 * size, borderRadius: '50%', boxShadow: '0 22px 40px rgba(60,20,50,.4)' }} />
);

/** ESCENA 5 — interacción y marca: pregunta grande → agenda + logo + cierre. */
export const Scene5: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const end = voice.speechEnd;
  const settle = prog(t, end + 0.15, end + 0.8, inOut);        // la pregunta sube y deja espacio a la marca
  const agenda = prog(t, end + 0.3, end + 1.0, outExpo);
  const logo = pop(frame, 30, end + 0.8);
  const cta = pop(frame, 30, end + 1.45, 10, 0.8);
  return (
    <AbsoluteFill>
      <CleanBG t={t + 8} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 215 - settle * 20, transform: `scale(${1 - settle * 0.4})`, transformOrigin: '50% 0%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {Q.map((line, li) => line.map((s, si) => {
          const wi = wStart(5, s.w);
          const p = pop(frame, 30, wi - 0.05, 12, 0.7);
          const hl = li === 1 && t >= wi;
          const last = li === 4;
          return (
            <div key={`${li}${si}`} style={{ fontFamily: FONT, fontWeight: 900, fontSize: s.size, lineHeight: 0.98, letterSpacing: '-0.045em', color: s.color, whiteSpace: 'nowrap',
              opacity: t >= wi - 0.05 ? Math.min(1, p * 1.6) : 0, transform: `translateY(${(1 - p) * 60}px) scale(${0.6 + 0.4 * p})`, position: 'relative' }}>
              {s.text}
              {hl && <div style={{ position: 'absolute', left: 0, bottom: 2, height: 10, width: `${prog(t, wi, wi + 0.5) * 100}%`, background: C.hot, borderRadius: 5, opacity: 0.35 }} />}
              {last && <div style={{ position: 'absolute', left: -6, top: '54%', height: 10, width: `${prog(t, wStart(5, 8) + 0.25, wStart(5, 8) + 0.6) * 54}%`, background: C.hot, borderRadius: 5, transform: 'rotate(-2deg)' }} />}
            </div>
          );
        }))}
      </div>
      {/* agendas personalizadas reales + clip real */}
      <div style={{ position: 'absolute', left: 540, top: 925, width: 0, height: 0, perspective: 1600, opacity: agenda }}>
        {([['camilo', -330, -10, 0.2], ['valeria', 330, 10, 0.32]] as const).map(([k, x, r, d]) => {
          const e = prog(t, end + d, end + d + 0.7, outExpo);
          return <div key={k} style={{ position: 'absolute', left: -140 + x * e, top: -190 + (1 - e) * 500 + 30, transform: `rotate(${r * e}deg) rotateY(${-x / 40 * e}deg)` }}><PhotoCard src={agendaSrc(k)} w={280} h={340} /></div>;
        })}
        <div style={{ position: 'absolute', left: -190, top: -230 + (1 - agenda) * 500, width: 380, height: 470, borderRadius: 22, overflow: 'hidden', boxShadow: '0 34px 50px rgba(60,35,45,.4)', transform: `scale(${1 + Math.max(0, t - end) * 0.012})` }}>
          <OffthreadVideo src={staticFile(`assets/${CLIP_LUISA}`)} muted startFrom={20} style={{ width: 380, height: 520, objectFit: 'cover', objectPosition: 'center 30%' }} />
        </div>
      </div>
      {/* logo + cierre */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1200, display: 'flex', justifyContent: 'center', opacity: Math.min(1, logo), transform: `scale(${0.6 + 0.4 * logo})` }}>
        <Logo size={0.88} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1445, display: 'flex', justifyContent: 'center', opacity: Math.min(1, cta), transform: `translateY(${(1 - cta) * 30}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: '#fff', background: C.hot, borderRadius: 60, padding: '20px 44px 24px', letterSpacing: '0.01em', textAlign: 'center', boxShadow: '0 18px 36px rgba(232,70,127,.4)', maxWidth: 800 }}>
          SÍGUENOS PARA MÁS IDEAS DE ORGANIZACIÓN
        </div>
      </div>
    </AbsoluteFill>
  );
};
