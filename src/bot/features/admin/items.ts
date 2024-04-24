import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { getAllItems } from "#root/database/schemas/items.js";
import { config } from "#root/config.js";
import { createItemsManageKeyboard } from "#root/bot/keyboards/index.js";
import { itemsManagementData } from "#root/bot/callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.callbackQuery(
  itemsManagementData.filter(),
  logHandle("keyboard-itemsmanage-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    const allItems = await getAllItems();
    if (allItems === undefined) {
      return ctx.reply(ctx.t("admin.panel-no_items"));
    }
    const itemsText =
      allItems.length === 0
        ? undefined
        : allItems
            .map((item) => {
              const link = `<a href="${config.BOT_LINK}?start=adminitem_${item.id}">${ctx.t(`${item.id}.name`)}</a>`;
              return `${link}`;
            })
            .join("\n");

    ctx.editMessageText(
      ctx.t("admin.panel-manage_items", {
        items: itemsText || ctx.t("admin.panel-items_manage"),
      }),
      {
        reply_markup: await createItemsManageKeyboard(ctx),
      },
    );
  },
);

export { composer as adminItemsFeature };
