const mongoose = require("mongoose");

const cooldownsSchema = new mongoose.Schema({
  guildId: { type: String, require: true },
  userID: { type: String, require: true },
  command: { type: String, require: true },
  expiry: { type: Number, require: true },
});

const model = mongoose.model("CooldownsModels", cooldownsSchema);

module.exports = model;
