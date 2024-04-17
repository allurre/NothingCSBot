import { createCallbackData } from "callback-data";

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
export const editCaseData = createCallbackData("edit-case", {
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
