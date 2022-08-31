import mongoose, { Schema } from "mongoose";

export interface ShopItem {
  guildId: String;
  tier: Number;
  rarity: String;
  name: String;
  price: Number;
}

const ShopItemSchema = new Schema<ShopItem>({
  guildId: { type: String, require: true },
  tier: { type: Number, require: true },
  rarity: { type: String, require: true },
  name: { type: String, require: true },
  price: { type: Number, require: true },
});

export default mongoose.model("shop_items", ShopItemSchema);
