import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  getSubscribeChannel,
  getAllSubscribeChannels,
} from "#root/database/schemas/subscribe-channels.js";
import {
  createUserSubscribeChannels,
  getUserSubscribeChannels,
} from "#root/database/schemas/user-subscribe-channels.js";
import { ISubscribeChannel } from "#root/database/interfaces/subscribe-channels.js";
import {
  additionallyChannelData,
  additionallyShootsData,
  claimAdditionallyShootsData,
} from "#root/bot/callback-data/index.js";
import {
  createChannelsSubscribeKeyboard,
  createChannelSubscribeKeyboard,
} from "#root/bot/keyboards/index.js";
import { isSubscribed } from "#root/bot/helpers/utils.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.callbackQuery(
  additionallyShootsData.filter(),
  logHandle("keyboard-additionally-select"),
  async (ctx) => {
    const userId = ctx.from.id;
    const allUserSubscribeChannels = await getUserSubscribeChannels(userId);
    if (allUserSubscribeChannels === undefined) {
      await createUserSubscribeChannels(userId)?.save();
    }
    ctx.answerCallbackQuery();
    return ctx.reply(ctx.t("additionally.main"), {
      reply_markup: await createChannelsSubscribeKeyboard(ctx),
    });
  },
);

feature.callbackQuery(
  additionallyChannelData.filter(),
  logHandle("keyboard-additionally_channel-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const { id: channelId } = additionallyChannelData.unpack(
      ctx.callbackQuery.data,
    );
    const userId = ctx.from.id;
    const selectChannel = await getSubscribeChannel(channelId);
    if (selectChannel === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.channel-is-undefined"));
    }

    const isSubscribe = await isSubscribed(ctx, channelId, userId);
    if (isSubscribe) {
      ctx.answerCallbackQuery(ctx.t("additionally.already-sub"));
    } else {
      ctx.answerCallbackQuery();
      ctx.reply(
        ctx.t("additionally.subscribe", {
          name: selectChannel.name,
          adding: selectChannel.adding,
        }),
        {
          reply_markup: await createChannelSubscribeKeyboard(
            ctx,
            selectChannel,
          ),
        },
      );
    }
  },
);

feature.callbackQuery(
  claimAdditionallyShootsData.filter(),
  logHandle("keyboard-additionally_channel-select"),
  async (ctx) => {
    if (ctx.database === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.no-registered-user"));
    }
    const userInventory = ctx.database.inventory;
    const userId = ctx.from.id;
    const allChannels = await getAllSubscribeChannels();
    const userChannels = await getUserSubscribeChannels(userId);
    if (allChannels === undefined || userChannels === undefined) {
      return ctx.answerCallbackQuery(ctx.t("errors.an-error-has-occurred"));
    }

    const subscriptionPromises = allChannels.map(async (channel) => {
      const isUserSubscribed = await isSubscribed(ctx, channel.id, userId);
      const isAlreadySubscribed = userChannels.channels.includes(
        Number.parseInt(channel.id.toString(), 10),
      );
      return isUserSubscribed && !isAlreadySubscribed ? channel : undefined;
    });
    const subscribedChannels = await Promise.all(subscriptionPromises);
    const uniqueIds: number[] = subscribedChannels
      .filter((channel): channel is ISubscribeChannel => !!channel)
      .map((channel) => channel.id)
      .filter((id, index, ids) => ids.indexOf(id) === index);
    const totalAdding = subscribedChannels
      .filter((channel): channel is ISubscribeChannel => !!channel)
      .reduce((sum, channel) => sum + channel.adding, 0);

    userChannels.channels = [...userChannels.channels, ...uniqueIds];
    userChannels.save();

    const newChannelsCount = totalAdding;
    ctx.answerCallbackQuery();
    if (newChannelsCount > 0) {
      userInventory.targets += newChannelsCount;
      userInventory.save();
      ctx.reply(
        ctx.t("additionally.collect", {
          count: newChannelsCount,
        }),
      );
    } else if (userChannels.channels.length === 0) {
      ctx.reply(ctx.t("additionally.no-subs"));
    } else {
      ctx.reply(ctx.t("additionally.already-collect"));
    }
  },
);

export { composer as additionallyFeature };
