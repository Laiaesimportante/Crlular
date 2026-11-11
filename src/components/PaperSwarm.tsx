import React from 'react';
import { random } from 'remotion';
import { Paper } from './Paper';

const N = 26;
const KEEP = 5; // la lista que queda: la única prioridad
export const GRID = { cols: 4, rows: 2, cw: 214, ch: 272, scale: 0.5 };
type Item = { x: number; y: number; z: number; rx: number; ry: number; rz: number; sx: number; sy: number; sz: number; ph: number; s: number; tint: 'paper' | 'pink' | 'kraft'; spawn: number };

export const makeItems = (spawnAt: number): Item[] =>
  Array.from({ length: N }, (_, i) => ({
    x: (random(`px${i}`) - 0.5) * 1500, y: (random(`py${i}`) - 0.5) * 1250, z: -1900 + random(`pz${i}`) * 2500,
    rx: (random(`rx${i}`) - 0.5) * 70, ry: (random(`ry${i}`) - 0.5) * 90, rz: (random(`rz${i}`) - 0.5) * 80,
    sx: (random(`sx${i}`) - 0.5) * 24, sy: (random(`sy${i}`) - 0.5) * 24, sz: (random(`sz${i}`) - 0.5) * 30,
    ph: random(`ph${i}`) * 6.28, s: 0.8 + random(`ss${i}`) * 0.7,
    tint: i % 5 === 0 ? 'pink' : i % 7 === 0 ? 'kraft' : 'paper', spawn: i < 7 ? 0 : spawnAt + (i - 7) * 0.075,
  }));

/**
 * Enjambre de listas. `t` tiempo absoluto, `order` 0..1 (caos→cuadrícula), `keep` 0..1 (resto desaparece y queda UNA prioridad), `base` t de referencia de movimiento.
 */
export const PaperSwarm: React.FC<{ items: Item[]; t: number; order?: number; keep?: number; appear?: number; speed?: number; cx?: number; cy?: number }> = ({ items, t, order = 0, keep = 0, appear = 1, speed = 1, cx: ox = 540, cy: oy = 700 }) => {
  const e = order * order * (3 - 2 * order); // smoothstep
  return (
    <div style={{ position: 'absolute', left: ox, top: oy, width: 0, height: 0, transformStyle: 'preserve-3d' }}>
      {items.map((it, i) => {
        const age = (t - it.spawn) * appear;
        if (age < 0) return null;
        const pop = Math.min(1, age / 0.18);
        const tt = t * speed;
        const cx = it.x + Math.sin(tt * 0.8 + it.ph) * 50, cy = it.y + Math.cos(tt * 0.7 + it.ph * 1.3) * 60 + age * 0, cz = it.z + Math.sin(tt * 0.5 + it.ph) * 60;
        const crx = it.rx + it.sx * tt, cry = it.ry + it.sy * tt, crz = it.rz + it.sz * tt * 0.6;
        const inGrid = i < GRID.cols * GRID.rows;
        const col = i % GRID.cols, row = Math.floor(i / GRID.cols);
        const gx = (col - (GRID.cols - 1) / 2) * GRID.cw, gy = (row - (GRID.rows - 1) / 2) * GRID.ch;
        const L = (a: number, b: number) => a + (b - a) * e;
        // los que no están en la cuadrícula se alejan y se desvanecen
        const x = inGrid ? L(cx, gx) : L(cx, cx * 1.6), y = inGrid ? L(cy, gy) : L(cy, cy * 1.6 - 400), z = inGrid ? L(cz, 0) : L(cz, -2600);
        const rx = inGrid ? L(crx, 0) : crx, ry = inGrid ? L(cry, 0) : cry, rz = inGrid ? L(crz, 0) : crz;
        const sc = pop * L(it.s, inGrid ? GRID.scale : it.s);
        let op = inGrid ? 1 : 1 - e;
        if (inGrid && i !== KEEP) op = 1 - keep;
        if (op <= 0.01) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: -180, top: -235, transformStyle: 'preserve-3d', opacity: op,
            transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})` }}>
            <Paper seed={i * 3} tint={it.tint} title={i % 3 === 0 ? 'PENDIENTES' : i % 3 === 1 ? 'LISTA' : 'TAREAS'} checked={e > 0.9 && inGrid && i !== KEEP ? [0, 1] : []} accent={i === KEEP && keep > 0 ? 0 : undefined} />
          </div>
        );
      })}
    </div>
  );
};
