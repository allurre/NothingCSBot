/* eslint-disable no-await-in-loop */
import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { ICommonCaseFields } from "#root/database/interfaces/case.js";
import { setCommandsHandler } from "#root/bot/handlers/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import {
  adminNewCase,
  adminUserChange,
} from "#root/bot/statelessquestion/admin.js";
import {
  getAllSubscribeChannels,
  removeSubscribeChannel,
} from "#root/database/schemas/subscribe-channels.js";
import {
  createAdminPanelMainKeyboard,
  createChannelPickKeyboard,
  createChannelsManageKeyboard,
  createUserPickKeyboard,
  createChannelsRemoveKeyboard,
  createCasesManageKeyboard,
  createItemsManageKeyboard,
  createCaseEditKeyboard,
} from "#root/bot/keyboards/index.js";
import {
  adminPanelData,
  userManagementData,
  moneyChangeData,
  shootChangeData,
  subscribeChannelsManagementData,
  addSubscribeChannelData,
  removeSubscribeChannelData,
  deleteSubscribeChannelData,
  casesManagementData,
  addCaseData,
  itemsManagementData,
  editCaseData,
  editCaseMenuData,
} from "#root/bot/callback-data/index.js";
import { getAllCases, getCase } from "#root/database/schemas/cases.js";
import { config } from "#root/config.js";
import { getAllItems } from "#root/database/schemas/items.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.command(
  "setcommands",
  logHandle("command-setcommands"),
  chatAction("typing"),
  setCommandsHandler,
);

feature.command("panel", logHandle("command-admin-panel"), async (ctx) => {
  ctx.reply(ctx.t("admin.panel-main"), {
    reply_markup: createAdminPanelMainKeyboard(ctx),
  });
});

feature.callbackQuery(
  adminPanelData.filter(),
  logHandle("keyboard-usermanage-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.editMessageText(ctx.t("admin.panel-main"), {
      reply_markup: createAdminPanelMainKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  userManagementData.filter(),
  logHandle("keyboard-usermanage-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-pick_user"), {
      reply_markup: createUserPickKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  subscribeChannelsManagementData.filter(),
  logHandle("keyboard-subscribechannelsmanage-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    const allChannels = await getAllSubscribeChannels();
    if (allChannels === undefined) {
      return ctx.reply(ctx.t("admin.panel-no_channels"));
    }
    const channelsText =
      allChannels.length === 0
        ? undefined
        : allChannels
            .map(
              (channel) =>
                `${channel.id}) <a href="${channel.url}">${channel.name}</a> - ${channel.adding}`,
            )
            .join("\n");

    ctx.editMessageText(
      ctx.t("admin.panel-channels_manage", {
        channels: channelsText || ctx.t("admin.panel-no_channels"),
      }),
      {
        reply_markup: createChannelsManageKeyboard(ctx),
      },
    );
  },
);

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
  itemsManagementData.filter(),
  logHandle("keyboard-itemsmanage-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    const allItems = await getAllItems();
    if (allItems === undefined) {
      return ctx.reply(ctx.t("admin.panel-no_items"));
    }
    const itemsText =
      allItems.length === 0
        ? undefined
        : allItems
            .map((item) => {
              const link = `<a href="${config.BOT_LINK}?start=adminitem_${item.id}">${ctx.t(`${item.id}.name`)}</a>`;
              return `${link}`;
            })
            .join("\n");

    ctx.editMessageText(
      ctx.t("admin.panel-manage_items", {
        items: itemsText || ctx.t("admin.panel-items_manage"),
      }),
      {
        reply_markup: await createItemsManageKeyboard(ctx),
      },
    );
  },
);

feature.callbackQuery(
  addSubscribeChannelData.filter(),
  logHandle("keyboard-addsubscribechannel-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-pick_new_channel"), {
      reply_markup: createChannelPickKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  removeSubscribeChannelData.filter(),
  logHandle("keyboard-removesubscribechannels-select"),
  async (ctx) => {
    ctx.answerCallbackQuery();
    ctx.editMessageText(ctx.t("admin.panel-remove_channel"), {
      reply_markup: await createChannelsRemoveKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  deleteSubscribeChannelData.filter(),
  logHandle("keyboard-deletesubscribechannel-select"),
  async (ctx) => {
    const { id: channelId } = deleteSubscribeChannelData.unpack(
      ctx.callbackQuery.data,
    );
    ctx.answerCallbackQuery();
    const removeStatus = await removeSubscribeChannel(channelId);
    if (removeStatus) {
      ctx.reply(ctx.t("admin.panel-delete_channel_success"), {
        reply_markup: { remove_keyboard: true },
      });
    } else {
      ctx.reply(ctx.t("admin.panel-delete_channel_failed"), {
        reply_markup: { remove_keyboard: true },
      });
    }
    ctx.reply(ctx.t("admin.panel-main"), {
      reply_markup: createAdminPanelMainKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  moneyChangeData.filter(),
  logHandle("keyboard-usermoneychange-select"),
  async (ctx) => {
    const { id: userId, count } = moneyChangeData.unpack(
      ctx.callbackQuery.data,
    );
    const userInventory = await getInvetory(userId);
    if (userInventory === undefined) {
      ctx.answerCallbackQuery();
      return ctx.reply(ctx.t("errors.no-select-user-found"));
    }
    if (count === 0) {
      ctx.answerCallbackQuery();
      return ctx.reply(
        ctx.t("admin.money-choose") +
          adminUserChange.messageSuffixHTML(`${userId.toString()}@coins`),
        {
          reply_markup: {
            force_reply: true,
            input_field_placeholder: `${userInventory.coins}@${ctx.from.first_name}`,
          },
        },
      );
    }
    userInventory.coins += count;
    userInventory.save();
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);

feature.callbackQuery(
  shootChangeData.filter(),
  logHandle("keyboard-usertargetschange-select"),
  async (ctx) => {
    const { id: userId, count } = shootChangeData.unpack(
      ctx.callbackQuery.data,
    );
    const userInventory = await getInvetory(userId);
    if (userInventory === undefined) {
      ctx.answerCallbackQuery();
      return ctx.reply(ctx.t("errors.no-select-user-found"));
    }
    if (count === 0) {
      ctx.answerCallbackQuery();
      return ctx.reply(
        ctx.t("admin.targets-choose") +
          adminUserChange.messageSuffixHTML(`${userId.toString()}@targets`),
        {
          reply_markup: {
            force_reply: true,
            input_field_placeholder: `${userInventory.targets}@${ctx.from.first_name}`,
          },
        },
      );
    }
    userInventory.targets += count;
    userInventory.save();
    ctx.answerCallbackQuery();
    ctx.reply(ctx.t("admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
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
      return ctx.reply(ctx.t("errors.loose_data"));
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
      return ctx.reply(ctx.t("errors.loose_data"));
    }
    if (ICommonCaseFields.includes(caseField)) {
      return ctx.reply(ctx.t("errors.an-error-has-occurred"));
    }
  },
);

export { composer as adminFeature };
