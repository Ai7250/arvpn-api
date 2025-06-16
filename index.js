
const express = require('express');
const cors = require('cors');
const app = express();
const proxies = require('./countries.json');

app.use(cors());

// Home Route
app.get('/', (req, res) => {
  res.send('ARVPN Proxy API is Live!');
});

// ✅ GET → All Available Locations
app.get('/api/locations', (req, res) => {
  const locations = proxies.map(p => ({ country: p.country, code: p.code }));
  res.json(locations);
});

// ✅ GET → Specific Proxy URL by Country Code
app.get('/api/proxy/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const proxy = proxies.find(p => p.code === code);

  if (proxy) {
    res.json({ success: true, proxy: proxy.proxy });
  } else {
    res.status(404).json({ success: false, message: "Location not found" });
  }
});

// ✅ GET → Random Proxy → For Rotation
app.get('/api/random-proxy', (req, res) => {
  const proxy = proxies[Math.floor(Math.random() * proxies.length)];
  res.json(proxy);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ARVPN Proxy API running on port ${PORT}`);
});
