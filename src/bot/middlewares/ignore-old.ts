import { NextFunction } from "grammy";
import type { Context } from "#root/bot/context.js";

export const ignoreOld =
  (threshold = 60) =>
  (ctx: Context, next: NextFunction) => {
    if (ctx.msg && Date.now() / 1000 - ctx.msg.date > threshold) {
      ctx.logger.info(`Ignoring message from ${ctx.msg.from?.id} timeout`);
      return;
    }

    return next();
  };
