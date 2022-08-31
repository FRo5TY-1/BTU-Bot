import mongoose, { Schema } from "mongoose";
import ShopItemSchema from "./shopItem";

interface ShopItem {
  guildId: String;
  tier: Number;
  rarity: String;
  name: String;
  price: Number;
}

export interface Inventory {
  guildId: String;
  userId: String;
  item: ShopItem;
  amount: Number;
}

const InventorySchema = new Schema<Inventory>({
  guildId: { type: String, require: true },
  userId: { type: String, require: true },
  item: { type: Schema.Types.ObjectId, ref: "shop_items", require: true },
  amount: { type: Number, default: 1 },
});

export default mongoose.model("inventorys", InventorySchema);
