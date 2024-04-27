import { randomBytes } from "node:crypto";
import { Api, CallbackQueryContext, ChatTypeContext, RawApi } from "grammy";
import { IUser } from "#root/database/interfaces/user.js";
import { IUserInventory } from "#root/database/interfaces/user-inventory.js";
import { IUserStats } from "#root/database/interfaces/user-stats.js";
import { Document } from "mongoose";
import {
  IUserInventoryItem,
  rarityChancesMap,
} from "#root/database/interfaces/user-inventory-item.js";
import { getItem } from "#root/database/schemas/items.js";
import {
  getRangById,
  getShootChance,
  shootReward,
  shootsRang,
} from "#root/bot/helpers/variables.js";
import { hitText } from "#root/bot/helpers/text.js";
import { i18n } from "#root/bot/i18n.js";
import { Context } from "#root/bot/context.js";

export function randomNumber(min: number, max: number): number {
  const random = randomBytes(8).readBigUInt64BE();
  const normalized = Number(random) / Number(BigInt(2 ** 64 - 1));
  return min + normalized * (max - min);
}

export function randomInt(min: number, max: number): number {
  return Math.round(randomNumber(min, max));
}

export function getRandomRarity(): string {
  const chance = randomInt(0, 100);
  const rarityKey = Math.max(
    ...[...rarityChancesMap.keys()].filter((key) => key <= chance),
  );
  return rarityChancesMap.get(rarityKey) || "ARMY";
}

export function getRandomItem(
  items: IUserInventoryItem[],
): IUserInventoryItem | undefined {
  let totalChance = 0;
  const chances = items.map((item) => {
    totalChance += item.group_drop_chance;
    return {
      item,
      accumulatedChance: totalChance,
    };
  });
  const randomChance = Math.random() * totalChance;
  const selectedItem = chances.find(
    (chance) => randomChance <= chance.accumulatedChance,
  );
  if (selectedItem === undefined) {
    return;
  }
  return selectedItem.item;
}

export async function getLootByRarity(
  requestRarity: string,
  loot: Array<string>,
): Promise<IUserInventoryItem[] | undefined> {
  const items: IUserInventoryItem[] = [];
  const lootPromises = loot.map(async (itemId) => {
    const item = await getItem(itemId);
    if (item && item.rarity === requestRarity) {
      items.push(item);
    }
  });
  await Promise.all(lootPromises);
  if (items.length === 0) {
    return undefined;
  }
  return items;
}

function getHitPosition(statusId: number, score: number): number {
  const userChance = getShootChance(statusId);
  let sum = 0;
  for (let index = userChance.length - 1; index >= 0; index -= 1) {
    sum += userChance[index];
    if (sum >= score) {
      return index;
    }
  }
  return userChance.length - 1;
}

export function getRankInfo(currentShots: number): {
  rank: number;
  progress: number;
  remainingShots: number;
} {
  const nextRankIndex = shootsRang.findIndex(
    ({ shoots }) => shoots > currentShots,
  );

  if (nextRankIndex === -1) {
    // Пользователь достиг максимального ранга
    return { rank: shootsRang.length, progress: 100, remainingShots: 0 };
  }

  const currentRankIndex = nextRankIndex - 1;
  const currentRank = shootsRang[currentRankIndex];
  const nextRank = shootsRang[nextRankIndex];
  const shotsToNextRank = nextRank.shoots - currentShots;
  const progress =
    ((currentShots - currentRank.shoots) / (shotsToNextRank || 1)) * 100;

  return { rank: currentRank.rang, progress, remainingShots: shotsToNextRank };
}

