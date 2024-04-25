import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getUser } from "#root/database/schemas/user.js";
import { i18n } from "#root/bot/i18n.js";
import { sendNotification } from "#root/bot/helpers/utils.js";

export const adminUserChange = new StatelessQuestion(
  "answer-adminuserchange",
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
    const parms = ctx.message.text.split("@");
    const count = Number.parseInt(parms[0], 10);
    const comment = parms[1];
    const addParms = additionalState.split("@");
    const userId = Number.parseInt(addParms[0], 10);
    if (userId === undefined) {
      ctx.reply(i18n.t(adminUser.locate_code, "errors.an-error-has-occurred"));
      return;
    }
    const action = addParms[1];
    if (count === undefined || Number.isNaN(count)) {
      ctx.reply(
        i18n.t(adminUser.locate_code, "errors.invalid-input", {
          format: i18n.t(adminUser.locate_code, "format.data_change"),
        }),
      );
      return;
    }
    const userDatabase = await getUser(userId);
    const userInventory = await getInvetory(userId);
    if (userInventory === undefined || userDatabase === undefined) {
      ctx.reply(i18n.t(adminUser.locate_code, "errors.no-select-user-found"));
      return;
    }
    userInventory.set(action, count);
    userInventory.save();
    sendNotification(ctx.api, userDatabase, action, count, comment);
    ctx.reply(i18n.t(adminUser.locate_code, "admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);
