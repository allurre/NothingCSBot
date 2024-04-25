import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getUser } from "#root/database/schemas/user.js";
import { i18n } from "#root/bot/i18n.js";
import { createCase } from "#root/database/schemas/cases.js";

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
          format: i18n.t(userDatabase.locate_code, "format.only_en"),
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
