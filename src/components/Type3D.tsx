import React from 'react';
import { FONT } from '../theme';

type Props = {
  text: string; size: number; face?: string; side?: string; depth?: number; step?: number;
  rotX?: number; rotY?: number; rotZ?: number; spacing?: number; weight?: number;
  gradient?: string; style?: React.CSSProperties;
};
/** Tipografía extruida con capas reales en Z (CSS 3D). El padre debe tener perspective + preserve-3d. */
export const Type3D: React.FC<Props> = ({
  text, size, face = '#fff', side = '#2a1a27', depth = 14, step = 2.2,
  rotX = 0, rotY = 0, rotZ = 0, spacing = -0.035, weight = 900, gradient, style,
}) => {
  const base: React.CSSProperties = {
    fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: 0.9,
    letterSpacing: `${spacing}em`, whiteSpace: 'nowrap', textTransform: 'uppercase',
  };
  return (
    <div style={{ display: 'inline-block', position: 'relative', transformStyle: 'preserve-3d',
      transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`, ...style }}>
      {Array.from({ length: depth }, (_, k) => depth - k).map((i) => (
        <div key={i} style={{ ...base, position: 'absolute', left: 0, top: 0, color: side,
          transform: `translateZ(${-i * step}px)`, filter: i === depth ? undefined : undefined }}>{text}</div>
      ))}
      <div style={{ ...base, position: 'relative', color: face,
        ...(gradient ? { background: gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : {}) }}>{text}</div>
    </div>
  );
};
