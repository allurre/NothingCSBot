import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  caseData,
  caseOpenData,
  caseInfoData,
  casesMenuData,
} from "#root/bot/callback-data/index.js";
import { getCase } from "#root/database/schemas/cases.js";
import { getItem } from "#root/database/schemas/items.js";
import {
  createInfoMenuKeyboard,
  createOpenCaseMenuKeyboard,
  createRelaseCasesKeyboard,
} from "#root/bot/keyboards/case.js";
import {
  getItemDescription,
  getLootByRarity,
  getRandomRarity,
} from "../helpers/utils.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  casesMenuData.filter(),
  logHandle("keyboard-casemenu-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    ctx.answerCallbackQuery();
    return ctx.reply(ctx.t("cases.main"), {
      reply_markup: await createRelaseCasesKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  caseData.filter(),
  logHandle("keyboard-case-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const { id: caseId } = caseData.unpack(ctx.callbackQuery.data);
    const box = await getCase(caseId);
    if (box === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-box-found"));
    }
    ctx.answerCallbackQuery();
    if (box.file_id !== undefined) {
      return ctx.replyWithPhoto(box.file_id, {
        caption: ctx.t("cases.case-menu", {
          name: ctx.t(`${box.id}.name`),
          price: box.price,
          description: ctx.t(`${box.id}.description`),
        }),
      });
    }
    return ctx.reply(
      ctx.t("cases.case-menu", {
        name: ctx.t(`${box.id}.name`),
        price: box.price,
        description: ctx.t(`${box.id}.description`),
      }),
      {
        reply_markup: await createOpenCaseMenuKeyboard(ctx, box.id),
      },
    );
  },
);

feature.callbackQuery(
  caseOpenData.filter(),
  logHandle("keyboard-caseopen-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const userInventory = ctx.database.inventory;
    const { id: caseId } = caseOpenData.unpack(ctx.callbackQuery.data);
    const box = await getCase(caseId);
    if (box === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-box-found"));
    }
    if (userInventory.coins < box.price) {
      const missingCoins = box.price - userInventory.coins;
      return ctx.answerCallbackQuery(
        ctx.t("errors.low-user-coins", {
          coins: missingCoins,
        }),
      );
    }
    userInventory.coins -= box.price;
    userInventory.save();
    ctx.answerCallbackQuery();
    const getingRarity = getRandomRarity();
    ctx.reply(ctx.t("cases.open-case"));
    const lootingItems = await getLootByRarity(getingRarity, box.loot); // это пиздец как долго, так что анимацию запустить до
    if (lootingItems === undefined) {
      return ctx.reply(ctx.t("loot.no-looting"));
    }
    // получить случайный предмет
  },
);

feature.callbackQuery(
  caseInfoData.filter(),
  logHandle("keyboard-caseinfo-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const { id: caseId, page } = caseInfoData.unpack(ctx.callbackQuery.data);
    const box = await getCase(caseId);
    if (box === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-box-found"));
    }
    const itemId = box.loot[page];
    const item = await getItem(itemId);
    if (item === undefined) {
      return ctx.answerCallbackQuery(ctx.t("cases.case-no-info"));
    }
    const description = getItemDescription(item, ctx.database.user.locate_code);
    ctx.answerCallbackQuery();
    if (ctx.msg?.photo) {
      if (item.file_id) {
        // оправка предмета с фото, если прошлый с фото
        return ctx.editMessageMedia(
          {
            type: "photo",
            media: item.file_id,
            caption: ctx.t("cases.case-info", {
              name: ctx.t(`${box.id}.name`),
              loot: description.toString(),
            }),
          },
          {
            reply_markup: await createInfoMenuKeyboard(ctx, caseId, page),
          },
        );
      }
      // оправка предмета без фото, если прошлый с фото
      ctx.deleteMessage();
      return ctx.reply(
        ctx.t("cases.case-info", {
          name: ctx.t(`${box.id}.name`),
          loot: description.toString(),
        }),
        {
          reply_markup: await createInfoMenuKeyboard(ctx, caseId, page),
        },
      );
    }
    if (item.file_id) {
      return ctx.replyWithPhoto(item.file_id, {
        // оправка предмета с фото, если прошлый без фото
        caption: ctx.t("cases.case-info", {
          name: ctx.t(`${box.id}.name`),
          loot: description.toString(),
        }),
        reply_markup: await createInfoMenuKeyboard(ctx, caseId, page),
      });
    }
    // оправка предмета без фото, если прошлый без фото
    return ctx.editMessageText(
      ctx.t("cases.case-info", {
        name: ctx.t(`${box.id}.name`),
        loot: description.toString(),
      }),
      {
        reply_markup: await createInfoMenuKeyboard(ctx, caseId, page),
      },
    );
  },
);

export { composer as casesFeature };