/**
 * Placeholder text must never reach a public URL again.
 *
 * The credits block on the Exit page renders `authors` straight out of the
 * content file, so an unfilled TODO there is not a code comment — it is a line
 * of copy on the last page a visitor sees. This fails the build instead.
 *
 * Two different things are checked, and only one of them is fatal:
 *
 *   - TODO inside a *string* in content/ is copy. It ships. Fatal.
 *   - TODO in a `//` or block comment is a note to ourselves. It does not
 *     ship. Reported as a reminder, never fatal.
 *
 *   npm run check:shipped
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOTS = ['content', 'components', 'app'];
const EXTENSIONS = new Set(['.ts', '.tsx']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (EXTENSIONS.has(extname(path))) out.push(path);
  }
  return out;
}

/** Is this line a comment rather than copy? */
const isComment = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);

/** A TODO sitting inside a quoted string is copy that renders. */
const inString = (line) =>
  /(['"`])[^'"`]*TODO[^'"`]*\1/.test(line) || /^\s*'[^']*TODO/.test(line);

const shipped = [];
const notes = [];

for (const root of ROOTS) {
  let files = [];
  try {
    files = walk(root);
  } catch {
    continue;
  }

  for (const file of files) {
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (!line.includes('TODO')) return;
        const where = `${file}:${i + 1}`;
        const text = line.trim().slice(0, 96);
        if (isComment(line)) notes.push(`  ${where}  ${text}`);
        else if (inString(line)) shipped.push(`  ${where}  ${text}`);
        else notes.push(`  ${where}  ${text}`);
      });
  }
}

if (notes.length) {
  console.log(`\n${notes.length} TODO note${notes.length === 1 ? '' : 's'} in comments (not shipped):`);
  notes.forEach((n) => console.log(n));
}

if (shipped.length) {
  console.error(`\n✗ ${shipped.length} TODO${shipped.length === 1 ? '' : 's'} in copy that renders to the page:`);
  shipped.forEach((s) => console.error(s));
  console.error('\n  This text appears on the live site. Fill it in before building.\n');
  process.exit(1);
}

console.log('\n✓ No placeholder text in rendered copy.');
