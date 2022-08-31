import mongoose, { Schema } from "mongoose";

export interface UpvoteChannel {
  guildId: String;
  channelId: String;
}

const UpvoteChannelSchema = new Schema<UpvoteChannel>({
  guildId: { type: String, require: true },
  channelId: { type: String, require: true },
});

export default mongoose.model("upvote_channels", UpvoteChannelSchema);
