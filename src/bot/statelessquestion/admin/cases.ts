import { StatelessQuestion } from "@grammyjs/stateless-question";
import { getUser } from "#root/database/schemas/user.js";
import { i18n } from "#root/bot/i18n.js";
import { createCase, getCase } from "#root/database/schemas/cases.js";

export const adminNewCase = new StatelessQuestion(
  "admin-case_new",
  async (ctx) => {
    if (ctx.from === undefined) {
      return;
    }
    const userDatabase = await getUser(ctx.from.id);
    if (userDatabase === undefined) {
      return;
    }
    if (ctx.message.text === undefined) {
      ctx.reply(
        i18n.t(userDatabase.locate_code, "errors.invalid-input", {
          format: i18n.t(userDatabase.locate_code, "format.only_en"),
        }),
      );
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
  },
);

export const adminPhotoCase = new StatelessQuestion(
  "admin-case_photo",
  async (ctx, additionalState) => {
    if (ctx.from === undefined) {
      return;
    }
    const userDatabase = await getUser(ctx.from.id);
    if (userDatabase === undefined) {
      return;
    }
    if (ctx.message.photo === undefined) {
      ctx.reply(
        i18n.t(userDatabase.locate_code, "errors.invalid-input", {
          format: i18n.t(userDatabase.locate_code, "format.photo"),
        }),
      );
      return;
    }
    const caseImage = ctx.message.photo[0].file_id;
    const caseId = additionalState;
    const box = await getCase(caseId);
    if (box === undefined) {
      ctx.reply(i18n.t(userDatabase.locate_code, "errors.lost_data"));
      return;
    }
    box.file_id = caseImage;
    box.save();
    ctx.reply(i18n.t(userDatabase.locate_code, "admin.panel-success"), {
      reply_markup: { remove_keyboard: true },
    });
  },
);
