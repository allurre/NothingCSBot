import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { additionallyShootsData } from "../callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  additionallyShootsData.filter(),
  logHandle("keyboard-additionally-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const _userDatabase = ctx.database.user;
  },
);

export { composer as additionallyFeature };
