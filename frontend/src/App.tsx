import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { reducer, getInitState } from "@minesweeper/Minesweeper/index";
import type { Difficulty, MinesweeperState } from "@minesweeper/Minesweeper/index";
import MinesweeperView from "@minesweeper/Minesweeper/MinesweeperView";
import ConsolePanel from "./ConsolePanel";
import ReadMe from "./ReadMe";
import MyDocumentsWindow from "./MyDocumentsWindow";
import MyComputerWindow from "./MyComputerWindow";
import XpWindow from "./XpWindow";
import XpTaskbar from "./XpTaskbar";
import XpShutdownScreen from "./XpShutdownScreen";
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

  const [topWindow, setTopWindow] = useState<
    "game" | "console" | "readme" | "mydocs" | "mycomputer"
  >("console");
  const [readmeOpen, setReadmeOpen] = useState(false);
  const [myDocumentsOpen, setMyDocumentsOpen] = useState(false);
  const [myComputerOpen, setMyComputerOpen] = useState(false);
  const [shutdownKind, setShutdownKind] = useState<"logoff" | "shutdown" | null>(null);
  const gameZ = topWindow === "game" ? 2 : 1;
  const consoleZ = topWindow === "console" ? 2 : 1;
  const readmeZ = topWindow === "readme" ? 2 : 1;
  const myDocumentsZ = topWindow === "mydocs" ? 2 : 1;
  const myComputerZ = topWindow === "mycomputer" ? 2 : 1;

  const openWindows = [
    { id: "game", title: "Minesweeper", icon: "💣" },
    { id: "console", title: "Robot Console", icon: "🤖" },
    ...(readmeOpen ? [{ id: "readme", title: "Read Me", icon: "📄" }] : []),
    ...(myDocumentsOpen ? [{ id: "mydocs", title: "My Documents", icon: "🗂️" }] : []),
    ...(myComputerOpen ? [{ id: "mycomputer", title: "My Computer", icon: "🖥️" }] : []),
  ];

  const openMyDocuments = useCallback(() => {
    setMyDocumentsOpen(true);
    setTopWindow("mydocs");
  }, []);

  const openMyComputer = useCallback(() => {
    setMyComputerOpen(true);
    setTopWindow("mycomputer");
  }, []);

  const onReset = useCallback((d?: Difficulty) => {
    dispatch({ type: "CLEAR_MAP", payload: d });
  }, []);

  const desktopRef = useRef<HTMLDivElement>(null);
  const [desktopSize, setDesktopSize] = useState({ width: 0, height: 0 });

  const measureDesktop = useCallback(() => {
    const el = desktopRef.current;
    if (!el) return;
    let maxRight = window.innerWidth;
    let maxBottom = window.innerHeight;
    for (const child of el.children) {
      if (!(child instanceof HTMLElement) || !child.classList.contains("xp-window")) continue;
      maxRight = Math.max(maxRight, child.offsetLeft + child.offsetWidth);
      maxBottom = Math.max(maxBottom, child.offsetTop + child.offsetHeight);
    }
    setDesktopSize({ width: maxRight, height: maxBottom });
  }, []);

  useLayoutEffect(() => {
    measureDesktop();
    window.addEventListener("resize", measureDesktop);
    return () => window.removeEventListener("resize", measureDesktop);
  }, [measureDesktop]);

  return (
    <div
      className="desktop"
      ref={desktopRef}
      style={{ width: desktopSize.width || undefined, height: desktopSize.height || undefined }}
    >
      <XpWindow
        title="Minesweeper"
        initialX={160}
        initialY={60}
        zIndex={gameZ}
        onFocus={() => setTopWindow("game")}
        onMove={measureDesktop}
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
        onMove={measureDesktop}
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
      {readmeOpen && (
        <XpWindow
          title="README.txt - Notepad"
          initialX={340}
          initialY={100}
          controls="all"
          zIndex={readmeZ}
          onFocus={() => setTopWindow("readme")}
          onMove={measureDesktop}
          onClose={() => setReadmeOpen(false)}
        >
          <ReadMe />
        </XpWindow>
      )}
      {myDocumentsOpen && (
        <XpWindow
          title="My Documents"
          initialX={260}
          initialY={180}
          controls="all"
          zIndex={myDocumentsZ}
          onFocus={() => setTopWindow("mydocs")}
          onMove={measureDesktop}
          onClose={() => setMyDocumentsOpen(false)}
        >
          <MyDocumentsWindow onOpenMyComputer={openMyComputer} />
        </XpWindow>
      )}
      {myComputerOpen && (
        <XpWindow
          title="My Computer"
          initialX={420}
          initialY={220}
          controls="all"
          zIndex={myComputerZ}
          onFocus={() => setTopWindow("mycomputer")}
          onMove={measureDesktop}
          onClose={() => setMyComputerOpen(false)}
        >
          <MyComputerWindow onOpenMyDocuments={openMyDocuments} />
        </XpWindow>
      )}
      <XpTaskbar
        openWindows={openWindows}
        activeWindow={topWindow}
        onSelectWindow={(id) => setTopWindow(id as typeof topWindow)}
        onReadMe={() => {
          setReadmeOpen(true);
          setTopWindow("readme");
        }}
        onOpenMyDocuments={openMyDocuments}
        onOpenMyComputer={openMyComputer}
        onLogOff={() => setShutdownKind("logoff")}
        onTurnOff={() => setShutdownKind("shutdown")}
      />
      {shutdownKind && (
        <XpShutdownScreen kind={shutdownKind} onDismiss={() => setShutdownKind(null)} />
      )}
    </div>
  );
}
