import { createCallbackData } from "callback-data";

export const adminPanelData = createCallbackData("admin-panel", {});
export const moneyChangeData = createCallbackData("money-change", {
  id: Number,
  count: Number,
});
export const shootChangeData = createCallbackData("shoot-change", {
  id: Number,
  count: Number,
});
export const statusChangeData = createCallbackData("status-change", {
  id: Number,
});
export const addSubscribeChannelData = createCallbackData(
  "add-subscribe-channel",
  {},
);
export const removeSubscribeChannelData = createCallbackData(
  "remove-subscribe-channel",
  {},
);
export const deleteSubscribeChannelData = createCallbackData(
  "delete-subscribe-channel",
  {
    id: Number,
  },
);
export const addItemData = createCallbackData("add-item", {});
export const deleteItemData = createCallbackData("delete-item", {});
export const editItemData = createCallbackData("edit-item", {
  id: String,
});

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

export const addPromocodeData = createCallbackData("add-promocode", {});
export const deletePromocodeData = createCallbackData("delete-promocode", {
  id: String,
});

export const userManagementData = createCallbackData("user-management", {});
export const subscribeChannelsManagementData = createCallbackData(
  "subscribe-channels-management",
  {},
);
export const itemsManagementData = createCallbackData("items-management", {});
export const casesManagementData = createCallbackData("cases-management", {});
export const notificationsManagementData = createCallbackData(
  "notifications-management",
  {},
);
export const mailingManagementData = createCallbackData(
  "mailing-management",
  {},
);
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

