import { ICommonCase } from "#root/database/interfaces/case.js";
import { IUserInventoryItem } from "#root/database/interfaces/user-inventory-item.js";

export const hitText: { [key: number]: string } = {
  0: "head",
  1: "body",
  2: "arm",
  3: "leg",
  4: "miss",
};

export function caseName(box: ICommonCase, langCode: string) {
  const localizedName = box.name.find(
    (nameObject) => nameObject.lang_code === langCode,
  );

  return localizedName ? localizedName.value : " ";
}

export function caseDescription(box: ICommonCase, langCode: string) {
  const localizedName = box.description.find(
    (nameObject) => nameObject.lang_code === langCode,
  );

  return localizedName ? localizedName.value : " ";
}

export function itemName(item: IUserInventoryItem, langCode: string) {
  const localizedName = item.name.find(
    (nameObject) => nameObject.lang_code === langCode,
  );

  return localizedName ? localizedName.value : " ";
}

export function itemDescription(item: IUserInventoryItem, langCode: string) {
  const localizedName = item.name.find(
    (nameObject) => nameObject.lang_code === langCode,
  );

  return localizedName ? localizedName.value : " ";
}
