/* eslint-disable no-await-in-loop */
import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { ICommonCaseFields } from "#root/database/interfaces/case.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { adminNewCase } from "#root/bot/statelessquestion/admin.js";
import { getAllCases, getCase } from "#root/database/schemas/cases.js";
import {
  createCaseEditKeyboard,
  createCasesManageKeyboard,
} from "#root/bot/keyboards/index.js";
import {
  editCaseData,
  editCaseMenuData,
  editCaseImageData,
  editLootData,
  editCaseLocaleData,
  addCaseData,
  casesManagementData,
} from "#root/bot/callback-data/index.js";
import { config } from "#root/config.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.callbackQuery(
  casesManagementData.filter(),
  logHandle("keyboard-casesmangae-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    const allCases = await getAllCases();
    if (allCases === undefined) {
      return ctx.reply(ctx.t("admin.panel-no_cases"));
    }
    const casesText =
      allCases.length === 0
        ? undefined
        : allCases
            .map((box) => {
              const boxText = `<a href="${config.BOT_LINK}?start=admincase-edit_${box.id}">${ctx.t(`${box.id}.name`)}</a>`;
              const link = box.release
                ? `<a href="${config.BOT_LINK}?start=admincase-unrel_${box.id}">${ctx.t("cases.unrelase")}</a>`
                : `<a href="${config.BOT_LINK}?start=admincase-rel_${box.id}">${ctx.t("cases.relase")}</a>`;
              return `${boxText} - ${link}`;
            })
            .join("\n");

    ctx.editMessageText(
      ctx.t("admin.panel-manage_cases", {
        cases: casesText || ctx.t("admin.panel-no_cases"),
      }),
      {
        reply_markup: await createCasesManageKeyboard(ctx),
      },
    );
  },
);

feature.callbackQuery(
  addCaseData.filter(),
  logHandle("keyboard-caseadd-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(
      ctx.t("admin.panel-add_case") + adminNewCase.messageSuffixHTML(),
      {
        reply_markup: {
          force_reply: true,
        },
      },
    );
  },
);

feature.callbackQuery(
  editCaseMenuData.filter(),
  logHandle("keyboard-caseedit-select"),
  async (ctx) => {
    const { id: caseId } = editCaseMenuData.unpack(ctx.callbackQuery.data);
    const box = await getCase(caseId);
    if (box === undefined) {
      return ctx.reply(ctx.t("errors.lost_data"));
    }
    ctx.answerCallbackQuery();
    return ctx.reply(
      ctx.t("admin.panel-edit_case", {
        name: ctx.t(`${box.id}.name`),
      }),
      {
        reply_markup: await createCaseEditKeyboard(ctx, caseId),
      },
    );
  },
);

feature.callbackQuery(
  editCaseData.filter(),
  logHandle("keyboard-caseedit-select"),
  async (ctx) => {
    const { id: caseId, field: caseField } = editCaseData.unpack(
      ctx.callbackQuery.data,
    );
    const box = getCase(caseId);
    if (box === undefined) {
      return ctx.reply(ctx.t("errors.lost_data"));
    }
    if (ICommonCaseFields.includes(caseField)) {
      return ctx.reply(ctx.t("errors.an-error-has-occurred"));
    }
    // редктирование либо цены, либо возможности выпадения
  },
);

feature.callbackQuery(
  editCaseImageData.filter(),
  logHandle("keyboard-caseedit-select"),
  async (ctx) => {
    const { id: caseId } = editCaseImageData.unpack(ctx.callbackQuery.data);
    const box = getCase(caseId);
    if (box === undefined) {
      return ctx.reply(ctx.t("errors.lost_data"));
    }
    // редктирование изображения
  },
);

feature.callbackQuery(
  editLootData.filter(),
  logHandle("keyboard-caseedit-select"),
  async (ctx) => {
    const { id: caseId } = editLootData.unpack(ctx.callbackQuery.data);
    const box = getCase(caseId);
    if (box === undefined) {
      return ctx.reply(ctx.t("errors.lost_data"));
    }
    // редктирование лута
  },
);

feature.callbackQuery(
  editCaseLocaleData.filter(),
  logHandle("keyboard-caseedit-select"),
  async (ctx) => {
    const { id: caseId } = editCaseLocaleData.unpack(ctx.callbackQuery.data);
    const box = getCase(caseId);
    if (box === undefined) {
      return ctx.reply(ctx.t("errors.lost_data"));
    }
    // редктирование локализации кейса
  },
);

export { composer as adminCasesFeature };
