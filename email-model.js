const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    subject: String,
    body: String,
    isDraft: { type: Boolean, default: false },
    sentAt: Date
});
module.exports = mongoose.model("Email", emailSchema);
