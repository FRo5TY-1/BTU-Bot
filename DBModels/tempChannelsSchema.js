const mongoose = require("mongoose");

const tempChannelsSchema = new mongoose.Schema({
  userID: { type: String, require: true },
  channelID: { type: String, require: true },
  expiry: { type: Number, require: true },
  channelType: { type: String, require: true },
});

const model = mongoose.model("TempChannelModels", tempChannelsSchema);

module.exports = model;
