import { useCallback, useEffect, useReducer, useState } from "react";
import { reducer, getInitState } from "@minesweeper/Minesweeper/index";
import type { Difficulty, MinesweeperState } from "@minesweeper/Minesweeper/index";
import MinesweeperView from "@minesweeper/Minesweeper/MinesweeperView";
import ConsolePanel from "./ConsolePanel";
import XpWindow from "./XpWindow";
import "@minesweeper/index.css";
import "./App.css";

function useTimer(status: MinesweeperState["status"]): number {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (status === "started") {
      const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(timer);
    }
    if (status === "new") setSeconds(0);
  }, [status]);
  return seconds;
}

function getNearIndexes(index: number, rows: number, columns: number): number[] {
  if (index < 0 || index >= rows * columns) return [];
  const row = Math.floor(index / columns);
  const column = index % columns;
  return [
    index - columns - 1, index - columns, index - columns + 1,
    index - 1,                             index + 1,
    index + columns - 1, index + columns,  index + columns + 1,
  ].filter((_, i) => {
    if (row === 0 && i < 3) return false;
    if (row === rows - 1 && i > 4) return false;
    if (column === 0 && [0, 3, 5].includes(i)) return false;
    if (column === columns - 1 && [2, 4, 7].includes(i)) return false;
    return true;
  });
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, getInitState("Expert"));
  const { ceils, columns, rows, mines, status, difficulty } = state;
  const seconds = useTimer(status);

  useEffect(() => {
    if (status !== "started") return;
    const remaining = ceils.filter(
      (c) => c.state !== "open" && c.minesAround >= 0
    ).length;
    if (remaining === 0) dispatch({ type: "WON" });
  });

  const openCeil = useCallback(
    (index: number) => {
      if (status === "new") {
        dispatch({ type: "START_GAME", payload: index });
        dispatch({ type: "OPEN_CEIL", payload: index });
        return;
      }
      if (status !== "started") return;
      const ceil = ceils[index];
      if (ceil.state === "flag" || ceil.state === "open") return;
      if (ceil.minesAround < 0) {
        dispatch({ type: "GAME_OVER", payload: index });
      } else {
        dispatch({ type: "OPEN_CEIL", payload: index });
      }
    },
    [status, ceils]
  );

  const changeCeilState = useCallback(
    (index: number) => {
      const ceil = ceils[index];
      if (ceil.state === "open" || status === "won" || status === "died") return;
      dispatch({ type: "CHANGE_CEIL_STATE", payload: index });
    },
    [ceils, status]
  );

  const openCeils = useCallback(
    (index: number) => {
      const ceil = ceils[index];
      if (ceil.state !== "open" || ceil.minesAround <= 0 || status !== "started")
        return;
      const nearIndexes = getNearIndexes(index, rows, columns);
      const flagged = nearIndexes.filter((i) => ceils[i].state === "flag").length;
      if (flagged !== ceil.minesAround) return;
      const mineIndex = nearIndexes.find(
        (i) => ceils[i].minesAround < 0 && ceils[i].state !== "flag"
      );
      if (mineIndex !== undefined) {
        dispatch({ type: "GAME_OVER", payload: mineIndex });
      } else {
        nearIndexes.forEach((i) => dispatch({ type: "OPEN_CEIL", payload: i }));
      }
    },
    [ceils, rows, columns, status]
  );

  const openingCeil = useCallback(
    (index: number) => {
      if (status === "died" || status === "won") return;
      dispatch({ type: "OPENING_CEIL", payload: index });
    },
    [status]
  );

  const openingCeils = useCallback(
    (index: number) => {
      if (status === "died" || status === "won") return;
      dispatch({ type: "OPENING_CEILS", payload: index });
    },
    [status]
  );

  const [topWindow, setTopWindow] = useState<"game" | "console">("console");
  const gameZ = topWindow === "game" ? 2 : 1;
  const consoleZ = topWindow === "console" ? 2 : 1;

  const onReset = useCallback((d?: Difficulty) => {
    dispatch({ type: "CLEAR_MAP", payload: d });
  }, []);

  return (
    <div className="desktop">
      <XpWindow
        title="Minesweeper"
        initialX={160}
        initialY={60}
        zIndex={gameZ}
        onFocus={() => setTopWindow("game")}
        controls="close-only"
      >
        <MinesweeperView
          ceils={ceils}
          columns={columns}
          rows={rows}
          mines={mines}
          status={status}
          difficulty={difficulty}
          seconds={seconds}
          changeCeilState={changeCeilState}
          openCeil={openCeil}
          openCeils={openCeils}
          openingCeil={openingCeil}
          openingCeils={openingCeils}
          onReset={onReset}
          sameTouchPos={false}
          lastTouch={new Date(0)}
          platform="desktop"
        />
      </XpWindow>
      <XpWindow
        title="Robot Console"
        initialX={520}
        initialY={140}
        variant="console"
        controls="close-only"
        zIndex={consoleZ}
        onFocus={() => setTopWindow("console")}
      >
        <ConsolePanel
          ceils={ceils}
          columns={columns}
          rows={rows}
          status={status}
          openCeil={openCeil}
          changeCeilState={changeCeilState}
          onReset={onReset}
          onReady={() => setTopWindow("game")}
        />
      </XpWindow>
    </div>
  );
}
