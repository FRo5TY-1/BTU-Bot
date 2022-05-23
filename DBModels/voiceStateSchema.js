const mongoose = require("mongoose");

const voiceStateModels = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  channelid: { type: String },
});

const model = mongoose.model("VoiceStateModels", voiceStateModels);

module.exports = model;
