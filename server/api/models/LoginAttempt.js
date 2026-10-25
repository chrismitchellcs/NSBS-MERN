const mongoose = require("mongoose");

/**
 * Failed admin login counter per client IP. Stored in Mongo (not memory) so the limit holds across
 * serverless instances; documents expire on their own via the TTL index.
 */
const LoginAttemptSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

LoginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("LoginAttempt", LoginAttemptSchema);
