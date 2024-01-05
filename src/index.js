import { Hono } from 'hono';

const app = new Hono();

app.get('/:code', async (c) => {
  try {
		const code = c.req.param('code').toLowerCase();
		console.log(code);
    const { results } = await c.env.DB.prepare('SELECT url FROM urls WHERE short_code = ?').bind(code).all();

    if (results.length > 0) {
      const websiteUrl = results[0].url;
      console.log('Redirecting to ' + websiteUrl);
      return c.redirect(websiteUrl);
    } else {
      console.log('Short code not found');
      return c.status(404).json({ error: 'Short code not found' });
    }
  } catch (e) {
    console.log('Error fetching URL:', e);
    return c.status(500).json({ error: 'Failed to fetch URL' });
  }
});

app.post('/store', async (c) => {
	try {
		const { shortCode, url } = await c.req.json();

    // Validation
    if (!shortCode || !url) {
      return c.json({status: 400,  error: 'Missing short code or URL' });
    }

		console.log(shortCode, url);
		console.log([shortCode, url]);

    const { results } = await c.env.DB.prepare("INSERT INTO urls (short_code, url) VALUES (?, ?)").bind(shortCode, url).run();
    return c.json({ message: 'URL stored successfully' });
  } catch (e) {
    console.error('Error storing URL:', e);
    return c.json({ status: 500, error: 'Failed to store URL. There is some error or the code already exists.' });
  }
});

export default app;
