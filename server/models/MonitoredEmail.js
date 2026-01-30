const mongoose = require("mongoose")

const monitoredEmailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  userEmail: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  lastCheckedAt: Date,
})

module.exports = mongoose.model("MonitoredEmail", monitoredEmailSchema)
