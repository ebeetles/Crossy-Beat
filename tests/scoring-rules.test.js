// Tests for scoreMove, coinScore and isNewBest (src/scoring.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreMove, coinScore, isNewBest } from "../src/scoring.js";

// ---- scoreMove ----

test("perfect hop: bonus is 2 x the NEW combo", () => {
  // combo 3 -> 4; 10 for the row + 2 * 4
  assert.deepEqual(scoreMove(1, 3, "perfect"), { points: 18, combo: 4 });
});

test("good hop: bonus is 1 x the NEW combo", () => {
  // combo 3 -> 4; 10 for the row + 1 * 4
  assert.deepEqual(scoreMove(1, 3, "good"), { points: 14, combo: 4 });
});

test("a hop with no timed press (grade null) gets the good bonus, not perfect", () => {
  assert.deepEqual(scoreMove(1, 0, null), { points: 11, combo: 1 });
});

test("zero rows gained scores nothing and leaves the combo unchanged", () => {
  assert.deepEqual(scoreMove(0, 5, "perfect"), { points: 0, combo: 5 });
});

test("negative rows gained (moving backward) scores nothing and leaves the combo unchanged", () => {
  assert.deepEqual(scoreMove(-1, 5, "good"), { points: 0, combo: 5 });
});

test("a multi-row hop scores 10 per row but only one combo bonus", () => {
  // 2 rows: 20 + 2 * 1
  assert.deepEqual(scoreMove(2, 0, "perfect"), { points: 22, combo: 1 });
});

// ---- coinScore ----

test("an off-beat coin is worth 5", () => {
  assert.equal(coinScore(false), 5);
});

test("an on-beat coin is worth 10", () => {
  assert.equal(coinScore(true), 10);
});

// ---- isNewBest ----

test("beating the best by 1 is a new best", () => {
  assert.equal(isNewBest(101, 100), true);
});

test("tying the best is NOT a new best", () => {
  assert.equal(isNewBest(100, 100), false);
});

test("scoring below the best is not a new best", () => {
  assert.equal(isNewBest(99, 100), false);
});
