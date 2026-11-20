const clamp = (x) => Math.max(0, Math.min(1, x));
const step = (p, a, b) => clamp((p - a) / (b - a));
const ease = (x) => x * x * (3 - 2 * x);

export const pourGlass = {
  centerX: 500,
  rimY: 326,
  rimRadius: 54,
  rimDepth: 9,
  shoulderY: 368,
  bowlRadius: 62,
  bowlDepth: 64,
};

const bottom = pourGlass.shoulderY + pourGlass.bowlDepth;
const emptyDepth = 5;
const fullDepth = 50;
const pourStart = .345;
const firstContact = .374;
const endOfPour = .65;

// Volume in the elliptical part of the bowl, with the constant factor omitted.
const bowlVolume = (depth) => depth * depth * (1 - depth / (3 * pourGlass.bowlDepth));

function wineSurface(fill) {
  const volume = bowlVolume(emptyDepth) + fill * (bowlVolume(fullDepth) - bowlVolume(emptyDepth));
  let low = fill === 1 ? fullDepth : emptyDepth;
  let high = fill === 0 ? emptyDepth : fullDepth;
  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2;
    if (bowlVolume(mid) < volume) low = mid;
    else high = mid;
  }
  const depth = (low + high) / 2;
  const distanceFromShoulder = 1 - depth / pourGlass.bowlDepth;
  return {
    surface: bottom - depth,
    surfaceRadius: pourGlass.bowlRadius * Math.sqrt(1 - distanceFromShoulder ** 2),
  };
}

function fallingWine(p, mouthX, mouthY, angle, impactX, surface, reach) {
  const run = impactX - mouthX;
  const tangent = run * Math.tan(angle - Math.PI / 2);
  const gravity = surface - mouthY - tangent;
  const tail = step(p, .629, endOfPour);
  const phase = (p - pourStart) * 130;
  const leftEdge = [];
  const rightEdge = [];
  const glint = [];

  for (let i = 0; i <= 16; i++) {
    const t = tail + (reach - tail) * i / 16;
    const x = mouthX + run * t;
    const dy = tangent + 2 * gravity * t;
    const y = mouthY + (tangent + gravity * t) * t;
    const length = Math.hypot(run, dy);
    const normalX = -dy / length;
    const normalY = run / length;
    const width = (3.65 - 1.95 * Math.sqrt(t)) * (1 + .12 * Math.sin(phase - 9 * t)) * (1 - .5 * tail);
    leftEdge.push(`${(x + normalX * width).toFixed(2)} ${(y + normalY * width).toFixed(2)}`);
    rightEdge.push(`${(x - normalX * width).toFixed(2)} ${(y - normalY * width).toFixed(2)}`);
    glint.push(`${(x + normalX * width * .38).toFixed(2)} ${(y + normalY * width * .38).toFixed(2)}`);
  }

  const drop = step(p, .635, endOfPour);
  return {
    ribbon: `M${leftEdge.join(' L')} L${rightEdge.reverse().join(' L')} Z`,
    glint: `M${glint.join(' L')}`,
    drop: {
      x: mouthX + run * drop,
      y: mouthY + (tangent + gravity * drop) * drop,
      rotation: Math.atan2(run, tangent + 2 * gravity * drop) * -180 / Math.PI,
      opacity: Math.sin(Math.PI * drop) * .95,
    },
  };
}

export function pourFrame(progress) {
  const p = clamp(progress);
  const returning = 1 - ease(step(p, .635, .85));
  const lift = ease(step(p, .12, .34)) * returning;
  const tip = ease(step(p, .37, .63)) * returning;
  const exit = ease(step(p, .85, 1));
  const rotation = 106 * ease(step(p, .14, pourStart)) * returning + 10 * tip - 7 * exit;
  const angle = rotation * Math.PI / 180;
  const x = 283 + 20 * lift + 8 * tip - 157 * exit;
  const y = 300 - 88 * lift - 4 * tip;
  // Start the jet at the lower edge of the opening as the neck rolls over.
  const mouthX = x + 172 * Math.sin(angle) + 4 * Math.cos(angle);
  const mouthY = y - 172 * Math.cos(angle) + 4 * Math.sin(angle);
  const fill = ease(step(p, firstContact, endOfPour));
  const { surface, surfaceRadius } = wineSurface(fill);
  const impactX = pourGlass.centerX - 4 + 9 * tip;
  const stream = ease(step(p, pourStart, .366)) * (1 - ease(step(p, .637, endOfPour)));
  const reach = step(p, pourStart, firstContact);
  const jet = stream > 0 ? fallingWine(p, mouthX, mouthY, angle, impactX, surface, reach) : null;

  return {
    x, y, rotation, lift, mouthX, mouthY, fill, surface, surfaceRadius, impactX, stream, reach, jet, exit,
    ripple: ease(step(p, firstContact, .401)) * (1 - ease(step(p, .635, .795))),
  };
}
