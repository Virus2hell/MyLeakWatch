require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// contact form route (existing)
const contactRoute = require('./routes/contact');
app.use('/api/contact', contactRoute);

// multer temp storage for image search
const upload = multer({ dest: 'uploads/' });

/**
 * =========================
 * Chat With AI (streaming)
 * POST /api/chat
 * Body: { messages: [{role:'user'|'assistant', content:string}, ...] }
 * Streams plain text chunks back to the client.
 * =========================
 */
app.post('/api/chat', async (req, res) => {
  try {
    const upstreamUrl = process.env.PROVIDER_URL || 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.MODEL || 'gpt-4o-mini';

    const inputMsgs = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const safe = inputMsgs.slice(-20).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 4000)
    }));
    const body = {
      model,
      stream: true,
      temperature: 0.4,
      messages: [{ role: 'system', content: 'You are MyLeakWatch Assistant.' }, ...safe]
    };

    console.log('[chat] inbound messages:', safe.length);
    if (!apiKey) {
      console.error('[chat] MISSING OPENAI_API_KEY');
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const upstream = await axios.post(upstreamUrl, body, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      responseType: 'stream',
      validateStatus: () => true
    });

    console.log('[chat] upstream status:', upstream.status);

    if (upstream.status < 200 || upstream.status >= 300) {
      let errText = '';
      upstream.data.on('data', (c) => { errText += c.toString(); });
      upstream.data.on('end', () => {
        console.error('[chat] upstream error body:', errText);
        // Fallback: return non-streaming error JSON for client visibility
        try { res.status(upstream.status).end('Upstream error'); } catch {}
      });
      upstream.data.on('error', (e) => {
        console.error('[chat] upstream stream error:', e?.message);
        try { res.status(upstream.status).end('Upstream error'); } catch {}
      });
      return;
    }

    upstream.data.on('data', chunk => {
      const str = chunk.toString();
      for (const line of str.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') { res.end(); return; }
        try {
          const json = JSON.parse(data);
          const delta = json?.choices?.[0]?.delta?.content || '';
          if (delta) res.write(delta);
        } catch { /* ignore */ }
      }
    });

    upstream.data.on('end', () => res.end());
    upstream.data.on('error', (e) => {
      console.error('[chat] stream error:', e?.message);
      try { res.end(); } catch {}
    });
    req.on('close', () => {
      try { upstream.data.destroy?.(); } catch {}
    });
  } catch (err) {
    console.error('[chat] handler error:', err.message);
    res.status(500).end('Server error');
  }
});


/**
 * ========== HIBP: Check email ==========
 */
app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(
      email
    )}?truncateResponse=false`;

    const headers = {
      'hibp-api-key': process.env.HIBP_API_KEY || '',
      'user-agent': 'MyLeakWatch/1.0 (contact@example.com)'
    };

    const response = await axios.get(hibpUrl, { headers, validateStatus: () => true });

    if (response.status === 200) {
      return res.json({ found: true, breaches: response.data });
    } else if (response.status === 404) {
      return res.json({ found: false, breaches: [] });
    } else {
      console.error('HIBP error', response.status, response.data);
      return res.status(500).json({ error: 'HIBP error', details: response.data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error', details: err.message });
  }
});

/**
 * ========== Image reverse search via Bing Visual Search ==========
 */
app.post('/api/check-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    const form = new FormData();
    form.append('image', fileStream, { filename: req.file.originalname });

    const bingKey = process.env.BING_SUBSCRIPTION_KEY;
    if (!bingKey) {
      fs.unlinkSync(filePath);
      return res.status(500).json({ error: 'Missing Bing subscription key on server' });
    }

    const bingUrl = 'https://api.bing.microsoft.com/v7.0/images/visualsearch';

    const bingResp = await axios.post(bingUrl, form, {
      headers: {
        ...form.getHeaders(),
        'Ocp-Apim-Subscription-Key': bingKey
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      validateStatus: () => true
    });

    fs.unlinkSync(filePath);

    if (bingResp.status >= 200 && bingResp.status < 300) {
      return res.json({ ok: true, results: bingResp.data });
    } else {
      console.error('Bing Visual Search error', bingResp.status, bingResp.data);
      return res.status(500).json({ error: 'visual search error', details: bingResp.data });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
