import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, MONO, SAFE } from '../theme';
import { CleanBG } from '../components/Backgrounds';
import { PageTurn } from '../components/Photos';
import { PaperSwarm } from '../components/PaperSwarm';
import { agendaSrc } from '../assets';
import { ITEMS, camZ } from './Scene2';
import { wStart, SCENE } from '../timing';
import { prog, inOut, outExpo, pop } from '../anim';

const Line: React.FC<{ children: React.ReactNode; size: number; color: string; style?: React.CSSProperties }> = ({ children, size, color, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.92, letterSpacing: '-0.04em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', transform: 'scaleX(.84)', transformOrigin: 'left center', ...style }}>{children}</div>
);

/** ESCENA 3 — el cambio de mentalidad: mundo blanco/rejilla; las listas se ordenan, queda UNA prioridad y aparece la agenda real. */
export const Scene3: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const order = prog(t, wStart(3, 3), wStart(3, 8) + 0.1, inOut);
  const keep = prog(t, wStart(3, 8) + 0.2, wStart(3, 9) + 0.35, inOut);
  const cam = camZ(SCENE.s2.to) * (1 - order);
  const agIn = prog(t, wStart(3, 9) + 0.05, wStart(3, 10) + 0.4, outExpo);
  const flip = prog(t, wStart(3, 10) + 0.2, wStart(3, 11) + 0.4, inOut);
  const done = prog(t, wStart(3, 12) + 0.15, wStart(3, 12) + 0.6);
  const menos = pop(frame, 30, wStart(3, 8) + 0.05), listas = pop(frame, 30, wStart(3, 8) + 0.2), strike = prog(t, wStart(3, 8) + 0.8, wStart(3, 9) + 0.1);
  const mas = pop(frame, 30, wStart(3, 12) - 0.2), accion = pop(frame, 30, wStart(3, 12) + 0.05, 9, 0.8);
  return (
    <AbsoluteFill>
      <CleanBG t={t} />
      <div style={{ position: 'absolute', left: SAFE.x0, top: SAFE.y0 + 4, fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: '.08em', opacity: prog(t, SCENE.s3.from + 0.4, SCENE.s3.from + 0.8) }}>
        <span style={{ color: C.hot }}>●</span> 03 / ORDEN
      </div>
      <div style={{ position: 'absolute', inset: 0, perspective: 1000, perspectiveOrigin: '50% 42%', opacity: 1 - agIn }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${cam}px)` }}>
          <PaperSwarm items={ITEMS} t={t} order={order} keep={keep} speed={0.35} cx={SAFE.cx} cy={870} />
        </div>
      </div>
      {/* tipografía cinética alineada a la rejilla */}
      <div style={{ position: 'absolute', left: SAFE.x0, top: SAFE.y0 + 52 }}>
        <div style={{ display: 'flex', gap: 22, alignItems: 'baseline', height: 118 }}>
          <Line size={116} color={C.ink} style={{ transform: `translateX(${(1 - menos) * -300}px) scaleX(.84)`, opacity: Math.min(1, menos) }}>menos</Line>
          <div style={{ position: 'relative', transform: `scale(${0.4 + 0.6 * listas}) translateY(${strike * 10}px)`, transformOrigin: 'left center', opacity: Math.min(1, listas) * (1 - strike * 0.6) }}>
            <Line size={116} color={C.taupe}>listas</Line>
            <div style={{ position: 'absolute', left: -8, top: '52%', height: 14, width: `${strike * 100}%`, background: C.hot, borderRadius: 7, transform: 'rotate(-3deg)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center', height: 130 }}>
          <Line size={116} color={C.ink} style={{ transform: `translateY(${(1 - mas) * 80}px) scaleX(.84)`, opacity: Math.min(1, mas) }}>más</Line>
          <div style={{ transform: `scale(${0.3 + 0.7 * accion}) rotate(${(1 - accion) * -6}deg)`, transformOrigin: 'left center', opacity: Math.min(1, accion), background: C.hot, padding: '2px 26px 12px' }}>
            <Line size={124} color="#fff" style={{ transformOrigin: 'center' }}>acción</Line>
          </div>
        </div>
      </div>
      {agIn > 0 && (
        <div style={{ position: 'absolute', left: 132, top: 655 + (1 - agIn) * 700, width: 760, opacity: Math.min(1, agIn * 1.4), transform: `scale(${0.92 + 0.08 * agIn}) rotateX(${(1 - agIn) * 24}deg)` }}>
          <PageTurn a={agendaSrc('openLuz')} b={agendaSrc('openLaura')} flip={flip} w={760} h={470} />
          <div style={{ position: 'absolute', left: 24, bottom: 22, opacity: done, transform: `scale(${0.6 + 0.4 * done})`, transformOrigin: 'left bottom', fontFamily: FONT, fontWeight: 900, fontSize: 36, color: '#fff', background: C.hot, padding: '10px 26px' }}>✓ UNA SOLA PRIORIDAD</div>
          <svg viewBox="0 0 400 200" style={{ position: 'absolute', left: 330, top: -150, width: 360, height: 180, overflow: 'visible' }}>
            <path d="M10 20 C 120 -10, 260 40, 330 150" fill="none" stroke={C.hot} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog(t, wStart(3, 12) - 0.3, wStart(3, 12) + 0.35)} />
            <path d="M296 118 L334 160 L372 112" fill="none" stroke={C.hot} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog(t, wStart(3, 12) + 0.28, wStart(3, 12) + 0.5)} />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};
