const helmet = require('helmet');

// ✅ Security Headers Middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
});

// ✅ Request Logger Middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${ip} - UserAgent: ${userAgent}`);
  
  // Track response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] Response: ${res.statusCode} - Duration: ${duration}ms`);
  });
  
  next();
};

// ✅ Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);
  
  // Default error
  let error = { 
    success: false,
    message: 'Internal Server Error' 
  };
  
  // Rate limit error
  if (err.type === 'entity.parse.failed') {
    error.message = 'Invalid JSON format';
    return res.status(400).json(error);
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.details = err.message;
    return res.status(400).json(error);
  }
  
  res.status(500).json(error);
};

// ✅ API Key Validation (Optional - for future use)
const validateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  // If no API key is provided, continue (public API)
  if (!apiKey) {
    return next();
  }
  
  // Validate API key format (basic validation)
  if (apiKey.length < 32) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key format'
    });
  }
  
  // TODO: Add actual API key validation logic here
  // For now, accept any properly formatted key
  req.apiKey = apiKey;
  next();
};

// ✅ CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com', 'https://arvpn.com'] // Add your actual domains
    : true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

module.exports = {
  securityHeaders,
  requestLogger,
  errorHandler,
  validateApiKey,
  corsOptions
};
