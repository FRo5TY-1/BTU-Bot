import mongoose, { Schema } from "mongoose";

export interface VoiceState {
  id: String;
  timestamp: Number;
  channelId: String;
}

const VoiceStateSchema = new Schema<VoiceState>({
  id: { type: String, required: true },
  timestamp: { type: Number, required: true },
  channelId: { type: String },
});

export default mongoose.model("voice_states", VoiceStateSchema);
