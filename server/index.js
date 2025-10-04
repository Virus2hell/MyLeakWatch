require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
//const fetch = require('node-fetch');

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
 * Local Chat via Ollama (OpenAI-compatible)
 * POST /api/chat
 * Body: { messages: [{role:'user'|'assistant', content:string}, ...] }
 * Streams plain text chunks back to the client.
 * =========================
 */
app.post('/api/chat', async (req, res) => {
  try {
    const upstreamUrl = 'http://127.0.0.1:11434/v1/chat/completions';
    const model = process.env.LOCAL_MODEL || 'llama3.1:8b';

    const inputMsgs = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const safe = inputMsgs.slice(-20).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 3000)
    }));

    const system = {
      role: 'system',
      content:
        'You are a cybersecurity safety assistant for MyLeakWatch. Answer concisely about breaches, passwords, credential stuffing, phishing, reverse image search, and safe breach‑check usage. Never ask for passwords or secrets.'
    };

    const body = { model, messages: [system, ...safe], stream: true, temperature: 0.3 };

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    console.log('[ollama] status:', upstream.status);

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      console.error('[ollama] upstream error', upstream.status, text);
      res.status(upstream.status).end(text || 'Upstream error');
      return;
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (!data) continue;
        if (data === '[DONE]') { res.end(); return; }
        try {
          const json = JSON.parse(data);
          const delta = json?.choices?.[0]?.delta?.content || '';
          if (delta) res.write(delta);
        } catch {
          console.error('[ollama] parse error line:', data.slice(0, 200));
        }
      }
    }

    res.end();
  } catch (err) {
    console.error('[ollama] handler error:', err?.stack || err?.message);
    res.status(500).end('Server error');
  }
});



/**
 * ========== HIBP: Check email ==========
 */
app.post('/api/check-email', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
    const headers = {
      'hibp-api-key': process.env.HIBP_API_KEY || '',
      'user-agent': 'MyLeakWatch/1.0 (contact@example.com)'
    };

    const response = await axios.get(hibpUrl, { headers, validateStatus: () => true });

    if (response.status === 200) {
      return res.json({ found: true, breaches: response.data });
    }
    if (response.status === 404) {
      return res.json({ found: false, breaches: [] });
    }
    if (response.status === 429) {
      return res.status(429).json({ error: 'Rate limited by HIBP. Try again later.' });
    }
    console.error('HIBP error', response.status, response.data);
    return res.status(500).json({ error: 'HIBP error', details: response.data });
  } catch (err) {
    console.error('HIBP exception', err.message);
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
