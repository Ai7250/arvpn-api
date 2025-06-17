# ARVPN API - Production Ready

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📝 API Endpoints

### Base URL: `https://your-domain.com`

#### General Endpoints
- `GET /` - API status and information
- `GET /health` - Health check endpoint

#### Proxy Endpoints
- `GET /api/proxy/locations` - Get all available proxy locations
- `GET /api/proxy/:code` - Get specific proxy by country code
- `GET /api/proxy/random/proxy` - Get random proxy for rotation
- `POST /api/proxy/health-check` - Check proxy health status
- `GET /api/proxy/stats/overview` - Get API statistics

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Rate Limits
- General API: 100 requests per 15 minutes
- Proxy requests: 20 requests per minute
- Random proxy: 5 requests per 30 seconds
- Health checks: 10 requests per minute

## 🛡️ Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting on all endpoints
- ✅ Request logging
- ✅ Input validation
- ✅ Error handling

## 🌍 Available Countries

| Country | Code | Flag |
|---------|------|------|
| United States | US | 🇺🇸 |
| United Kingdom | UK | 🇬🇧 |
| Germany | DE | 🇩🇪 |
| France | FR | 🇫🇷 |
| India | IN | 🇮🇳 |
| Singapore | SG | 🇸🇬 |
| Japan | JP | 🇯🇵 |
| Canada | CA | 🇨🇦 |
| Australia | AU | 🇦🇺 |
| Netherlands | NL | 🇳🇱 |
| Brazil | BR | 🇧🇷 |
| Russia | RU | 🇷🇺 |
| South Korea | KR | 🇰🇷 |
| Italy | IT | 🇮🇹 |
| Spain | ES | 🇪🇸 |

## 📚 API Usage Examples

### Get All Locations
```bash
curl https://your-domain.com/api/proxy/locations
```

### Get Specific Proxy
```bash
curl https://your-domain.com/api/proxy/US
```

### Get Random Proxy
```bash
curl https://your-domain.com/api/proxy/random/proxy
```

### Health Check
```bash
curl -X POST https://your-domain.com/api/proxy/health-check \
  -H "Content-Type: application/json" \
  -d '{"code": "US"}'
```

## 🚀 Deployment

### Render.com Deployment
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Cloudflare Setup
1. Add your domain to Cloudflare
2. Update DNS settings
3. Configure SSL/TLS

## 🔍 Monitoring

The API includes built-in logging and error tracking. Monitor your logs for:
- Request patterns
- Error rates
- Response times
- Rate limit hits

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.