const mongoose = require("mongoose");

const shopItemModels = new mongoose.Schema({
  guildId: { type: String, require: true },
  tier: { type: Number, require: true },
  rarity: { type: String, require: true },
  name: { type: String, require: true },
  price: { type: Number, require: true },
});

const model = mongoose.model("shopItemModels", shopItemModels);

module.exports = model;
