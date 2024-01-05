import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth'

import { customAlphabet } from 'nanoid';

const app = new Hono();

// app.use(
//   '/store/*',
//   basicAuth({
//     username: 'username',
//     password: 'password'
//   })
// )

const NANOID_SIZE = 6;
const nanoid = customAlphabet('eEaAoSsIiLlHhNn0MmKkGgBb1Jj2Pp3Ff4Ww5Qq6Yy7Uu8Zz9_-', NANOID_SIZE);

app.get('/:code', async (c) => {
  try {
		const code = c.req.param('code');
		console.log(code);
    const { results } = await c.env.DB.prepare('SELECT url FROM urls WHERE short_code = ?').bind(code).all();

    if (results.length > 0) {
      const websiteUrl = results[0].url;
      console.log('Redirecting to ' + websiteUrl);
      return c.redirect(websiteUrl);
    } else {
      console.log('Short code not found');
      return c.json({ status: 404,  error: 'Short code not found' });
    }
  } catch (e) {
    console.log('Error fetching URL:', e);
    return c.json({ status: 500, error: 'Failed to fetch URL' });
  }
});

app.post('/store', async (c) => {
	try {
		// get the long url from json payload in request body
		const { url } = await c.req.json();

		// Generate a random id of length = NANOID_SIZE
		const shortCode = nanoid();
		const created_at = Date.now();

		console.log(shortCode);
    // Validation
    if (!shortCode || !url) {
      return c.json({status: 400,  error: 'Missing short code or URL' });
		}

		// Save the url and
		const { results } = await c.env.DB.prepare("INSERT INTO urls (short_code, url, created_at) VALUES (?, ?, ?)").bind(shortCode, url, created_at).run();

		return c.json({ message: `URL stored successfully. short: ${shortCode}, url: ${url}` });
  } catch (e) {
    console.error('Error storing URL:', e);
    return c.json({ status: 500, error: 'Failed to store URL. There is some error or the code already exists.' });
  }
});

export default app;
