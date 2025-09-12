/*
  Optimize key images with sharp: resize and convert to WebP.
  Run: node scripts/optimize-images.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const pub = path.join(root, 'public');

/** @type {Array<{src:string, out:string, width:number, quality:number}>} */
const jobs = [
  { src: 'backgroundIbogenics.jpg', out: 'backgroundIbogenics.webp', width: 1920, quality: 80 },
  { src: 'backgroundHero.jpg', out: 'backgroundHero.webp', width: 1920, quality: 80 },
  { src: 'handsTA.png', out: 'handsTA.webp', width: 1600, quality: 80 },
  { src: 'bottles.png', out: 'bottles.webp', width: 800, quality: 80 },
  { src: 'friends.jpg', out: 'friends.webp', width: 600, quality: 72 },
  { src: 'YOGA.jpg', out: 'YOGA.webp', width: 600, quality: 72 },
  { src: 'nature.jpg', out: 'nature.webp', width: 600, quality: 72 },
  { src: 'mesodose_immediate stress relief.jpg', out: 'mesodose_immediate stress relief.webp', width: 1400, quality: 78 },
  { src: 'Mesodose_better focus fewer worries.jpg', out: 'Mesodose_better focus fewer worries.webp', width: 1400, quality: 78 },
  { src: 'inner support lasting strenght.jpg', out: 'inner support lasting strenght.webp', width: 1400, quality: 78 },
  { src: 'DROPS.png', out: 'DROPS.webp', width: 1200, quality: 80 },
  { src: 'RB.png', out: 'RB.webp', width: 1200, quality: 80 },
  { src: 'CLARA.png', out: 'CLARA.webp', width: 1200, quality: 80 },
  { src: 'TANIA.png', out: 'TANIA.webp', width: 1200, quality: 80 },
  { src: 'LUCIA.png', out: 'LUCIA.webp', width: 1200, quality: 80 },
  { src: 'sleep-better-night.jpg', out: 'sleep-better-night.webp', width: 1200, quality: 78 },
  { src: 'drops.jpg', out: 'drops.webp', width: 1200, quality: 80 },
  { src: 'logo_white.png', out: 'logo_white.webp', width: 1200, quality: 80 },
];

async function optimizeOne({ src, out, width, quality }) {
  const inPath = path.join(pub, src);
  const outPath = path.join(pub, out);
  if (!fs.existsSync(inPath)) {
    console.warn(`[skip] not found: ${src}`);
    return;
  }
  try {
    const img = sharp(inPath).rotate();
    const meta = await img.metadata();
    const w = Math.min(width, meta.width || width);
    await img
      .resize({ width: w })
      .webp({ quality, effort: 5 })
      .toFile(outPath);
    const inStat = fs.statSync(inPath);
    const outStat = fs.statSync(outPath);
    console.log(`${src} -> ${out}  ${fmt(inStat.size)} -> ${fmt(outStat.size)}  (${Math.round(100*(1 - outStat.size/inStat.size))}% smaller)`);
  } catch (err) {
    console.error(`[error] ${src}:`, err.message);
  }
}

function fmt(n) {
  return `${(n/1024).toFixed(1)} KB`;
}

(async () => {
  for (const job of jobs) {
    // ensure folder exists
    const dir = path.dirname(path.join(pub, job.out));
    fs.mkdirSync(dir, { recursive: true });
    await optimizeOne(job);
  }
})();
