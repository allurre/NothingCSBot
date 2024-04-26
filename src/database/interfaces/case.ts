import { ILocale } from "./locale.js";

export interface ICommonCase {
  id: number;
  name: Array<ILocale>;
  description: Array<ILocale>;
  loot: Array<string>;
  can_drop: boolean;
  price: number;
  release: boolean;
  file_id?: string;
}

export const ICommonCaseDataFields = ["can_drop", "price"];
