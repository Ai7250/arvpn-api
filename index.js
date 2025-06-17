const express = require('express');
const cors = require('cors');
const app = express();

// Import middleware
const { generalLimiter, proxyLimiter, randomProxyLimiter, healthCheckLimiter } = require('./middleware/rateLimit');
const { securityHeaders, requestLogger, errorHandler, corsOptions } = require('./middleware/security');

// Import routes
const proxyRoutes = require('./routes/proxy');

// ✅ Security & CORS Setup
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Request Logging
app.use(requestLogger);

// ✅ General Rate Limiting
app.use(generalLimiter);

// ✅ Home Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '✅ ARVPN Proxy API is Live!',
    version: '1.0.0',
    endpoints: {
      locations: '/api/proxy/locations',
      getProxy: '/api/proxy/:code',
      randomProxy: '/api/proxy/random/proxy',
      healthCheck: '/api/proxy/health-check',
      stats: '/api/proxy/stats/overview'
    },
    documentation: 'https://github.com/your-username/arvpn-api',
    timestamp: new Date().toISOString()
  });
});

// ✅ API Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// ✅ Apply specific rate limiters to proxy routes
app.use('/api/proxy/random', randomProxyLimiter);
app.use('/api/proxy/health-check', healthCheckLimiter);
app.use('/api/proxy/:code', proxyLimiter);

// ✅ Use proxy routes
app.use('/api/proxy', proxyRoutes);

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/proxy/locations',
      'GET /api/proxy/:code',
      'GET /api/proxy/random/proxy',
      'POST /api/proxy/health-check',
      'GET /api/proxy/stats/overview'
    ]
  });
});

// ✅ Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ ARVPN Proxy API running on port ${PORT}`);
});

