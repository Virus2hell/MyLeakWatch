const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/cyber-news", async (req, res) => {
  try {

    const response = await axios.get(
      `https://gnews.io/api/v4/search?q=cybersecurity OR ransomware OR malware OR data breach&lang=en&max=10&apikey=${process.env.GNEWS_API_KEY}`
    );

    const articles = response.data.articles || [];

    const formattedNews = articles.map((article, index) => ({
      id: `NEWS-${index}`,
      type: "Cyber News",
      severity: "medium",
      country: "Global",
      countryCode: "GL",
      timestamp: article.publishedAt,
      source: article.source.name,
      target: "Internet",
      description: article.title,
      feed: "CyberNews"
    }));

    res.json(formattedNews);

  } catch (error) {

    console.log("Cyber news error:", error.message);

    res.status(500).json({
      error: "Cyber news unavailable"
    });

  }
});

module.exports = router;