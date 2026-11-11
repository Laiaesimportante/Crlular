import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT, SAFE } from '../theme';
import { MagentaBG } from '../components/Backgrounds';
import { PhotoCard } from '../components/Photos';
import { wStart } from '../timing';
import { prog, inOut, outExpo, pop } from '../anim';
import { LOGO_FILE, CLIP_LUISA, agendaSrc } from '../assets';
import voice from '../voice.json';

const Q: { w: number; text: string; size: number; color: string }[] = [
  { w: 0, text: '¿ESTÁS', size: 118, color: C.ink },
  { w: 3, text: 'ORGANIZANDO', size: 158, color: '#fff' },
  { w: 4, text: 'TUS DÍAS', size: 118, color: C.ink },
  { w: 6, text: 'O SOLAMENTE', size: 104, color: C.ink },
  { w: 8, text: 'ANOTANDO', size: 150, color: C.ink },
  { w: 9, text: 'COSAS?', size: 150, color: '#fff' },
];

export const Logo: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <Img src={staticFile(`assets/${LOGO_FILE}`)} style={{ width: 250 * size, height: 250 * size, borderRadius: '50%', boxShadow: '0 22px 40px rgba(10,9,12,.45)' }} />
);

/** ESCENA 5 — interacción y marca. La pregunta grande ES el subtítulo (sincronizada por palabra). Fondo magenta del logo. */
export const Scene5: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const end = voice.speechEnd;
  const settle = prog(t, end + 0.2, end + 0.85, inOut);
  const agenda = prog(t, end + 0.35, end + 1.05, outExpo);
  const logo = pop(frame, 30, end + 0.85);
  const cta = pop(frame, 30, end + 1.5, 10, 0.8);
  return (
    <AbsoluteFill>
      <MagentaBG />
      <div style={{ position: 'absolute', left: 0, width: 1024, top: SAFE.y0 + 10 - settle * 10, transform: `scale(${1 - settle * 0.5})`, transformOrigin: '50% 0%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {Q.map((s, li) => {
          const wi = wStart(5, s.w);
          const p = pop(frame, 30, wi - 0.05, 12, 0.7);
          const struck = li === 4;
          return (
            <div key={li} style={{ fontFamily: FONT, fontWeight: 900, fontSize: s.size, lineHeight: 0.98, letterSpacing: '-0.04em', color: s.color, whiteSpace: 'nowrap', transform: `translateY(${(1 - p) * 60}px) scale(${0.6 + 0.4 * p}) scaleX(.84)`, opacity: t >= wi - 0.05 ? Math.min(1, p * 1.6) : 0, position: 'relative' }}>
              {s.text}
              {struck && <div style={{ position: 'absolute', left: -6, top: '54%', height: 14, width: `${prog(t, wStart(5, 8) + 0.3, wStart(5, 8) + 0.65) * 104}%`, background: C.ink, transform: 'rotate(-2deg)' }} />}
            </div>
          );
        })}
      </div>
      {/* agendas reales + clip real */}
      <div style={{ position: 'absolute', left: SAFE.cx, top: 945, width: 0, height: 0, perspective: 1600, opacity: agenda }}>
        {([['camilo', -270, -9, 0.2], ['valeria', 270, 9, 0.32]] as const).map(([k, x, r, d]) => {
          const e = prog(t, end + d + 0.1, end + d + 0.8, outExpo);
          return <div key={k} style={{ position: 'absolute', left: -110 + x * e, top: -140 + (1 - e) * 500, transform: `rotate(${r * e}deg)` }}><PhotoCard src={agendaSrc(k)} w={220} h={280} /></div>;
        })}
        <div style={{ position: 'absolute', left: -150, top: -190 + (1 - agenda) * 500, width: 300, height: 380, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 44px rgba(10,9,12,.45)', border: '6px solid #fff' }}>
          <OffthreadVideo src={staticFile(`assets/${CLIP_LUISA}`)} muted startFrom={20} style={{ width: 300, height: 430, objectFit: 'cover', objectPosition: 'center 30%' }} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, width: 1024, top: 1135, display: 'flex', justifyContent: 'center', opacity: Math.min(1, logo), transform: `scale(${0.6 + 0.4 * logo})` }}>
        <Logo size={0.72} />
      </div>
      <div style={{ position: 'absolute', left: 0, width: 1024, top: 1322, display: 'flex', justifyContent: 'center', opacity: Math.min(1, cta), transform: `translateY(${(1 - cta) * 30}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: '#fff', background: C.ink, padding: '12px 30px 16px', textAlign: 'center', lineHeight: 1.05 }}>
          SÍGUENOS PARA MÁS IDEAS<br />DE ORGANIZACIÓN
        </div>
      </div>
    </AbsoluteFill>
  );
};
