const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const upstreamUrl =
      process.env.PROVIDER_URL || 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' });

    const inputMsgs = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const safe = inputMsgs.slice(-20).map(m => ({
      role: m.role === 'user' ? 'user' : m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 4000)
    }));

    const system = {
      role: 'system',
      content:
        'You are MyLeakWatch Assistant. Help with breach safety, password hygiene, and how to use this site. ' +
        'Never ask for or store passwords. For email breach checks, direct users to the homepage email input.'
    };

    const body = {
      model: process.env.MODEL || 'gpt-4o-mini',
      stream: true,
      temperature: 0.4,
      messages: [system, ...safe]
    };

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const upstream = await axios.post(upstreamUrl, body, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      responseType: 'stream',
      validateStatus: () => true
    });

    if (upstream.status < 200 || upstream.status >= 300) {
      res.status(upstream.status).end('Upstream error'); return;
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
        } catch {}
      }
    });
    upstream.data.on('end', () => res.end());
    upstream.data.on('error', () => res.end());
    req.on('close', () => { try { upstream.data.destroy?.(); } catch {} });
  } catch (e) {
    res.status(500).end('Server error');
  }
});

module.exports = router;
