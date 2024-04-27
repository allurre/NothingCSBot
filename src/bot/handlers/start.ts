import { Context } from "#root/bot/context.js";
import { executeStartPromocode } from "./start/promocode.js";
import { executeAdminCase } from "./start/admin/cases.js";

export function executeStartMatch(
  ctx: Context,
  action: string,
  arguments_: string,
) {
  if (action.startsWith("admincase")) {
    const caseAction = arguments_.split("_")[0];
    const caseId = arguments_.split("_")[1];
    executeAdminCase(ctx, caseAction, caseId);
  } else if (action === "promo") {
    executeStartPromocode(ctx, arguments_);
  }
}
