import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { calibrationData } from "#root/bot/callback-data/index.js";
import {
  getColibrationRangID,
  getRangById,
} from "#root/bot/helpers/varibles.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  calibrationData.filter(),
  logHandle("keyboard-calibration-select"),
  async (ctx) => {
    const userDatabase = ctx.database.user;
    ctx.answerCallbackQuery();
    const calibrationMessage = await ctx.replyWithDice("🎯");
    const rangId: number = getColibrationRangID(calibrationMessage.dice.value);
    userDatabase.status_id = rangId;
    const timerPromise = new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    Promise.all([userDatabase.save(), timerPromise]).then(() => {
      ctx.reply(ctx.t("calibration.end", { rang: getRangById(rangId) }));
    });
  },
);

export { composer as calibrationFeature };
