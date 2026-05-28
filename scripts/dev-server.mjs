import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const root = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
};

function send404(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('404 - Not Found');
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(
      new URL(req.url, `http://localhost`).pathname,
    );
    let filePath = path.join(root, urlPath);

    // If path is directory, serve index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      return send404(res);
    }

    const ext = path.extname(filePath).toLowerCase();
    const stat = fs.statSync(filePath);
    const contentType = mime[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stat.size);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => send404(res));
  } catch (e) {
    send404(res);
  }
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop.');
});
