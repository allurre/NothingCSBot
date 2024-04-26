import type { Context } from "#root/bot/context.js";
import { Keyboard, InlineKeyboard } from "grammy";
import { IUser } from "#root/database/interfaces/user.js";
import {
  moneyChangeData,
  shootChangeData,
} from "#root/bot/callback-data/index.js";

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
  ]);
};
