import { InlineKeyboard } from "grammy";
import { homeData } from "#root/bot/callback-data/index.js";
import type { Context } from "#root/bot/context.js";

export const createHomeKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("default_buttons.home"),
        callback_data: homeData.pack({}),
      },
    ],
  ]);
};
