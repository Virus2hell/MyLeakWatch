const express = require("express");
const router = express.Router();
const { fetchOTXAttacks } = require("../services/otx.service");

router.get("/attacks", async (req, res) => {
  try {
    const attacks = await fetchOTXAttacks();
    res.json(attacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch OTX data" });
  }
});

module.exports = router;