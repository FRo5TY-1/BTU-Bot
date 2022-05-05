const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  guildId: { type: String, require: true },
  userID: { type: String, require: true },
  BTUcoins: { type: Number, default: 500 },
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
