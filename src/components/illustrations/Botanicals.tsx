/**
 * Ilustraciones de línea estilo grabado botánico (originales, SVG puro).
 * Cada trazo usa `pathLength={1}` y la clase `ink` para poder "dibujarse"
 * animando `stroke-dashoffset` de 1 → 0 (ver <DrawOnView/> y el hero).
 * Son decorativas: `aria-hidden` siempre.
 */
import type { SVGProps } from "react";

type IllProps = SVGProps<SVGSVGElement> & { strokeWidth?: number };

const base = (p: IllProps) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: p.strokeWidth ?? 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
});

export function VineBranch(props: IllProps) {
  const { strokeWidth, ...rest } = props;
  return (
    <svg viewBox="0 0 200 320" {...base({ strokeWidth })} {...rest}>
      <path className="ink" pathLength={1} d="M100 318 C96 268 110 226 98 176 S88 96 112 22" />
      {/* Hoja izquierda */}
      <path
        className="ink"
        pathLength={1}
        d="M98 212 C80 208 58 218 48 202 C42 190 54 182 46 170 C60 172 64 160 74 166 C76 154 90 156 92 168 C98 178 99 196 98 212 Z"
      />
      <path className="ink" pathLength={1} d="M98 212 L58 180 M98 212 L80 165 M98 212 L50 200 M74 190 L66 196 M86 186 L90 176" />
      {/* Hoja derecha */}
      <path
        className="ink"
        pathLength={1}
        d="M101 128 C119 121 141 131 151 115 C157 103 147 95 153 84 C141 86 135 76 127 82 C125 71 112 73 110 84 C104 92 101 110 101 128 Z"
      />
      <path className="ink" pathLength={1} d="M101 128 L146 98 M101 128 L122 80 M101 128 L150 116 M126 110 L134 104" />
      {/* Hoja pequeña superior */}
      <path className="ink" pathLength={1} d="M108 52 C96 46 84 52 80 42 C78 34 86 30 84 24 C94 26 100 20 104 28 C110 34 110 44 108 52 Z" />
      {/* Zarcillos */}
      <path className="ink" pathLength={1} d="M103 170 C120 168 130 182 121 191 C114 198 105 191 110 184 C113 180 119 183 116 186" />
      <path className="ink" pathLength={1} d="M100 70 C86 70 80 58 88 52 C94 48 100 54 96 58" />
      {/* Racimo */}
      <path className="ink" pathLength={1} d="M99 236 C108 238 116 242 120 250" />
      {[
        [120, 256],
        [131, 258],
        [125, 266],
        [114, 265],
        [136, 268],
        [119, 276],
        [130, 278],
        [124, 288],
        [113, 284],
        [126, 298],
      ].map(([cx, cy], i) => (
        <circle key={i} className="ink" pathLength={1} cx={cx} cy={cy} r={6} />
      ))}
    </svg>
  );
}

export function FlowerSprig(props: IllProps) {
  const { strokeWidth, ...rest } = props;
  return (
    <svg viewBox="0 0 160 240" {...base({ strokeWidth })} {...rest}>
      <path className="ink" pathLength={1} d="M80 238 C82 190 70 150 84 96" />
      <path className="ink" pathLength={1} d="M78 190 C60 182 44 186 34 172 C52 166 68 172 78 186" />
      <path className="ink" pathLength={1} d="M80 150 C98 140 114 144 124 130 C106 126 90 134 81 146" />
      {/* Flor */}
      <path
        className="ink"
        pathLength={1}
        d="M84 96 C70 90 64 74 74 66 C70 54 82 46 90 54 C98 44 112 50 108 62 C120 66 118 82 106 86 C104 98 92 100 84 96 Z"
      />
      <circle className="ink" pathLength={1} cx={90} cy={72} r={7} />
      <path className="ink" pathLength={1} d="M90 72 L86 60 M90 72 L101 66 M90 72 L98 82 M90 72 L80 78" />
      {/* Botón */}
      <path className="ink" pathLength={1} d="M76 120 C64 112 62 100 70 96 C76 100 80 110 76 120 Z" />
    </svg>
  );
}

export function GrapeCluster(props: IllProps) {
  const { strokeWidth, ...rest } = props;
  const g = [
    [50, 40],
    [64, 42],
    [36, 44],
    [57, 54],
    [43, 56],
    [71, 56],
    [50, 68],
    [64, 68],
    [37, 70],
    [57, 81],
    [44, 83],
    [51, 95],
  ];
  return (
    <svg viewBox="0 0 100 110" {...base({ strokeWidth })} {...rest}>
      <path className="ink" pathLength={1} d="M52 30 C52 18 58 10 66 6" />
      <path className="ink" pathLength={1} d="M56 22 C66 18 80 22 86 14 C76 10 64 12 56 22 Z" />
      {g.map(([cx, cy], i) => (
        <circle key={i} className="ink" pathLength={1} cx={cx} cy={cy} r={7.5} />
      ))}
    </svg>
  );
}

