const mongoose = require('mongoose');
const { config } = require('./config');

async function connectDB() {
  await mongoose.connect(config.MONGO_URI);
}

module.exports = { connectDB };
