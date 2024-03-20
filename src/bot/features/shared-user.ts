import { Composer } from "grammy";
import type { Context } from "#root/bot/context.js";
import { isAdmin } from "#root/bot/filters/index.js";
import { logHandle } from "#root/bot/helpers/logging.js";
import { getUser } from "#root/database/schemas/user.js";
import { createUserChangeKeyboard } from "#root/bot/keyboards/admin-panel.js";

const composer = new Composer<Context>();

const feature = composer.chatType("private").filter(isAdmin);

feature.on(":users_shared", logHandle("usershare-admin-panel"), async (ctx) => {
  if (ctx.message.users_shared.request_id === 1) {
    // переделать в обработку хендлером
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
  }
});

export { composer as userShareFeature };
