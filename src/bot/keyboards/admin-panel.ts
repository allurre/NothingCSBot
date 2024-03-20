import { Keyboard, InlineKeyboard } from "grammy";
import {
  moneyChangeData,
  shootChangeData,
  statusChangeData,
  userManagementData,
  itemManagementData,
} from "#root/bot/callback-data/index.js";
import type { Context } from "#root/bot/context.js";
import { IUser } from "#root/database/interfaces/user.js";

export const createAdminPanelMainKeyboard = (ctx: Context) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("admin_buttons.mange-user"),
        callback_data: userManagementData.pack({}),
      },
      {
        text: ctx.t("admin_buttons.mange-item"),
        callback_data: itemManagementData.pack({}),
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
        text: ctx.t("admin_buttons.data", { count: -50 }),
        callback_data: shootChangeData.pack({
          id: user.id,
          count: -50,
        }),
      },
      {
        text: ctx.t("admin_buttons.data", { count: 50 }),
        callback_data: shootChangeData.pack({
          id: user.id,
          count: 50,
        }),
      },
      {
        text: ctx.t("admin_buttons.data", { count: 500 }),
        callback_data: shootChangeData.pack({
          id: user.id,
          count: 500,
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

export const createUserPickConfirmKeyboard = () => {
  return { remove_keyboard: true };
};
