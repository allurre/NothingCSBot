import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { inventoryData, profileData } from "#root/bot/callback-data/index.js";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { getUser } from "#root/database/schemas/user.js";
import { getStats } from "#root/database/schemas/user-stats.js";
import { getRangById } from "#root/bot/helpers/varibles.js";
import {
  createInventoryKeyboard,
  createProfileKeyboard,
} from "#root/bot/keyboards/profile.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("profile", logHandle("command-profile"), async (ctx) => {
  const userId = Number.parseInt(ctx.match, 10);
  const userInventory = await getInvetory(userId);
  const userDatabase = await getUser(userId);
  const userStats = await getStats(userId);
  if (
    userInventory === undefined ||
    userDatabase === undefined ||
    userStats === undefined
  ) {
    ctx.reply(ctx.t("errors.no-select-user-found"));
    return;
  }
  const rang = getRangById(userDatabase.status_id || -1);
  ctx.reply(
    ctx.t("profile.main", {
      id: userInventory.id,
      name: userDatabase.username,
      rang,
      coins: userInventory.coins,
      accuracy: userStats.headshots / userStats.shoots,
    }),
    {
      reply_markup: createProfileKeyboard(ctx, userId),
    },
  );
});

feature.callbackQuery(
  profileData.filter(),
  logHandle("keyboard-profile-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const userId = ctx.from.id;
    const userInventory = ctx.database.inventory;
    const userDatabase = ctx.database.user;
    const userStats = ctx.database.stats;
    const rang = getRangById(userDatabase.status_id || 0);
    ctx.answerCallbackQuery();
    ctx.reply(
      ctx.t("profile.main", {
        id: userInventory.id,
        name: userDatabase.username,
        rang,
        coins: userInventory.coins,
        accuracy: userStats.headshots / userStats.shoots,
      }),
      {
        reply_markup: createProfileKeyboard(ctx, userId),
      },
    );
  },
);

feature.callbackQuery(
  inventoryData.filter(),
  logHandle("keyboard-inventory-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const userId = ctx.from.id;
    const userInventory = ctx.database.inventory;
    const _userDatabase = ctx.database.user;
    ctx.answerCallbackQuery();
    ctx.reply(
      ctx.t("profile.inventory", {
        id: userInventory.id,
      }),
      {
        reply_markup: createInventoryKeyboard(ctx, userId),
      },
    );
  },
);

export { composer as profileFeature };
