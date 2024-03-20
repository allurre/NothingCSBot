/* eslint-disable no-await-in-loop */
import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { setCommandsHandler } from "#root/bot/handlers/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import {
  createAdminPanelMainKeyboard,
  createUserPickKeyboard,
} from "../keyboards/index.js";
import {
  userManagementData,
  moneyChangeData,
  shootChangeData,
} from "../callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.command(
  "setcommands",
  logHandle("command-setcommands"),
  chatAction("typing"),
  setCommandsHandler,
);

feature.command("panel", logHandle("command-admin-panel"), async (ctx) => {
  ctx.reply(ctx.t("admin.panel-main"), {
    reply_markup: createAdminPanelMainKeyboard(ctx),
  });
});

feature.callbackQuery(
  userManagementData.filter(),
  logHandle("keyboard-usermanage-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-pick_user"), {
      reply_markup: createUserPickKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  moneyChangeData.filter(),
  logHandle("keyboard-usermoneychange-select"),
  async (ctx) => {
    const { id: userId, count } = moneyChangeData.unpack(
      ctx.callbackQuery.data,
    );
    const userInventory = await getInvetory(userId);
    if (userInventory === undefined) {
      ctx.answerCallbackQuery();
      return ctx.reply(ctx.t("errors.no-select-user-found"));
    }
    if (count === 0) {
      ctx.answerCallbackQuery();
      ctx.reply(ctx.t("admin.money-choose"));
      // const message = await waitMessage(ctx);
      // if (message === undefined) {
      //   return ctx.reply(ctx.t("errors.no-response"));
      // }
      // changeMoney = Number.parseInt(message.text || "0", 10);
    }
    userInventory.coins += count;
    userInventory.save();
    ctx.answerCallbackQuery();
    ctx.api.sendMessage(
      userId,
      ctx.t("notifications.money_change", {
        coins: userInventory.coins,
        reason: "CONSOLE",
      }),
    );
    ctx.reply(ctx.t("admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);

feature.callbackQuery(
  shootChangeData.filter(),
  logHandle("keyboard-usershootchange-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-pick_user"), {
      reply_markup: createUserPickKeyboard(ctx),
    });
  },
);

export { composer as adminFeature };
