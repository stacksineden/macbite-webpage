/** Dev-only static server that mimics the host rules in _headers/vercel.json. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const ROOT = 'dist/client';
const PORT = Number(process.argv[2] ?? 4180);
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml',
  '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.avif':'image/avif', '.xml':'application/xml',
  '.txt':'text/plain', '.webmanifest':'application/manifest+json', '.json':'application/json' };
const tryFiles = async (p) => { try { const s = await stat(p); return s.isFile() ? p : null; } catch { return null; } };

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x').pathname;
  const candidates = [path.join(ROOT, url), path.join(ROOT, url, 'index.html'), path.join(ROOT, url + '.html')];
  let file = null;
  for (const c of candidates) { file = await tryFiles(c); if (file) break; }
  if (!file) file = path.join(ROOT, 'shell.html');           // SPA fallback
  const body = await readFile(file);
  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  res.end(body);
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`));
