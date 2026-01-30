const express = require("express")
const MonitoredEmail = require("../models/MonitoredEmail")
const router = express.Router()

router.post("/monitor-email", async (req, res) => {
  const { email, userEmail } = req.body

  await MonitoredEmail.create({
    email,
    userEmail,
    enabled: true,
  })

  res.json({ success: true })
})

module.exports = router
