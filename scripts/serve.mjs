/**
 * Serves the built site from ./out with no dependencies and no network.
 *
 *   npm run build      once
 *   npm run preview    on the day
 *
 * The static export references its assets from the site root, so opening
 * out/index.html straight off the filesystem will not load the CSS or the
 * fonts. This is the offline-safe way to show it.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('out');
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

if (!existsSync(ROOT)) {
  console.error('No ./out directory. Run `npm run build` first.');
  process.exit(1);
}

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);

  // Keep the resolved path inside ./out.
  const target = resolve(join(ROOT, normalize(url)));
  if (!target.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  let file = target;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');

  // A missing page must answer 404, not 200 with the 404 page's body. Serving
  // the right-looking HTML under a 200 makes every automated check pass while
  // the site is actually broken.
  let status = 200;
  if (!existsSync(file)) {
    status = 404;
    file = join(ROOT, '404.html');
    if (!existsSync(file)) {
      res.writeHead(404).end('Not found');
      return;
    }
  }

  const size = statSync(file).size;
  const type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';

  // Range support, so the clips can be scrubbed and seek properly.
  const range = req.headers.range;
  if (range && /^bytes=/.test(range)) {
    const [startRaw, endRaw] = range.replace('bytes=', '').split('-');
    const start = Number(startRaw) || 0;
    const end = endRaw ? Number(endRaw) : size - 1;
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    });
    createReadStream(file, { start, end }).pipe(res);
    return;
  }

  res.writeHead(status, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`\n  Second Nature — http://localhost:${PORT}\n`);
});
