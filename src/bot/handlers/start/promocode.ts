import { Context } from "#root/bot/context.js";
import { validatePromocodeUsage } from "#root/bot/helpers/validator.js";
import { getPromocode } from "#root/database/schemas/promocode.js";

export async function executeStartPromocode(ctx: Context, code: string) {
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
}
