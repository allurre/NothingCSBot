import { InlineKeyboard } from "grammy";
import { inventoryData, homeData } from "#root/bot/callback-data/index.js";
import type { Context } from "#root/bot/context.js";

export const createProfileKeyboard = (ctx: Context, userId: number) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("profile_buttons.inventory"),
        callback_data: inventoryData.pack({
          id: userId,
        }),
      },
    ],
    [
      {
        text: ctx.t("default_buttons.home"),
        callback_data: homeData.pack({}),
      },
    ],
  ]);
};

export const createInventoryKeyboard = (ctx: Context, userId: number) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("profile_buttons.items-previous"),
        callback_data: inventoryData.pack({
          id: userId,
        }),
      },
      {
        text: ctx.t("profile_buttons.items-next"),
        callback_data: inventoryData.pack({
          id: userId,
        }),
      },
    ],
    [
      {
        text: ctx.t("default_buttons.home"),
        callback_data: homeData.pack({}),
      },
    ],
  ]);
};
