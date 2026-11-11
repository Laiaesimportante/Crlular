// Fuente única de verdad del guion y los tiempos ESTIMADOS de la locución.
// Cuando exista el audio real, ajusta SYL_PER_SEC o edita src/voice.json (start/end por palabra) y vuelve a renderizar.
import fs from 'node:fs';

const SYL_PER_SEC = 5.3; // ritmo reflexivo/conversacional (≈ 150 palabras/min en español)
const START = 0.45;      // pequeño aire antes de la primera palabra
const GAP_FRAG = 0.45;   // pausa entre fragmentos
const TAIL = 3.4;        // cierre visual (CTA) después de la voz

// w = [palabra, sílabas, pausa_después_seg, énfasis?]
const F = [
  { id: 1, scene: 1, tone: 'Afirmación seca y segura, descendente; sin pregunta. Casi un sentencia.',
    blocks: [3, 2, 2, 1],
    w: [['Tener',2,0],['una',2,0],['agenda',3,0.05],['no',1,0.04,'E'],['significa',4,0.12,'E'],['que',1,0],['seas',2,0.16],['organizado.',5,0,'E']] },
  { id: 2, scene: 2, tone: 'Ritmo ágil, ligera aceleración al enumerar; cansancio/ironía suave en "sin haber avanzado".',
    blocks: [3, 3, 2, 3, 3, 3],
    w: [['Puedes',2,0],['tener',2,0],['mil',1,0,'E'],['listas,',2,0.3,'E'],['escribir',3,0],['todos',2,0],['tus',1,0],['pendientes',3,0.14,'E'],['y',1,0],['aun',2,0],['así',2,0.08],['terminar',3,0],['el',1,0],['día',2,0.1],['sin',1,0],['haber',2,0],['avanzado.',4,0,'E']] },
  { id: 3, scene: 3, tone: 'Cambio de energía: más cálida y abierta, ritmo fluido; sube ligeramente en "cumplir".',
    blocks: [3, 3, 3, 3, 3, 2],
    w: [['El',1,0],['verdadero',4,0],['cambio',2,0],['comienza',3,0.12,'E'],['cuando',2,0],['dejas',2,0],['de',1,0],['llenar',2,0],['páginas',3,0.3,'E'],['y',1,0],['empiezas',3,0],['a',1,0],['cumplir',2,0.06,'E'],['lo',1,0],['que',1,0],['te',1,0],['propones.',3,0,'E']] },
  { id: 4, scene: 4, tone: 'Reflexiva, más lenta y pausada; peso en "prioridad". Tono de consejo sincero.',
    blocks: [3, 3, 3, 3, 3],
    w: [['Organizarte',4,0],['no',1,0],['es',1,0],['hacerlo',3,0],['todo,',2,0.35,'E'],['es',1,0],['aprender',3,0],['a',1,0],['darle',2,0],['prioridad',4,0.08,'E'],['a',1,0],['lo',1,0],['que',1,0],['realmente',3,0],['importa.',3,0,'E']] },
  { id: 5, scene: 5, tone: 'Pregunta directa al espectador, cercana y desafiante sin juzgar; entonación ascendente final y última palabra más lenta.',
    blocks: [2, 3, 3, 2],
    w: [['Y',1,0],['tú,',1,0.22],['¿estás',2,0],['organizando',5,0],['tus',1,0],['días',2,0.12],['o',1,0],['solamente',4,0],['anotando',4,0.04],['cosas?',2,0,'E']] },
];

const r = (x) => Math.round(x * 100) / 100;
let t = START;
const frags = [];
for (const f of F) {
  const fs0 = t;
  const words = [];
  for (const [text, syl, pause, emph] of f.w) {
    const slow = emph ? 1.1 : 1.0;                       // palabras enfatizadas, ligeramente más largas
    const d = (syl / SYL_PER_SEC) * slow + 0.02;
    words.push({ text, start: r(t), end: r(t + d), emph: !!emph, pauseAfter: pause });
    t += d + pause;
  }
  // blocks (subtítulos)
  const blocks = [];
  let i = 0;
  for (const n of f.blocks) { blocks.push({ from: i, to: i + n - 1 }); i += n; }
  const text = f.w.map((x) => x[0]).join(' ');
  frags.push({ id: f.id, scene: f.scene, text, tone: f.tone, start: r(fs0), end: r(t), words, blocks });
  t += GAP_FRAG;
}
const speechEnd = frags[frags.length - 1].end;
const total = r(speechEnd + TAIL);
fs.writeFileSync('src/voice.json', JSON.stringify({ fps: 30, speechEnd, total, frags }, null, 1));

