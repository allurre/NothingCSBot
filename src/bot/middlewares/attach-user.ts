import { Document } from "mongoose";
import { NextFunction } from "grammy";
import { IUser } from "#root/database/interfaces/user.js";
import { IUserStats } from "#root/database/interfaces/user-stats.js";
import { IUserInventory } from "#root/database/interfaces/user-inventory.js";
import { createUser, getUser } from "#root/database/schemas/user.js";
import { createStats, getStats } from "#root/database/schemas/user-stats.js";
import {
  createInventory,
  getInventory,
} from "#root/database/schemas/user-inventory.js";
import type { Context } from "../context.js";

export async function attachUser(ctx: Context, next: NextFunction) {
  if (
    ctx.from === undefined ||
    (ctx.msg === undefined && ctx.callbackQuery === undefined)
  ) {
    return next();
  }
  let userDB;
  let inventoryDB;
  let statDB;
  const userDatabase: (Document & IUser) | undefined = await getUser(
    ctx.from.id,
  );
  if (userDatabase === undefined) {
    const newUser: (Document & IUser) | undefined = createUser({
      id: ctx.from.id,
      username: ctx.from.first_name,
      locate_code: ctx.from.language_code || "en",
      status_id: -1,
    });
    if (newUser) await newUser.save();
    else return;
    userDB = newUser;
  } else {
    userDB = userDatabase;
  }

  const userInventory: (Document & IUserInventory) | undefined =
    await getInventory(ctx.from.id);
  if (userInventory === undefined) {
    const newInventory: (Document & IUserInventory) | undefined =
      createInventory(ctx.from.id);
    if (newInventory) await newInventory.save();
    else return;
    inventoryDB = newInventory;
  } else {
    inventoryDB = userInventory;
  }

  const userStats: (Document & IUserStats) | undefined = await getStats(
    ctx.from.id,
  );
  if (userStats === undefined) {
    const newStats: (Document & IUserStats) | undefined = createStats(
      ctx.from.id,
    );
    if (newStats) await newStats.save();
    else return;
    statDB = newStats;
  } else {
    statDB = userStats;
  }
  ctx.database = {
    user: userDB,
    inventory: inventoryDB,
    stats: statDB,
  };

  return next();
}
