import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  createRegisterKeyboard,
  createStartKeyboard,
} from "#root/bot/keyboards/index.js";
import { homeData } from "#root/bot/callback-data/index.js";
import { executeStartMatch } from "#root/bot/helpers/utils.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), async (ctx) => {
  if (ctx.database === undefined) {
    return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
  }
  if (ctx.match) {
    const action = ctx.match.split("-")[0];
    const arguments_ = ctx.match.replace(/^-?\w+-\s*/, "");
    executeStartMatch(ctx, action, arguments_);
    if (action.startsWith("admin")) return ctx.msg.delete();
  }
  const userDatabase = ctx.database.user;
  await (userDatabase.locate_code === undefined
    ? ctx.i18n.setLocale(ctx.from.language_code || "en")
    : ctx.i18n.setLocale(ctx.database.user.locate_code));
  if (userDatabase.status_id === -1)
    return ctx.reply(ctx.t("start.register", { name: ctx.from.first_name }), {
      reply_markup: createRegisterKeyboard(ctx),
    });
  return ctx.reply(ctx.t("start.welcome", { name: userDatabase.username }), {
    reply_markup: createStartKeyboard(ctx),
  });
});

feature.callbackQuery(
  homeData.filter(),
  logHandle("unhandled-callback-query"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const userDatabase = ctx.database.user;
    await (userDatabase.locate_code === undefined
      ? ctx.i18n.setLocale(ctx.from.language_code || "en")
      : ctx.i18n.setLocale(ctx.database.user.locate_code));
    ctx.answerCallbackQuery();
    if (userDatabase.status_id === -1)
      return ctx.reply(ctx.t("start.register", { name: ctx.from.first_name }), {
        reply_markup: createRegisterKeyboard(ctx),
      });
    return ctx.reply(ctx.t("start.welcome", { name: userDatabase.username }), {
      reply_markup: createStartKeyboard(ctx),
    });
  },
);

export { composer as startFeature };
