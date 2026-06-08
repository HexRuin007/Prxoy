app.get('/proxy', async (req, res) => {
  const {
    server = 'main',
    path = '',
    key
  } = req.query;

  const BASE_URLS = {
    main: 'https://tycoon-2epova.users.cfx.re/status/',
    beta: 'https://tycoon-njyvop.users.cfx.re/status/'
  };

  const base = BASE_URLS[server.toLowerCase()];

  if (!base) {
    return res.status(400).json({
      error: 'Invalid server. Use main or beta.'
    });
  }

  const targetUrl = base + path;

  console.log(`${server.toUpperCase()} -> ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      headers: key
        ? {
            'X-Tycoon-Key': key
          }
        : {}
    });

    const text = await response.text();

    res.status(response.status);
    res.set(
      'Content-Type',
      response.headers.get('content-type') ||
        'application/json'
    );

    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});
