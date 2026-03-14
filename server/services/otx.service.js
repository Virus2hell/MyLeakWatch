const axios = require("axios");

const OTX_API_KEY = process.env.OTX_API_KEY;

const headers = {
  "X-OTX-API-KEY": OTX_API_KEY,
};

async function fetchOTXAttacks() {
  try {
    const response = await axios.get(
      "https://otx.alienvault.com/api/v1/pulses/recent",
      { headers }
    );

    const pulses = response.data.results;

    const attacks = pulses.map((pulse, index) => {
      const countryCode = pulse.targeted_countries?.[0] || "US";

      return {
        id: `ATK-${index + 1}`,
        type: mapAttackType(pulse.tags),
        severity: "medium",
        country: countryCode,
        countryCode,
        timestamp: new Date(pulse.modified),
        source: "OTX",
        target: pulse.name,
        description: pulse.description || "Threat intelligence pulse",
      };
    });

    return attacks;
  } catch (err) {
    console.error("OTX API ERROR:", err.response?.data || err.message);
    return [];
  }
}

function mapAttackType(tags = []) {
  if (tags.includes("phishing")) return "Phishing";
  if (tags.includes("malware")) return "Malware";
  if (tags.includes("ransomware")) return "Ransomware";
  if (tags.includes("ddos")) return "DDoS";
  return "APT";
}

module.exports = { fetchOTXAttacks };