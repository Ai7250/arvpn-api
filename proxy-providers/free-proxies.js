const https = require('https');

/**
 * Free proxy providers for testing purposes
 * In production, you would use paid proxy services like:
 * - ProxyMesh, Bright Data, SmartProxy, etc.
 */

// Free SOCKS5 proxies (these change frequently)
const FREE_SOCKS5_PROXIES = {
  'US': [
    { host: '72.210.252.134', port: 46164 },
    { host: '184.178.172.25', port: 15291 },
    { host: '192.252.220.92', port: 17328 }
  ],
  'DE': [
    { host: '144.91.95.126', port: 3128 },
    { host: '168.119.137.56', port: 3128 }
  ],
  'UK': [
    { host: '185.142.67.23', port: 8080 },
    { host: '212.115.232.79', port: 10001 }
  ],
  'FR': [
    { host: '51.159.115.233', port: 3128 },
    { host: '51.158.169.52', port: 29976 }
  ]
};

// Free HTTP proxies
const FREE_HTTP_PROXIES = {
  'US': [
    { host: '20.206.106.192', port: 80 },
    { host: '143.198.228.250', port: 80 },
    { host: '157.245.27.9', port: 3128 }
  ],
  'DE': [
    { host: '144.91.95.126', port: 3128 },
    { host: '49.12.208.87', port: 5566 }
  ],
  'UK': [
    { host: '185.142.67.23', port: 8080 },
    { host: '212.115.232.79', port: 10001 }
  ]
};

/**
 * Test if a proxy is working
 */
async function testProxy(host, port, type = 'http') {
  return new Promise((resolve) => {
    const timeout = 5000;
    const net = require('net');
    
    const socket = new net.Socket();
    
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeout);
    
    socket.connect(port, host, () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

/**
 * Get a working proxy for a country
 */
async function getWorkingProxy(countryCode, type = 'http') {
  const proxies = type === 'socks5' ? FREE_SOCKS5_PROXIES : FREE_HTTP_PROXIES;
  const countryProxies = proxies[countryCode] || proxies['US']; // Fallback to US
  
  for (const proxy of countryProxies) {
    const isWorking = await testProxy(proxy.host, proxy.port, type);
    if (isWorking) {
      return {
        host: proxy.host,
        port: proxy.port,
        type: type,
        url: `${type}://${proxy.host}:${proxy.port}`
      };
    }
  }
  
  // If no proxy works, return a demo proxy
  return {
    host: 'demo-proxy.example.com',
    port: type === 'socks5' ? 1080 : 8080,
    type: type,
    url: `${type}://demo-proxy.example.com:${type === 'socks5' ? 1080 : 8080}`,
    demo: true
  };
}

/**
 * Fetch proxy list from online source
 */
async function fetchLiveProxies() {
  return new Promise((resolve) => {
    // This would fetch from proxy APIs like proxy-list.download, etc.
    // For demo purposes, we return the static list
    resolve(FREE_HTTP_PROXIES);
  });
}

module.exports = {
  getWorkingProxy,
  testProxy,
  fetchLiveProxies,
  FREE_HTTP_PROXIES,
  FREE_SOCKS5_PROXIES
};
