import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import {
  IUserInventoryItem,
  itemRarities,
} from "../interfaces/user-inventoty-item.js";

const ItemSchema: Schema = new Schema({
  _id: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  rarity: {
    type: String,
    required: true,
    default: "ARMY",
    enum: itemRarities,
  },
  group_drop_chance: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 100,
  },
  file_id: { type: String, required: false, default: undefined },
});

const Item = model<IUserInventoryItem>("Item", ItemSchema);

export default Item;

export async function getItem(
  id: string,
): Promise<(Document & IUserInventoryItem) | undefined> {
  if (!id) {
    logger.error("Item Id is required.");
    return undefined;
  }

  const itemDatabase = await Item.findById(id);
  if (itemDatabase) {
    return itemDatabase;
  }
  logger.error("Item is not found.");
  return undefined;
}

export function createItem(
  id: string,
  name: string,
  price: number,
  rarity: string,
): (Document & IUserInventoryItem) | undefined {
  if (!id || !name || !price || !rarity) {
    logger.error("New Item data is required.");
    return undefined;
  }

  const itemDatabase = new Item({
    _id: id,
    name,
    price,
    rarity,
  });

  return itemDatabase;
}
