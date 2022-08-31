import mongoose, { Schema } from "mongoose";

export interface PremiumServer {
  guildId: String;
}

const PremiumServerSchema = new Schema<PremiumServer>({
  guildId: { type: String, require: true },
});

export default mongoose.model("premium_servers", PremiumServerSchema);
