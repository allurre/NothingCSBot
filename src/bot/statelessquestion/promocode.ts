import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getPromocode } from "#root/database/schemas/promocode.js";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { getUser } from "#root/database/schemas/user.js";
import { i18n } from "../i18n.js";

export const promocodeUse = new StatelessQuestion(
  "answer-promocodeuse",
  async (ctx) => {
    if (ctx.from === undefined) {
      return;
    }
    const userId = ctx.from.id;
    const user = await getUser(userId);
    const userInventory = await getInvetory(userId);
    if (userInventory === undefined || user === undefined) {
      return;
    }
    if (ctx.message.text === undefined) {
      return;
    }
    const userInput = ctx.message.text;
    const promocode = getPromocode(userInput);
    if (promocode === undefined) {
      ctx.reply(i18n.t(user.locate_code, "promocode.use-no_promocode"));
    }
  },
);
