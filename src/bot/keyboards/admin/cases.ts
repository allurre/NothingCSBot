import type { Context } from "#root/bot/context.js";
import { InlineKeyboard } from "grammy";
import { config } from "#root/config.js";
import {
  addCaseData,
  addItemData,
  adminPanelData,
  deleteMenuItemData,
  editCaseData,
  editCaseImageData,
  editCaseLocaleData,
  editCaseMenuData,
  editLootData,
} from "#root/bot/callback-data/index.js";

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
        callback_data: deleteMenuItemData.pack({}),
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
        text: ctx.t("default_buttons.cancel"),
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
