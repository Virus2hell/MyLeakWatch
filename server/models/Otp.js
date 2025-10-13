const { Schema, model, Types } = require('mongoose');

const otpSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', index: true },
    credential: { type: Types.ObjectId, ref: 'Credential', index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// TTL index by expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = model('Otp', otpSchema);
module.exports = { Otp };
