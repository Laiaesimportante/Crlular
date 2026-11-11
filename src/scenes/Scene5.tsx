import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { C, FONT } from '../theme';
import { CleanBG } from '../components/Backgrounds';
import { Agenda } from '../components/Agenda';
import { wStart } from '../timing';
import { prog, inOut, outExpo, pop } from '../anim';
import { LOGO_FILE } from '../assets';
import { useCurrentFrame } from 'remotion';
import voice from '../voice.json';

const Q: { w: number; text: string; size: number; color: string }[][] = [
  [{ w: 0, text: '¿ESTÁS', size: 112, color: C.ink }],
  [{ w: 3, text: 'ORGANIZANDO', size: 142, color: C.hot }],
  [{ w: 4, text: 'TUS DÍAS', size: 112, color: C.ink }],
  [{ w: 6, text: 'O SOLAMENTE', size: 100, color: C.taupe }],
  [{ w: 8, text: 'ANOTANDO COSAS?', size: 100, color: C.ink }],
];

export const Logo: React.FC<{ size?: number }> = ({ size = 1 }) =>
  LOGO_FILE ? <Img src={staticFile(`assets/${LOGO_FILE}`)} style={{ height: 150 * size }} /> : (
    // Placeholder tipográfico hasta recibir el logo oficial (assets.ts → LOGO_FILE)
    <div style={{ textAlign: 'center', fontFamily: FONT, color: C.ink, lineHeight: 1 }}>
      <div style={{ fontSize: 96 * size, fontWeight: 900, letterSpacing: '-0.04em' }}>jireh<span style={{ color: C.hot }}>.</span></div>
      <div style={{ fontSize: 30 * size, fontWeight: 700, letterSpacing: '0.42em', marginTop: 6 * size }}>ACCESSORIES</div>
    </div>
  );

/** ESCENA 5 — interacción y marca: pregunta grande → agenda + logo + cierre. */
export const Scene5: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const end = voice.speechEnd;
  const settle = prog(t, end + 0.1, end + 0.8, inOut);        // la pregunta sube y deja espacio a la marca
  const agenda = prog(t, end + 0.25, end + 1.0, outExpo);
  const logo = pop(frame, 30, end + 0.8);
  const cta = pop(frame, 30, end + 1.45, 10, 0.8);
  return (
    <AbsoluteFill>
      <CleanBG t={t + 8} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 215 - settle * 20, transform: `scale(${1 - settle * 0.34})`, transformOrigin: '50% 0%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
      {/* agenda personalizada */}
      <div style={{ position: 'absolute', left: 540, top: 975, perspective: 1400, opacity: agenda }}>
        <div style={{ transformStyle: 'preserve-3d', transform: `translate(-50%, -50%) translateY(${(1 - agenda) * 500}px) rotateX(${14 + (1 - agenda) * 30}deg) rotateY(${-20 + Math.sin(t) * 4}deg) rotateZ(-5deg)` }}>
          <Agenda w={300} h={400} depth={14} />
        </div>
      </div>
      {/* logo + cierre */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1245, display: 'flex', justifyContent: 'center', opacity: Math.min(1, logo), transform: `scale(${0.7 + 0.3 * logo})` }}>
        <Logo />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1425, display: 'flex', justifyContent: 'center', opacity: Math.min(1, cta), transform: `translateY(${(1 - cta) * 30}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: '#fff', background: C.hot, borderRadius: 60, padding: '20px 44px 24px', letterSpacing: '0.01em', textAlign: 'center', boxShadow: '0 18px 36px rgba(232,70,127,.4)', maxWidth: 800 }}>
          SÍGUENOS PARA MÁS IDEAS DE ORGANIZACIÓN
        </div>
      </div>
    </AbsoluteFill>
  );
};
