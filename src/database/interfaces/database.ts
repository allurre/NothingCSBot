import { Document } from "mongoose";
import { IUserInventory } from "./user-inventory.js";
import { IUser } from "./user.js";
import { IUserStats } from "./user-stats.js";

export interface Database {
  database: {
    user: Document & IUser;
    inventory: Document & IUserInventory;
    stats: Document & IUserStats;
  };
}
