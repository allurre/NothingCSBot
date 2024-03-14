import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { profileData } from "#root/bot/callback-data/index.js";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { Document } from "mongoose";
import { IUserInventory } from "#root/database/interfaces/user-inventory.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  profileData.filter(),
  logHandle("keyboard-profile-select"),
  async (ctx) => {
    let { id } = profileData.unpack(ctx.callbackQuery.data);
    if (id === 0) id = ctx.from.id;
    const userInventory: (Document & IUserInventory) | undefined =
      await getInvetory(id);
    if (userInventory && userInventory !== undefined) {
      ctx.answerCallbackQuery();
      ctx.reply(ctx.t("profile.main", { id: userInventory.id }));
    } else {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
  },
);

export { composer as profileFeature };
