import React from 'react';
import { Img, staticFile } from 'remotion';

const shadow = '0 34px 50px rgba(60,35,45,.38)';
/** Foto real de producto en tarjeta (sin alterar el diseño; solo recorte/encuadre). */
export const PhotoCard: React.FC<{ src: string; w: number; h: number; style?: React.CSSProperties; pos?: string }> = ({ src, w, h, style, pos = 'center' }) => (
  <Img src={staticFile(src)} style={{ width: w, height: h, objectFit: 'cover', objectPosition: pos, borderRadius: 18, boxShadow: shadow, display: 'block', ...style }} />
);

/** Pasar página entre dos fotos reales de la agenda abierta (flip 0→1 alrededor del lomo izquierdo). */
export const PageTurn: React.FC<{ a: string; b: string; flip: number; w: number; h: number }> = ({ a, b, flip, w, h }) => (
  <div style={{ position: 'relative', width: w, height: h, perspective: 2200 }}>
    <PhotoCard src={b} w={w} h={h} style={{ position: 'absolute', inset: 0 }} />
    {flip < 0.98 && (
      <div style={{ position: 'absolute', inset: 0, transformOrigin: 'left center', transform: `rotateY(${-flip * 96}deg)`, transformStyle: 'preserve-3d' }}>
        <PhotoCard src={a} w={w} h={h} style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: `linear-gradient(90deg, rgba(0,0,0,${flip * 0.5}), rgba(0,0,0,${flip * 0.1}))` }} />
      </div>
    )}
  </div>
);
