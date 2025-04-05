const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  subject: String,
  body: String,
  isDraft: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
  sentAt: Date,
  receivedAt: Date,
});

const Email = mongoose.model('Email', emailSchema);
module.exports = Email;
