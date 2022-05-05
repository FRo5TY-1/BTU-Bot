const mongoose = require("mongoose");
const { schema } = require("./shopItemsSchema");

const itemSchema = new mongoose.Schema({
  guildId: { type: String, require: true },
  userID: { type: String, require: true },
  item: { type: schema, require: true },
  amount: { type: Number, default: 1 },
});

const model = mongoose.model("inventorymodels", itemSchema);

module.exports = model;
