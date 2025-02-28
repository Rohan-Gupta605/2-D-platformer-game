export enum Difficulty {
  EASY = 0,
  NORMAL = 1,
  HARD = 2
}

export interface LevelData {
  platforms: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  coins: {
    x: number;
    y: number;
  }[];
  enemies: {
    x: number;
    y: number;
    leftBound: number;
    rightBound: number;
  }[];
  playerStart: {
    x: number;
    y: number;
  };
  exit?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}