// tests/scoring.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreMove } from "../src/scoring.js";

test("a perfect hop from no combo scores 12", () => {
  assert.deepEqual(scoreMove(1, 0, "perfect"), { points: 12, combo: 1 });
});