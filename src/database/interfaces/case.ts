export interface ICommonCase {
  id: number;
  loot: Array<string>;
  can_drop: boolean;
  price: number;
  release: boolean;
  file_id?: string;
}

export const ICommonCaseFields = ["can_drop", "price"];
