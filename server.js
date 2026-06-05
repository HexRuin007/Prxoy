const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url query parameter');

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const body = await response.text();

    res.set('Content-Type', contentType);
    res.send(body);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CORS proxy listening on http://localhost:${port}`);
});