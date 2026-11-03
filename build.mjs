// Assemble les fichiers de src/ en bundles dans dist/ (version lisible + version minifiée).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { minify } from 'terser';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const bundles = {
  // Page d'accueil — l'ordre compte : le loader prépare la page, les autres scripts s'y branchent.
  home: ['src/home/loader.js', 'src/home/stickers.js', 'src/home/eye.js', 'src/home/showreel.js', 'src/home/words.js', 'src/home/parallax.js', 'src/home/reveal.js'],
  // Toutes les pages
  global: ['src/global/cursor.js'],
};

mkdirSync('dist', { recursive: true });
for (const [name, files] of Object.entries(bundles)) {
  const banner = `/*! The Lazy Dog — ${name}.js v${pkg.version} — github.com/Cetezer44/thelazydog-webflow-custom-code */\n`;
  const code = files.map((f) => `/* --- ${f} --- */\n${readFileSync(f, 'utf8')}`).join('\n');
  writeFileSync(`dist/${name}.js`, banner + code);
  const min = await minify(code, { compress: true, mangle: true, format: { comments: false } });
  writeFileSync(`dist/${name}.min.js`, banner + min.code + '\n');
  console.log(`dist/${name}.min.js  ${(min.code.length / 1024).toFixed(1)} Ko`);
}
