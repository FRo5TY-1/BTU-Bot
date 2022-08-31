import mongoose, { Schema } from "mongoose";

export interface Cooldown {
  guildId: String;
  userId: String;
  command: String;
  expiry: Number;
}

const CooldownsSchema = new Schema<Cooldown>({
  guildId: { type: String, require: true },
  userId: { type: String, require: true },
  command: { type: String, require: true },
  expiry: { type: Number, require: true },
});

export default mongoose.model("cooldowns", CooldownsSchema);
