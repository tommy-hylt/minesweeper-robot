import type { Ceil, Move } from "./types";
import { openedFraction } from "./board";
import { countStrategy } from "./strategies/countStrategy";
import { bruteForceStrategy } from "./strategies/bruteForceStrategy";
import { randomStrategy } from "./strategies/randomStrategy";

export function pickMove(ceils: Ceil[], columns: number, rows: number): Move | null {
  const progress = openedFraction(ceils);
  const active = buildStrategies(progress);

  for (const { name, strategy } of active) {
    const guesses = strategy.guess(ceils, columns, rows);
    const certain = guesses.filter((g) => g.confidence >= 1);

    if (certain.length > 0) {
      const pick = certain[0];
      return { index: pick.index, action: pick.value === "bomb" ? "flag" : "open", strategy: name, confidence: 1 };
    }

    const probabilistic = guesses.filter((g) => g.confidence > 0);
    if (probabilistic.length > 0) {
      const pick = probabilistic.sort((a, b) => a.confidence - b.confidence)[0];
      return { index: pick.index, action: "open", strategy: name, confidence: pick.confidence };
    }
  }

  return null;
}

function buildStrategies(progress: number) {
  const result = [];

  if (progress >= 0.1) result.push({ name: "count", strategy: countStrategy() });
  if (progress >= 0.4) result.push({ name: "brute-force", strategy: bruteForceStrategy() });
  result.push({ name: "random", strategy: randomStrategy() });

  return result;
}
