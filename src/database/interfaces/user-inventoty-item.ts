export const rarityChancesMap = new Map([
  [0, "ARMY"],
  [72, "ARMY_ST"],
  [80, "ILLEGAL"],
  [94, "ILLEGAL_ST"],
  [96, "CLASSIFIED"],
  [99.4, "CLASSIFIED_ST"],
  [99.95, "SECRET"],
  [100, "SECRET_ST"],
]);

export const itemRarities = [
  "ARMY",
  "ARMY_ST",
  "ILLEGAL",
  "ILLEGAL_ST",
  "CLASSIFIED",
  "CLASSIFIED_ST",
  "SECRET",
  "SECRET_ST",
];

export interface IUserInventoryItem {
  id: string;
  price: number;
  rarity: string;
  group_drop_chance: number;
  file_id?: string;
}