// --- TXT entregables ---
fs.mkdirSync('entregables', { recursive: true });
fs.writeFileSync('entregables/GUION_VOZ_JIREH_DIA01.txt',
  frags.map((f) => f.text).join('\n\n') + '\n');

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(2).padStart(5, '0')}`;
let o = 'TIMING_VOZ_JIREH_DIA01 — Jireh Accessories · «La verdad incómoda sobre organizarse»\n';
o += '='.repeat(78) + '\n';
o += `ESTIMACIÓN (el audio real aún no existe). Velocidad base: ${SYL_PER_SEC} sílabas/s (~150 palabras/min), conversacional y reflexiva.\n`;
o += `Voz: joven, segura, conversacional, reflexiva, con carácter; sin tono publicitario.\n`;
o += `Locución estimada: ${mmss(START)} → ${mmss(speechEnd)} (${r(speechEnd - START)} s). Video total con cierre visual: ${total} s.\n`;
o += 'El guion cabe de forma natural en el objetivo de 30–40 s; no fue necesario acelerar la voz.\n';
o += 'Si tu locución real dura distinto, edita src/voice.json (start/end por palabra) o cambia SYL_PER_SEC y ejecuta `npm run timing`.\n\n';
for (const f of frags) {
  o += `FRAGMENTO ${f.id} · Escena ${f.scene}\n`;
  o += `  Inicio: ${mmss(f.start)}   Fin: ${mmss(f.end)}   Duración: ${r(f.end - f.start).toFixed(2)} s\n`;
  o += `  Texto exacto: «${f.text}»\n`;
  o += `  Entonación: ${f.tone}\n`;
  o += `  Énfasis: ${f.words.filter((w) => w.emph).map((w) => w.text.toUpperCase().replace(/[.,?]/g, '')).join(', ')}\n`;
  const pauses = f.words.filter((w) => w.pauseAfter >= 0.1).map((w) => `${w.pauseAfter.toFixed(2)} s tras «${w.text}»`);
  o += `  Pausas internas: ${pauses.length ? pauses.join('; ') : 'ninguna'}\n`;
  const nxt = frags[f.id];
  o += `  Pausa posterior: ${nxt ? GAP_FRAG.toFixed(2) + ' s' : 'cierre visual de ' + TAIL + ' s (sin voz): «Síguenos para más ideas de organización»'}\n`;
  o += '  Palabra por palabra: ' + f.words.map((w) => `${w.text}[${w.start.toFixed(2)}]`).join(' ') + '\n\n';
}
fs.writeFileSync('entregables/TIMING_VOZ_JIREH_DIA01.txt', o);

// tabla para consola / markdown
let tb = '| # | Escena | Inicio | Fin | Dur. | Texto | Énfasis |\n|---|---|---|---|---|---|---|\n';
for (const f of frags) tb += `| ${f.id} | ${f.scene} | ${f.start.toFixed(2)} s | ${f.end.toFixed(2)} s | ${(f.end - f.start).toFixed(2)} s | ${f.text} | ${f.words.filter((w) => w.emph).map((w) => w.text.replace(/[.,?]/g, '').toUpperCase()).join(', ')} |\n`;
fs.writeFileSync('entregables/TABLA_SINCRONIZACION.md', tb);
console.log(tb, '\nspeechEnd', speechEnd, 'total', total);

// ---------- CUES (golpes visuales + diseño sonoro), derivadas de las palabras ----------
const wS = (f, i) => frags[f - 1].words[i].start;
const fS = (f) => frags[f - 1].start;
const cues = {
  // impactos tipográficos / golpes (flash + hit)
  hits: [0.0, wS(1,3), wS(1,4), wS(1,7), wS(2,3), wS(2,7), fS(3) - 0.2, wS(3,12), wS(4,9), wS(4,14), fS(5) - 0.05, wS(5,3), wS(5,9)],
  // whooshes (transiciones y pasos de letras por cámara)
  whooshes: [fS(2) - 0.38, wS(2,4) - 0.1, wS(2,7) - 0.25, wS(2,12), fS(3) - 0.5, wS(3,8) - 0.1, fS(4) - 0.5, wS(4,9) - 0.25, wS(4,12), fS(5) - 0.5, speechEnd + 0.1],
  // papel (aparición/ordenado de listas)
  paper: [wS(2,2), wS(2,2) + 0.12, wS(2,2) + 0.22, wS(2,3) + 0.08, wS(2,3) + 0.22, wS(2,5), wS(2,6), wS(2,9), wS(3,3), wS(3,4), wS(3,5), wS(3,6), wS(3,7), wS(4,0)],
  // clicks UI (checks, tags)
  clicks: [wS(1,0) - 0.05, wS(3,9), wS(3,11), wS(4,5), wS(4,13), wS(5,6), speechEnd + 0.9, speechEnd + 1.6],
  // escritura (pluma)
  typing: [wS(4,0) + 0.1, wS(4,0) + 0.55, wS(4,1) + 0.2, wS(4,2) + 0.35, wS(4,3) + 0.2, wS(4,4) - 0.1],
  // ding de tarea completada
  dings: [wS(4,14) + 0.45, wS(3,12) + 0.3],
  // cambio de intensidad musical
  tensionEnd: fS(3) - 0.2, // desde aquí la música se vuelve positiva
  total,
};
for (const k of Object.keys(cues)) if (Array.isArray(cues[k])) cues[k] = cues[k].map(r);
fs.writeFileSync('src/cues.json', JSON.stringify(cues, null, 1));

// ---------- Línea de tiempo del VIDEO (para montar el audio en otro programa) + SRT ----------
const scn = [
  ['1', 'LA FRASE QUE ROMPE LA CREENCIA', 0, fS(2) - 0.15, 'Impacto de música en 0:00; golpes en NO / SIGNIFICA / ORGANIZADO'],
  ['2', 'EL PROBLEMA', fS(2) - 0.35, fS(3) - 0.15, 'Whip pan de entrada; whooshes de LISTAS/TAREAS/PENDIENTES; papeles'],
  ['3', 'EL CAMBIO DE MENTALIDAD', fS(3) - 0.35, fS(4) - 0.15, 'Impacto + cambio de música a positiva; listas se ordenan; check en «cumplir»'],
  ['4', 'LA REFLEXIÓN', fS(4) - 0.35, fS(5) - 0.15, 'Zoom de entrada; calendario; ding de tarea completada'],
  ['5', 'INTERACCIÓN Y MARCA', fS(5) - 0.35, total, 'Match cut al magenta; pregunta; logo y CTA en silencio de voz'],
];
let ex = '\n' + '='.repeat(78) + '\nESCENAS DEL VIDEO (para colocar música/SFX y la voz en tu editor)\n' + '='.repeat(78) + '\n';
ex += `Coloca el archivo de VOZ de modo que su primera palabra («Tener») caiga en ${mmss(START)} (${START} s) y ajusta el resto con la tabla de arriba.\n`;
ex += 'Cambio de intensidad de la música: tensión 0:00 → ' + mmss(cues.tensionEnd) + '; sensación positiva desde ahí.\n\n';
for (const [n, name, a, b, note] of scn) ex += `Escena ${n} · ${name}\n  ${mmss(a)} → ${mmss(b)}  (${r(b - a)} s)\n  Sonido: ${note}\n\n`;
const lst = (a, label) => `  ${label}: ` + a.map((x) => mmss(x)).join('  ') + '\n';
ex += 'MARCAS DE SONIDO (SFX)\n' + lst(cues.hits, 'Golpes/impactos') + lst(cues.whooshes, 'Whooshes') + lst(cues.paper, 'Papel') + lst(cues.clicks, 'Clicks') + lst(cues.typing, 'Escritura') + lst(cues.dings, 'Ding tarea completada');
fs.appendFileSync('entregables/TIMING_VOZ_JIREH_DIA01.txt', ex);

const srtT = (s) => { const ms = Math.round(s * 1000); const p = (n, l = 2) => String(n).padStart(l, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
let srt = '', k = 1;
for (const f of frags) f.blocks.forEach((b, i) => {
  const ws = f.words.slice(b.from, b.to + 1), nb = f.blocks[i + 1];
  const end = nb ? f.words[nb.from].start - 0.02 : ws[ws.length - 1].end + 0.25;
  srt += `${k++}\n${srtT(ws[0].start)} --> ${srtT(end)}\n${ws.map((w) => w.text).join(' ').toUpperCase()}\n\n`;
});
fs.writeFileSync('entregables/SUBTITULOS_JIREH_DIA01.srt', srt);
