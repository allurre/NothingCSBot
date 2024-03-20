import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  createRegisterKeyboard,
  createStartKeyboard,
} from "#root/bot/keyboards/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), async (ctx) => {
  const userDatabase = ctx.database.user;
  if (userDatabase.status_id === -1)
    return ctx.reply(ctx.t("start.register"), {
      reply_markup: createRegisterKeyboard(ctx),
    });
  return ctx.reply(ctx.t("start.welcome"), {
    reply_markup: createStartKeyboard(ctx),
  });
});

export { composer as welcomeFeature };
