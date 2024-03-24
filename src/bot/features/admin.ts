/* eslint-disable no-await-in-loop */
import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { setCommandsHandler } from "#root/bot/handlers/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { adminComment } from "#root/bot/statelessquestion/admin.js";
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
      return ctx.reply(
        ctx.t("admin.money-choose") +
          adminComment.messageSuffixHTML(`${userId.toString()}/coins`),
        {
          reply_markup: {
            force_reply: true,
            input_field_placeholder: `${userInventory.coins}/${ctx.from.first_name}`,
          },
        },
      );
    }
    userInventory.coins += count;
    userInventory.save();
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
  },
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
  shootChangeData.filter(),
  logHandle("keyboard-usertargetschange-select"),
  async (ctx) => {
    const { id: userId, count } = shootChangeData.unpack(
      ctx.callbackQuery.data,
    );
    const userInventory = await getInvetory(userId);
    if (userInventory === undefined) {
      ctx.answerCallbackQuery();
      return ctx.reply(ctx.t("errors.no-select-user-found"));
    }
    if (count === 0) {
      ctx.answerCallbackQuery();
      return ctx.reply(
        ctx.t("admin.targets-choose") +
          adminComment.messageSuffixHTML(`${userId.toString()}/targets`),
        {
          reply_markup: {
            force_reply: true,
            input_field_placeholder: `${userInventory.targets}/${ctx.from.first_name}`,
          },
        },
      );
    }
    userInventory.targets += count;
    userInventory.save();
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);

export { composer as adminFeature };
