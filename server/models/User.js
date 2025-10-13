const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    googleId: { type: String, index: true },
    email: { type: String, required: true, unique: true },
    name: String,
  },
  { timestamps: true }
);

const User = model('User', userSchema);
module.exports = { User };
