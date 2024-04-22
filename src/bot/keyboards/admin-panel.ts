import { Keyboard, InlineKeyboard } from "grammy";
import {
  adminPanelData,
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
  addCaseData,
  addItemData,
  deleteItemData,
  editCaseLocaleData,
  editLootData,
  editCaseMenuData,
  editCaseImageData,
  editCaseData,
} from "#root/bot/callback-data/index.js";
import type { Context } from "#root/bot/context.js";
import { IUser } from "#root/database/interfaces/user.js";
import { getAllSubscribeChannels } from "#root/database/schemas/subscribe-channels.js";
import { chunk } from "#root/bot/helpers/keyboard.js";
import { config } from "#root/config.js";

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
      {
        text: ctx.t("admin_buttons.manage-promocodes"),
        callback_data: promocodesManagementData.pack({}),
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
        callback_data: removeSubscribeChannelData.pack({}),
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

export const createCasesManageKeyboard = async (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.case-add"),
        callback_data: addCaseData.pack({}),
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

export const createItemsManageKeyboard = async (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.item-add"),
        callback_data: addItemData.pack({}),
      },
      {
        text: ctx.t("admin_buttons.item-delete"),
        callback_data: deleteItemData.pack({}),
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

export const createCaseInfoKeyboard = async (ctx: Context, caseId: string) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.case-edit"),
        callback_data: editCaseMenuData.pack({
          id: caseId,
        }),
      },
      {
        text: ctx.t("admin_buttons.loot-edit"),
        callback_data: editLootData.pack({
          id: caseId,
        }),
      },
    ],
    [
      {
        text: ctx.t("admin_buttons.image-edit"),
        callback_data: editCaseImageData.pack({
          id: caseId,
        }),
      },
      {
        text: ctx.t("admin_buttons.locale-edit"),
        callback_data: editCaseLocaleData.pack({
          id: caseId,
        }),
      },
    ],
    [
      {
        text: ctx.t("default_buttons.cansel"),
        callback_data: adminPanelData.pack({}),
      },
    ],
  ]);
};

export const createCaseEditKeyboard = async (ctx: Context, caseId: string) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.case-edit_candrop"),
        callback_data: editCaseData.pack({
          id: caseId,
          field: "can_drop",
        }),
      },
      {
        text: ctx.t("admin_buttons.case-edit_price"),
        callback_data: editCaseData.pack({
          id: caseId,
          field: "price",
        }),
      },
    ],
    [
      {
        text: ctx.t("default_buttons.back"),
        url: `${config.BOT_LINK}?start=admincase-edit_${caseId}`,
      },
    ],
  ]);
};
