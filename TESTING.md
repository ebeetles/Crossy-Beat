Starting point: HW2 — Crossy-Beat (rhythm-game Crossy Road)

## What I pulled out of the page, and what got awkward

## What I tested, and what I deliberately left untested

## Break it on purpose

| # | One-line change | Test that caught it | Failure message |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

## Fake tests found

## CI
- Passing run:
- Failing run:

## Verifier experiment
### What I asked
### What the agent did
### Transcript (relevant part)
### Diff
index c4812d0..675e2c9 100644
--- a/src/main.js
+++ b/src/main.js
@@ -59,6 +59,7 @@ function onBeat(beatIndex, time) {
 
   const latched = input.takeLatched();
   const prevRow = world.player.row;
+  const prevFurthest = world.furthest;
   const ev = world.tick(beatIndex, latched);
 
   // Difficulty coupling: tempo + stems + biome step with the tier.
@@ -71,7 +72,7 @@ function onBeat(beatIndex, time) {
   }
 
   // Scoring + combo.
-  const gained = rowsGained(prevRow, world.player.row);
+  const gained = rowsGained(prevRow, world.player.row, prevFurthest);
   if (gained > 0) {
     const move = scoreMove(gained, App.combo, latched ? latched.grade : null);
     App.score += move.points;
diff --git a/src/scoring.js b/src/scoring.js
index a29fe12..3f460ee 100644
--- a/src/scoring.js
+++ b/src/scoring.js
@@ -4,8 +4,10 @@
 import { CONFIG } from './config.js';
 
 // How many rows of scoring progress a hop from prevRow to newRow made.
-export function rowsGained(prevRow, newRow) {
-  return Math.max(0, newRow - prevRow);
+// Only rows beyond furthest (the furthest row reached before this hop) count,
+// so hopping back and forth over already-reached rows scores nothing.
+export function rowsGained(prevRow, newRow, furthest = prevRow) {
+  return Math.max(0, newRow - Math.max(prevRow, furthest));
 }
 
 // Points and new combo for one beat's movement.
### What I make of it

## How I used AI