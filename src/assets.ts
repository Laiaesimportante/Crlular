// ─────────────────────────────────────────────────────────────────────────────
// RECURSOS REALES DE JIREH (pendiente de recibir).
// El repositorio no traía fotos/videos de las agendas. Mientras tanto la
// composición usa una agenda vectorial NEUTRA (sin portada ni diseño inventado).
// Para usar las agendas reales:
//   1. Copia las fotos (PNG/JPG, idealmente con fondo recortado) en public/assets/agendas/
//   2. Escribe aquí sus nombres, p. ej.:  export const AGENDA_COVERS = ['agenda-rosa.png', 'agenda-beige.png'];
// Cada <Agenda /> toma la foto indicada por su prop `photo` (índice) y la muestra tal cual, sin alterarla.
// ─────────────────────────────────────────────────────────────────────────────
export const AGENDA_COVERS: string[] = [];
export const LOGO_FILE: string | null = null; // p. ej. 'logo-jireh.png' en public/assets/
export const VOICE_FILE: string | null = null; // p. ej. 'voz.mp3' en public/audio/ → se mezcla automáticamente
