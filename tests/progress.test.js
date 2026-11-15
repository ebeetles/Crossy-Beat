// Bug found while playing: hopping back and forth farms points forever.
// Only rows beyond the furthest row already reached should score.
import { test } from "node:test";
import assert from "node:assert/strict";
import { rowsGained } from "../src/scoring.js";

test("hopping back onto a row you've already passed scores no progress", () => {
  // furthest reached is row 8; player stepped back to 5 and hops forward to 6
  assert.equal(rowsGained(5, 6, 8), 0);
});
