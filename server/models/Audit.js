const { Schema, model, Types } = require('mongoose');

const auditSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', index: true },
    action: { type: String, enum: ['OTP_REQUEST', 'OTP_VERIFY_OK', 'OTP_VERIFY_FAIL', 'VIEW_SECRET'], required: true },
    credential: { type: Types.ObjectId, ref: 'Credential' },
    ip: String,
    ua: String,
  },
  { timestamps: true }
);

const Audit = model('Audit', auditSchema);
module.exports = { Audit };
