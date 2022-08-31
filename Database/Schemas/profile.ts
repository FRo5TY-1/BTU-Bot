import mongoose, { Schema } from "mongoose";

export interface Profile {
  guildId: String;
  userId: String;
  email: String;
  BTUcoins: Number;
  streamTime: Number;
}

const ProfileSchema = new Schema<Profile>(
  {
    guildId: { type: String, require: true },
    userId: { type: String, require: true },
    email: { type: String, default: null },
    BTUcoins: { type: Number, default: 500 },
    streamTime: { type: Number, default: 0 },
  },
  { strict: false }
);

export default mongoose.model("profiles", ProfileSchema);
