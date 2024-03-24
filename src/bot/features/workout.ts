import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { workoutData, shootData } from "#root/bot/callback-data/index.js";
import { createWorkoutKeyboard } from "../keyboards/workout.js";
import { shoot } from "../helpers/utils.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  workoutData.filter(),
  logHandle("keyboard-workout-select"),
  async (ctx) => {
    ctx.reply(ctx.t("workout.main"), {
      reply_markup: createWorkoutKeyboard(ctx),
    });
    ctx.answerCallbackQuery();
  },
);

feature.callbackQuery(
  shootData.filter(),
  logHandle("keyboard-shoot-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      ctx.reply(ctx.t("errors.no-registered-user"));
    }
    shoot(ctx, ctx.database.user, ctx.database.inventory, ctx.database.stats);
    ctx.answerCallbackQuery();
  },
);

export { composer as workoutFeature };
