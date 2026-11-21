// Entry for make.fun's news-image-20261120: copies the pre-rendered front page of Friday 20 November 2026
// (entry.png, drawn by tools/render.mjs) to /output/entry.png. Node 22, standard library only, no network.
// Locally: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const image = readFileSync(new URL('./entry.png', import.meta.url));
const isPng = image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
if (!isPng || image.length > 1048576) throw new Error('entry.png must be a PNG of at most 1 MiB');
writeFileSync(join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'), image);
