const mongoose = require("mongoose")

const breachLogSchema = new mongoose.Schema({
  email: String,
  breachName: String,
  breachDate: String,
  notifiedAt: Date,
})

module.exports = mongoose.model("BreachLog", breachLogSchema)
