# Crlular — Jireh Accessories · Video 01 «La verdad incómoda sobre organizarse»

Proyecto editable en **Remotion** (React/TypeScript). 1080×1920 · 30 fps · ~36,7 s.

## Comandos
```
npm install
npm run timing   # regenera src/voice.json, src/cues.json y entregables/*.txt desde el guion
npm run audio    # música + SFX provisionales (python3 + numpy) → public/audio/musica_sfx.wav
npm run studio   # previsualizar
npm run render   # → out/JIREH_DIA01_verdad_incomoda.mp4   (si hace falta: --browser-executable=<chrome>)
node scripts/stills.mjs 70 130 ...   # revisar fotogramas sueltos sin renderizar todo
```

## Estructura
- `src/scenes/Scene1..5.tsx` — una escena por componente; `src/components/` — Type3D, Paper, PaperSwarm, Agenda, Calendar3D, Subtitles, Backgrounds.
- `src/timing.ts` + `src/voice.json` — tiempos por palabra (ESTIMADOS). Todo (subtítulos, animaciones, sonido) se ancla a ellos.
- `scripts/build-timing.mjs` — fuente del guion y de los tiempos.
- `entregables/` — GUION_VOZ_JIREH_DIA01.txt, TIMING_VOZ_JIREH_DIA01.txt, TABLA_SINCRONIZACION.md.

## Pendiente
1. **Fotos/videos reales de Jireh**: el repo no los traía. Se usa una agenda vectorial neutra (sin portada inventada). Copia las fotos a `public/assets/agendas/` y lístalas en `src/assets.ts` (`AGENDA_COVERS`); logo en `LOGO_FILE`.
2. **Voz**: guarda `public/audio/voz.mp3`, pon `VOICE_FILE = 'voz.mp3'` en `src/assets.ts`, ajusta `src/voice.json` a la duración real y renderiza de nuevo.
3. Clip real de «mano escribiendo» (no se simuló una grabación; la escena 4 usa un trazo vectorial).
