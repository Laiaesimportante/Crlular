import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT, MONO, SAFE } from '../theme';
import { CleanBG } from '../components/Backgrounds';
import { Type3D } from '../components/Type3D';
import { PhotoCard } from '../components/Photos';
import { Calendar3D } from '../components/Calendar3D';
import { agendaSrc } from '../assets';
import { wStart, SCENE } from '../timing';
import { prog, inOut, outExpo } from '../anim';

/** ESCENA 4 — la reflexión: hacerlo todo ≠ priorizar. Agenda real → calendario 3D con UN día marcado y tarea completada.
 *  PRIORIDAD sale en el subtítulo (no se repite en grande); el hero 3D es ENFOQUE. */
export const Scene4: React.FC<{ t: number }> = ({ t }) => {
  const agenda = prog(t, wStart(4, 0) - 0.2, wStart(4, 0) + 0.5, outExpo);
  const dim = prog(t, wStart(4, 9) - 0.5, wStart(4, 9) + 0.1, inOut);
  const cal = prog(t, wStart(4, 9) - 0.35, wStart(4, 9) + 0.45, outExpo);
  const ring = prog(t, wStart(4, 11), wStart(4, 14), inOut);
  const check = prog(t, wStart(4, 14) + 0.05, wStart(4, 14) + 0.45, outExpo);
  const enf = prog(t, wStart(4, 13) - 0.1, wStart(4, 13) + 0.35, outExpo);
  const pulse = 1 + Math.sin(Math.max(0, t - wStart(4, 14)) * 9) * 0.02 * (check > 0 ? 1 : 0);
  return (
    <AbsoluteFill>
      <CleanBG t={t} />
      <div style={{ position: 'absolute', left: SAFE.x0, top: SAFE.y0 + 4, fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: '.08em' }}><span style={{ color: C.hot }}>●</span> 04 / ENFOQUE</div>
      <div style={{ position: 'absolute', left: 0, width: 1024, top: SAFE.y0 + 40, height: 190, perspective: 1100 }}>
        <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', transformStyle: 'preserve-3d', opacity: enf, transform: `translateZ(${(1 - enf) * 900}px) rotateX(${(1 - enf) * -30}deg)` }}>
          <Type3D text="ENFOQUE" size={176} face={C.ink} side={C.hot} depth={22} step={3} rotY={4} />
        </div>
      </div>
      {/* agenda real: «hacerlo todo» */}
      <div style={{ position: 'absolute', left: 132, top: 540, width: 760, opacity: agenda * (1 - dim), transform: `translateY(${(1 - agenda) * 500 + dim * 160}px) scale(${1 - dim * 0.1}) rotateX(${(1 - agenda) * 30}deg)`, perspective: 1600 }}>
        <PhotoCard src={agendaSrc('openMillos')} w={760} h={560} />
      </div>
      {/* calendario 3D con el día prioritario */}
      <div style={{ position: 'absolute', left: 232, top: 520, width: 560, height: 620, perspective: 1500, opacity: cal, transform: `translateY(${(1 - cal) * 300}px) scale(${pulse})` }}>
        <Calendar3D w={560} h={620} hi={14} ring={ring} check={check} style={{ transform: `rotateX(${14 - (1 - cal) * 40}deg) rotateY(${-10 + Math.sin(t * 0.8) * 3}deg)`, transformOrigin: '50% 60%' }} />
      </div>
      <div style={{ position: 'absolute', left: 232, top: 1100, opacity: check, transform: `scale(${0.6 + 0.4 * check})`, transformOrigin: 'left center', fontFamily: FONT, fontWeight: 900, fontSize: 34, color: '#fff', background: C.ink, padding: '10px 28px' }}>✓ TAREA COMPLETADA</div>
    </AbsoluteFill>
  );
};
