import { createCallbackData } from "callback-data";

export const profileData = createCallbackData("profile", {});

export const inventoryData = createCallbackData("inventory", {
  id: Number,
});
