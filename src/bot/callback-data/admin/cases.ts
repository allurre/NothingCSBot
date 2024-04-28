import { createCallbackData } from "callback-data";

export const casesManagementData = createCallbackData("cases-management", {});
export const addCaseData = createCallbackData("add-case", {});
export const editCaseMenuData = createCallbackData("edit-case-menu", {
  id: String,
});
export const editCaseData = createCallbackData("edit-case-data", {
  id: String,
  field: String,
});
export const editLootData = createCallbackData("edit-case-loot", {
  id: String,
});
export const editCaseLocaleData = createCallbackData("edit-case-locale", {
  id: String,
});
export const editCaseImageData = createCallbackData("edit-case-image", {
  id: String,
});
