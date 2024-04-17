import { Context } from "#root/bot/context.js";
import { Conversation } from "#root/bot/conversation.js";
import { getPromocode } from "#root/database/schemas/promocode.js";

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
  ctx.reply(promocode.code);
}

export { promocodeUsege as promocodeConversation };
