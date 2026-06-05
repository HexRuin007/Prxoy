const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => {
  console.log('GET /');
  res.send('CORS proxy is running');
});

app.get('/health', (req, res) => {
  console.log('GET /health');
  res.json({ status: 'ok' });
});

app.get('/proxy', async (req, res) => {
  console.log('GET /proxy', req.query.url);
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url query parameter');

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const body = await response.text();

    res.set('Content-Type', contentType);
    res.send(body);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

app.use((req, res) => {
  console.warn('Not found:', req.method, req.url);
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).send('Server error');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`CORS proxy listening on http://0.0.0.0:${port}`);
});