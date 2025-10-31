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

// QUICK DIAG: list accessible models for your key
app.get('/api/_gemini/models', async (_req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const r = await axios.get(url, { validateStatus: () => true });
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

/**
 * Chat via Google Gemini API (v1beta, gemini-1.0-pro)
 */
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing GEMINI_API_KEY in environment' });

    const inputMsgs = Array.isArray(req.body?.messages) ? req.body.messages : [];

    const contents = inputMsgs.slice(-20).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 3000) }]
    }));

    // Use gemini-1.0-pro on v1beta (widely available)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

    const requestBody = {
      contents,
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ],
      systemInstruction: {
        role: 'user',
        parts: [{
          text: 'You are a cybersecurity safety assistant for MyLeakWatch. Answer concisely about breaches, passwords, credential stuffing, phishing, reverse image search, and safe breach‑check usage. Never ask for passwords or secrets.'
        }]
      }
    };

    const geminiResp = await axios.post(geminiUrl, requestBody, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
      timeout: 30000
    });

    if (geminiResp.status !== 200) {
      return res.status(geminiResp.status).json({ error: 'Gemini API error', details: geminiResp.data });
    }

    const text =
      geminiResp.data?.candidates?.[0]?.content?.parts
        ?.map(p => p?.text || '')
        .join('') || '';

    if (!text) return res.status(500).json({ error: 'No response from Gemini API' });

    return res.json({ ok: true, content: text });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err?.message });
  }
});

/**
 * HIBP endpoint (unchanged)
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

    if (response.status === 200) return res.json({ found: true, breaches: response.data });
    if (response.status === 404) return res.json({ found: false, breaches: [] });
    if (response.status === 429) return res.status(429).json({ error: 'Rate limited by HIBP. Try again later.' });

    return res.status(500).json({ error: 'HIBP error', details: response.data });
  } catch (err) {
    res.status(500).json({ error: 'server error', details: err.message });
  }
});

/**
 * Bing Visual Search (unchanged)
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
