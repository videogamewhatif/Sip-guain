export const pourGlass: {
  centerX: number; rimY: number; rimRadius: number; rimDepth: number;
  shoulderY: number; bowlRadius: number; bowlDepth: number;
};

export function pourFrame(progress: number): {
  x: number; y: number; rotation: number; lift: number; mouthX: number; mouthY: number;
  fill: number; surface: number; surfaceRadius: number; impactX: number;
  stream: number; reach: number; exit: number; ripple: number;
  jet: {
    ribbon: string;
    glint: string;
    drop: { x: number; y: number; rotation: number; opacity: number };
  } | null;
};
