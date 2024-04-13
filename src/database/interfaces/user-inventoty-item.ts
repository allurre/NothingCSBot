export const ItemRarity = {
  ARMY: 10.3,
  ARMY_ST: 1.2,
  ILLEGAL: 2.88,
  ILLEGAL_ST: 0.32,
  CLASSIFIED: 0.9,
  CLASSIFIED_ST: 0.1,
  SECRET: 0.225,
  SECRET_ST: 0.025,
};

export type ItemRarityKey = keyof typeof ItemRarity;

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
}
