import { NextFunction } from "grammy";

import type { Context } from "../context.js";

export async function setLanguage(ctx: Context, next: NextFunction) {
  if (ctx.database === undefined) {
    return next();
  }
  ctx.i18n.setLocale(ctx.database.user.locate_code);
  return next();
}
