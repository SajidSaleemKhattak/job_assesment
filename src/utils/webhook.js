const http = require('http');
const https = require('https');

function postJSON(url, payload) {
  try {
    if (!url) return;
    const data = JSON.stringify(payload);
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    const { hostname, pathname, port, protocol } = new URL(url);
    const options = {
      hostname,
      port: port || (isHttps ? 443 : 80),
      path: pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = client.request(options, res => {
      // Drain response
      res.on('data', () => {});
    });
    req.on('error', () => {});
    req.write(data);
    req.end();
  } catch (_) {
    // swallow errors to avoid breaking main flow
  }
}

module.exports = {
  notify(event, entity, data) {
    const url = process.env.WEBHOOK_URL || '';
    if (!url) return;
    postJSON(url, { event, entity, data, timestamp: new Date().toISOString() });
  }
};
