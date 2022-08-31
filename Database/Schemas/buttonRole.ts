import mongoose, { Schema } from "mongoose";

export interface ButtonRole {
  guildId: String;
  messageId: String;
  buttonCustomId: String;
  buttonStyle: String;
  buttonLabel: String;
  buttonEmojiId: String;
  roleId: String;
  changable: Boolean;
}

const ButtonRolesSchema = new Schema<ButtonRole>({
  guildId: { type: String, require: true },
  messageId: { type: String, require: true },
  buttonCustomId: { type: String, require: true },
  buttonStyle: { type: String, require: true },
  buttonLabel: { type: String, require: true },
  buttonEmojiId: { type: String, require: true },
  roleId: { type: String, require: true },
  changable: { type: Boolean, require: true },
});

export default mongoose.model("button_roles", ButtonRolesSchema);
