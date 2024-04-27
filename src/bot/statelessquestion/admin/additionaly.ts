import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getUser } from "#root/database/schemas/user.js";
import { i18n } from "#root/bot/i18n.js";
import { addSubscribeChannel } from "#root/database/schemas/subscribe-channels.js";
import { containsLink } from "#root/bot/helpers/validator.js";

export const adminNewChannel = new StatelessQuestion(
  "admin-channel_url",
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
    const url = prams[0];
    const name = prams[1];
    const additionally = Number.parseInt(prams[2], 10) || 1;
    const channelId = Number.parseInt(additionalState, 10);
    if (channelId === undefined) {
      ctx.reply(i18n.t(adminUser.locate_code, "errors.an-error-has-occurred"));
      return;
    }
    if (
      url === undefined ||
      containsLink(url) === false ||
      name === undefined
    ) {
      ctx.reply(
        i18n.t(adminUser.locate_code, "errors.invalid-input", {
          format: i18n.t(adminUser.locate_code, "format.channel"),
        }),
      );
      return;
    }
    addSubscribeChannel(channelId, url, name, additionally);
    ctx.reply(i18n.t(adminUser.locate_code, "admin.panel-success"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);
