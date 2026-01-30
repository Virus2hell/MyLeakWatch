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
 * Chat via OpenRouter (OpenAI-compatible)
 * POST /api/chat
 * Body: { messages: [{role:'user'|'assistant', content:string}, ...] }
 * Returns JSON { ok: true, content: string }
 * =========================
 */
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GROQ_API_KEY in environment' });
    }

    // Keep transcript small to control tokens and avoid rate limits
    const inputMsgs = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const clipped = inputMsgs.slice(-12).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 1500)
    }));

    // System prompt for safety and product alignment
    const system = {
  role: 'system',
  content: `You are a cybersecurity safety assistant for MyLeakWatch. Answer concisely about breaches, passwords, credential stuffing, phishing, and safe breach-check usage. Never ask for passwords or secrets.

**Format responses cleanly:**
- Use ## Headers (max 4 words)
- Short bullet lists (- format)
- 1-2 sentences per bullet
- No bold text or numbering
- Keep total response under 200 words`
};

    const body = {
      model: 'llama-3.1-8b-instant', // Fast Groq model; swap as needed (e.g., 'mixtral-8x7b-32768', 'llama-3.3-70b-versatile')
      messages: [system, ...clipped],
      temperature: 0.3,
      max_tokens: 800
    };

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
        // No need for HTTP-Referer or X-Title with Groq
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Groq error', details: data });
    }

    const text =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.delta?.content ??
      '';

    if (!text) {
      return res.status(500).json({ error: 'No content from model', details: data });
    }

    return res.json({ ok: true, content: text });
  } catch (err) {
    console.error('[groq] handler error:', err?.stack || err?.message);
    res.status(500).json({ error: 'Server error', details: err?.message });
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
    return res.status(500).json({ error: 'HIBP error', details: response.data });
  } catch (err) {
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
      return res.status(500).json({ error: 'visual search error', details: bingResp.data });
    }
  } catch (err) {
    res.status(500).json({ error: 'server error', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
