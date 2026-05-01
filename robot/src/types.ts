export type { Ceil, CeilState, GameStatus, MinesweeperState } from "@minesweeper/Minesweeper/types";

import type { Ceil } from "@minesweeper/Minesweeper/types";

export type GuessValue = "empty" | "bomb";

export interface Guess {
  index: number;
  value: GuessValue;
  confidence: number;
}

export interface Move {
  index: number;
  action: "open" | "flag";
  strategy: string;
  confidence: number;
}

export interface IStrategy {
  guess(ceils: Ceil[], columns: number, rows: number): Guess[];
}
