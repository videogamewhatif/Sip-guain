/**
 * Línea de tiempo de la animación "Botella sirviendo vino".
 *
 * Es una función pura de `p` (progreso de scroll 0 → 1): el mismo valor
 * produce siempre el mismo fotograma, por lo que la animación es 100 %
 * reversible y se detiene exactamente donde se detiene el usuario.
 * La consumen dos renderizadores: WebGL (React Three Fiber) y SVG (respaldo).
 *
 * Unidades: "mundo" 2D en metros escénicos. x → derecha, y → arriba, mesa en y = 0.
 *
 *   Etapa 1  0.00–0.15  Presentación
 *   Etapa 2  0.15–0.35  La botella se eleva, se acerca y se inclina (pivote en la boca)
 *   Etapa 3  0.35–0.65  Servir: chorro, impacto, ondas y llenado por volumen
 *   Etapa 4  0.65–0.85  Copa llena: el chorro se corta, la botella vuelve, el vino oscila
 *   Etapa 5  0.85–1.00  La botella sale de cuadro; la copa queda como protagonista
 */
import { clamp, easeInCubic, easeInOutCubic, easeInOutSine, lerp, range } from "./utils";

export const STAGES = [
  { id: 1, label: "Presentación", from: 0, to: 0.15 },
  { id: 2, label: "Inclinación", from: 0.15, to: 0.35 },
  { id: 3, label: "Servir", from: 0.35, to: 0.65 },
  { id: 4, label: "Copa llena", from: 0.65, to: 0.85 },
  { id: 5, label: "Bienvenida", from: 0.85, to: 1 },
] as const;

/* ─────────────────────────── Geometría ─────────────────────────── */

/** Proporción real de la fotografía recortada de la botella (221 × 960 px). */
export const BOTTLE_ASPECT = 221 / 960;
export const BOTTLE_H = 2.9;
export const BOTTLE_W = BOTTLE_H * BOTTLE_ASPECT;
/** La boca está en el borde superior de la imagen, centrada. */
const BOTTLE_X0 = -0.82;

export const GLASS_X = 0.55;
export const RIM_Y = 2.1;
export const BOWL_BOTTOM_Y = 0.97;
const BOWL_TOP_Y = 2.09;

/** Perfil interior de la copa (u: 0 fondo → 1 borde, r: radio). Forma de tulipa. */
const INNER_PROFILE: [number, number][] = [
  [0, 0],
  [0.05, 0.14],
  [0.15, 0.28],
  [0.3, 0.38],
  [0.46, 0.425],
  [0.6, 0.428],
  [0.75, 0.41],
  [0.9, 0.389],
  [1, 0.375],
];
const OUTER_PROFILE: [number, number][] = [
  [0, 0.055],
  [0.04, 0.15],
  [0.13, 0.29],
  [0.28, 0.395],
  [0.44, 0.44],
  [0.6, 0.443],
  [0.75, 0.425],
  [0.9, 0.403],
  [1, 0.39],
];

/** Interpolación Catmull-Rom sobre puntos (u, r) ordenados por u. */
function catmull(points: [number, number][], u: number) {
  const n = points.length;
  let i = 0;
  while (i < n - 2 && u > points[i + 1][0]) i++;
  const p0 = points[Math.max(0, i - 1)][1];
  const p1 = points[i][1];
  const p2 = points[i + 1][1];
  const p3 = points[Math.min(n - 1, i + 2)][1];
  const t = clamp((u - points[i][0]) / (points[i + 1][0] - points[i][0]));
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

/** Radio interior de la copa a la altura y (mundo). */
export function innerRadiusAt(y: number) {
  const u = clamp((y - BOWL_BOTTOM_Y) / (BOWL_TOP_Y - BOWL_BOTTOM_Y));
  return Math.max(0, catmull(INNER_PROFILE, u));
}

/**
 * Perfil completo de la copa para un torno (lathe): exterior de la base al
 * borde y regreso por el interior. Devuelve pares [r, y].
 */
export function glassLatheProfile(segments = 28): [number, number][] {
  const pts: [number, number][] = [
    [0.0005, 0],
    [0.4, 0],
    [0.415, 0.012],
    [0.4, 0.026],
    [0.12, 0.04],
    [0.045, 0.09],
    [0.032, 0.2],
    [0.03, 0.6],
    [0.034, 0.8],
    [0.05, 0.88],
  ];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    pts.push([catmull(OUTER_PROFILE, u), lerp(0.92, 2.1, u)]);
  }
  pts.push([0.383, 2.106]);
  for (let i = segments; i >= 0; i--) {
    const u = i / segments;
    pts.push([Math.max(0.0005, catmull(INNER_PROFILE, u)), lerp(BOWL_BOTTOM_Y, BOWL_TOP_Y, u)]);
  }
  return pts;
}

/** Perfil interior abierto (para el volumen de vino), del eje al borde. */
export function wineLatheProfile(segments = 28): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    pts.push([Math.max(0.0005, catmull(INNER_PROFILE, u) * 0.985), lerp(BOWL_BOTTOM_Y + 0.004, BOWL_TOP_Y, u)]);
  }
  return pts;
}

