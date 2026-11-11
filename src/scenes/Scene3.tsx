import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT } from '../theme';
import { CleanBG } from '../components/Backgrounds';
import { PageTurn } from '../components/Photos';
import { agendaSrc } from '../assets';
import { PaperSwarm } from '../components/PaperSwarm';
import { ITEMS, camZ } from './Scene2';
import { wStart, SCENE } from '../timing';
import { prog, inOut, outExpo, pop } from '../anim';
import { useCurrentFrame } from 'remotion';

const Line: React.FC<{ children: React.ReactNode; size: number; color: string; style?: React.CSSProperties }> = ({ children, size, color, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.92, letterSpacing: '-0.04em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', ...style }}>{children}</div>
);

/** ESCENA 3 — el cambio de mentalidad: las listas se ordenan, queda UNA prioridad y aparece la agenda real. */
export const Scene3: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const order = prog(t, wStart(3, 3), wStart(3, 8) + 0.1, inOut);
  const keep = prog(t, wStart(3, 8) + 0.2, wStart(3, 9) + 0.35, inOut);
  const cam = camZ(SCENE.s2.to) * (1 - order);
  // agenda abierta: entra y pasa página; la tarea clave se completa en "cumplir"
  const agIn = prog(t, wStart(3, 9) + 0.05, wStart(3, 10) + 0.4, outExpo);
  const flip = prog(t, wStart(3, 10) + 0.2, wStart(3, 11) + 0.4, inOut);
  const done = prog(t, wStart(3, 12) + 0.15, wStart(3, 12) + 0.6);
  // tipografía cinética
  const menos = pop(frame, 30, wStart(3, 8) + 0.05), listas = pop(frame, 30, wStart(3, 8) + 0.2), strike = prog(t, wStart(3, 8) + 0.8, wStart(3, 9) + 0.1);
  const mas = pop(frame, 30, wStart(3, 12) - 0.2), accion = pop(frame, 30, wStart(3, 12) + 0.05, 9, 0.8);
  const lowerLists = prog(t, wStart(3, 9) + 0.1, wStart(3, 10) + 0.2, inOut);
  return (
    <AbsoluteFill>
      <CleanBG t={t} />
      {/* listas que se ordenan (mismo enjambre de la escena 2) */}
      <div style={{ position: 'absolute', inset: 0, perspective: 1000, perspectiveOrigin: '50% 42%', opacity: 1 - agIn }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${cam}px) translateY(${lowerLists * 0}px)` }}>
          <PaperSwarm items={ITEMS} t={t} order={order} keep={keep} speed={0.35} />
        </div>
      </div>
      {/* tipografía cinética 2D integrada */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 235, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 26, alignItems: 'baseline', height: 130 }}>
          <Line size={118} color={C.ink} style={{ transform: `translateX(${(1 - menos) * -300}px)`, opacity: Math.min(1, menos) }}>menos</Line>
          <div style={{ position: 'relative', transform: `scale(${0.4 + 0.6 * listas}) translateY(${strike * 14}px)`, opacity: Math.min(1, listas) * (1 - strike * 0.55) }}>
            <Line size={118} color={C.taupe}>listas</Line>
            <div style={{ position: 'absolute', left: -10, top: '52%', height: 14, width: `${strike * 112}%`, background: C.hot, borderRadius: 7, transform: 'rotate(-3deg)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 26, alignItems: 'center', height: 150, marginTop: 6 }}>
          <Line size={118} color={C.ink} style={{ transform: `translateY(${(1 - mas) * 80}px)`, opacity: Math.min(1, mas) }}>más</Line>
          <div style={{ transform: `scale(${0.3 + 0.7 * accion}) rotate(${(1 - accion) * -6}deg)`, opacity: Math.min(1, accion), background: C.hot, borderRadius: 28, padding: '4px 34px 14px', boxShadow: '0 22px 40px rgba(232,70,127,.4)' }}>
            <Line size={128} color="#fff">acción</Line>
          </div>
        </div>
      </div>
      {/* agenda real (placeholder neutro) con la prioridad destacada + flecha 2D */}
      {agIn > 0 && (
        <div style={{ position: 'absolute', left: 130, top: 520 + (1 - agIn) * 700, width: 820, opacity: Math.min(1, agIn * 1.4), transform: `scale(${0.92 + 0.08 * agIn}) rotateX(${(1 - agIn) * 24}deg)` }}>
          <PageTurn a={agendaSrc('openLuz')} b={agendaSrc('openLaura')} flip={flip} w={820} h={640} />
          <div style={{ position: 'absolute', left: 30, bottom: 26, opacity: done, transform: `scale(${0.6 + 0.4 * done})`, transformOrigin: 'left bottom', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff', background: C.hot, borderRadius: 40, padding: '12px 32px' }}>✓ UNA SOLA PRIORIDAD</div>
          <svg viewBox="0 0 400 200" style={{ position: 'absolute', left: 420, top: -220, width: 400, height: 200, overflow: 'visible' }}>
            <path d="M10 20 C 120 -10, 260 40, 330 150" fill="none" stroke={C.hot} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog(t, wStart(3, 12) - 0.3, wStart(3, 12) + 0.35)} />
            <path d="M296 118 L334 160 L372 112" fill="none" stroke={C.hot} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog(t, wStart(3, 12) + 0.28, wStart(3, 12) + 0.5)} />
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
};
