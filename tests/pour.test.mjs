import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pourFrame } from '../src/lib/pour.mjs';

test('presentation, tilt, flow, settling and exit share one reversible timeline', () => {
  assert.equal(pourFrame(0).rotation, 0);
  assert.equal(pourFrame(.25).fill, 0);
  assert.ok(pourFrame(.25).rotation > 0);
  assert.ok(pourFrame(.5).stream > .9);
  assert.ok(pourFrame(.5).mouthX > 450);
  assert.ok(pourFrame(.5).mouthY < 344);
  assert.equal(pourFrame(.65).stream, 0);
  assert.ok(pourFrame(.65).fill > .99);
  assert.equal(pourFrame(.85).rotation, 0);
  assert.equal(pourFrame(1).exit, 1);
  const forward = Array.from({ length: 101 }, (_, i) => pourFrame(i / 100));
  const backward = Array.from({ length: 101 }, (_, i) => pourFrame((100 - i) / 100));
  assert.deepEqual(backward.reverse(), forward);
});

test('progress clamps at bounds and the liquid surface rises monotonically', () => {
  assert.deepEqual(pourFrame(-1), pourFrame(0));
  assert.deepEqual(pourFrame(2), pourFrame(1));
  for (let i = 1; i <= 100; i++) {
    assert.ok(pourFrame(i / 100).surface <= pourFrame((i - 1) / 100).surface);
  }
});

test('wine starts collecting after the jet reaches the bowl and ripples settle after the final drop', () => {
  const airborne = pourFrame(.36);
  assert.ok(airborne.jet);
  assert.ok(airborne.reach < 1);
  assert.equal(airborne.fill, 0);

  const landed = pourFrame(.42);
  assert.equal(landed.reach, 1);
  assert.ok(landed.fill > 0);
  assert.ok(landed.surfaceRadius > airborne.surfaceRadius);
  assert.ok(pourFrame(.642).jet?.drop.opacity > 0);

  const cut = pourFrame(.65);
  assert.equal(cut.jet, null);
  assert.ok(cut.ripple > 0);
  assert.equal(pourFrame(.8).ripple, 0);
});
