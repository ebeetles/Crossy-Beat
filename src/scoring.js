// scoring.js — scoring rules only. No page, no audio, no DOM.
// Extracted from main.js onBeat()/die() so the rules can be tested on their own.

import { CONFIG } from './config.js';

// How many rows of scoring progress a hop from prevRow to newRow made.
export function rowsGained(prevRow, newRow) {
  return Math.max(0, newRow - prevRow);
}

// Points and new combo for one beat's movement.
// rowsGained: rows moved forward this beat (0 if none).
// combo: the combo count before this move.
// grade: 'perfect' | 'good' | null (null when no input was latched).
// Returns { points, combo }.
export function scoreMove(rowsGained, combo, grade) {
  if (!(rowsGained > 0)) return { points: 0, combo };
  const newCombo = combo + 1;
  const bonus = grade === 'perfect' ? CONFIG.COMBO_PERFECT_BONUS : CONFIG.COMBO_GOOD_BONUS;
  return { points: 10 * rowsGained + bonus * newCombo, combo: newCombo };
}

// Points for collecting a coin. onBeat: whether a valid on-beat input was latched.
export function coinScore(onBeat) {
  return CONFIG.COIN_VALUE + (onBeat ? CONFIG.COIN_ONBEAT_BONUS : 0);
}

// Whether a finished run's score beats the stored best.
export function isNewBest(score, best) {
  return score > best;
}
