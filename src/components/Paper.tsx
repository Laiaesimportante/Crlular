import React from 'react';
import { C, FONT } from '../theme';

const TASKS = ['llamar', 'comprar', 'entregar', 'revisar', 'pagar', 'enviar', 'agendar', 'ordenar', 'pedir', 'cotizar', 'reunión', 'estudiar'];

type Props = {
  w?: number; h?: number; seed?: number; title?: string; tint?: 'paper' | 'pink' | 'kraft';
  checked?: number[]; rows?: number; style?: React.CSSProperties; strike?: boolean; accent?: number;
};
/** Hoja/lista de pendientes dibujada en CSS (no es una foto: elemento gráfico). */
export const Paper: React.FC<Props> = ({ w = 360, h = 470, seed = 0, title = 'PENDIENTES', tint = 'paper', checked = [], rows = 7, style, strike, accent }) => {
  const bg = tint === 'pink' ? C.blush : tint === 'kraft' ? C.beige : C.white;
  return (
    <div style={{ width: w, height: h, background: bg, borderRadius: 10, padding: `${w * 0.09}px ${w * 0.08}px`, boxSizing: 'border-box',
      boxShadow: '0 22px 40px rgba(0,0,0,0.32), 0 2px 0 rgba(255,255,255,0.6) inset', fontFamily: FONT, color: C.ink, overflow: 'hidden', position: 'relative', ...style }}>
      <div style={{ fontSize: w * 0.085, fontWeight: 900, letterSpacing: '0.04em', color: C.hot, marginBottom: w * 0.05 }}>{title}</div>
      {Array.from({ length: rows }, (_, i) => {
        const done = checked.includes(i);
        const isAcc = accent === i;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: w * 0.04, height: (h - w * 0.3) / rows, borderBottom: `2px solid rgba(139,116,102,0.22)`,
            background: isAcc ? 'rgba(232,70,127,0.16)' : undefined, margin: isAcc ? `0 -${w * 0.03}px` : undefined, padding: isAcc ? `0 ${w * 0.03}px` : undefined }}>
            <div style={{ width: w * 0.06, height: w * 0.06, border: `3px solid ${done || isAcc ? C.hot : C.taupe}`, borderRadius: 4, background: done ? C.hot : 'transparent', flex: 'none' }} />
            <div style={{ fontSize: w * 0.07, fontWeight: 700, color: C.ink, opacity: done ? 0.45 : 0.85, textDecoration: done || strike ? 'line-through' : 'none', textTransform: 'capitalize' }}>
              {TASKS[(seed + i * 5) % TASKS.length]}
            </div>
          </div>
        );
      })}
    </div>
  );
};
