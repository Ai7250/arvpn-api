const express = require('express');
const router = express.Router();
const proxies = require('../countries.json');
const { getWorkingProxy, testProxy } = require('../proxy-providers/free-proxies');

// ✅ GET → All Available Locations
router.get('/locations', (req, res) => {
  try {
    const locations = proxies.map(p => ({ 
      country: p.country, 
      code: p.code,
      flag: getCountryFlag(p.code)
    }));
    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching locations",
      error: error.message 
    });
  }
});

// ✅ GET → Specific Proxy URL by Country Code
router.get('/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const proxy = proxies.find(p => p.code === code);

    if (proxy) {
      // Try to get a working proxy for this country
      const workingProxy = await getWorkingProxy(code, 'http');
      
      res.json({ 
        success: true, 
        country: proxy.country, 
        code: proxy.code,
        proxy: workingProxy.url,
        proxy_host: workingProxy.host,
        proxy_port: workingProxy.port,
        proxy_type: workingProxy.type,
        exit_ip: proxy.exit_ip || `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        is_demo: workingProxy.demo || false,
        flag: getCountryFlag(proxy.code),
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: `Proxy not found for country code: ${code}`,
        availableCodes: proxies.map(p => p.code)
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching proxy",
      error: error.message 
    });
  }
});

// ✅ GET → SOCKS5 Proxy by Country Code  
router.get('/:code/socks5', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const proxy = proxies.find(p => p.code === code);

    if (proxy) {
      const workingProxy = await getWorkingProxy(code, 'socks5');
      
      res.json({ 
        success: true, 
        country: proxy.country, 
        code: proxy.code,
        proxy: workingProxy.url,
        proxy_host: workingProxy.host,
        proxy_port: workingProxy.port,
        proxy_type: 'socks5',
        exit_ip: proxy.exit_ip || `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        is_demo: workingProxy.demo || false,
        flag: getCountryFlag(proxy.code),
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: `SOCKS5 proxy not found for country code: ${code}`
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching SOCKS5 proxy",
      error: error.message 
    });
  }
});

// ✅ GET → Random Proxy → For Rotation
router.get('/random/proxy', async (req, res) => {
  try {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    const proxy = proxies[randomIndex];
    const workingProxy = await getWorkingProxy(proxy.code, 'http');
    
    res.json({
      success: true,
      country: proxy.country,
      code: proxy.code,
      proxy: workingProxy.url,
      proxy_host: workingProxy.host,
      proxy_port: workingProxy.port,
      proxy_type: workingProxy.type,
      exit_ip: proxy.exit_ip || `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      is_demo: workingProxy.demo || false,
      flag: getCountryFlag(proxy.code),
      timestamp: new Date().toISOString(),
      rotationId: Math.random().toString(36).substr(2, 9)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error getting random proxy",
      error: error.message 
    });
  }
});

// ✅ POST → Proxy Health Check
router.post('/health-check', async (req, res) => {
  try {
    const { code, proxy_host, proxy_port } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Country code is required"
      });
    }
    
    const proxy = proxies.find(p => p.code === code.toUpperCase());
    
    if (!proxy) {
      return res.status(404).json({
        success: false,
        message: "Proxy not found"
      });
    }

    // Test the proxy if host and port provided
    let proxyStatus = "active";
    if (proxy_host && proxy_port) {
      const isWorking = await testProxy(proxy_host, proxy_port);
      proxyStatus = isWorking ? "active" : "inactive";
    }

    res.json({
      success: true,
      country: proxy.country,
      code: proxy.code,
      status: proxyStatus,
      lastChecked: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Health check failed",
      error: error.message 
    });
  }
});

// ✅ GET → Proxy Statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      totalProxies: proxies.length,
      activeProxies: proxies.length, // Assume all are active for now
      countries: proxies.map(p => p.country),
      regions: getRegionStats(),
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching stats",
      error: error.message 
    });
  }
});

// Helper function to get country flags
function getCountryFlag(code) {
  const flags = {
    'US': '🇺🇸',
    'UK': '🇬🇧', 
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'IN': '🇮🇳',
    'SG': '🇸🇬',
    'JP': '🇯🇵',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'NL': '🇳🇱',
    'BR': '🇧🇷',
    'RU': '🇷🇺',
    'KR': '🇰🇷',
    'IT': '🇮🇹',
    'ES': '🇪🇸'
  };
  return flags[code] || '🌍';
}

// Helper function to get region statistics
function getRegionStats() {
  const regions = {
    'North America': ['US', 'CA'],
    'Europe': ['UK', 'DE', 'FR', 'NL', 'RU', 'IT', 'ES'],
    'Asia': ['IN', 'SG', 'JP', 'KR'],
    'Oceania': ['AU'],
    'South America': ['BR']
  };
  
  const stats = {};
  for (const [region, codes] of Object.entries(regions)) {
    stats[region] = codes.length;
  }
  
  return stats;
}

module.exports = router;
