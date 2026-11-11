import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT } from '../theme';
import { CleanBG } from '../components/Backgrounds';
import { Type3D } from '../components/Type3D';
import { AgendaOpen } from '../components/Agenda';
import { Calendar3D } from '../components/Calendar3D';
import { wStart, wEnd, fEnd } from '../timing';
import { prog, inOut, outExpo } from '../anim';

/** Pluma vectorial que escribe (sin mano: no se inventan grabaciones). */
const Writing: React.FC<{ p: number }> = ({ p }) => {
  const d = 'M20 80 C 50 20, 70 20, 90 70 S 130 130, 150 60 S 200 20, 230 78 S 280 120, 310 60 S 360 30, 390 70 S 430 110, 470 50';
  return (
    <svg viewBox="0 0 500 140" style={{ width: 640, height: 180, overflow: 'visible' }}>
      <path d={d} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} opacity={0.85} />
    </svg>
  );
};

/** ESCENA 4 — la reflexión: escribir ≠ priorizar. Agenda → calendario 3D, PRIORIDAD y ENFOQUE, tarea completada. */
export const Scene4: React.FC<{ t: number }> = ({ t }) => {
  const agenda = prog(t, wStart(4, 0) - 0.2, wStart(4, 0) + 0.5, outExpo);
  const write = prog(t, wStart(4, 0) + 0.1, wStart(4, 4) + 0.1, (x) => x);
  const dim = prog(t, wStart(4, 9) - 0.5, wStart(4, 9) + 0.1, inOut);          // la agenda cede el paso al calendario
  const cal = prog(t, wStart(4, 9) - 0.35, wStart(4, 9) + 0.45, outExpo);
  const ring = prog(t, wStart(4, 11), wStart(4, 14), inOut);
  const check = prog(t, wStart(4, 14) + 0.05, wStart(4, 14) + 0.45, outExpo);
  const prio = prog(t, wStart(4, 9) - 0.25, wStart(4, 9) + 0.2, outExpo);
  const enf = prog(t, wStart(4, 14) - 0.15, wStart(4, 14) + 0.3, outExpo);
  const pulse = 1 + Math.sin(Math.max(0, t - wStart(4, 14)) * 9) * 0.02 * (check > 0 ? 1 : 0);
  return (
    <AbsoluteFill>
      <CleanBG t={t + 3} />
      {/* título 3D: PRIORIDAD → ENFOQUE */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 245, height: 220, perspective: 1100 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', transformStyle: 'preserve-3d', opacity: prio * (1 - enf), transform: `translateZ(${(1 - prio) * 900}px) translateY(${enf * -60}px) rotateX(${enf * 40}deg)` }}>
          <Type3D text="PRIORIDAD" size={150} face={C.hot} side={C.plum} depth={22} step={3} rotY={-5} rotX={3} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', transformStyle: 'preserve-3d', opacity: enf, transform: `translateZ(${(1 - enf) * 900}px) rotateX(${(1 - enf) * -30}deg)` }}>
          <Type3D text="ENFOQUE" size={170} face={C.ink} side={C.hot} depth={22} step={3} rotY={4} />
        </div>
      </div>
      {/* agenda con escritura: "hacerlo todo" */}
      <div style={{ position: 'absolute', left: 90, top: 520, width: 900, opacity: agenda * (1 - dim), transform: `translateY(${(1 - agenda) * 500 + dim * 160}px) scale(${1 - dim * 0.1}) rotateX(${(1 - agenda) * 30}deg)`, perspective: 1600 }}>
        <AgendaOpen w={900} h={600} title="TODO" tasks={[{ t: 'responder' }, { t: 'organizar' }, { t: 'comprar' }, { t: 'llamar' }, { t: 'revisar' }]} />
        <div style={{ position: 'absolute', left: 60, top: 40 }}><Writing p={write} /></div>
      </div>
      {/* calendario 3D con día prioritario */}
      <div style={{ position: 'absolute', left: 240, top: 500, width: 600, height: 660, perspective: 1500, opacity: cal, transform: `translateY(${(1 - cal) * 300}px) scale(${pulse})` }}>
        <Calendar3D w={600} h={660} hi={14} ring={ring} check={check}
          style={{ transform: `rotateX(${14 - (1 - cal) * 40}deg) rotateY(${-10 + Math.sin(t * 0.8) * 3}deg)`, transformOrigin: '50% 60%' }} />
      </div>
      {/* chip de tarea completada */}
      <div style={{ position: 'absolute', left: 250, top: 1130, opacity: check, transform: `scale(${0.6 + 0.4 * check})`, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: '#fff', background: C.ink, borderRadius: 40, padding: '12px 34px' }}>✓ TAREA COMPLETADA</div>
    </AbsoluteFill>
  );
};
