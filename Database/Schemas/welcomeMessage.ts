import mongoose, { Schema } from "mongoose";

export interface WelcomeMessage {
  guildId: string;
  channelId: string;
  message: string;
}

const WelcomeMessageSchema = new Schema<WelcomeMessage>({
  guildId: { type: String, require: true, unique: true },
  channelId: { type: String, required: true, unique: true },
  message: { type: String, required: true },
});

export default mongoose.model("welcome_messages", WelcomeMessageSchema);
