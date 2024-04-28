import type { Context } from "#root/bot/context.js";
import { Keyboard, InlineKeyboard } from "grammy";
import { getAllSubscribeChannels } from "#root/database/schemas/subscribe-channels.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import {
  addSubscribeChannelData,
  adminPanelData,
  deleteSubscribeChannelData,
  deleteMenuSubscribeChannelData,
} from "#root/bot/callback-data/index.js";

export const createChannelPickKeyboard = (ctx: Context) => {
  return Keyboard.from([
    [
      {
        text: ctx.t("admin_buttons.choose-channel"),
        request_chat: {
          request_id: 1001,
          bot_is_member: true,
          chat_is_channel: true,
        },
      },
    ],
  ]);
};

export const createChannelsManageKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.add-channel"),
        callback_data: addSubscribeChannelData.pack({}),
      },
      {
        text: ctx.t("admin_buttons.remove-channel"),
        callback_data: deleteMenuSubscribeChannelData.pack({}),
      },
    ],
    [
      {
        text: ctx.t("default_buttons.back"),
        callback_data: adminPanelData.pack({}),
      },
    ],
  ]);
};

export const createChannelsRemoveKeyboard = async (ctx: Context) => {
  const allChannels = await getAllSubscribeChannels();
  if (allChannels === undefined || allChannels.length === 0) {
    return InlineKeyboard.from([
      [
        {
          text: ctx.t("admin_buttons.no_channels"),
          callback_data: "no-data-here",
        },
        {
          text: ctx.t("default_buttons.back"),
          callback_data: adminPanelData.pack({}),
        },
      ],
    ]);
  }

  const channelsKeyboard = chunk(
    allChannels.map((channel) => ({
      text: channel.name,
      callback_data: deleteSubscribeChannelData.pack({
        id: channel.id,
      }),
    })),
    3,
  );
  channelsKeyboard.push([
    {
      text: ctx.t("default_buttons.back"),
      callback_data: adminPanelData.pack({}),
    },
  ]);

  return InlineKeyboard.from(channelsKeyboard);
};
