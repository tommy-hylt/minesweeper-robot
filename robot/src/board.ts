import type { Ceil } from "./types";

export function getSurrounding(index: number, columns: number, rows: number): number[] {
  if (index < 0 || index >= rows * columns) return [];

  const row = Math.floor(index / columns);
  const col = index % columns;

  return [
    index - columns - 1,
    index - columns,
    index - columns + 1,
    index - 1,
    index + 1,
    index + columns - 1,
    index + columns,
    index + columns + 1,
  ].filter((_, arrayIndex) => {
    if (row === 0 && arrayIndex < 3) return false;
    if (row === rows - 1 && arrayIndex > 4) return false;
    if (col === 0 && [0, 3, 5].includes(arrayIndex)) return false;
    if (col === columns - 1 && [2, 4, 7].includes(arrayIndex)) return false;
    return true;
  });
}

export function getCoveredCeils(ceils: Ceil[]): Ceil[] {
  return ceils.filter((ceil) => ceil.state === "cover" || ceil.state === "unknown");
}

export function getNumberedCeils(ceils: Ceil[], columns: number, rows: number): Ceil[] {
  return ceils.filter((ceil, index) => {
    if (ceil.state !== "open") return false;
    if (ceil.minesAround <= 0) return false;
    return getSurrounding(index, columns, rows).some(
      (i) => ceils[i].state === "cover" || ceils[i].state === "unknown"
    );
  });
}

export function countSurroundingFlags(index: number, ceils: Ceil[], columns: number, rows: number): number {
  return getSurrounding(index, columns, rows).filter((i) => ceils[i].state === "flag").length;
}

export function countSurroundingCovered(index: number, ceils: Ceil[], columns: number, rows: number): number {
  return getSurrounding(index, columns, rows).filter(
    (i) => ceils[i].state === "cover" || ceils[i].state === "unknown"
  ).length;
}

export function isComplete(ceils: Ceil[]): boolean {
  return ceils
    .filter((ceil) => ceil.minesAround >= 0)
    .every((ceil) => ceil.state === "open");
}

export function openedFraction(ceils: Ceil[]): number {
  const safe = ceils.filter((ceil) => ceil.minesAround >= 0);
  const opened = safe.filter((ceil) => ceil.state === "open");
  return safe.length === 0 ? 0 : opened.length / safe.length;
}
