const mongoose = require("mongoose");

const premiumServerModels = new mongoose.Schema({
  guildId: { type: String, require: true },
});

const model = mongoose.model("PremiumServerModels", premiumServerModels);

module.exports = model;