export function VineLeaf(props: IllProps) {
  const { strokeWidth, ...rest } = props;
  return (
    <svg viewBox="0 0 100 100" {...base({ strokeWidth })} {...rest}>
      <path
        className="ink"
        pathLength={1}
        d="M50 92 C42 80 20 84 12 66 C6 52 20 48 14 34 C28 34 30 20 42 26 C44 12 56 12 58 26 C70 20 74 34 86 34 C80 48 94 52 88 66 C80 84 58 80 50 92 Z"
      />
      <path className="ink" pathLength={1} d="M50 92 L50 30 M50 70 L22 50 M50 70 L78 50 M50 56 L34 36 M50 56 L66 36" />
    </svg>
  );
}

export function Quill(props: IllProps) {
  const { strokeWidth, ...rest } = props;
  return (
    <svg viewBox="0 0 100 100" {...base({ strokeWidth })} {...rest}>
      <path className="ink" pathLength={1} d="M18 88 C34 64 52 40 86 10 C88 30 74 52 52 62 C44 66 36 70 30 76" />
      <path className="ink" pathLength={1} d="M86 10 C66 22 46 44 30 76" />
      <path className="ink" pathLength={1} d="M60 40 L72 38 M52 50 L66 50 M44 60 L58 60 M54 34 L52 24 M46 44 L42 34" />
      <path className="ink" pathLength={1} d="M18 88 L14 94" />
    </svg>
  );
}

export function OpenBook(props: IllProps) {
  const { strokeWidth, ...rest } = props;
  return (
    <svg viewBox="0 0 120 90" {...base({ strokeWidth })} {...rest}>
      <path className="ink" pathLength={1} d="M60 22 C46 12 26 10 8 14 L8 74 C26 70 46 72 60 82 C74 72 94 70 112 74 L112 14 C94 10 74 12 60 22 Z" />
      <path className="ink" pathLength={1} d="M60 22 L60 82" />
      <path className="ink" pathLength={1} d="M18 28 C30 26 42 27 52 32 M18 38 C30 36 42 37 52 42 M18 48 C30 46 42 47 52 52" />
      <path className="ink" pathLength={1} d="M68 32 C78 27 90 26 102 28 M68 42 C78 37 90 36 102 38" />
      <path className="ink" pathLength={1} d="M84 50 C88 58 96 58 98 52 C94 50 90 50 84 50 Z" />
    </svg>
  );
}

export function WineGlassLine(props: IllProps) {
  const { strokeWidth, ...rest } = props;
  return (
    <svg viewBox="0 0 80 140" {...base({ strokeWidth })} {...rest}>
      <path className="ink" pathLength={1} d="M18 8 C12 40 16 70 40 78 C64 70 68 40 62 8 Z" />
      <path className="ink" pathLength={1} d="M16 44 C30 48 50 48 64 44" />
      <path className="ink" pathLength={1} d="M40 78 L40 128 M22 132 C30 128 50 128 58 132" />
    </svg>
  );
}

export function Barrel(props: IllProps) {
  const { strokeWidth, ...rest } = props;
  return (
    <svg viewBox="0 0 120 100" {...base({ strokeWidth })} {...rest}>
      <ellipse className="ink" pathLength={1} cx={22} cy={50} rx={12} ry={40} />
      <path className="ink" pathLength={1} d="M22 10 C50 4 72 4 100 10 C110 30 110 70 100 90 C72 96 50 96 22 90" />
      <path className="ink" pathLength={1} d="M40 7 C46 30 46 70 40 93 M82 6 C88 30 88 70 82 94" />
      <path className="ink" pathLength={1} d="M24 30 C50 26 76 26 104 30 M24 70 C50 74 76 74 104 70" />
    </svg>
  );
}

/** Mariposa monarca a color, con aleteo opcional (CSS). */
export function Monarch({ flutter = false, ...props }: SVGProps<SVGSVGElement> & { flutter?: boolean }) {
  const wing = (
    <>
      <path d="M50 37 C58 14 84 4 93 16 C99 26 88 40 53 42 Z" fill="#d9822b" stroke="#24211f" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M52 45 C68 44 84 52 81 64 C77 75 62 72 53 50 Z" fill="#e39a3b" stroke="#24211f" strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M53 40 L86 18 M53 40 L90 30 M54 41 L72 12 M54 47 L76 62 M54 48 L66 68" stroke="#24211f" strokeWidth={1.1} fill="none" />
      {[
        [88, 14],
        [93, 21],
        [90, 29],
        [79, 69],
        [73, 72],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.3} fill="#f2e9da" />
      ))}
    </>
  );
  return (
    <svg viewBox="0 0 100 80" aria-hidden focusable="false" {...props}>
      <g className={flutter ? "origin-[50px_40px] animate-flutter" : undefined} style={{ transformBox: "view-box" }}>
        {wing}
      </g>
      <g transform="translate(100 0) scale(-1 1)">
        <g className={flutter ? "origin-[50px_40px] animate-flutter" : undefined} style={{ transformBox: "view-box" }}>
          {wing}
        </g>
      </g>
      <ellipse cx={50} cy={42} rx={2.4} ry={12} fill="#24211f" />
      <path d="M49 31 C46 22 42 18 38 16 M51 31 C54 22 58 18 62 16" stroke="#24211f" strokeWidth={1} fill="none" />
    </svg>
  );
}
