import { NextFunction } from "grammy";
import type { Context } from "../context.js";

export const ignoreOld =
  (threshold = 60) =>
  (ctx: Context, next: NextFunction) => {
    if (ctx.msg && Date.now() / 1000 - ctx.msg.date > threshold) {
      if (ctx.chat?.type === "private") {
        if (ctx.callbackQuery) {
          return next();
        }
        ctx.logger.info(`Ignoring message from ${ctx.msg.from?.id} timeout`);
      }
      return;
    }

    return next();
  };
