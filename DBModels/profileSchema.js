const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  BTUcoins: { type: Number, default: 1000 },
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
