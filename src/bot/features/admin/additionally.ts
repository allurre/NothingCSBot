import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  removeSubscribeChannel,
  getAllSubscribeChannels,
} from "#root/database/schemas/subscribe-channels.js";
import {
  createAdminPanelMainKeyboard,
  createChannelPickKeyboard,
  createChannelsManageKeyboard,
  createChannelsRemoveKeyboard,
} from "#root/bot/keyboards/index.js";
import {
  addSubscribeChannelData,
  removeSubscribeChannelData,
  deleteSubscribeChannelData,
  subscribeChannelsManagementData,
} from "#root/bot/callback-data/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.callbackQuery(
  subscribeChannelsManagementData.filter(),
  logHandle("keyboard-subscribechannelsmanage-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    const allChannels = await getAllSubscribeChannels();
    if (allChannels === undefined) {
      return ctx.reply(ctx.t("admin.panel-no_channels"));
    }
    const channelsText =
      allChannels.length === 0
        ? undefined
        : allChannels
            .map(
              (channel) =>
                `${channel.id}) <a href="${channel.url}">${channel.name}</a> - ${channel.adding}`,
            )
            .join("\n");

    ctx.editMessageText(
      ctx.t("admin.panel-channels_manage", {
        channels: channelsText || ctx.t("admin.panel-no_channels"),
      }),
      {
        reply_markup: createChannelsManageKeyboard(ctx),
      },
    );
  },
);

feature.callbackQuery(
  addSubscribeChannelData.filter(),
  logHandle("keyboard-addsubscribechannel-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-pick_new_channel"), {
      reply_markup: createChannelPickKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  removeSubscribeChannelData.filter(),
  logHandle("keyboard-removesubscribechannels-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.editMessageText(ctx.t("admin.panel-remove_channel"), {
      reply_markup: await createChannelsRemoveKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  deleteSubscribeChannelData.filter(),
  logHandle("keyboard-deletesubscribechannel-select"),
  async (ctx) => {
    const { id: channelId } = deleteSubscribeChannelData.unpack(
      ctx.callbackQuery.data,
    );
    ctx.answerCallbackQuery();
    const removeStatus = await removeSubscribeChannel(channelId);
    if (removeStatus) {
      ctx.reply(ctx.t("admin.panel-delete_channel_success"), {
        reply_markup: { remove_keyboard: true },
      });
    } else {
      ctx.reply(ctx.t("admin.panel-delete_channel_failed"), {
        reply_markup: { remove_keyboard: true },
      });
    }
    ctx.reply(ctx.t("admin.panel-main"), {
      reply_markup: createAdminPanelMainKeyboard(ctx),
    });
  },
);

export { composer as adminAdditionallyFeature };
