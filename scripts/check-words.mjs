/**
 * The course brief bans three words outright. This makes a stray one fail the
 * build rather than surface in the viva.
 *
 * Approved substitutes: considered, restrained, rarefied, deliberate,
 * unhurried, singular, high-craft, held, quiet, slow.
 *
 *   npm run check:words
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const BANNED = ['premium', 'exclusive', 'expensive'];
const ROOTS = ['content', 'components', 'app'];
const EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.md']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (EXTENSIONS.has(extname(path))) out.push(path);
  }
  return out;
}

let failures = 0;

for (const root of ROOTS) {
  let files = [];
  try {
    files = walk(root);
  } catch {
    continue;
  }

  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const word of BANNED) {
        // \b so "expensively" is caught but a filename like "exclusive.jpg"
        // would still be flagged, which is the behaviour we want.
        if (new RegExp(`\\b${word}`, 'i').test(line)) {
          console.error(`  ${file}:${i + 1}  "${word}"  →  ${line.trim().slice(0, 90)}`);
          failures++;
        }
      }
    });
  }
}

if (failures) {
  console.error(`\n✗ ${failures} banned word${failures === 1 ? '' : 's'} found.`);
  console.error('  Use: considered, restrained, rarefied, deliberate, unhurried,');
  console.error('       singular, high-craft, held, quiet, slow.\n');
  process.exit(1);
}

console.log('✓ No banned words. (premium / exclusive / expensive)');
