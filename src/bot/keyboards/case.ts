import { InlineKeyboard } from "grammy";
import type { Context } from "#root/bot/context.js";
import { getAllReleasedCases, getCase } from "#root/database/schemas/cases.js";
import { chunk } from "../helpers/keyboard.js";
import {
  casesMenuData,
  caseInfoData,
  caseData,
  caseOpenData,
  homeData,
} from "../callback-data/index.js";

export const createRelaseCasesKeyboard = async (ctx: Context) => {
  const allRelaseCases = await getAllReleasedCases();
  if (allRelaseCases === undefined || allRelaseCases.length === 0) {
    return InlineKeyboard.from([
      [
        {
          text: ctx.t("cases_buttons.no_cases"),
          callback_data: "no-data-here",
        },
      ],
    ]);
  }

  const caseKeyboard = chunk(
    allRelaseCases.map((box) => ({
      text: ctx.t(`${box.id}.name`),
      callback_data: caseData.pack({
        id: box.id,
      }),
    })),
    3,
  );
  caseKeyboard.push([
    {
      text: ctx.t("default_buttons.home"),
      callback_data: homeData.pack({}),
    },
  ]);

  return InlineKeyboard.from(caseKeyboard);
};

export const createOpenCaseMenuKeyboard = async (
  ctx: Context,
  caseId: string,
  page: number = 0,
) => {
  const box = await getCase(caseId);
  if (box === undefined) {
    return InlineKeyboard.from([
      [
        {
          text: ctx.t("default_buttons.back"),
          callback_data: casesMenuData.pack({}),
        },
      ],
    ]);
  }
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("cases_buttons.open", {
          name: ctx.t(`${box.id}.name`),
        }),
        callback_data: caseOpenData.pack({
          id: caseId,
        }),
      },
      {
        text: ctx.t("cases_buttons.info"),
        callback_data: caseInfoData.pack({
          id: caseId,
          page,
        }),
      },
    ],
    [
      {
        text: ctx.t("default_buttons.back"),
        callback_data: casesMenuData.pack({}),
      },
    ],
  ]);
};

export const createInfoMenuKeyboard = async (
  ctx: Context,
  caseId: string,
  page: number = 0,
) => {
  const previousPage = page - 1;
  const nextPage = page + 1;
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("cases_buttons.info-previous"),
        callback_data: caseInfoData.pack({
          id: caseId,
          page: previousPage,
        }),
      },
      {
        text: ctx.t("cases_buttons.info-next"),
        callback_data: caseInfoData.pack({
          id: caseId,
          page: nextPage,
        }),
      },
    ],
    [
      {
        text: ctx.t("default_buttons.back"),
        callback_data: caseData.pack({
          id: caseId,
        }),
      },
    ],
  ]);
};
