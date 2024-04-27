import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getUser } from "#root/database/schemas/user.js";
import { i18n } from "#root/bot/i18n.js";
import { createItem } from "#root/database/schemas/items.js";

export const adminNewItem = new StatelessQuestion(
  "admin-item_new",
  async (ctx) => {
    if (ctx.from === undefined) {
      return;
    }
    if (ctx.message.text === undefined) {
      return;
    }
    const userDatabase = await getUser(ctx.from.id);
    if (userDatabase === undefined) {
      return;
    }
    const itemName = ctx.message.text;
    const isEnglish = /^[\d A-Za-z]+$/.test(itemName);
    if (isEnglish === false) {
      ctx.reply(
        i18n.t(userDatabase.locate_code, "errors.invalid-input", {
          format: i18n.t(userDatabase.locate_code, "format.only_en"),
        }),
      );
      return;
    }
    const itemId = itemName.toLowerCase().replaceAll(" ", "");
    const newItem = createItem(itemId, itemName);
    if (newItem === undefined) {
      ctx.reply(
        i18n.t(userDatabase.locate_code, "errors.an-error-has-occurred"),
      );
      return;
    }
    newItem.save();
  },
);
