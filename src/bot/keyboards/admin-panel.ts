import type { Context } from "#root/bot/context.js";
import { InlineKeyboard } from "grammy";
import {
  userManagementData,
  itemsManagementData,
  casesManagementData,
  subscribeChannelsManagementData,
  notificationsManagementData,
  mailingManagementData,
  promocodesManagementData,
} from "#root/bot/callback-data/index.js";

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

export * from "./admin/user.js";
export * from "./admin/cases.js";
export * from "./admin/additionally.js";
