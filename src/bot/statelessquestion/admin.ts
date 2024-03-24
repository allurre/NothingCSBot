import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getUser } from "#root/database/schemas/user.js";
import { i18n } from "../i18n.js";
import { sendNotification } from "../helpers/utils.js";

export const adminComment = new StatelessQuestion(
  "admin-comment",
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
    const parms = ctx.message.text.split("/");
    const count = Number.parseInt(parms[0], 10);
    const comment = parms[1];
    const addParms = additionalState.split("/");
    const userId = Number.parseInt(addParms[0], 10);
    if (userId === undefined) {
      ctx.answerCallbackQuery();
      ctx.reply(i18n.t(adminUser.locate_code, "errors.an-error-has-occurred"));
    }
    const action = addParms[1];
    if (count === undefined) {
      ctx.answerCallbackQuery();
      ctx.reply(
        i18n.t(adminUser.locate_code, "errors.invalid-input", {
          format: "number/comment",
        }),
      );
    }
    const userDatabase = await getUser(userId);
    const userInventory = await getInvetory(userId);
    if (userInventory === undefined || userDatabase === undefined) {
      ctx.answerCallbackQuery();
      ctx.reply(i18n.t(adminUser.locate_code, "errors.no-select-user-found"));
      return;
    }
    userInventory.set(action, count);
    userInventory.save();
    sendNotification(ctx.api, userDatabase, "money_change", count, comment);
    ctx.reply(i18n.t(adminUser.locate_code, "admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);
