import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT, SAFE } from '../theme';
import { ChaosBG } from '../components/Backgrounds';
import { Type3D } from '../components/Type3D';
import { Agenda } from '../components/Agenda';
import { agendaSrc } from '../assets';
import { PaperSwarm, makeItems } from '../components/PaperSwarm';
import { wStart, SCENE, fEnd } from '../timing';
import { prog, inOut, outExpo } from '../anim';

export const ITEMS = makeItems(wStart(2, 2) + 0.02);
/** cámara virtual que atraviesa el caos: acelera y se frena al final (speed ramp) */
export const camZ = (t: number) => {
  const a = t - SCENE.s2.from, d = SCENE.s2.to - SCENE.s2.from;
  const u = Math.min(1, Math.max(0, a / d));
  const e = u < 0.8 ? Math.pow(u / 0.8, 1.6) * 0.85 : 0.85 + 0.12 * (1 - Math.pow(1 - (u - 0.8) / 0.2, 2));
  return 1500 * e;
};

const Fly: React.FC<{ t: number; at: number; text: string; top: number; size: number; face: string; side: string; rot?: number; dir?: number; ghost?: boolean }> = ({ t, at, text, top, size, face, side, rot = 0, dir = 1, ghost }) => {
  const u = (t - at) / 1.25;
  if (u < 0 || u > 1) return null;
  const z = -2200 + u * u * 3300; // se acerca a cámara y la atraviesa
  const op = u < 0.12 ? u / 0.12 : u > 0.82 ? Math.max(0, (1 - u) / 0.18) : 1;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, textAlign: 'center', transformStyle: 'preserve-3d', opacity: op, transform: `translate3d(${dir * (1 - u) * -240}px, 0, ${z}px) rotateZ(${rot}deg) rotateY(${dir * (u - 0.5) * 24}deg)` }}>
      {ghost ? <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 0.9, letterSpacing: '-0.035em', color: 'transparent', WebkitTextStroke: '4px rgba(255,255,255,.45)', display: 'inline-block', transform: 'scaleX(.84)' }}>{text}</div>
        : <Type3D text={text} size={size} face={face} side={side} depth={16} step={3.2} />}
    </div>
  );
};

/** ESCENA 2 — el problema. Escritorio desordenado, listas flotando, palabras 3D, cámara atravesando. */
export const Scene2: React.FC<{ t: number }> = ({ t }) => {
  const cz = camZ(t);
  const shakeAmt = t > wStart(2, 3) && t < wStart(2, 3) + 0.3 ? Math.sin(t * 80) * 6 : 0;
  const prgIn = prog(t, wStart(2, 14) - 0.1, wStart(2, 14) + 0.5, outExpo);
  const stuck = 0.03 + 0.012 * Math.sin(t * 6);
  const calm = prog(t, wStart(2, 14), fEnd(2), inOut); // al final "sin haber avanzado": todo se apaga y se frena
  return (
    <AbsoluteFill style={{ transform: `translate(${shakeAmt}px, ${shakeAmt}px)` }}>
      <ChaosBG t={t * 1.6} heat={0.9 - calm * 0.5} />
      <div style={{ position: 'absolute', inset: 0, perspective: 1000, perspectiveOrigin: '50% 42%', filter: `saturate(${1 - calm * 0.35})` }}>
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `translateZ(${cz}px)` }}>
          {/* producto en el centro, rodeado de listas */}
          <div style={{ position: 'absolute', left: 512, top: 680, transformStyle: 'preserve-3d', transform: `translate(-50%,-50%) translateZ(-250px) rotateY(${-22 + t * 5}deg) rotateX(12deg) rotateZ(${-8}deg)` }}>
            <Agenda w={400} h={480} src={agendaSrc('yus')} />
          </div>
          <PaperSwarm items={ITEMS} t={t} speed={1 - calm * 0.8} cx={SAFE.cx} cy={680} />
        </div>
        {/* palabras 3D que atraviesan la cámara (no sufren el movimiento de cámara) */}
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
          <Fly t={t} at={wStart(2, 3) - 0.35} text="LISTAS" top={380} size={250} face={C.white} side={C.hot} rot={-5} ghost />
          <Fly t={t} at={wStart(2, 4) - 0.2} text="TAREAS" top={620} size={230} face={C.hot} side={C.plum} rot={4} dir={-1} />
          <Fly t={t} at={wStart(2, 7) - 0.45} text="PENDIENTES" top={470} size={180} face={C.white} side={C.hot} rot={-3} ghost />
        </div>
      </div>
      {/* barra de avance estancada: refuerza "sin haber avanzado" */}
      {prgIn > 0 && (
        <div style={{ position: 'absolute', left: 112, right: 168, top: 1030, opacity: prgIn, transform: `translateY(${(1 - prgIn) * 30}px)` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.hot, letterSpacing: '.08em', marginBottom: 12 }}>
            <span>AVANCE DEL DÍA</span><span>{Math.round(stuck * 100)}%</span>
          </div>
          <div style={{ height: 26, borderRadius: 13, background: 'rgba(255,255,255,.14)' }}>
            <div style={{ width: `${stuck * 100 * prgIn}%`, height: '100%', borderRadius: 13, background: C.hot }} />
          </div>
        </div>
      )}
      <AbsoluteFill style={{ background: 'radial-gradient(120% 90% at 50% 45%, transparent 45%, rgba(0,0,0,.65))' }} />
    </AbsoluteFill>
  );
};
