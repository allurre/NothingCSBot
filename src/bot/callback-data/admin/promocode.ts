import { createCallbackData } from "callback-data";

export const promocodesManagementData = createCallbackData(
  "promocodes-management",
  {},
);
export const promocodesExpiredData = createCallbackData(
  "promocodes-expired-view",
  {},
);
export const promocodesActiveData = createCallbackData(
  "promocodes-active-view",
  {},
);
export const addPromocodeData = createCallbackData("add-promocode", {});
export const deletePromocodeData = createCallbackData("delete-promocode", {
  id: String,
});
