import { createCallbackData } from "callback-data";

export const adminPanelData = createCallbackData("admin-panel", {});

export * from "./admin/user.js";
export * from "./admin/additionally.js";
export * from "./admin/promocode.js";
export * from "./admin/cases.js";
export * from "./admin/items.js";
export * from "./admin/mailing.js";
export * from "./admin/notifications.js";
