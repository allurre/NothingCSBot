import { getInventory } from "#root/database/schemas/user-inventory.js";
import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getUser } from "#root/database/schemas/user.js";
import { i18n } from "#root/bot/i18n.js";
import { sendNotification } from "#root/bot/helpers/utils.js";

export const adminUserChange = new StatelessQuestion(
  "admin-user_change",
  async (ctx, additionalState) => {
    if (ctx.from === undefined) {
      return;
    }
    const adminUser = await getUser(ctx.from.id);
    if (adminUser === undefined) {
      return;
    }
    if (ctx.message.text === undefined) {
      return;
    }
    const prams = ctx.message.text.split("@");
    const count = Number.parseInt(prams[0], 10);
    const comment = prams[1];
    const addPrams = additionalState.split("@");
    const userId = Number.parseInt(addPrams[0], 10);
    if (userId === undefined) {
      ctx.reply(i18n.t(adminUser.locate_code, "errors.an-error-has-occurred"));
      return;
    }
    const action = addPrams[1];
    if (count === undefined || Number.isNaN(count)) {
      ctx.reply(
        i18n.t(adminUser.locate_code, "errors.invalid-input", {
          format: i18n.t(adminUser.locate_code, "format.data_change"),
        }),
      );
      return;
    }
    const userDatabase = await getUser(userId);
    const userInventory = await getInventory(userId);
    if (userInventory === undefined || userDatabase === undefined) {
      ctx.reply(i18n.t(adminUser.locate_code, "errors.no-select-user-found"));
      return;
    }
    userInventory.set(action, count);
    userInventory.save();
    sendNotification(ctx.api, userDatabase, action, count, comment);
    ctx.reply(i18n.t(adminUser.locate_code, "admin.panel-success"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);
