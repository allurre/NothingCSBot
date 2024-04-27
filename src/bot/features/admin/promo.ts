import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  promocodesActiveData,
  promocodesExpiredData,
} from "#root/bot/callback-data/index.js";
import {
  getAllActivePromocodes,
  getAllExpiredPromocodes,
} from "#root/database/schemas/promocode.js";
import {
  createActivePromoKeyboard,
  createExpiredPromoKeyboard,
} from "#root/bot/keyboards/admin/promo.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.callbackQuery(
  promocodesActiveData.filter(),
  logHandle("keyboard-active_promo-view-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    const activePromos = await getAllActivePromocodes();
    if (activePromos === undefined) {
      return ctx.reply(ctx.t("admin.panel-no_active_promo"), {
        reply_markup: createExpiredPromoKeyboard(ctx),
      });
    }
  },
);

feature.callbackQuery(
  promocodesExpiredData.filter(),
  logHandle("keyboard-expired_promo-view-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    const expiredPromos = await getAllExpiredPromocodes();
    if (expiredPromos === undefined) {
      return ctx.reply(ctx.t("admin.panel-no_expired_promo"), {
        reply_markup: createActivePromoKeyboard(ctx),
      });
    }
  },
);

export { composer as adminPromoFeature };
