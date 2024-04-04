import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { getAllSubscribeChannels } from "#root/database/schemas/subscribe-channels.js";
import { adminNewChannel } from "#root/bot/statelessquestion/admin.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["private", "group"]).filter(isAdmin);

feature.on(":chat_shared", logHandle("admin-chatshare"), async (ctx) => {
  const reqwest = ctx.message.chat_shared.request_id;
  switch (reqwest) {
    case 1001: {
      const selectChatId = ctx.message.chat_shared.chat_id; // добавить проверку на существование в доп каналах
      const allChannels = await getAllSubscribeChannels();
      if (allChannels === undefined) {
        return ctx.reply(ctx.t("errors.an-error-has-occurred"));
      }
      let selectChat;
      let selectChatAdmins;
      try {
        selectChat = await ctx.api.getChat(selectChatId);
        selectChatAdmins = await ctx.api.getChatAdministrators(selectChatId);
      } catch (error) {
        ctx.logger.error(error);
      }
      if (selectChat === undefined || selectChatAdmins === undefined) {
        return ctx.reply(ctx.t("admin.panel-faled_new_channel"));
      }
      const isChatInclude = allChannels.some(
        (channel) => channel.id.toString() === selectChatId.toString(),
      );
      const isChatAdmin = selectChatAdmins.some(
        (admin) => admin.user.id === ctx.me.id,
      );
      if (selectChat.type === "channel" && isChatAdmin && !isChatInclude) {
        return ctx.reply(
          ctx.t("admin.panel-add_new_channel") +
            adminNewChannel.messageSuffixHTML(`${selectChatId.toString()}`),
          {
            reply_markup: {
              force_reply: true,
            },
          },
        );
      }
      ctx.reply(ctx.t("admin.panel-faled_new_channel"), {
        reply_markup: { remove_keyboard: true },
      });

      break;
    }
    default: {
      break;
    }
  }
});

export { composer as adminChannelShareFeature };
