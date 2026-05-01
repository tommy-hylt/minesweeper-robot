import type { Ceil } from "../types";
import type { Guess, IStrategy } from "../types";
import { getSurrounding, countSurroundingFlags, countSurroundingCovered } from "../board";

export function countStrategy(): IStrategy {
  return { guess };
}

function guess(ceils: Ceil[], columns: number, rows: number): Guess[] {
  const results: Guess[] = [];

  ceils.forEach((ceil, index) => {
    if (ceil.state !== "open" || ceil.minesAround <= 0) return;

    const surrounding = getSurrounding(index, columns, rows);
    const coveredCount = countSurroundingCovered(index, ceils, columns, rows);
    const flaggedCount = countSurroundingFlags(index, ceils, columns, rows);
    const remainingMines = ceil.minesAround - flaggedCount;

    if (remainingMines === 0) {
      surrounding
        .filter((i) => ceils[i].state === "cover" || ceils[i].state === "unknown")
        .forEach((i) => results.push({ index: i, value: "empty", confidence: 1 }));
    }

    if (remainingMines > 0 && remainingMines === coveredCount) {
      surrounding
        .filter((i) => ceils[i].state === "cover" || ceils[i].state === "unknown")
        .forEach((i) => results.push({ index: i, value: "bomb", confidence: 1 }));
    }
  });

  return deduped(results);
}

function deduped(guesses: Guess[]): Guess[] {
  const seen = new Map<number, Guess>();
  const conflicts = new Set<number>();

  for (const g of guesses) {
    if (conflicts.has(g.index)) continue;
    const existing = seen.get(g.index);
    if (!existing) {
      seen.set(g.index, g);
    } else if (existing.value !== g.value) {
      conflicts.add(g.index);
      seen.delete(g.index);
    } else if (g.confidence > existing.confidence) {
      seen.set(g.index, g);
    }
  }

  return [...seen.values()];
}
