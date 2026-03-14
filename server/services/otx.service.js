const axios = require("axios");

const OTX_API_KEY = process.env.OTX_API_KEY;

const headers = {
  "X-OTX-API-KEY": OTX_API_KEY
};

async function fetchOTXAttacks() {
  const response = await axios.get(
    "https://otx.alienvault.com/api/v1/pulses/subscribed",
    { headers }
  );

  const pulses = response.data.results;

  const attacks = pulses.map((pulse, index) => {
    const countryCode = pulse.targeted_countries?.[0] || "US";

    return {
      id: `ATK-${index + 1}`,
      type: mapAttackType(pulse.tags),
      severity: mapSeverity(pulse.adversary),
      country: countryCode,
      countryCode,
      timestamp: new Date(pulse.modified),
      source: "AlienVault OTX",
      target: pulse.name,
      description: pulse.description || "Threat intelligence pulse",
      indicators: pulse.indicators?.map(i => i.indicator)
    };
  });

  return attacks;
}

function mapAttackType(tags = []) {
  if (tags.includes("phishing")) return "Phishing";
  if (tags.includes("ransomware")) return "Ransomware";
  if (tags.includes("malware")) return "Malware";
  if (tags.includes("ddos")) return "DDoS";
  if (tags.includes("xss")) return "XSS";
  return "APT";
}

function mapSeverity(adversary) {
  if (!adversary) return "medium";
  return "high";
}

module.exports = { fetchOTXAttacks };