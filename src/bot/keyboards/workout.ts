import { InlineKeyboard } from "grammy";
import {
  shootData,
  additionallyShootsData,
  homeData,
} from "#root/bot/callback-data/index.js";
import type { Context } from "#root/bot/context.js";

export const createWorkoutKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("workout_buttons.shoot"),
        callback_data: shootData.pack({
          count: 1,
        }),
      },
      {
        text: ctx.t("workout_buttons.additionally"),
        callback_data: additionallyShootsData.pack({}),
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
