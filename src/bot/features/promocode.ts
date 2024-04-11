import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { promocodeData } from "#root/bot/callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  promocodeData.filter(),
  logHandle("keyboard-promocode-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const { code: promoCode } = promocodeData.unpack(ctx.callbackQuery.data);
    if (promoCode) {
      ctx.reply(ctx.t("promocode.use-"));
    } else {
      ctx.reply(ctx.t("promocode.main"));
      await ctx.conversation.enter("promocodeConversation");
    }
  },
);
