# Minesweeper Robot — Frontend

You're looking at it: a Windows XP desktop that never existed, running a Minesweeper robot that watches the board and plays it for you.

This is a tribute to https://github.com/tommyinb/MinesweeperRobot, the original C# tool that automated real Minesweeper by scanning screen pixels and driving the mouse. This version skips the pixel-scanning entirely — it just reads game state directly and clicks through React props — but keeps the spirit intact, right down to the fake Start menu, taskbar, and clock.

## What you're looking at

- **Minesweeper** window — ShizukuIchi's React Minesweeper (`../minesweeper`), unmodified logic
- **Robot Console** window — a live log of every move the robot makes, and why
- The **taskbar** at the bottom — Start menu (with this very file under Read Me), open windows, a clock

## How it's wired

`App.tsx` owns the actual game state: it lifts the `reducer` and `getInitState` straight out of the vendored Minesweeper package and drives it with `useReducer`, the same way the original game does internally. That state is handed to two independent consumers:

- `<MinesweeperView>` — renders the board
- `<ConsolePanel>` (via `useRobot` from `../robot`) — runs the solver on a timer and dispatches moves through the same `openCeil` / `changeCeilState` callbacks a human player would use

Neither consumer knows about the other. The board has no idea it's being played by a robot.

## The Windows XP chrome

- `XpWindow` — the draggable, focusable frame around each panel (titlebar, close button, z-index on focus)
- `XpTaskbar` / `XpStartMenu` — the taskbar and its Start menu popup
- `.desktop` sizes itself to whatever the windows actually occupy (see `measureDesktop` in `App.tsx`), so the taskbar always spans the true content width — even on a phone screen where a window has been dragged past the visible edge

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/, base path is relative for reverse-proxy hosting
```

## Credits

Folder, drive, computer, help, and shortcut icons are the genuine Windows XP originals, extracted from `shell32.dll` and archived at [archive.org/details/win-xp-icons](https://archive.org/details/win-xp-icons) and [archive.org/details/WindowsXPExtractedIcons](https://archive.org/details/WindowsXPExtractedIcons). The toolbar Back/Forward/Up/Search/Folders icons are from the "Windows XP Explorer Toolbar Icons" pack shared on the [Classic Shell forum](https://www.classicshell.net/forum/viewtopic.php?f=8&t=5070).
