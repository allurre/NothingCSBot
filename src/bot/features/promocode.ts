import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { promocodeData } from "#root/bot/callback-data/index.js";
import { getPromocode } from "#root/database/schemas/promocode.js";
import { validatePromocodeUsage } from "#root/bot/helpers/utils.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  promocodeData.filter(),
  logHandle("keyboard-promocode-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const { code } = promocodeData.unpack(ctx.callbackQuery.data);
    if (code) {
      const promocode = await getPromocode(code);
      if (promocode === undefined) {
        return ctx.reply(ctx.t("promocode.use-no_promocode"));
      }
      const promoUsage = validatePromocodeUsage(promocode);
      if (promoUsage.can_use === false) {
        if (promoUsage.reason === undefined) {
          return ctx.reply(ctx.t("promocode.use-no_promocode"));
        }
        return ctx.reply(ctx.t(promoUsage.reason));
      }
      // начисление за использование
    } else {
      ctx.reply(ctx.t("promocode.main"));
      await ctx.conversation.enter("promocodeConversation");
    }
  },
);
