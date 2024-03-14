import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import {
  createRegisterKeyboard,
  createStartKeyboard,
} from "#root/bot/keyboards/index.js";
import { createUser, getUser } from "#root/database/schemas/user.js";
import { Document } from "mongoose";
import { IUser } from "#root/database/interfaces/user.js";
import { createInvetory } from "#root/database/schemas/user-inventory.js";
import { IUserInventory } from "#root/database/interfaces/user-inventory.js";
import { IUserStats } from "#root/database/interfaces/user-stats.js";
import { createStats } from "#root/database/schemas/user-stats.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.command("start", logHandle("command-start"), async (ctx) => {
  const userDatabase: (Document & IUser) | undefined = await getUser(
    ctx.from.id,
  );
  if (userDatabase === undefined) {
    const newUser: (Document & IUser) | undefined = createUser({
      id: ctx.from.id,
      username: ctx.from.first_name,
    });
    const newInventory: (Document & IUserInventory) | undefined =
      createInvetory(ctx.from.id);
    const newStats: (Document & IUserStats) | undefined = createStats(
      ctx.from.id,
    );
    if (newUser && newInventory && newStats) {
      ctx.reply(ctx.t("start.new-user"));
      return Promise.all([
        newUser.save(),
        newInventory.save(),
        newStats.save(),
      ]).then(() => {
        return ctx.reply(ctx.t("start.register"), {
          reply_markup: createRegisterKeyboard(ctx),
        });
      });
    }
    return ctx.reply(ctx.t("errors.regestration"));
  }
  if (userDatabase.status_id === -1)
    return ctx.reply(ctx.t("start.register"), {
      reply_markup: createRegisterKeyboard(ctx),
    });
  return ctx.reply(ctx.t("start.welcome"), {
    reply_markup: createStartKeyboard(ctx),
  });
});

export { composer as welcomeFeature };
