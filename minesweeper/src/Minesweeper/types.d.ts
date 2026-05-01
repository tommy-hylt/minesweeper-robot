export type CeilState =
  | "cover"
  | "flag"
  | "unknown"
  | "open"
  | "die"
  | "mine"
  | "misflagged";

export type GameStatus = "new" | "started" | "died" | "won";

export type Difficulty = "Beginner" | "Intermediate" | "Expert";

export interface Ceil {
  state: CeilState;
  minesAround: number;
  opening: boolean;
}

export interface DifficultyConfig {
  rows: number;
  columns: number;
  ceils: number;
  mines: number;
}

export interface MinesweeperState {
  difficulty: Difficulty;
  status: GameStatus;
  rows: number;
  columns: number;
  mines: number;
  ceils: Ceil[];
}

export type MinesweeperAction =
  | { type: "CLEAR_MAP"; payload?: Difficulty }
  | { type: "START_GAME"; payload: number }
  | { type: "OPEN_CEIL"; payload: number }
  | { type: "CHANGE_CEIL_STATE"; payload: number }
  | { type: "GAME_OVER"; payload: number }
  | { type: "WON" }
  | { type: "OPENING_CEIL"; payload: number }
  | { type: "OPENING_CEILS"; payload: number };

export interface MinesweeperViewProps {
  ceils: Ceil[];
  className?: string;
  changeCeilState: (index: number) => void;
  onReset: (difficulty?: Difficulty) => void;
  openCeil: (index: number) => void;
  openCeils: (index: number) => void;
  mines: number;
  status: GameStatus;
  seconds: number;
  onClose?: () => void;
  difficulty: Difficulty;
  openingCeil: (index: number) => void;
  openingCeils: (index: number) => void;
  sameTouchPos: boolean;
  lastTouch: Date;
  columns: number;
  rows: number;
  platform?: "desktop" | "mobile";
}
