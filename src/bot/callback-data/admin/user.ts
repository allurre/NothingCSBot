import { createCallbackData } from "callback-data";

export const userManagementData = createCallbackData("user-management", {});
export const moneyChangeData = createCallbackData("money-change", {
  id: Number,
  count: Number,
});
export const shootChangeData = createCallbackData("shoot-change", {
  id: Number,
  count: Number,
});
