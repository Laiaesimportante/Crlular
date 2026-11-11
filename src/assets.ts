// RECURSOS REALES DE JIREH (fotos recortadas solo del fondo sobrante; los diseños no se alteran).
export const LOGO_FILE: string | null = 'logo-jireh.png';      // public/assets/
export const VOICE_FILE: string | null = 'voz.wav';                   // p. ej. 'voz.mp3' en public/audio/ → se mezcla automáticamente
export const AGENDAS = {
  alejandra: 'cover_alejandra.jpg', yus: 'cover_yus.jpg', camilo: 'cover_camilo.jpg', valeria: 'cover_valeria.jpg', samu: 'cover_samu.jpg',
  openLuz: 'open_luz.jpg', openLaura: 'open_laura.jpg', openEstadio: 'open_estadio.jpg', openMillos: 'open_millos.jpg',
};
export const CLIP_LUISA = 'clip_luisa.mp4'; // video real: agenda personalizada empaquetada
export const agendaSrc = (k: keyof typeof AGENDAS) => `assets/agendas/${AGENDAS[k]}`;
