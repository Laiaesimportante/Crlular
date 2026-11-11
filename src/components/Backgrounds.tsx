import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, random } from 'remotion';
import { C } from '../theme';

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const x = Math.floor(random(`gx${f}`) * 256), y = Math.floor(random(`gy${f}`) * 256);
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none',
      backgroundImage: `url(${staticFile('assets/grain.png')})`, backgroundSize: '256px', backgroundPosition: `${x}px ${y}px` }} />
  );
};

/** MUNDO 1 — desorden: oscuro, contraste, rosa como luz de neón. */
export const ChaosBG: React.FC<{ t: number; heat?: number }> = ({ t, heat = 0.5 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(900px 900px at ${30 + 25 * Math.sin(t * 0.9)}% ${30 + 10 * Math.cos(t * 0.7)}%, rgba(232,70,127,${0.28 * heat + 0.1}), transparent 60%), radial-gradient(1000px 1200px at 85% 85%, rgba(243,165,188,0.14), transparent 60%), linear-gradient(180deg, ${C.night}, ${C.ink} 70%)` }}>
    {/* barras de luz diagonales para sensación de velocidad */}
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: 'absolute', left: `${((t * (60 + i * 25) + i * 380) % 1500) - 300}px`, top: -200, width: 3 + i * 3, height: 2400,
        background: 'linear-gradient(180deg, transparent, rgba(243,165,188,0.20), transparent)', transform: 'rotate(18deg)' }} />
    ))}
  </AbsoluteFill>
);

/** MUNDO 2 — organización: claro, suave, rosado/neutro. */
export const CleanBG: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(1100px 900px at ${25 + 4 * Math.sin(t * 0.4)}% 12%, #ffffff, transparent 62%), radial-gradient(900px 900px at 90% 70%, ${C.blush}, transparent 65%), linear-gradient(180deg, ${C.cream}, ${C.beige})` }}>
    <AbsoluteFill style={{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(139,116,102,0.22))' }} />
  </AbsoluteFill>
);
