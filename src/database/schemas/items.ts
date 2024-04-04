import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import {
  IUserInventoryItem,
  ItemRarity,
} from "../interfaces/user-inventoty-item.js";
import { LRUCache } from "../cache/cache.js";

const cache = new LRUCache<number, Document & IUserInventoryItem>(100);

const ItemSchema: Schema = new Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true, default: 0 },
  price: { type: Number, required: true, default: 0 },
  rarity: { type: ItemRarity, required: true, default: 0 },
});

ItemSchema.pre(
  "save",
  function psave(this: Document & IUserInventoryItem, next) {
    cache.add(this._id, this);
    next();
  },
);

const Item = model<IUserInventoryItem>("Item", ItemSchema);

export default Item;

export async function getItem(
  id: number,
): Promise<(Document & IUserInventoryItem) | undefined> {
  if (!id) {
    logger.error("Item Id is required.");
    return undefined;
  }

  const cached = cache.get(id);
  if (cached) return cached;

  const itemDatabase = await Item.findById(id);
  if (itemDatabase) {
    cache.add(id, itemDatabase);
  } else {
    logger.error("Item is not register.");
    return undefined;
  }

  return itemDatabase;
}

export function createStats(
  id: number,
): (Document & IUserInventoryItem) | undefined {
  if (!id) {
    logger.error("New Item Id is required.");
    return undefined;
  }

  const itemDatabase = new Item({
    _id: id,
  });

  cache.add(id, itemDatabase);
  return itemDatabase;
}
