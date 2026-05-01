import type { Ceil } from "../types";
import type { Guess, IStrategy } from "../types";
import { getSurrounding } from "../board";

const MAX_CHAIN = 8;

export function bruteForceStrategy(): IStrategy {
  return { guess };
}

function guess(ceils: Ceil[], columns: number, rows: number): Guess[] {
  const chains = buildChains(ceils, columns, rows);
  const results: Guess[] = [];

  for (const chain of chains) {
    const chainGuesses = solveChain(chain, ceils, columns, rows);
    results.push(...chainGuesses);
  }

  if (results.length > 0) return results;

  const uncertain = results.length === 0
    ? buildChains(ceils, columns, rows)
        .flatMap((chain) => probabilisticGuess(chain, ceils, columns, rows))
    : results;

  return uncertain;
}

function buildChains(ceils: Ceil[], columns: number, rows: number): number[][] {
  const frontier = new Set<number>();

  ceils.forEach((ceil, index) => {
    if (ceil.state !== "open" || ceil.minesAround <= 0) return;
    getSurrounding(index, columns, rows)
      .filter((i) => ceils[i].state === "cover" || ceils[i].state === "unknown")
      .forEach((i) => frontier.add(i));
  });

  const visited = new Set<number>();
  const chains: number[][] = [];

  for (const start of frontier) {
    if (visited.has(start)) continue;
    const chain = growChain(start, frontier, visited, columns, rows);
    if (chain.length > 0) chains.push(chain);
  }

  return chains;
}

function growChain(
  start: number,
  frontier: Set<number>,
  visited: Set<number>,
  columns: number,
  rows: number
): number[] {
  const chain: number[] = [];
  const queue = [start];

  while (queue.length > 0 && chain.length < MAX_CHAIN) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    if (!frontier.has(current)) continue;
    chain.push(current);

    getSurrounding(current, columns, rows)
      .filter((i) => frontier.has(i) && !visited.has(i))
      .forEach((i) => queue.push(i));
  }

  return chain;
}

function solveChain(
  chain: number[],
  ceils: Ceil[],
  columns: number,
  rows: number
): Guess[] {
  const n = chain.length;
  const total = 1 << n;
  const constraints = getConstraints(chain, ceils, columns, rows);

  const bombCounts = new Array<number>(n).fill(0);
  let validCount = 0;

  for (let mask = 0; mask < total; mask++) {
    if (satisfiesConstraints(mask, chain, constraints, ceils, columns, rows)) {
      validCount++;
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) bombCounts[i]++;
      }
    }
  }

  if (validCount === 0) return [];

  return chain
    .map((index, i) => {
      const confidence = bombCounts[i] / validCount;
      if (confidence === 0) return { index, value: "empty" as const, confidence: 1 };
      if (confidence === 1) return { index, value: "bomb" as const, confidence: 1 };
      return undefined;
    })
    .filter((g): g is Guess => g !== undefined);
}

function probabilisticGuess(
  chain: number[],
  ceils: Ceil[],
  columns: number,
  rows: number
): Guess[] {
  const n = chain.length;
  const total = 1 << n;
  const constraints = getConstraints(chain, ceils, columns, rows);

  const bombCounts = new Array<number>(n).fill(0);
  let validCount = 0;

  for (let mask = 0; mask < total; mask++) {
    if (satisfiesConstraints(mask, chain, constraints, ceils, columns, rows)) {
      validCount++;
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) bombCounts[i]++;
      }
    }
  }

  if (validCount === 0) return [];

  let safestIndex = -1;
  let lowestBombChance = Infinity;

  chain.forEach((index, i) => {
    const chance = bombCounts[i] / validCount;
    if (chance < lowestBombChance) {
      lowestBombChance = chance;
      safestIndex = index;
    }
  });

  if (safestIndex === -1) return [];
  return [{ index: safestIndex, value: "empty", confidence: 1 - lowestBombChance }];
}

interface Constraint {
  numberedIndex: number;
  remainingMines: number;
  chainMembers: number[];
}

function getConstraints(
  chain: number[],
  ceils: Ceil[],
  columns: number,
  rows: number
): Constraint[] {
  const chainSet = new Set(chain);
  const constraints: Constraint[] = [];
  const seen = new Set<number>();

  chain.forEach((chainIndex) => {
    getSurrounding(chainIndex, columns, rows)
      .filter((i) => ceils[i].state === "open" && ceils[i].minesAround > 0)
      .forEach((numberedIndex) => {
        if (seen.has(numberedIndex)) return;
        seen.add(numberedIndex);

        const surrounding = getSurrounding(numberedIndex, columns, rows);
        const flaggedCount = surrounding.filter((i) => ceils[i].state === "flag").length;
        const chainMembers = surrounding.filter((i) => chainSet.has(i));

        if (chainMembers.length > 0) {
          constraints.push({
            numberedIndex,
            remainingMines: ceils[numberedIndex].minesAround - flaggedCount,
            chainMembers,
          });
        }
      });
  });

  return constraints;
}

function satisfiesConstraints(
  mask: number,
  chain: number[],
  constraints: Constraint[],
  ceils: Ceil[],
  columns: number,
  rows: number
): boolean {
  const chainIndexMap = new Map(chain.map((index, i) => [index, i]));

  return constraints.every((constraint) => {
    const bombsInChain = constraint.chainMembers.filter((i) => {
      const pos = chainIndexMap.get(i);
      return pos !== undefined && (mask & (1 << pos)) !== 0;
    }).length;

    // remainingMines already has flaggedCount subtracted, so only count
    // unconstrained outside unknowns as degrees of freedom — do NOT re-add flags.
    const possibleOutsideUnknowns = getSurrounding(constraint.numberedIndex, columns, rows)
      .filter((i) => !chainIndexMap.has(i))
      .filter((i) => ceils[i].state === "cover" || ceils[i].state === "unknown")
      .length;

    const minBombs = bombsInChain;
    const maxBombs = bombsInChain + possibleOutsideUnknowns;

    return minBombs <= constraint.remainingMines && constraint.remainingMines <= maxBombs;
  });
}
