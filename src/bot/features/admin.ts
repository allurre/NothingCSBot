/* eslint-disable no-await-in-loop */
import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { setCommandsHandler } from "#root/bot/handlers/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { createAdminPanelMainKeyboard } from "#root/bot/keyboards/index.js";
import { adminPanelData } from "#root/bot/callback-data/index.js";
import { adminUsersFeature } from "./admin/user.js";
import { adminAdditionallyFeature } from "./admin/additionally.js";
import { adminCasesFeature } from "./admin/cases.js";
import { adminItemsFeature } from "./admin/items.js";
import { adminPromoFeature } from "./admin/promo.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.command(
  "setcommands",
  logHandle("command-set_commands"),
  chatAction("typing"),
  setCommandsHandler,
);

feature.command("panel", logHandle("command-admin-panel"), async (ctx) => {
  ctx.reply(ctx.t("admin.panel-main"), {
    reply_markup: createAdminPanelMainKeyboard(ctx),
  });
});

feature.callbackQuery(
  adminPanelData.filter(),
  logHandle("keyboard-user_manage-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.editMessageText(ctx.t("admin.panel-main"), {
      reply_markup: createAdminPanelMainKeyboard(ctx),
    });
  },
);

feature.use(adminUsersFeature);
feature.use(adminAdditionallyFeature);
feature.use(adminCasesFeature);
feature.use(adminItemsFeature);
feature.use(adminPromoFeature);

export { composer as adminFeature };
