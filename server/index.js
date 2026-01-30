require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const mongoose = require('mongoose');

// ================== APP INIT ==================
const app = express();
app.use(cors());
app.use(express.json());

// ================== DB CONNECT ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  });

// ================== CRON ==================
require('./cron/breachCheck.cron');

// ================== ROUTES ==================

// existing contact route
const contactRoute = require('./routes/contact');
app.use('/api/contact', contactRoute);

// new breach monitoring route
const breachRoutes = require('./routes/breach.routes');
app.use('/api', breachRoutes);

// ================== MULTER ==================
const upload = multer({ dest: 'uploads/' });

// =================================================
// CHAT via GROQ (unchanged)
// =================================================
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GROQ_API_KEY in environment' });
    }

    const inputMsgs = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const clipped = inputMsgs.slice(-12).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 1500)
    }));

    const system = {
      role: 'system',
      content: `You are a cybersecurity safety assistant for MyLeakWatch. Answer concisely.
- Use short bullets
- No sensitive data requests
- Under 200 words`
    };

    const body = {
      model: 'llama-3.1-8b-instant',
      messages: [system, ...clipped],
      temperature: 0.3,
      max_tokens: 800
    };

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'Groq error', details: data });

    const text = data?.choices?.[0]?.message?.content || '';
    return res.json({ ok: true, content: text });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// =================================================
// HIBP INSTANT EMAIL CHECK (KEEPING THIS ✅)
// =================================================
app.post('/api/check-email', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;

    const headers = {
      'hibp-api-key': process.env.HIBP_API_KEY,
      'user-agent': 'MyLeakWatch/1.0'
    };

    const response = await axios.get(hibpUrl, {
      headers,
      validateStatus: () => true
    });

    if (response.status === 200) {
      return res.json({ found: true, breaches: response.data });
    }
    if (response.status === 404) {
      return res.json({ found: false, breaches: [] });
    }
    if (response.status === 429) {
      return res.status(429).json({ error: 'HIBP rate limit hit' });
    }

    return res.status(500).json({ error: 'HIBP error', details: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// =================================================
// IMAGE REVERSE SEARCH (unchanged)
// =================================================
app.post('/api/check-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const form = new FormData();
    form.append('image', fs.createReadStream(req.file.path));

    const bingKey = process.env.BING_SUBSCRIPTION_KEY;
    if (!bingKey) return res.status(500).json({ error: 'Missing Bing API key' });

    const bingResp = await axios.post(
      'https://api.bing.microsoft.com/v7.0/images/visualsearch',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Ocp-Apim-Subscription-Key': bingKey
        },
        validateStatus: () => true
      }
    );

    fs.unlinkSync(req.file.path);

    if (bingResp.status >= 200 && bingResp.status < 300) {
      return res.json({ ok: true, results: bingResp.data });
    }

    return res.status(500).json({ error: 'Visual search error', details: bingResp.data });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// ================== START SERVER ==================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
