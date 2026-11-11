import React from 'react';
import { AbsoluteFill, staticFile, useCurrentFrame, random } from 'remotion';
import { C } from '../theme';

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const x = Math.floor(random(`gx${f}`) * 256), y = Math.floor(random(`gy${f}`) * 256);
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none',
      backgroundImage: `url(${staticFile('assets/grain.png')})`, backgroundSize: '256px', backgroundPosition: `${x}px ${y}px` }} />
  );
};

/** Trama de medios tonos (halftone) con máscara. */
export const Halftone: React.FC<{ color: string; size?: number; dot?: number; mask: string; opacity?: number; style?: React.CSSProperties }> = ({ color, size = 22, dot = 3.2, mask, opacity = 1, style }) => (
  <div style={{ position: 'absolute', inset: 0, opacity, backgroundImage: `radial-gradient(circle, ${color} ${dot}px, transparent ${dot + 0.6}px)`, backgroundSize: `${size}px ${size}px`,
    WebkitMaskImage: mask, maskImage: mask, ...style }} />
);

/** MUNDO 1 — DESORDEN: negro, magenta, trama, líneas rápidas. */
export const ChaosBG: React.FC<{ t: number; heat?: number }> = ({ t, heat = 0.5 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(900px 900px at ${25 + 30 * Math.sin(t * 0.9)}% ${25 + 10 * Math.cos(t * 0.7)}%, rgba(255,31,158,${0.22 * heat + 0.06}), transparent 62%), ${C.ink}` }}>
    <Halftone color="rgba(255,31,158,.55)" size={24} dot={3.4} mask="linear-gradient(200deg, #000 0%, transparent 45%)" opacity={0.5 + heat * 0.4} />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ position: 'absolute', left: `${((t * (90 + i * 40) + i * 330) % 1600) - 300}px`, top: -200, width: 2 + i * 2, height: 2400,
        background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.22), transparent)', transform: 'rotate(18deg)' }} />
    ))}
  </AbsoluteFill>
);

/** MUNDO 2 — ORDEN: papel blanco con rejilla editorial (columnas y marcas finas). */
export const CleanBG: React.FC<{ t?: number }> = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    {[64, 288, 512, 736, 960].map((x) => <div key={x} style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 2, background: 'rgba(10,9,12,.08)' }} />)}
    {[300, 560, 820, 1080, 1340].map((y) => <div key={y} style={{ position: 'absolute', top: y, left: 64, right: 120, height: 2, background: 'rgba(10,9,12,.08)' }} />)}
    <div style={{ position: 'absolute', left: 64, top: 1420, width: 10, height: 10, borderRadius: 5, background: C.hot }} />
  </AbsoluteFill>
);

/** CIERRE — magenta pleno del logo con trama negra. */
export const MagentaBG: React.FC = () => (
  <AbsoluteFill style={{ background: C.hot }}>
    <Halftone color="rgba(10,9,12,.30)" size={26} dot={4} mask="linear-gradient(160deg, #000 0%, transparent 55%)" />
    <Halftone color="rgba(255,255,255,.35)" size={26} dot={3} mask="linear-gradient(340deg, #000 0%, transparent 40%)" />
  </AbsoluteFill>
);
