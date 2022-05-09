const mongoose = require("mongoose");

const upvotechannelmodels = new mongoose.Schema({
  guildId: { type: String, require: true },
  channelId: { type: String, require: true },
});

const model = mongoose.model("upvotechannelmodels", upvotechannelmodels);

module.exports = model;
