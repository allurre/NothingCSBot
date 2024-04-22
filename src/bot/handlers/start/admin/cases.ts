import { Context } from "#root/bot/context.js";
import { createCaseInfoKeyboard } from "#root/bot/keyboards/index.js";
import { getCase } from "#root/database/schemas/cases.js";

export async function executeAdminCase(
  ctx: Context,
  caseAction: string,
  caseId: string,
) {
  const box = await getCase(caseId);
  if (box === undefined) {
    return ctx.reply(ctx.t("errors.loose_data"));
  }
  switch (caseAction) {
    case "edit": {
      ctx.reply(
        ctx.t("admin.pannel-info_case", {
          id: box.id,
          name: ctx.t(`${box.id}.name`),
          price: box.price,
          relase: box.release
            ? ctx.t("admin.info-relase")
            : ctx.t("admin.info-no-relase"),
          can_drop: box.can_drop ? ctx.t("default.yes") : ctx.t("default.no"),
        }),
        {
          reply_markup: await createCaseInfoKeyboard(ctx, caseId),
        },
      );
      break;
    }
    case "unrel": {
      break;
    }
    case "rel": {
      break;
    }
    default: {
      break;
    }
  }
}
