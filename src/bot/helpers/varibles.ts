export function getColibrationRangID(dice: number): number {
  const diceToRange: { [key: number]: number } = {
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 3,
    6: 4,
  };
  return diceToRange[dice] || 1;
}

export function getRangById(id: number): string {
  const prefix: { [key: number]: string } = {
    1: "SILVER I",
    2: "SILVER II",
    3: "SILVER III",
    4: "SILVER IV",
    5: "SILVER ELITE",
    6: "SILVER ELITE MASTER",
    7: "GOLD NOVA I",
    8: "GOLD NOVA II",
    9: "GOLD NOVA III",
    10: "GOLD NOVA MASTER",
    11: "MASTER GUARDIAN I",
    12: "MASTER GUARDIAN II",
    13: "MASTER GUARDIAN ELITE",
    14: "BIG STAR",
    15: "LEGENDARY EAGLE",
    16: "LEGENDARY EAGLE MASTER",
    17: "SUPREME MASTER",
    18: "THE GLOBAL ELITE",
  };
  return prefix[id] || "SILVER I";
}

export function getShootChance(status: number): number[] {
  switch (status) {
    case 1: {
      return [1, 13, 13, 13, 60];
    }
    case 2: {
      return [5, 13, 13, 13, 55];
    }
    case 3: {
      return [10, 13, 13, 13, 50];
    }
    case 4: {
      return [15, 13, 13, 13, 45];
    }
    case 5: {
      return [20, 13, 13, 13, 40];
    }
    case 6: {
      return [25, 13, 13, 13, 35];
    }
    case 7: {
      return [30, 13, 13, 13, 30];
    }
    case 8: {
      return [35, 13, 13, 13, 25];
    }
    case 9: {
      return [40, 13, 13, 13, 20];
    }
    case 10: {
      return [45, 13, 13, 13, 15];
    }
    case 11: {
      return [50, 13, 13, 13, 11];
    }
    case 12: {
      return [55, 12, 12, 12, 9];
    }
    case 13: {
      return [60, 11, 11, 11, 7];
    }
    case 14: {
      return [65, 10, 10, 10, 5];
    }
    case 15: {
      return [70, 9, 9, 9, 3];
    }
    case 16: {
      return [80, 6, 6, 6, 2];
    }
    case 17: {
      return [90, 3, 3, 3, 1];
    }
    case 18: {
      return [100, 0, 0, 0, 0];
    }
    default: {
      return [0, 0, 0, 0, 0];
    }
  }
}

export const shootReward: { [key: number]: number } = {
  0: 100,
  1: 35,
  2: 25,
  3: 25,
  4: 10,
};
