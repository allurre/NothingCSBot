import { IUserInventoryItem } from "./user-inventoty-item.js";

export interface IUserInventory {
  id: number;
  coins: number;
  targets: number;
  items: Array<IUserInventoryItem>;
}
