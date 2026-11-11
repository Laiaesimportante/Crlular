import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT } from '../theme';
import { CleanBG } from '../components/Backgrounds';
import { Type3D } from '../components/Type3D';
import { PhotoCard } from '../components/Photos';
import { agendaSrc } from '../assets';
import { Calendar3D } from '../components/Calendar3D';
import { wStart, wEnd, fEnd } from '../timing';
import { prog, inOut, outExpo } from '../anim';

/** ESCENA 4 — la reflexión: escribir ≠ priorizar. Agenda → calendario 3D, PRIORIDAD y ENFOQUE, tarea completada. */
export const Scene4: React.FC<{ t: number }> = ({ t }) => {
  const agenda = prog(t, wStart(4, 0) - 0.2, wStart(4, 0) + 0.5, outExpo);
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
      {/* agenda real (calendario abierto): «hacerlo todo» */}
      <div style={{ position: 'absolute', left: 140, top: 500, width: 800, opacity: agenda * (1 - dim), transform: `translateY(${(1 - agenda) * 500 + dim * 160}px) scale(${1 - dim * 0.1 + Math.sin(t * 0.7) * 0.004}) rotateX(${(1 - agenda) * 30}deg)`, perspective: 1600 }}>
        <PhotoCard src={agendaSrc('openMillos')} w={800} h={690} />
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
