import { InlineKeyboard } from "grammy";
import type { Context } from "#root/bot/context.js";
import { getAllSubscribeChannels } from "#root/database/schemas/subscribe-channels.js";
import { ISubscribeChannel } from "#root/database/interfaces/subscribe-channels.js";
import { chunk } from "../helpers/keyboard.js";
import {
  additionallyChannelData,
  additionallyShootsData,
  claimAdditionallyShootsData,
} from "../callback-data/index.js";

export const createChannelsSubscribeKeyboard = async (ctx: Context) => {
  const allChannels = await getAllSubscribeChannels();
  if (allChannels === undefined || allChannels.length === 0) {
    return InlineKeyboard.from([
      [
        {
          text: ctx.t("additionally_buttons.no_channels"),
          callback_data: "no-data-here",
        },
      ],
    ]);
  }
  const channelsKeyboard = chunk(
    allChannels.map((channel) => ({
      text: channel.name,
      callback_data: additionallyChannelData.pack({
        id: channel.id,
      }),
    })),
    3,
  );
  channelsKeyboard.push([
    {
      text: ctx.t("additionally_buttons.claim"),
      callback_data: claimAdditionallyShootsData.pack({}),
    },
  ]);

  return InlineKeyboard.from(channelsKeyboard);
};

export const createChannelSubscribeKeyboard = async (
  ctx: Context,
  channel: ISubscribeChannel,
) => {
  return InlineKeyboard.from([
    [
      {
        text: ctx.t("additionally_buttons.subscribe"),
        url: channel.url,
      },
    ],
    [
      {
        text: ctx.t("additionally_buttons.back"),
        callback_data: additionallyShootsData.pack({}),
      },
    ],
  ]);
};
