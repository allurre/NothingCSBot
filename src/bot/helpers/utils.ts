import { randomBytes } from "node:crypto";
import {
  Api,
  CallbackQueryContext,
  ChatTypeContext,
  Context,
  RawApi,
} from "grammy";
import { IUser } from "#root/database/interfaces/user.js";
import { IUserInventory } from "#root/database/interfaces/user-inventory.js";
import { IUserStats } from "#root/database/interfaces/user-stats.js";
import { Document } from "mongoose";
import { getShootChance, shootReward } from "./varibles.js";
import { hitText } from "./text.js";
import { i18n } from "../i18n.js";

export function randomNumber(min: number, max: number): number {
  const random = randomBytes(8).readBigUInt64BE();
  const normalized = Number(random) / Number(BigInt(2 ** 64 - 1));
  return min + normalized * (max - min);
}

export function randomInt(min: number, max: number): number {
  return Math.round(randomNumber(min, max));
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

export async function shoot(
  ctx: CallbackQueryContext<ChatTypeContext<Context, "private">>,
  userDatabase: Document & IUser,
  userInventory: Document & IUserInventory,
  userStats: Document & IUserStats,
): Promise<void> {
  const user = userDatabase;
  const inventory = userInventory;
  const stats = userStats;
  if (user.status_id === undefined) {
    ctx.reply(i18n.t(user.locate_code, "errors.no-calibration-user"));
    return;
  }
  if (userInventory.targets < 1) {
    ctx.reply(i18n.t(user.locate_code, "shoot.no-targets"));
    return;
  }
  const shootMessage = ctx.reply(i18n.t(user.locate_code, "shoot.start"));
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
  const timerPromise = new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  Promise.all([
    shootMessage,
    inventory.save(),
    stats.save(),
    timerPromise,
  ]).then(() => {
    ctx.reply(
      i18n.t(userDatabase.locate_code, `shoot.end-${hitText[hitTarget]}`, {
        reward,
      }),
    );
  });
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

    default: {
      api.sendMessage(
        userDatabase.id,
        i18n.t(userDatabase.locate_code, "notifications.day_update"),
      );
      break;
    }
  }
}
