import {
  IUserInventoryItem,
  ItemRarity,
} from "#root/database/interfaces/user-inventoty-item.js";

export const hitText: { [key: number]: string } = {
  0: "head",
  1: "body",
  2: "arm",
  3: "leg",
  4: "miss",
};

export function itemToString(item: IUserInventoryItem): string {
  const rarityString = item.rarity.toLowerCase().replaceAll("_", "-");
  return `
**Название:** ${item.name}
**Цена:** ${item.price}
**Качество:** ${rarityString}
**Шанс выпадения:** ${ItemRarity[item.rarity]}%
`;
}
