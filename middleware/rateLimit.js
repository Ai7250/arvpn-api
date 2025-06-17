const rateLimit = require('express-rate-limit');

// ✅ General API Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// ✅ Strict Rate Limiter for Proxy Endpoints
const proxyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 proxy requests per minute
  message: {
    success: false,
    message: 'Proxy request limit exceeded. Please wait before making more requests.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Random Proxy Rate Limiter (More restrictive)
const randomProxyLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 5, // Limit each IP to 5 random proxy requests per 30 seconds
  message: {
    success: false,
    message: 'Random proxy request limit exceeded. Please wait 30 seconds.',
    retryAfter: '30 seconds'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Health Check Rate Limiter
const healthCheckLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 health checks per minute
  message: {
    success: false,
    message: 'Health check limit exceeded. Please wait before checking again.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  proxyLimiter,
  randomProxyLimiter,
  healthCheckLimiter
};
