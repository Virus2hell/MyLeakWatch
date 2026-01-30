module.exports = {
  baseURL: "https://haveibeenpwned.com/api/v3",
  headers: {
    "hibp-api-key": process.env.HIBP_API_KEY,
    "user-agent": "MyLeakWatch",
  },
}
const axios = require("axios")
const { baseURL, headers } = require("../config/hibp")

const checkBreaches = async (email) => {
  try {
    const res = await axios.get(
      `${baseURL}/breachedaccount/${email}`,
      { headers }
    )
    return res.data
  } catch (err) {
    if (err.response?.status === 404) return []
    throw err
  }
}

module.exports = { checkBreaches }
