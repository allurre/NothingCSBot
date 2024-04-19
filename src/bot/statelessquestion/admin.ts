import { getInvetory } from "#root/database/schemas/user-inventory.js";
import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getUser } from "#root/database/schemas/user.js";
import { addSubscribeChannel } from "#root/database/schemas/subscribe-channels.js";
import { i18n } from "#root/bot/i18n.js";
import { sendNotification } from "#root/bot/helpers/utils.js";
import { containsLink } from "#root/bot/helpers/validator.js";
import { createCase } from "#root/database/schemas/cases.js";

export const adminUserChange = new StatelessQuestion(
  "answer-adminuserchange",
  async (ctx, additionalState) => {
    if (ctx.from === undefined) {
      return;
    }
    const adminUser = await getUser(ctx.from.id);
    if (adminUser === undefined) {
      return;
    }
    if (ctx.message.text === undefined) {
      return;
    }
    const parms = ctx.message.text.split("@");
    const count = Number.parseInt(parms[0], 10);
    const comment = parms[1];
    const addParms = additionalState.split("@");
    const userId = Number.parseInt(addParms[0], 10);
    if (userId === undefined) {
      ctx.reply(i18n.t(adminUser.locate_code, "errors.an-error-has-occurred"));
      return;
    }
    const action = addParms[1];
    if (count === undefined || Number.isNaN(count)) {
      ctx.reply(
        i18n.t(adminUser.locate_code, "errors.invalid-input", {
          format: "number@comment",
        }),
      );
      return;
    }
    const userDatabase = await getUser(userId);
    const userInventory = await getInvetory(userId);
    if (userInventory === undefined || userDatabase === undefined) {
      ctx.reply(i18n.t(adminUser.locate_code, "errors.no-select-user-found"));
      return;
    }
    userInventory.set(action, count);
    userInventory.save();
    sendNotification(ctx.api, userDatabase, action, count, comment);
    ctx.reply(i18n.t(adminUser.locate_code, "admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);

export const adminNewChannel = new StatelessQuestion(
  "admin-newchannelurl",
  async (ctx, additionalState) => {
    if (ctx.from === undefined) {
      return;
    }
    const adminUser = await getUser(ctx.from.id);
    if (adminUser === undefined) {
      return;
    }
    if (ctx.message.text === undefined) {
      return;
    }
    const parms = ctx.message.text.split("@");
    const url = parms[0];
    const name = parms[1];
    const additionally = Number.parseInt(parms[2], 10) || 1;
    const channelId = Number.parseInt(additionalState, 10);
    if (channelId === undefined) {
      ctx.reply(i18n.t(adminUser.locate_code, "errors.an-error-has-occurred"));
      return;
    }
    if (
      url === undefined ||
      containsLink(url) === false ||
      name === undefined
    ) {
      ctx.reply(
        i18n.t(adminUser.locate_code, "errors.invalid-input", {
          format: "url@name@add(optional)",
        }),
      );
      return;
    }
    addSubscribeChannel(channelId, url, name, additionally);
    ctx.reply(i18n.t(adminUser.locate_code, "admin.panel-sucsess"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);

export const adminNewCase = new StatelessQuestion(
  "admin-newcase",
  async (ctx) => {
    if (ctx.from === undefined) {
      return;
    }
    if (ctx.message.text === undefined) {
      return;
    }
    const userDatabase = await getUser(ctx.from.id);
    if (userDatabase === undefined) {
      return;
    }
    const caseName = ctx.message.text;
    const isEnglish = /^[\d A-Za-z]+$/.test(caseName);
    if (isEnglish === false) {
      ctx.reply(
        i18n.t(userDatabase.locate_code, "errors.invalid-input", {
          format: "only english characters",
        }),
      );
      return;
    }
    const caseId = caseName.toLowerCase().replaceAll(" ", "");
    const newCase = createCase(caseId, caseName);
    if (newCase === undefined) {
      ctx.reply(
        i18n.t(userDatabase.locate_code, "errors.an-error-has-occurred"),
      );
      return;
    }
    newCase.save();
    // добавить локализацию
  },
);
