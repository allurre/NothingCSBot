import { autoChatAction } from "@grammyjs/auto-chat-action";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { autoRetry } from "@grammyjs/auto-retry";
import { hydrate } from "@grammyjs/hydrate";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { BotConfig, StorageAdapter, Bot as TelegramBot, session } from "grammy";
import {
  adminUserChange,
  adminNewChannel,
} from "#root/bot/statelessquestion/admin.js";
import {
  Context,
  SessionData,
  createContextConstructor,
} from "#root/bot/context.js";
import {
  adminFeature,
  languageFeature,
  unhandledFeature,
  welcomeFeature,
  calibrationFeature,
  profileFeature,
  workoutFeature,
  adminUserShareFeature,
  adminChannelShareFeature,
  additionallyFeature,
} from "#root/bot/features/index.js";
import { errorHandler } from "#root/bot/handlers/index.js";
import { i18n, isMultipleLocales } from "#root/bot/i18n.js";
import {
  updateLogger,
  attachUser,
  ignoreOld,
} from "#root/bot/middlewares/index.js";
import { config } from "#root/config.js";
import { logger } from "#root/logger.js";

type Options = {
  sessionStorage?: StorageAdapter<SessionData>;
  config?: Omit<BotConfig<Context>, "ContextConstructor">;
};

export function createBot(token: string, options: Options = {}) {
  const { sessionStorage } = options;
  const bot = new TelegramBot(token, {
    ...options.config,
    ContextConstructor: createContextConstructor({ logger }),
  });
  const protectedBot = bot.errorBoundary(errorHandler);

  // Middlewares
  const throttler = apiThrottler();
  bot.api.config.use(throttler);
  bot.api.config.use(autoRetry());
  bot.api.config.use(parseMode("HTML"));

  if (config.isDev) {
    protectedBot.use(updateLogger());
  }
  protectedBot.use(autoChatAction(bot.api));
  protectedBot.use(hydrateReply);
  protectedBot.use(hydrate());
  protectedBot.use(attachUser);
  protectedBot.use(
    session({
      initial: () => ({}),
      storage: sessionStorage,
    }),
  );
  protectedBot.use(i18n);
  protectedBot.use(ignoreOld(5 * 60));

  // Handlers
  protectedBot.use(adminUserShareFeature);
  protectedBot.use(adminChannelShareFeature);
  protectedBot.use(welcomeFeature);
  protectedBot.use(calibrationFeature);
  protectedBot.use(adminFeature);
  protectedBot.use(profileFeature);
  protectedBot.use(workoutFeature);
  protectedBot.use(additionallyFeature);

  if (isMultipleLocales) {
    protectedBot.use(languageFeature);
  }

  protectedBot.use(adminUserChange.middleware());
  protectedBot.use(adminNewChannel.middleware());

  // must be the last handler
  protectedBot.use(unhandledFeature);

  return bot;
}

export type Bot = ReturnType<typeof createBot>;
