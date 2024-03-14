import { randomBytes } from "node:crypto";
import { getUser } from "#root/database/schemas/user.js";
import { CallbackQueryContext, ChatTypeContext } from "grammy";
import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { getStats } from "#root/database/schemas/user-stats.js";
import { Context } from "../context.js";
import { getShootChance, shootReward } from "./varibles.js";
import { hitText } from "./text.js";

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
): Promise<void> {
  const userId = ctx.from.id;
  const userDatabase = await getUser(userId);
  const userInventory = await getInvetory(userId);
  const userStats = await getStats(userId);
  if (
    userDatabase === undefined ||
    userInventory === undefined ||
    userStats === undefined
  ) {
    ctx.reply(ctx.t("errors.no-registered-user"));
    return;
  }
  if (userDatabase.status_id === undefined) {
    ctx.reply(ctx.t("errors.no-calibration-user"));
    return;
  }
  const shootMessage = ctx.reply(ctx.t("shoot.start"));
  const score = randomInt(1, 100);
  const hitTarget = getHitPosition(userDatabase.status_id, score);
  const reward = shootReward[hitTarget];
  userInventory.coins += reward;
  userInventory.targets -= 1;
  userStats.earned += reward;
  userStats.shoots += 1;
  if (hitTarget === 0) {
    userStats.headshots += 1;
  }
  const timerPromise = new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  Promise.all([
    shootMessage,
    userInventory.save(),
    userStats.save(),
    timerPromise,
  ]).then(() => {
    ctx.reply(ctx.t(`shoot.end-${hitText[hitTarget]}`, { reward }));
  });
}
