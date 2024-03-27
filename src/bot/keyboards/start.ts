import { InlineKeyboard } from "grammy";
import {
  workoutData,
  profileData,
  calibrationData,
} from "#root/bot/callback-data/index.js";
import type { Context } from "#root/bot/context.js";

export const createRegisterKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("start_buttons.calibration"),
        callback_data: calibrationData.pack({}),
      },
    ],
  ]);
};

export const createStartKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("start_buttons.workout"),
        callback_data: workoutData.pack({}),
      },
    ],
    [
      {
        text: ctx.t("start_buttons.profile"),
        callback_data: profileData.pack({}),
      },
    ],
  ]);
};
