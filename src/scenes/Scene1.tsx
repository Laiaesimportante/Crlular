import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../theme';
import { ChaosBG } from '../components/Backgrounds';
import { Type3D } from '../components/Type3D';
import { Agenda } from '../components/Agenda';
import { agendaSrc } from '../assets';
import { wStart } from '../timing';
import { prog, outExpo } from '../anim';

/** ESCENA 1 — la frase que rompe la creencia. Mundo oscuro, agenda sobre superficie, NO SIGNIFICA / ORGANIZADO en 3D. */
export const Scene1: React.FC<{ t: number }> = ({ t }) => {
  const slamNo = prog(t, wStart(1, 3) - 0.18, wStart(1, 3) + 0.16, outExpo);
  const slamSig = prog(t, wStart(1, 4) - 0.18, wStart(1, 4) + 0.16, outExpo);
  const org = prog(t, wStart(1, 7) - 0.3, wStart(1, 7) + 0.25, outExpo);
  const back = prog(t, wStart(1, 7) - 0.3, wStart(1, 7) + 0.1); // NO SIGNIFICA se hunde al llegar ORGANIZADO
  const kick = prog(t, 0, 0.5, outExpo);
  const cam = 1 + t * 0.018;
  const shake = t > wStart(1, 3) && t < wStart(1, 3) + 0.25 ? Math.sin(t * 90) * 7 * (1 - (t - wStart(1, 3)) / 0.25) : 0;
  const glitch = org > 0 && org < 1 ? (1 - org) * 14 : 0;
  return (
    <AbsoluteFill style={{ transform: `scale(${cam}) translate(${shake}px, ${shake * 0.6}px)` }}>
      <ChaosBG t={t} heat={0.3 + org * 0.4} />
      {/* superficie + luz rosa bajo la agenda */}
      <div style={{ position: 'absolute', left: 90, top: 880, width: 900, height: 330, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(243,165,188,.55), rgba(232,70,127,.18) 55%, transparent)`, opacity: kick }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 960, height: 2, background: 'linear-gradient(90deg, transparent, rgba(243,165,188,.5), transparent)' }} />
      <div style={{ position: 'absolute', inset: 0, perspective: 1400, perspectiveOrigin: '50% 40%' }}>
        {/* agenda sobre la superficie */}
        <div style={{ position: 'absolute', left: 540, top: 1030, transformStyle: 'preserve-3d', transform: `translate(-50%,-50%) rotateX(64deg) rotateZ(${-24 + t * 2.2}deg) translateZ(${(1 - kick) * 300}px)`, opacity: kick }}>
          <Agenda w={440} h={560} src={agendaSrc('alejandra')} />
        </div>
        {/* kicker */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 255, textAlign: 'center', transformStyle: 'preserve-3d', opacity: prog(t, 0.05, 0.3) }}>
          <Type3D text="Tener una agenda" size={76} face="#fff" side={C.hot} depth={8} step={1.6} spacing={-0.02} />
        </div>
        {/* NO */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', transformStyle: 'preserve-3d',
          opacity: (slamNo > 0 ? 1 : 0) * (1 - back * 0.7),
          transform: `translateZ(${(1 - slamNo) * 1100 - back * 520}px) rotateX(${(1 - slamNo) * 25}deg) rotateY(${-6 + back * 14}deg)` }}>
          <Type3D text="NO" size={340} face={C.hot} side={C.plum} depth={26} step={3} rotY={-4} />
        </div>
        {/* SIGNIFICA */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 650, textAlign: 'center', transformStyle: 'preserve-3d',
          opacity: (slamSig > 0 ? 1 : 0) * (1 - back * 0.7),
          transform: `translateZ(${(1 - slamSig) * 1300 - back * 520}px) rotateY(${back * 14}deg)` }}>
          <Type3D text="SIGNIFICA" size={168} face="#fff" side={C.plum} depth={20} step={3} />
        </div>
        {/* ORGANIZADO con profundidad */}
        {org > 0 && (
          <div style={{ position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', transformStyle: 'preserve-3d',
            transform: `translateZ(${(1 - org) * 1600}px) rotateX(${(1 - org) * -18}deg) skewX(${glitch * 0.3}deg)` }}>
            <div style={{ position: 'absolute', left: glitch, right: -glitch, top: 0, textAlign: 'center', opacity: 0.7, mixBlendMode: 'screen' }}>
              <Type3D text="ORGANIZADO" size={150} face={C.hot} side={C.hot} depth={1} />
            </div>
            <Type3D text="ORGANIZADO" size={150} face={C.white} side={C.hot} depth={30} step={3.4} rotY={-5} rotX={4} />
          </div>
        )}
      </div>
      {/* viñeta de cine */}
      <AbsoluteFill style={{ background: 'radial-gradient(120% 90% at 50% 45%, transparent 50%, rgba(0,0,0,.6))' }} />
    </AbsoluteFill>
  );
};
