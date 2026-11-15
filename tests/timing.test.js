// Tests for gradeError (src/timing.js).
// Expected numbers are written out from the rules, not computed by the code under test:
//   window  = max(22% of a beat, 90 ms)
//   perfect = within 8% of a beat
import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeError } from "../src/timing.js";
import { CONFIG } from "../src/config.js";

const BEAT_110 = 60 / 110;          // ~0.545 s per beat
const WINDOW_110 = 0.22 * BEAT_110; // ~0.120 s (bigger than the 90 ms floor)
const PERFECT_110 = 0.08 * BEAT_110; // ~0.044 s

test("a press exactly on the beat is perfect", () => {
  assert.deepEqual(gradeError(0, BEAT_110), { valid: true, grade: "perfect", err: 0 });
});

test("a press exactly at the edge of the window still counts, as good", () => {
  assert.deepEqual(gradeError(WINDOW_110, BEAT_110), { valid: true, grade: "good", err: WINDOW_110 });
});

test("a late press just outside the window is a miss", () => {
  const err = WINDOW_110 + 0.001;
  assert.deepEqual(gradeError(err, BEAT_110), { valid: false, grade: null, err });
});

test("an early press just outside the window is a miss", () => {
  const err = -(WINDOW_110 + 0.001);
  assert.deepEqual(gradeError(err, BEAT_110), { valid: false, grade: null, err });
});

test("an early press is graded like a late one, and keeps its negative error", () => {
  assert.deepEqual(gradeError(-0.03, BEAT_110), { valid: true, grade: "perfect", err: -0.03 });
});

test("a press exactly at the perfect boundary is still perfect", () => {
  assert.equal(gradeError(PERFECT_110, BEAT_110).grade, "perfect");
});

test("a press just past the perfect boundary is good", () => {
  assert.equal(gradeError(PERFECT_110 + 0.001, BEAT_110).grade, "good");
});

// Floor tests read the floor from config on purpose: they protect the LOGIC
// (the window never shrinks below the floor), not the tuned value, so the floor
// can be retuned without editing tests. A 0.2 s beat makes 22% (44 ms) far
// smaller than any sensible floor, so the floor is what decides.
const FLOOR = CONFIG.WINDOW_FLOOR_MS / 1000;
const SHORT_BEAT = 0.2;

test("when 22% of a beat is tiny, a press exactly at the floor still counts", () => {
  assert.equal(gradeError(FLOOR, SHORT_BEAT).valid, true);
});

test("when 22% of a beat is tiny, a press 1 ms past the floor is a miss", () => {
  assert.equal(gradeError(FLOOR + 0.001, SHORT_BEAT).valid, false);
});

test("at 60 BPM the window scales up with the beat: a 200 ms press still counts", () => {
  // 22% of a 1 s beat = 220 ms, well above the floor
  assert.deepEqual(gradeError(0.2, 1), { valid: true, grade: "good", err: 0.2 });
});
