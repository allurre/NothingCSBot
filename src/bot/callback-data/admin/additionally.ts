import { createCallbackData } from "callback-data";

export const subscribeChannelsManagementData = createCallbackData(
  "subscribe-channels-management",
  {},
);
export const addSubscribeChannelData = createCallbackData(
  "add-subscribe-channel",
  {},
);
export const deleteMenuSubscribeChannelData = createCallbackData(
  "delete-menu-subscribe-channel",
  {},
);
export const deleteSubscribeChannelData = createCallbackData(
  "delete-subscribe-channel",
  {
    id: Number,
  },
);
