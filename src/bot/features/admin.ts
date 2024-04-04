/* eslint-disable no-await-in-loop */
import { chatAction } from "@grammyjs/auto-chat-action";
import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { setCommandsHandler } from "#root/bot/handlers/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { adminUserChange } from "#root/bot/statelessquestion/admin.js";
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
} from "#root/bot/keyboards/index.js";
import {
  userManagementData,
  moneyChangeData,
  shootChangeData,
  subscribeChannelsManagementData,
  addSubscribeChannelData,
  removeSubscribeChannelData,
  deleteSubscribeChannelData,
} from "#root/bot/callback-data/index.js";

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
      return ctx.reply(ctx.t("errors.an-error-has-occurred"));
    }
    const channelsText =
      allChannels.length > 0
        ? allChannels
            .map(
              (channel) =>
                `${channel.id}) <a href="${channel.url}">${channel.name}</a> - ${channel.adding}`,
            )
            .join("\n")
        : "";

    ctx.reply(
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
    ctx.reply(ctx.t("admin.panel-remove_channel"), {
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

export { composer as adminFeature };