/* ───────────────── Llenado por volumen (no por altura) ───────────────── */

const VOL_STEPS = 120;
const volumeTable: number[] = (() => {
  const t = [0];
  const dy = (BOWL_TOP_Y - BOWL_BOTTOM_Y) / VOL_STEPS;
  for (let i = 1; i <= VOL_STEPS; i++) {
    const y = BOWL_BOTTOM_Y + (i - 0.5) * dy;
    const r = innerRadiusAt(y);
    t.push(t[i - 1] + Math.PI * r * r * dy);
  }
  return t;
})();

/** Nivel final: ~62 % de la capacidad (más vino). */
export const TARGET_FILL_FRACTION = 0.62;

function levelForVolume(v: number) {
  if (v <= 0) return BOWL_BOTTOM_Y;
  for (let i = 1; i <= VOL_STEPS; i++) {
    if (volumeTable[i] >= v) {
      const f = (v - volumeTable[i - 1]) / (volumeTable[i] - volumeTable[i - 1]);
      return BOWL_BOTTOM_Y + ((i - 1 + f) / VOL_STEPS) * (BOWL_TOP_Y - BOWL_BOTTOM_Y);
    }
  }
  return BOWL_TOP_Y;
}

/* ─────────────────────────── Estado por fotograma ─────────────────────────── */

export interface Vec2 {
  x: number;
  y: number;
}

export interface PourState {
  p: number;
  stage: number;
  bottle: {
    /** Centro de la imagen de la botella. */
    center: Vec2;
    /** Boca de la botella (pivote). */
    mouth: Vec2;
    /** Rotación en radianes (positivo = antihorario). */
    angle: number;
    opacity: number;
    /** Opacidad de la sombra de contacto (0 cuando la botella está en el aire). */
    shadow: number;
  };
  stream: {
    visible: boolean;
    /** Curva cuadrática: inicio (boca), control y fin (superficie). */
    p0: Vec2;
    p1: Vec2;
    p2: Vec2;
    /** Fracción visible de la curva [tail, head] (0 = boca, 1 = superficie). */
    tail: number;
    head: number;
    /** Fase para el brillo y la textura del chorro (avanza con el scroll). */
    phase: number;
  };
  wine: {
    level: number;
    radius: number;
    /** Inclinación de la superficie (oscilación) en radianes, ejes x y z. */
    tiltX: number;
    tiltZ: number;
    /** 0–1: intensidad de ondas por impacto. */
    agitation: number;
    /** Fase de las ondas (determinista respecto al scroll). */
    ripplePhase: number;
  };
  glass: { offsetX: number };
}

const POUR_ANGLE = -1.92; // ≈ -110°
const POUR_ANGLE_END = -2.06; // ≈ -118° (se inclina más conforme se vacía)
const MOUTH_POUR: Vec2 = { x: GLASS_X - 0.13, y: RIM_Y + 0.34 };
const MOUTH_START: Vec2 = { x: BOTTLE_X0, y: BOTTLE_H };
const LIFT_CTRL: Vec2 = { x: -0.35, y: 3.75 };
const RETURN_CTRL: Vec2 = { x: -0.45, y: 3.65 };
const MOUTH_END: Vec2 = { x: BOTTLE_X0 - 0.12, y: BOTTLE_H };

const quad = (a: Vec2, c: Vec2, b: Vec2, t: number): Vec2 => ({
  x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
  y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
});

/** Centro de la botella a partir de la boca (pivote) y el ángulo. */
function centerFromMouth(m: Vec2, angle: number): Vec2 {
  const h = BOTTLE_H / 2;
  return { x: m.x + h * Math.sin(angle), y: m.y - h * Math.cos(angle) };
}

