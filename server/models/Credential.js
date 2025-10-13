const { Schema, model, Types } = require('mongoose');

const encryptedSchema = new Schema(
  {
    algo: { type: String, enum: ['AES-GCM'], required: true },
    ivB64: { type: String, required: true },
    saltB64: { type: String, required: true },
    ctB64: { type: String, required: true },
    iterations: { type: Number, required: true },
  },
  { _id: false }
);

const credentialSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', index: true },
    site: { type: String, required: true },
    username: { type: String, required: true },
    note: String,
    encrypted: { type: encryptedSchema, required: true },
  },
  { timestamps: true }
);

const Credential = model('Credential', credentialSchema);
module.exports = { Credential };
