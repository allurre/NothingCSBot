import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { workoutData, shootData } from "#root/bot/callback-data/index.js";
import { IUser } from "#root/database/interfaces/user.js";
import { getUser } from "#root/database/schemas/user.js";
import { Document } from "mongoose";
import { IUserInventory } from "#root/database/interfaces/user-inventory.js";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { createWorkoutKeyboard } from "../keyboards/workout.js";
import { shoot } from "../helpers/utils.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  workoutData.filter(),
  logHandle("keyboard-workout-select"),
  async (ctx) => {
    const userId = ctx.from.id;
    const userDatabase: (Document & IUser) | undefined = await getUser(userId);
    const userInventory: (Document & IUserInventory) | undefined =
      await getInvetory(userId);
    if (userDatabase === undefined || userInventory === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
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
    shoot(ctx);
    ctx.answerCallbackQuery();
  },
);

export { composer as workoutFeature };
