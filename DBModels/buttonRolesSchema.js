const mongoose = require("mongoose");

const buttonRolesSchema = new mongoose.Schema({
  guildID: { type: String, require: true },
  messageID: { type: String, require: true },
  buttonCustomID: { type: String, require: true },
  buttonStyle: { type: String, require: true },
  buttonLabel: { type: String, require: true },
  buttonEmojiID: { type: String, require: true },
  roleID: { type: String, require: true },
  changable: { type: Boolean, require: true },
});

const model = mongoose.model("ButtonRolesModel", buttonRolesSchema);

module.exports = model;
