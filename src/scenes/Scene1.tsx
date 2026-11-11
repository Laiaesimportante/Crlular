import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, SAFE, FONT, SERIF } from '../theme';
import { ChaosBG } from '../components/Backgrounds';
import { Type3D } from '../components/Type3D';
import { Agenda } from '../components/Agenda';
import { agendaSrc } from '../assets';
import { wStart } from '../timing';
import { prog, outExpo, pop } from '../anim';

/** ESCENA 1 — la frase que rompe la creencia. Aquí el texto 3D ES el subtítulo (sincronizado palabra a palabra; sin subtítulo extra). */
export const Scene1: React.FC<{ t: number }> = ({ t }) => {
  const frame = useCurrentFrame();
  const slamNo = prog(t, wStart(1, 3) - 0.16, wStart(1, 3) + 0.14, outExpo);
  const slamSig = prog(t, wStart(1, 4) - 0.16, wStart(1, 4) + 0.14, outExpo);
  const back = prog(t, wStart(1, 5) - 0.05, wStart(1, 5) + 0.25);                 // NO SIGNIFICA se hunde
  const que = prog(t, wStart(1, 5) - 0.05, wStart(1, 5) + 0.2, outExpo);
  const org = prog(t, wStart(1, 7) - 0.28, wStart(1, 7) + 0.22, outExpo);
  const strike = prog(t, wStart(1, 7) + 0.35, wStart(1, 7) + 0.75);
  const kick = prog(t, 0, 0.4, outExpo);
  const sh = (a: number, d: number) => (t > a && t < a + d ? Math.sin(t * 95) * 9 * (1 - (t - a) / d) : 0);
  const shake = sh(wStart(1, 3), 0.25) + sh(wStart(1, 4), 0.22) + sh(wStart(1, 7), 0.3);
  const glitch = org > 0 && org < 1 ? (1 - org) * 16 : 0;
  const kicker = ['TENER', 'UNA', 'AGENDA'];
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.7}px) scale(${1 + t * 0.012})` }}>
      <ChaosBG t={t} heat={0.35 + org * 0.5} />
      {/* cinta de precaución */}
      <div style={{ position: 'absolute', left: -100, top: 1085, width: 1400, height: 54, transform: 'rotate(-7deg)', background: `repeating-linear-gradient(115deg, ${C.hot} 0 34px, ${C.ink} 34px 68px)`, opacity: 0.95 * kick, borderTop: `3px solid ${C.ink}` }} />
      {/* superficie de luz bajo la agenda */}
      <div style={{ position: 'absolute', left: 112, top: 1090, width: 800, height: 300, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(255,31,158,.45), transparent)', opacity: kick }} />
      <div style={{ position: 'absolute', inset: 0, perspective: 1400, perspectiveOrigin: '50% 38%' }}>
        <div style={{ position: 'absolute', left: SAFE.cx, top: 1190, transformStyle: 'preserve-3d', transform: `translate(-50%,-50%) rotateX(62deg) rotateZ(${-22 + t * 2.2}deg) translateZ(${(1 - kick) * 300}px)`, opacity: kick }}>
          <Agenda w={420} h={520} src={agendaSrc('alejandra')} />
        </div>
        {/* TENER UNA AGENDA (sincronizado) */}
        <div style={{ position: 'absolute', left: 0, width: 1024, top: SAFE.y0 + 8, display: 'flex', justifyContent: 'center', gap: 20, opacity: 1 - back * 0.55 }}>
          {kicker.map((w, i) => {
            const p = pop(frame, 30, wStart(1, i) - 0.03, 12, 0.6);
            return <span key={w} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, letterSpacing: '-0.01em', color: '#fff', opacity: t >= wStart(1, i) - 0.03 ? 1 : 0, transform: `translateY(${(1 - p) * 40}px) scale(${0.6 + 0.4 * p}) scaleX(.86)` }}>{w}</span>;
          })}
        </div>
        {/* NO */}
        <div style={{ position: 'absolute', left: 0, width: 1024, top: SAFE.y0 + 78, textAlign: 'center', transformStyle: 'preserve-3d', opacity: (slamNo > 0 ? 1 : 0) * (1 - back * 0.75),
          transform: `translateZ(${(1 - slamNo) * 1100 - back * 560}px) rotateX(${(1 - slamNo) * 25}deg)` }}>
          <Type3D text="NO" size={320} face={C.hot} side={C.plum} depth={26} step={3} rotY={-4} />
        </div>
        {/* SIGNIFICA */}
        <div style={{ position: 'absolute', left: 0, width: 1024, top: SAFE.y0 + 380, textAlign: 'center', transformStyle: 'preserve-3d', opacity: (slamSig > 0 ? 1 : 0) * (1 - back * 0.75),
          transform: `translateZ(${(1 - slamSig) * 1300 - back * 560}px)` }}>
          <Type3D text="SIGNIFICA" size={190} face="#fff" side={C.plum} depth={20} step={3} />
        </div>
        {/* que seas */}
        <div style={{ position: 'absolute', left: 0, width: 1024, top: SAFE.y0 + 255, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 84, color: C.pink, opacity: que, transform: `translateY(${(1 - que) * 30}px)` }}>que seas</div>
        {/* ORGANIZADO */}
        {org > 0 && (
          <div style={{ position: 'absolute', left: 0, width: 1024, top: SAFE.y0 + 350, textAlign: 'center', transformStyle: 'preserve-3d', transform: `translateZ(${(1 - org) * 1600}px) rotateX(${(1 - org) * -18}deg) skewX(${glitch * 0.3}deg)` }}>
            <div style={{ position: 'absolute', left: glitch, right: -glitch, top: 0, textAlign: 'center', opacity: 0.8, mixBlendMode: 'screen' }}>
              <Type3D text="ORGANIZADO" size={160} face={C.hot} side={C.hot} depth={1} />
            </div>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Type3D text="ORGANIZADO" size={160} face="#fff" side={C.hot} depth={30} step={3.4} rotY={-5} rotX={4} />
              <div style={{ position: 'absolute', left: '4%', top: '50%', height: 18, width: `${strike * 92}%`, background: C.hot, borderRadius: 9, transform: 'rotate(-3deg)', boxShadow: `0 0 0 4px ${C.ink}` }} />
            </div>
          </div>
        )}
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,.6))' }} />
    </AbsoluteFill>
  );
};
