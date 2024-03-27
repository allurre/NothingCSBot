import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  getSubscribeChannel,
  getAllSubscribeChannels,
} from "#root/database/schemas/subscribe-channels.js";
import { additionallyShootsData } from "../callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  additionallyShootsData.filter(),
  logHandle("keyboard-additionally-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const _userDatabase = ctx.database.user;
    const subscribeChannels = await getAllSubscribeChannels();
    console.log(subscribeChannels);
    return ctx.answerCallbackQuery(ctx.t("[eq"));
  },
);

export { composer as additionallyFeature };
