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
  createReleaseCasesKeyboard,
} from "#root/bot/keyboards/case.js";
import {
  getItemDescription,
  getLootByRarity,
  getRandomItem,
  getRandomRarity,
} from "#root/bot/helpers/utils.js";
import { caseDescription, caseName, itemName } from "#root/bot/helpers/text.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  casesMenuData.filter(),
  logHandle("keyboard-case_menu-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    ctx.answerCallbackQuery();
    return ctx.reply(ctx.t("cases.main"), {
      reply_markup: await createReleaseCasesKeyboard(ctx),
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
          name: caseName(box, ctx.database.user.locate_code),
          price: box.price,
          description: caseDescription(box, ctx.database.user.locate_code),
        }),
        reply_markup: await createOpenCaseMenuKeyboard(ctx, box.id),
      });
    }
    return ctx.reply(
      ctx.t("cases.case-menu", {
        name: caseName(box, ctx.database.user.locate_code),
        price: box.price,
        description: caseDescription(box, ctx.database.user.locate_code),
      }),
      {
        reply_markup: await createOpenCaseMenuKeyboard(ctx, box.id),
      },
    );
  },
);

feature.callbackQuery(
  caseOpenData.filter(),
  logHandle("keyboard-case-open-select"),
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
    await userInventory.save();
    ctx.answerCallbackQuery();
    const getRarity = getRandomRarity();
    ctx.reply(ctx.t("cases.case-open"));
    const lootingItems = await getLootByRarity(getRarity, box.loot); // это пиздец как долго, так что анимацию запустить до
    if (lootingItems === undefined) {
      return ctx.reply(ctx.t("loot.no-looting"));
    }
    const dropItem = getRandomItem(lootingItems);
    if (dropItem === undefined) {
      return ctx.reply(ctx.t("loot.no-looting"));
    }
    userInventory.items.push(dropItem.id);
    await userInventory.save();
    if (dropItem.file_id === undefined) {
      return ctx.reply(
        ctx.t("loot.drop", {
          name: itemName(dropItem, ctx.database.user.locate_code),
          price: dropItem.price,
          rarity: ctx.t(`loot.${dropItem.rarity.toLowerCase()}`),
        }),
      );
    }
    return ctx.replyWithPhoto(dropItem.file_id, {
      caption: ctx.t("loot.drop", {
        name: itemName(dropItem, ctx.database.user.locate_code),
        price: dropItem.price,
        rarity: ctx.t(`loot.${dropItem.rarity.toLowerCase()}`),
      }),
    });
  },
);

feature.callbackQuery(
  caseInfoData.filter(),
  logHandle("keyboard-case-info-select"),
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
        return ctx.editMessageMedia(
          {
            type: "photo",
            media: item.file_id,
            caption: ctx.t("cases.case-info", {
              name: itemName(item, ctx.database.user.locate_code),
              loot: description.toString(),
            }),
          },
          {
            reply_markup: await createInfoMenuKeyboard(ctx, caseId, page),
          },
        );
      }
      ctx.deleteMessage();
      return ctx.reply(
        ctx.t("cases.case-info", {
          name: caseName(box, ctx.database.user.locate_code),
          loot: description.toString(),
        }),
        {
          reply_markup: await createInfoMenuKeyboard(ctx, caseId, page),
        },
      );
    }
    if (item.file_id) {
      return ctx.replyWithPhoto(item.file_id, {
        caption: ctx.t("cases.case-info", {
          name: caseName(box, ctx.database.user.locate_code),
          loot: description.toString(),
        }),
        reply_markup: await createInfoMenuKeyboard(ctx, caseId, page),
      });
    }
    return ctx.editMessageText(
      ctx.t("cases.case-info", {
        name: caseName(box, ctx.database.user.locate_code),
        loot: description.toString(),
      }),
      {
        reply_markup: await createInfoMenuKeyboard(ctx, caseId, page),
      },
    );
  },
);

export { composer as casesFeature };
