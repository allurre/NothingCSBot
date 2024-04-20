import { Context } from "#root/bot/context.js";
import { Conversation } from "#root/bot/conversation.js";
import { getPromocode } from "#root/database/schemas/promocode.js";
import { validatePromocodeUsage } from "#root/bot/helpers/validator.js";

async function promocodeUsege(conversation: Conversation, ctx: Context) {
  const { message } = await conversation.wait();
  if (message === undefined) {
    return ctx.reply(ctx.t("errors.too-old"));
  }
  if (message.text === undefined) {
    return promocodeUsege(conversation, ctx);
  }
  const promocode = await getPromocode(message.text);
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
}

export { promocodeUsege as promocodeConversation };
