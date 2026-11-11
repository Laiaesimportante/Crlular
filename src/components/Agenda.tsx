import React from 'react';
import { Img, staticFile } from 'remotion';
import { C, FONT } from '../theme';


/** Agenda cerrada. Si hay foto real (assets.ts) se usa tal cual; si no, agenda vectorial NEUTRA (sin portada inventada). */
export const Agenda: React.FC<{ w?: number; h?: number; src?: string; color?: string; style?: React.CSSProperties; depth?: number }> = ({
  w = 520, h = 700, src, color = C.pink, style, depth = 18,
}) => {
  return (
    <div style={{ position: 'relative', width: w, height: h, transformStyle: 'preserve-3d', ...style }}>
      {/* grosor de páginas (capas Z) */}
      {Array.from({ length: depth }, (_, i) => (
        <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '10px 22px 22px 10px', background: i % 2 ? C.cream : C.white,
          transform: `translateZ(${-i * 1.6 - 2}px)`, border: '1px solid rgba(139,116,102,.3)' }} />
      ))}
      {src && <Img src={staticFile(src)} style={{ position: 'absolute', inset: 0, width: w, height: h, objectFit: 'cover', borderRadius: 14, boxShadow: '0 40px 60px rgba(0,0,0,.4)' }} />}
      {/* tapa vectorial (solo si no hay foto real) */}
      {!src && <div style={{ position: 'absolute', inset: 0, borderRadius: '10px 22px 22px 10px', background: `linear-gradient(135deg, ${color}, #e98fae)`,
        boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.18), 0 40px 60px rgba(0,0,0,.35)' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: w * 0.09, borderRadius: '10px 0 0 10px', background: 'linear-gradient(90deg, rgba(0,0,0,.18), rgba(255,255,255,.12) 60%, transparent)' }} />
        {/* elástico */}
        <div style={{ position: 'absolute', right: w * 0.12, top: 0, bottom: 0, width: w * 0.026, background: C.white, opacity: 0.92 }} />
        {/* brillo suave */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: 'linear-gradient(120deg, rgba(255,255,255,.28), transparent 38%)' }} />
      </div>}
    </div>
  );
};

type OpenProps = {
  w?: number; h?: number; flip?: number; tasks?: { t: string; done?: number; star?: boolean }[]; title?: string; scribble?: number; style?: React.CSSProperties;
};
/** Agenda abierta con una hoja que se pasa (flip 0→1). Contenido: tareas con check animable. */
export const AgendaOpen: React.FC<OpenProps> = ({ w = 900, h = 640, flip = 0, tasks = [], title = 'HOY', scribble = 1, style }) => {
  const pw = w / 2;
  const page = (side: 'l' | 'r', content?: React.ReactNode, extra?: React.CSSProperties) => (
    <div style={{ position: 'absolute', top: 0, [side === 'l' ? 'left' : 'right']: 0, width: pw, height: h, background: C.white,
      borderRadius: side === 'l' ? '16px 0 0 16px' : '0 16px 16px 0', overflow: 'hidden', fontFamily: FONT, ...extra,
      boxShadow: 'inset 0 0 0 1px rgba(139,116,102,.25)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 ${h / 11 - 2}px, rgba(139,116,102,.25) ${h / 11 - 2}px ${h / 11}px)`, backgroundPosition: `0 ${h * 0.16}px` }} />
      <div style={{ position: 'absolute', inset: 0, background: side === 'l' ? 'linear-gradient(270deg, rgba(139,116,102,.28), transparent 18%)' : 'linear-gradient(90deg, rgba(139,116,102,.28), transparent 18%)' }} />
      {content}
    </div>
  );
  const rows = (
    <div style={{ position: 'absolute', left: pw * 0.12, right: pw * 0.08, top: h * 0.06 }}>
      <div style={{ fontSize: 40, fontWeight: 900, color: C.hot, letterSpacing: '.06em', height: h * 0.1 }}>{title}</div>
      {tasks.map((k, i) => (
        <div key={i} style={{ height: h / 11, display: 'flex', alignItems: 'center', gap: 18, fontSize: 34, fontWeight: k.star ? 900 : 600, color: C.ink }}>
          <div style={{ width: 34, height: 34, border: `4px solid ${k.star ? C.hot : C.taupe}`, borderRadius: 8, position: 'relative', background: (k.done ?? 0) > 0.95 ? C.hot : 'transparent', flex: 'none' }}>
            {(k.done ?? 0) > 0 && (
              <svg viewBox="0 0 40 40" style={{ position: 'absolute', left: -2, top: -8, width: 46, height: 46 }}>
                <path d="M6 22 L16 32 L36 6" fill="none" stroke={(k.done ?? 0) > 0.95 ? '#fff' : C.hot} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50 * (1 - (k.done ?? 0))} />
              </svg>
            )}
          </div>
          <span style={{ textTransform: 'capitalize', opacity: (k.done ?? 0) > 0.95 ? 0.5 : 1, textDecoration: (k.done ?? 0) > 0.95 ? 'line-through' : 'none' }}>{k.t}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ position: 'relative', width: w, height: h, perspective: 2200, transformStyle: 'preserve-3d', filter: 'drop-shadow(0 34px 38px rgba(80,50,60,.35))', ...style }}>
      {page('l', undefined, { opacity: 1 })}
      {page('r', rows)}
      {/* hoja que se pasa */}
      <div style={{ position: 'absolute', right: 0, top: 0, width: pw, height: h, transformOrigin: 'left center', transform: `rotateY(${-flip * 178}deg)`, transformStyle: 'preserve-3d', display: flip > 0 && flip < 1 ? 'block' : 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${C.cream}, ${C.white})`, borderRadius: '0 16px 16px 0', backfaceVisibility: 'hidden' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(270deg, ${C.cream}, ${C.white})`, borderRadius: '16px 0 0 16px', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }} />
      </div>
      <div style={{ position: 'absolute', left: pw - 3, top: 0, width: 6, height: h, background: 'rgba(139,116,102,.35)' }} />
    </div>
  );
};
