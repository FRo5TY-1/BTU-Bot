const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  userID: { type: String, require: true },
  itemName: { type: String, require: true },
  itemAmount: { type: Number, require: true },
  itemTier: { type: Number, require: true },
});

const model = mongoose.model("ItemModels", itemSchema);

module.exports = model;