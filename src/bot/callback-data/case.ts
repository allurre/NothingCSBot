import { createCallbackData } from "callback-data";

export const casesMenuData = createCallbackData("cases-main", {});

export const caseData = createCallbackData("case", {
  id: String,
});

export const caseInfoData = createCallbackData("case-info", {
  id: String,
  page: Number,
});

export const caseOpenData = createCallbackData("case-open", {
  id: String,
});
