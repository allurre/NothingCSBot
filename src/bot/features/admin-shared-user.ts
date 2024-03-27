import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { getUser } from "#root/database/schemas/user.js";
import { createUserChangeKeyboard } from "#root/bot/keyboards/admin-panel.js";
import { isAdmin } from "#root/bot/filters/index.js";

const composer = new Composer<Context>();

const feature = composer.chatType(["private", "group"]).filter(isAdmin);

feature.on(":users_shared", logHandle("admin-usershare"), async (ctx) => {
  const reqwest = ctx.message.users_shared.request_id;
  switch (reqwest) {
    case 1: {
      const selectUserId = ctx.message.users_shared.user_ids[0];
      const userDatabase = await getUser(selectUserId);
      if (userDatabase === undefined) {
        return ctx.reply(ctx.t("errors.no-select-user-found"));
      }
      ctx.reply(
        ctx.t("admin.panel-change_user", {
          user: userDatabase.username,
        }),
        {
          reply_markup: createUserChangeKeyboard(userDatabase, ctx),
        },
      );
      break;
    }
    default: {
      break;
    }
  }
});

export { composer as adminUserShareFeature };
