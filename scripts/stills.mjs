// Revisión visual barata: renderiza fotogramas sueltos (no el video completo). Uso: node scripts/stills.mjs 60 125 240 ...
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const browserExecutable = process.env.CHROME || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const comp = await selectComposition({ serveUrl, id: 'JirehDia01', browserExecutable, chromiumOptions: { gl: 'swiftshader' } });
for (const f of frames) {
  await renderStill({ composition: comp, serveUrl, frame: f, output: `out/still_${String(f).padStart(4, '0')}.jpg`, browserExecutable, imageFormat: 'jpeg', scale: 0.5, chromiumOptions: { gl: 'swiftshader' } });
  console.log('still', f);
}