export async function sendNotification(
  api: Api<RawApi>,
  userDatabase: IUser,
  notificationType: string,
  count?: number,
  comment?: string,
) {
  switch (notificationType) {
    case "day_update": {
      api.sendMessage(
        userDatabase.id,
        i18n.t(userDatabase.locate_code, "notifications.day_update"),
      );
      break;
    }
    case "coins": {
      api.sendMessage(
        userDatabase.id,
        i18n.t(userDatabase.locate_code, "notifications.money_change", {
          coins: count || 0,
          reason: comment || "CONSOLE",
        }),
      );
      break;
    }
    case "targets": {
      api.sendMessage(
        userDatabase.id,
        i18n.t(userDatabase.locate_code, "notifications.shoot_change", {
          shoot: count || 0,
          reason: comment || "CONSOLE",
        }),
      );
      break;
    }
    case "new_rank": {
      api.sendMessage(
        userDatabase.id,
        i18n.t(userDatabase.locate_code, "notifications.new_rank", {
          rang: getRangById(userDatabase.status_id),
        }),
      );
      break;
    }
    case "little_more": {
      api.sendMessage(
        userDatabase.id,
        i18n.t(userDatabase.locate_code, "notifications.little_more"),
      );
      break;
    }

    default: {
      api.sendMessage(
        userDatabase.id,
        i18n.t(userDatabase.locate_code, "notifications.day_update"),
      );
      break;
    }
  }
}

export async function shoot(
  ctx: CallbackQueryContext<ChatTypeContext<Context, "private">>,
  userDatabase: Document & IUser,
  userInventory: Document & IUserInventory,
  userStats: Document & IUserStats,
): Promise<void> {
  const user = userDatabase;
  const inventory = userInventory;
  const stats = userStats;
  if (user.status_id === -1) {
    ctx.reply(i18n.t(user.locate_code, "errors.no-calibration-user"));
    return;
  }
  if (userInventory.targets < 1) {
    ctx.reply(i18n.t(user.locate_code, "shoot.no-targets"));
    return;
  }
  const shootMessage = await ctx.reply(i18n.t(user.locate_code, "shoot.start"));
  const timerPromise = new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  const score = randomInt(1, 100);
  const hitTarget = getHitPosition(user.status_id, score);
  const reward = shootReward[hitTarget];

  inventory.coins += reward;
  inventory.targets -= 1;
  stats.earned += reward;
  stats.shoots += 1;
  if (hitTarget === 0) {
    stats.headshots += 1;
  }

  const userUpdateRang = getRankInfo(stats.shoots);
  if (userUpdateRang.remainingShots === 1 && inventory.targets === 0) {
    sendNotification(ctx.api, user, "little_more");
  }
  if (userUpdateRang.rank > user.status_id) {
    user.status_id = userUpdateRang.rank;
    sendNotification(ctx.api, user, "new_rank");
  }

  await Promise.all([
    user.save(),
    inventory.save(),
    stats.save(),
    timerPromise,
  ]).then(() => {
    shootMessage.editText(
      i18n.t(userDatabase.locate_code, `shoot.end-${hitText[hitTarget]}`, {
        reward,
      }),
    );
  });
}

export async function isSubscribed(
  ctx: Context,
  channelId: number,
  userId: number,
): Promise<boolean> {
  try {
    const userMember = await ctx.api.getChatMember(channelId, userId);
    const isMember = ["member", "administrator", "creator"].includes(
      userMember.status,
    );
    if (isMember) return true;
    return false;
  } catch {
    ctx.reply(
      ctx.t("errors.channel-sub-check-failed", {
        id: channelId,
      }),
    );
    return false;
  }
}

export function getItemDescription(
  item: IUserInventoryItem,
  locateCode: string,
): string {
  return `
      ${i18n.t(locateCode, "loot.skin")}: ${i18n.t(locateCode, `${item.id}.name`)}
      ${i18n.t(locateCode, "loot.price")}: ${item.price}
      ${i18n.t(locateCode, "loot.quality")}: ${i18n.t(locateCode, `loot.${item.rarity.toLowerCase()}`)}
      ${i18n.t(locateCode, "loot.chance")}: ${item.group_drop_chance}%
    `;
}
