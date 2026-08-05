# Minesweeper Robot (Web Edition)

In memory of [tommyinb/MinesweeperRobot](https://github.com/tommyinb/MinesweeperRobot) — the original C# WinForms bot that watched pixels on a real Windows Minesweeper window and clicked its way through them.

This project reimagines that idea for the browser. No pixel scanning, no window handles — just a solver reading real game state and firing the same callbacks a human player would. And since the original bot's natural habitat was a Windows desktop, this version recreates one: a Windows XP desktop, taskbar and all, with Minesweeper and the robot's console running inside it as draggable windows.

## What's here

Three folders, each usable on its own:

| Folder | Language | What it is |
|---|---|---|
| `minesweeper/` | JavaScript | [ShizukuIchi's React Minesweeper](https://github.com/ShizukuIchi/minesweeper), vendored as-is, with hand-written `.d.ts` types added for TypeScript consumers |
| `robot/` | TypeScript | The solver — a port of the original C# strategies, minus the screen scraping |
| `frontend/` | Vite + React + TS | Wires the two together inside the Windows XP desktop UI: draggable windows, taskbar, Start menu |

## How the robot thinks

Ported from the original C# strategies, tried in order each turn:

1. **CountStrategy** — if a numbered cell's unrevealed neighbors exactly equal its mine count, flag them all; if its flagged neighbors already equal that count, the rest are safe to open
2. **BruteForceStrategy** — for trickier constraint chains, enumerate every possible mine assignment and keep only the moves that come out certain (or, failing that, the least risky guess)
3. **RandomStrategy** — when logic runs dry, pick a covered cell and hope

## Running it

```bash
cd frontend
npm install
npm run dev      # dev server
npm run build    # production build → frontend/dist
```

`frontend/vite.config.ts` sets `base: "./"` so the build works behind a reverse proxy at any subpath, not just domain root.

## Credits

- Original robot: https://github.com/tommyinb/MinesweeperRobot
- Game: https://github.com/ShizukuIchi/minesweeper
- Code style: https://github.com/tommy-hylt/tommy-style
