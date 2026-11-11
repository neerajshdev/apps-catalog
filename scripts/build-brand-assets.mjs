/**
 * Regenerates the raster brand icons from the single vector source
 * (public/brand/chiku-mark.svg), since browser-favicon and iOS home-screen
 * icons must be bitmaps.
 *
 * Usage: bun run brand:assets
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(ROOT, 'public/brand/chiku-mark.svg');
const CREAM = '#f9f5ea';

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  throw new Error(
    'sharp is required to rasterize the brand icons. It normally ships with Next.js; run `bun install` first.',
  );
}

/** Rasterize the mark at `size` px, optionally over an opaque background. */
async function render(size, background) {
  const pipeline = sharp(SOURCE, { density: 384 }).resize(size, size, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (background) pipeline.flatten({ background });
  return pipeline.png({ compressionLevel: 9 }).toBuffer();
}

/** Packs PNG buffers into a multi-size .ico container (Vista+ format). */
function toIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(16 * entries.length);
  let offset = 6 + directory.length;

  entries.forEach((entry, index) => {
    const cursor = 16 * index;
    const dimension = entry.size >= 256 ? 0 : entry.size; // 0 means 256
    directory.writeUInt8(dimension, cursor);
    directory.writeUInt8(dimension, cursor + 1);
    directory.writeUInt8(0, cursor + 2); // palette colours
    directory.writeUInt8(0, cursor + 3); // reserved
    directory.writeUInt16LE(1, cursor + 4); // colour planes
    directory.writeUInt16LE(32, cursor + 6); // bits per pixel
    directory.writeUInt32LE(entry.buffer.length, cursor + 8);
    directory.writeUInt32LE(offset, cursor + 12);
    offset += entry.buffer.length;
  });

  return Buffer.concat([header, directory, ...entries.map((entry) => entry.buffer)]);
}

const targets = [
  { file: join(ROOT, 'src/app/icon.png'), buffer: await render(256) },
  // iOS composites transparency onto black, so the apple icon keeps the cream.
  { file: join(ROOT, 'src/app/apple-icon.png'), buffer: await render(180, CREAM) },
];

const icoEntries = [];
for (const size of [16, 32, 48]) {
  icoEntries.push({ size, buffer: await render(size) });
}

mkdirSync(join(ROOT, 'src/app'), { recursive: true });
for (const target of targets) {
  writeFileSync(target.file, target.buffer);
  console.log(`wrote ${target.file.replace(`${ROOT}/`, '')} (${(target.buffer.length / 1024).toFixed(1)} KB)`);
}

const ico = toIco(icoEntries);
writeFileSync(join(ROOT, 'src/app/favicon.ico'), ico);
console.log(`wrote src/app/favicon.ico (${(ico.length / 1024).toFixed(1)} KB, 16/32/48 px)`);
