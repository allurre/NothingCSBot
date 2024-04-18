import { Keyboard, InlineKeyboard } from "grammy";
import {
  moneyChangeData,
  shootChangeData,
  statusChangeData,
  userManagementData,
  itemsManagementData,
  casesManagementData,
  subscribeChannelsManagementData,
  addSubscribeChannelData,
  deleteSubscribeChannelData,
  removeSubscribeChannelData,
  notificationsManagementData,
  mailingManagementData,
  promocodesManagementData,
} from "#root/bot/callback-data/index.js";
import type { Context } from "#root/bot/context.js";
import { IUser } from "#root/database/interfaces/user.js";
import { getAllSubscribeChannels } from "#root/database/schemas/subscribe-channels.js";
import { chunk } from "#root/bot/helpers/keyboard.js";

export const createAdminPanelMainKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.manage-user"),
        callback_data: userManagementData.pack({}),
      },
    ],
    [
      {
        text: ctx.t("admin_buttons.manage-subscribe-channels"),
        callback_data: subscribeChannelsManagementData.pack({}),
      },
    ],
    [
      {
        text: ctx.t("admin_buttons.manage-cases"),
        callback_data: casesManagementData.pack({}),
      },
      {
        text: ctx.t("admin_buttons.manage-item"),
        callback_data: itemsManagementData.pack({}),
      },
    ],
    [
      {
        text: ctx.t("admin_buttons.manage-promocodes"),
        callback_data: promocodesManagementData.pack({}),
      },
    ],
    [
      {
        text: ctx.t("admin_buttons.manage-notifications"),
        callback_data: notificationsManagementData.pack({}),
      },
    ],
    [
      {
        text: ctx.t("admin_buttons.manage-mailing"),
        callback_data: mailingManagementData.pack({}),
      },
    ],
  ]);
};

export const createUserChangeKeyboard = (user: IUser, ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.money"),
        callback_data: moneyChangeData.pack({
          id: user.id,
          count: 0,
        }),
      },
      {
        text: ctx.t("admin_buttons.data", { count: -50 }),
        callback_data: moneyChangeData.pack({
          id: user.id,
          count: -50,
        }),
      },
      {
        text: ctx.t("admin_buttons.data", { count: 50 }),
        callback_data: moneyChangeData.pack({
          id: user.id,
          count: 50,
        }),
      },
      {
        text: ctx.t("admin_buttons.data", { count: 500 }),
        callback_data: moneyChangeData.pack({
          id: user.id,
          count: 500,
        }),
      },
    ],
    [
      {
        text: ctx.t("admin_buttons.shoot"),
        callback_data: shootChangeData.pack({
          id: user.id,
          count: 0,
        }),
      },
      {
        text: ctx.t("admin_buttons.data", { count: -1 }),
        callback_data: shootChangeData.pack({
          id: user.id,
          count: -1,
        }),
      },
      {
        text: ctx.t("admin_buttons.data", { count: 1 }),
        callback_data: shootChangeData.pack({
          id: user.id,
          count: 1,
        }),
      },
      {
        text: ctx.t("admin_buttons.data", { count: 5 }),
        callback_data: shootChangeData.pack({
          id: user.id,
          count: 5,
        }),
      },
    ],
    [
      {
        text: ctx.t("admin_buttons.status"),
        callback_data: statusChangeData.pack({
          id: 1,
        }),
      },
    ],
  ]);
};

export const createUserPickKeyboard = (ctx: Context) => {
  return Keyboard.from([
    [
      {
        text: ctx.t("admin_buttons.choose-user"),
        request_users: {
          request_id: 1,
          max_quantity: 1,
          user_is_bot: false,
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
        callback_data: removeSubscribeChannelData.pack({}),
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
      ],
    ]);
  }

  return InlineKeyboard.from(
    chunk(
      allChannels.map((channel) => ({
        text: channel.name,
        callback_data: deleteSubscribeChannelData.pack({
          id: channel.id,
        }),
      })),
      3,
    ),
  );
};

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

export const createUserPickConfirmKeyboard = () => {
  return { remove_keyboard: true };
};