export function getPourState(rawP: number): PourState {
  const p = clamp(rawP);
  const stage = STAGES.findIndex((s) => p < s.to || s.id === 5) + 1;

  /* Botella */
  let mouth: Vec2 = MOUTH_START;
  let angle = 0;
  if (p >= 0.15 && p < 0.35) {
    mouth = quad(MOUTH_START, LIFT_CTRL, MOUTH_POUR, easeInOutCubic(range(p, 0.15, 0.35)));
    // Primero se eleva, después se inclina: el giro arranca un poco más tarde.
    angle = POUR_ANGLE * easeInOutSine(range(p, 0.175, 0.35));
  } else if (p >= 0.35 && p < 0.65) {
    mouth = MOUTH_POUR;
    angle = lerp(POUR_ANGLE, POUR_ANGLE_END, range(p, 0.35, 0.65));
  } else if (p >= 0.65) {
    // Al terminar, el cuello sube primero (corta el chorro) y luego regresa.
    angle = lerp(POUR_ANGLE_END, 0, easeInOutCubic(range(p, 0.65, 0.81)));
    mouth = quad(MOUTH_POUR, RETURN_CTRL, MOUTH_END, easeInOutCubic(range(p, 0.665, 0.85)));
    if (p > 0.86) {
      mouth = { x: mouth.x - 2.6 * easeInCubic(range(p, 0.86, 1)), y: mouth.y };
    }
  }
  const center = centerFromMouth(mouth, angle);
  const bottomY = center.y - (BOTTLE_H / 2) * Math.cos(angle);
  const opacity = 1 - range(p, 0.9, 0.99);
  const shadow = clamp(1 - Math.max(0, bottomY - 0.02) * 2.2) * (Math.abs(angle) < 0.3 ? 1 : 0.4) * opacity;

  /* Vino en la copa */
  const fill = range(p, 0.378, 0.645);
  const level = levelForVolume(fill * TARGET_FILL_FRACTION * volumeTable[VOL_STEPS]);
  const radius = innerRadiusAt(level) * 0.985;

  /* Chorro: cae con gravedad (la cabeza acelera) y se desprende de la boca al final */
  const head = easeInCubic(range(p, 0.352, 0.382)) ** 0.5 * (p >= 0.352 ? 1 : 0);
  const tail = p < 0.625 ? 0 : Math.min(1, easeInCubic(range(p, 0.625, 0.655)) ** 0.6);
  const dir = { x: -Math.sin(angle), y: Math.cos(angle) }; // eje de la botella hacia la boca
  const lip = { x: mouth.x + dir.x * 0.01, y: mouth.y + dir.y * 0.01 };
  const surface = { x: GLASS_X - 0.02, y: level + 0.005 };
  // Punto de control sobre el eje de salida, sin rebasar el punto de impacto:
  // así la trayectoria es una parábola creíble (avanza y cae, nunca regresa).
  const k = dir.x > 0.05 ? Math.min(0.16, ((surface.x - lip.x) / dir.x) * 0.85) : 0.1;
  const p1 = { x: lip.x + dir.x * Math.max(0.02, k), y: lip.y + dir.y * Math.max(0.02, k) };
  const streamVisible = p > 0.352 && tail < 0.999;

  /* Ondas y oscilación de la superficie */
  const pouring = p > 0.378 && p < 0.655 ? 1 : 0;
  const agitation = pouring * (0.55 + 0.45 * range(p, 0.38, 0.45)) * (1 - range(p, 0.64, 0.66));
  const since = p - 0.655;
  const slosh = since > 0 ? Math.exp(-since * 26) * Math.sin(since * 95) : 0;
  const jitter = agitation * 0.012 * Math.sin(p * 900);
  const tiltX = 0.05 * slosh + jitter;
  const tiltZ = -0.075 * slosh + agitation * 0.01 * Math.cos(p * 700);

  return {
    p,
    stage,
    bottle: { center, mouth, angle, opacity, shadow },
    stream: { visible: streamVisible, p0: lip, p1, p2: surface, tail, head, phase: p * 60 },
    wine: { level, radius, tiltX, tiltZ, agitation, ripplePhase: p * 55 },
    glass: { offsetX: 0 },
  };
}

/* ─────────────────────────── Encuadre de cámara ─────────────────────────── */

export interface Frame {
  /** Centro del encuadre en el mundo. */
  cx: number;
  cy: number;
  /** Ancho y alto mínimos que deben verse. */
  w: number;
  h: number;
}

type FrameKey = [number, Frame];

/** Horizontal: la composición deja aire a la izquierda para los textos. */
const LANDSCAPE: FrameKey[] = [
  [0, { cx: -1.25, cy: 1.55, w: 5.6, h: 3.9 }],
  [0.15, { cx: -1.05, cy: 1.6, w: 5.2, h: 3.8 }],
  [0.35, { cx: -0.85, cy: 2.05, w: 4.8, h: 4.9 }],
  [0.65, { cx: -0.6, cy: 1.95, w: 4.4, h: 4.6 }],
  [0.85, { cx: 0.5, cy: 1.4, w: 2.4, h: 3.0 }],
  [1, { cx: -0.75, cy: 1.5, w: 4.4, h: 3.4 }],
];

/** Vertical (móvil): textos arriba, escena abajo; movimientos más contenidos. */
const PORTRAIT: FrameKey[] = [
  [0, { cx: -0.1, cy: 2.35, w: 2.9, h: 5.6 }],
  [0.15, { cx: -0.1, cy: 2.3, w: 2.9, h: 5.4 }],
  [0.35, { cx: -0.85, cy: 2.35, w: 3.9, h: 5.2 }],
  [0.65, { cx: -0.7, cy: 2.3, w: 3.8, h: 5.0 }],
  [0.85, { cx: 0.5, cy: 1.9, w: 1.9, h: 3.9 }],
  [1, { cx: 0.5, cy: 2.05, w: 1.9, h: 4.4 }],
];

export function getFrame(p: number, aspect: number): Frame {
  const keys = aspect < 0.9 ? PORTRAIT : LANDSCAPE;
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
  const [pa, a] = keys[i];
  const [pb, b] = keys[i + 1];
  const t = easeInOutSine(range(p, pa, pb));
  return { cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) };
}

/** Punto de la curva cuadrática en t. */
export function streamPoint(s: PourState["stream"], t: number): Vec2 {
  return quad(s.p0, s.p1, s.p2, t);
}
