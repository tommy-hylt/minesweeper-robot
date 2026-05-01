import { ComponentType } from "react";
import {
  Difficulty,
  MinesweeperAction,
  MinesweeperState,
  MinesweeperViewProps,
} from "./types";

export type { Ceil, CeilState, Difficulty, DifficultyConfig, GameStatus, MinesweeperAction, MinesweeperState, MinesweeperViewProps } from "./types";

export function reducer(
  state: MinesweeperState,
  action: MinesweeperAction
): MinesweeperState;

export function getInitState(difficulty?: Difficulty): MinesweeperState;

interface MinesweeperProps {
  defaultDifficulty?: Difficulty;
  onClose?: () => void;
  sameTouchPos: boolean;
  lastTouch: Date;
  platform?: "desktop" | "mobile";
}

declare const MineSweeper: ComponentType<MinesweeperProps>;

export default MineSweeper;
