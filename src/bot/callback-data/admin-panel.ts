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

export const userManagementData = createCallbackData("user-management", {});
export const itemManagementData = createCallbackData("item-management", {});
export const subscribeChannelsManagementData = createCallbackData(
  "subscribe-channels-management",
  {},
);
