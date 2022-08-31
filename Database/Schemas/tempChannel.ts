import mongoose, { Schema } from "mongoose";

export interface TempChannel {
  guildId: String;
  userId: String;
  channelId: String;
  expiry: String;
  channelType: String;
}

const TempChannelSchema = new mongoose.Schema<TempChannel>({
  guildId: { type: String, require: true },
  userId: { type: String, require: true },
  channelId: { type: String, require: true },
  expiry: { type: Number, require: true },
  channelType: { type: String, require: true },
});

export default mongoose.model("temp_channels", TempChannelSchema);
