const mongoose = require('mongoose');
const { env } = require('./config');

async function connectDB() {
  await mongoose.connect(env.MONGO_URI);
}

module.exports = { connectDB };
