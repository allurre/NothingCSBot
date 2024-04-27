import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { getAllItems } from "#root/database/schemas/items.js";
import { config } from "#root/config.js";
import { createItemsManageKeyboard } from "#root/bot/keyboards/index.js";
import {
  addItemData,
  itemsManagementData,
} from "#root/bot/callback-data/index.js";
import { adminNewItem } from "#root/bot/statelessquestion/admin/items.js";
import { itemName } from "#root/bot/helpers/text.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.callbackQuery(
  itemsManagementData.filter(),
  logHandle("keyboard-items-manage-select"),
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
              const link = `<a href="${config.BOT_LINK}?start=adminitem_${item.id}">${itemName(item, ctx.database.user.locate_code)}</a>`;
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

feature.callbackQuery(
  addItemData.filter(),
  logHandle("keyboard-case-add-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(
      ctx.t("admin.panel-add_item") + adminNewItem.messageSuffixHTML(),
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  },
);

export { composer as adminItemsFeature };
