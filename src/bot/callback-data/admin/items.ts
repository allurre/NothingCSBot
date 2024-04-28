import { createCallbackData } from "callback-data";

export const itemsManagementData = createCallbackData("items-management", {});
export const addItemData = createCallbackData("add-item", {});
export const deleteMenuItemData = createCallbackData("delete-item", {});
export const editItemData = createCallbackData("edit-item", {
  id: String,
});
