const express = require('express');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  rateLimit({
    windowMs: 10 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' },
  }),
);

function createServiceProxy(prefix, target, serviceName) {
  return createProxyMiddleware({
    pathFilter: (pathname) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
    target,
    changeOrigin: true,
    pathRewrite: { [`^${prefix}(?=/|$)`]: '' },
    on: {
      proxyReq: (proxyRequest, request) => {
        console.log(
          `Proxying ${request.method} ${request.originalUrl} to ${serviceName}`,
        );
      },
      error: (error, request, response) => {
        console.error(`${serviceName} proxy error: ${error.message}`);
        if (!response.headersSent) {
          response.writeHead(502, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({ error: 'Upstream service unavailable' }));
        }
      },
    },
  });
}

app.use(
  createServiceProxy(
    '/product-service',
    process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000',
    'product-service',
  ),
);
app.use(
  createServiceProxy(
    '/order-service',
    process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
    'order-service',
  ),
);

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`Gateway listening on port ${port}`);
});
