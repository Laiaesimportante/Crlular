import React from 'react';
import { C, FONT } from '../theme';

/** Calendario de escritorio 3D (capas en Z). `hi` = día prioritario resaltado, `ring` 0..1 anima el círculo. */
export const Calendar3D: React.FC<{ w?: number; h?: number; hi?: number; ring?: number; check?: number; style?: React.CSSProperties }> = ({ w = 640, h = 700, hi = 14, ring = 0, check = 0, style }) => {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const cw = (w - 80) / 7, ch = (h - 250) / 5;
  const hiIdx = hi - 1 + 2; // el día 1 cae en la 3ª columna
  const hr = Math.floor(hiIdx / 7), hc = hiIdx % 7;
  return (
    <div style={{ position: 'relative', width: w, height: h, transformStyle: 'preserve-3d', ...style }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: 26, background: i % 2 ? C.beige : C.cream, transform: `translateZ(${-(i + 1) * 3}px)` }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: C.white, boxShadow: '0 40px 60px rgba(80,50,60,.28)', overflow: 'hidden', fontFamily: FONT }}>
        <div style={{ height: 120, background: C.hot, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 54, fontWeight: 900, letterSpacing: '.18em' }}>ESTA SEMANA</div>
        <div style={{ display: 'flex', padding: '26px 40px 0', color: C.taupe, fontWeight: 800, fontSize: 28 }}>
          {days.map((d, i) => <div key={i} style={{ width: cw, textAlign: 'center' }}>{d}</div>)}
        </div>
        <div style={{ position: 'relative', margin: '8px 40px 0', height: ch * 5 }}>
          {Array.from({ length: 30 }, (_, i) => {
            const idx = i + 2, r = Math.floor(idx / 7), c = idx % 7;
            const on = i + 1 === hi;
            return <div key={i} style={{ position: 'absolute', left: c * cw, top: r * ch, width: cw, height: ch, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: on ? C.ink : 'rgba(43,26,39,.55)' }}>{i + 1}</div>;
          })}
          {/* círculo de prioridad que se dibuja */}
          <svg style={{ position: 'absolute', left: hc * cw - 12, top: hr * ch - 12, width: cw + 24, height: ch + 24, overflow: 'visible' }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <ellipse cx="50" cy="50" rx="44" ry="42" fill={`rgba(232,70,127,${0.16 * check})`} stroke={C.hot} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - ring} transform="rotate(-100 50 50)" />
            <path d="M28 52 L44 68 L74 30" fill="none" stroke={C.hot} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - check} />
          </svg>
        </div>
      </div>
    </div>
  );
};
