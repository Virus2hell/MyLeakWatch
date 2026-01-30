const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  notificationFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "daily",
  },
})

module.exports = mongoose.model("User", userSchema)
