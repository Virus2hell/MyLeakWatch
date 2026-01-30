const axios = require('axios');

async function checkBreaches(email) {
  try {
    const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`, {
      headers: {
        'hibp-api-key': process.env.HIBP_API_KEY,
        'user-agent': 'MyLeakWatch/1.0'
      }
    });
    return response.data; // Array of breaches
  } catch (err) {
    if (err.response?.status === 429) {
      const delay = parseInt(err.response.headers['retry-after']) * 1000 || 1500;
      await new Promise(r => setTimeout(r, delay));
      return checkBreaches(email); // Retry
    }
    throw err;
  }
}

module.exports = { checkBreaches };
