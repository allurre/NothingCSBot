import {
  promocodesExpiredData,
  promocodesActiveData,
} from "#root/bot/callback-data/index.js";
import type { Context } from "#root/bot/context.js";
import { InlineKeyboard } from "grammy";

export const createExpiredPromoKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.view-expired_promocodes"),
        callback_data: promocodesExpiredData.pack({}),
      },
    ],
  ]);
};

export const createActivePromoKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.view-active_promocodes"),
        callback_data: promocodesActiveData.pack({}),
      },
    ],
  ]);
};
