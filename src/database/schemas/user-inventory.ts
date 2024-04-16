import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { IUserInventory } from "../interfaces/user-inventory.js";
import { LRUCache } from "../cache/cache.js";

const cache = new LRUCache<number, Document & IUserInventory>(100);

const InventorySchema: Schema = new Schema({
  _id: { type: Number, required: true },
  coins: { type: Number, required: true, default: 0 },
  targets: { type: Number, required: true, default: 0 },
  items: [{ type: String, required: true }],
});

InventorySchema.pre(
  "save",
  function psave(this: Document & IUserInventory, next) {
    cache.add(this._id, this);
    next();
  },
);

const Inventory = model<IUserInventory>("Inventory", InventorySchema);

export default Inventory;

export async function getInvetory(
  id: number,
): Promise<(Document & IUserInventory) | undefined> {
  if (!id) {
    logger.error("Inventory Id is required.");
    return undefined;
  }
  const inventoryId = -id;

  const cached = cache.get(inventoryId);
  if (cached) return cached;

  const inventoryDatabase = await Inventory.findById(inventoryId);
  if (inventoryDatabase) {
    cache.add(inventoryId, inventoryDatabase);
  } else {
    logger.error("Inventory is not register.");
    return undefined;
  }

  return inventoryDatabase;
}

export function createInvetory(
  id: number,
): (Document & IUserInventory) | undefined {
  if (!id) {
    logger.error("New inventory Id is required.");
    return undefined;
  }
  const inventoryId = -id;

  const inventoryDatabase = new Inventory({
    _id: inventoryId,
  });

  cache.add(inventoryId, inventoryDatabase);
  return inventoryDatabase;
}
