import type { Ceil } from "../types";
import type { Guess, IStrategy } from "../types";

export function randomStrategy(): IStrategy {
  return { guess };
}

function guess(ceils: Ceil[], _columns: number, _rows: number): Guess[] {
  const candidates = ceils
    .map((ceil, index) => ({ ceil, index }))
    .filter(({ ceil }) => ceil.state === "cover" || ceil.state === "unknown");

  if (candidates.length === 0) return [];

  const { index } = candidates[Math.floor(Math.random() * candidates.length)];
  return [{ index, value: "empty", confidence: 0.5 }];
}
