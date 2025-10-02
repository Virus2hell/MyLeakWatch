// server/index.js
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

///contact form
const contactRoute = require("./routes/contact"); // new route

// Register routes
app.use("/api/check-email", emailChecker);


// configure multer to store file in memory / temp
const upload = multer({ dest: 'uploads/' });

// ========== HIBP: Check email ==========
app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    // HIBP endpoint
    const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;

    const headers = {
      'hibp-api-key': process.env.HIBP_API_KEY || '',
      'user-agent': 'MyLeakWatch/1.0 (contact@example.com)'
    };

    const response = await axios.get(hibpUrl, { headers, validateStatus: ()=>true });

    // 200 -> array of breaches; 404 -> not found; other -> error
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

// ========== Image reverse search via Bing Visual Search ==========
app.post('/api/check-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // read file
    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    // Build form-data for Bing Visual Search
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
      validateStatus: ()=>true
    });

    // cleanup temp file
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
app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
