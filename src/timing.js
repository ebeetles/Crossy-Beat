// timing.js — beat-timing judgement only. No Tone.js, no audio context, no DOM.
// Extracted from clock.js gradePress() so it can be imported without a browser.

import { CONFIG, windowHalf } from './config.js';

// Grade a press that landed `err` seconds from the target beat (negative = early).
// Returns { valid, grade: 'perfect' | 'good' | null, err }.
export function gradeError(err, beatDurSec) {
  const w = windowHalf(beatDurSec);
  if (Math.abs(err) <= w) {
    const perfectW = CONFIG.PERFECT_FRAC * beatDurSec;
    return { valid: true, grade: Math.abs(err) <= perfectW ? 'perfect' : 'good', err };
  }
  return { valid: false, grade: null, err };
}
