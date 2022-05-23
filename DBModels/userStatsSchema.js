const mongoose = require("mongoose");

const userStatsModels = new mongoose.Schema({
  id: { type: String, required: true },
  seconds: { type: Number, required: true },
  guildid: { type: String },
});

const model = mongoose.model("UserStatsModels", userStatsModels);

module.exports = model;
