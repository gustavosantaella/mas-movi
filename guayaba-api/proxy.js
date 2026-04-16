const http = require('http');
const httpProxy = require('http-proxy');

const PORT = 4500;

console.log('─── proxy.js v2 loaded ───'); // ← confirms new code

// Mapeo de rutas a puertos de microservicios
const apis = {
  '/auth': 3001,
  '/mobility': 3001,
  // '/payments': 3002,
};

const proxy = httpProxy.createProxyServer({ ws: true });

proxy.on('error', (err, req, res) => {
  console.error(`[Proxy Error] ${req.method} ${req.url} → ${err.code || ''} ${err.message}`);
  if (res && res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Servicio no disponible.' }));
  }
});

// ─── HTTP requests ─────────────────────────────────────
const server = http.createServer((req, res) => {
  const url = req.url || '';

  const matchedRoute = Object.keys(apis).find((route) =>
    url.startsWith(`/proxy${route}`)
  );

  if (!matchedRoute) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Ruta no encontrada.' }));
    return;
  }

  req.url = url.replace(/^\/proxy/, '/api');

  const targetPort = apis[matchedRoute];
  const target = `http://localhost:${targetPort}`;

  console.log(`[Proxy] ${req.method} ${url} → ${target}${req.url}`);

  proxy.web(req, res, { target });
});

// ─── WebSocket upgrade ─────────────────────────────────
server.on('upgrade', (req, socket, head) => {
  const url = req.url || '';

  console.log(`[WS] Incoming upgrade: ${url}`);

  const matchedRoute = Object.keys(apis).find((route) =>
    url.startsWith(`/proxy${route}`)
  );

  if (!matchedRoute) {
    console.log(`[WS] No route matched for: ${url}`);
    socket.destroy();
    return;
  }

  // Strip /proxy/<service> prefix → Socket.IO expects /socket.io
  const originalUrl = req.url;
  req.url = url.replace(`/proxy${matchedRoute}`, '');

  const targetPort = apis[matchedRoute];
  const target = `http://localhost:${targetPort}`;

  console.log(`[WS] Route: ${matchedRoute} | Rewrite: ${originalUrl} → ${req.url}`);
  console.log(`[WS] Forwarding to: ${target}${req.url}`);

  proxy.ws(req, socket, head, { target });
});

server.listen(PORT, () => {
  console.log(`\n🚀 API Gateway v2 en http://localhost:${PORT}/proxy/`);
  console.log('Rutas:');
  Object.entries(apis).forEach(([route, port]) => {
    console.log(`   /proxy${route}/* → http://localhost:${port}`);
  });
  console.log('   WebSocket: /proxy/<service>/socket.io → strips prefix\n');
});
