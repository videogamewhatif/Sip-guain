"use client";

/**
 * Renderizador SVG de la animación de vertido.
 *
 * Usos: póster instantáneo mientras carga WebGL, respaldo para dispositivos
 * sin WebGL y composición estática con `prefers-reduced-motion`.
 * Lee el mismo `getPourState` que la escena 3D, así que ambos coinciden.
 * Se actualiza por atributos en requestAnimationFrame (sin re-render de React).
 */
import { type RefObject, useEffect, useId, useMemo, useRef } from "react";
import {
  BOTTLE_H,
  BOTTLE_W,
  BOWL_BOTTOM_Y,
  GLASS_X,
  getFrame,
  getPourState,
  glassLatheProfile,
  innerRadiusAt,
} from "@/lib/pour-timeline";

interface Props {
  bottleSrc: string;
  /** Progreso vivo (scroll). Si no se pasa, se usa `staticProgress`. */
  progressRef?: RefObject<number>;
  staticProgress?: number;
  /** Fuerza el encuadre de un progreso distinto (p. ej. composición estática). */
  frameProgress?: number;
  animate?: boolean;
  className?: string;
}

const RAD2DEG = 180 / Math.PI;

export default function WinePourSvg({ bottleSrc, progressRef, staticProgress = 0, frameProgress, animate = false, className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (n: string) => `${uid}-${n}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const bottleRef = useRef<SVGGElement>(null);
  const wineRef = useRef<SVGRectElement>(null);
  const surfaceRef = useRef<SVGEllipseElement>(null);
  const streamRef = useRef<SVGPathElement>(null);
  const rippleRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const bottleShadowRef = useRef<SVGEllipseElement>(null);

  const { glassPath, bowlClip, highlightPath } = useMemo(() => {
    const prof = glassLatheProfile(24);
    const rimIndex = prof.findIndex(([, y]) => y >= 2.1);
    const outer = prof.slice(0, rimIndex + 2);
    const right = outer.map(([r, y]) => `${(GLASS_X + r).toFixed(4)},${(-y).toFixed(4)}`);
    const left = [...outer].reverse().map(([r, y]) => `${(GLASS_X - r).toFixed(4)},${(-y).toFixed(4)}`);
    const inner: string[] = [];
    const innerL: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const y = BOWL_BOTTOM_Y + (i / 40) * (2.09 - BOWL_BOTTOM_Y);
      const r = innerRadiusAt(y);
      inner.push(`${(GLASS_X + r).toFixed(4)},${(-y).toFixed(4)}`);
      innerL.unshift(`${(GLASS_X - r).toFixed(4)},${(-y).toFixed(4)}`);
    }
    const hl: string[] = [];
    for (let i = 6; i <= 30; i++) {
      const y = BOWL_BOTTOM_Y + (i / 40) * (2.09 - BOWL_BOTTOM_Y);
      hl.push(`${(GLASS_X - innerRadiusAt(y) * 0.78).toFixed(4)},${(-y).toFixed(4)}`);
    }
    return {
      glassPath: `M${right.join(" L")} L${left.join(" L")} Z`,
      bowlClip: `M${inner.join(" L")} L${innerL.join(" L")} Z`,
      highlightPath: `M${hl.join(" L")}`,
    };
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let raf = 0;
    let aspect = svg.clientWidth / Math.max(1, svg.clientHeight);
    let smoothP = progressRef?.current ?? staticProgress;
    const ro = new ResizeObserver(() => {
      aspect = svg.clientWidth / Math.max(1, svg.clientHeight);
      draw(smoothP);
    });
    ro.observe(svg);

    function draw(p: number) {
      // Ruta oculta (Activity) o sin tamaño todavía: no hay nada que encuadrar.
      if (!(aspect > 0) || !Number.isFinite(aspect)) return;
      const s = getPourState(p);
      const f = getFrame(frameProgress ?? s.p, aspect);
      let W = f.w;
      let H = f.h;
      if (W / H > aspect) H = W / aspect;
      else W = H * aspect;
      svg!.setAttribute("viewBox", `${f.cx - W / 2} ${-(f.cy + H / 2)} ${W} ${H}`);

      const b = s.bottle;
      bottleRef.current?.setAttribute("transform", `translate(${b.center.x} ${-b.center.y}) rotate(${-b.angle * RAD2DEG})`);
      bottleRef.current?.setAttribute("opacity", String(b.opacity));
      bottleShadowRef.current?.setAttribute("cx", String(b.center.x));
      bottleShadowRef.current?.setAttribute("opacity", String(0.5 * b.shadow));

      const lvl = s.wine.level;
      const hasWine = lvl > BOWL_BOTTOM_Y + 0.01;
      wineRef.current?.setAttribute("y", String(-lvl));
      wineRef.current?.setAttribute("height", String(Math.max(0, lvl - BOWL_BOTTOM_Y + 0.02)));
      if (surfaceRef.current) {
        surfaceRef.current.setAttribute("cy", String(-lvl));
        surfaceRef.current.setAttribute("rx", String(s.wine.radius));
        surfaceRef.current.setAttribute("ry", String(s.wine.radius * (0.14 + s.wine.tiltX * 0.8)));
        surfaceRef.current.setAttribute("transform", `rotate(${-s.wine.tiltZ * RAD2DEG} ${GLASS_X} ${-lvl})`);
        surfaceRef.current.setAttribute("opacity", hasWine ? "1" : "0");
      }
      rippleRefs.current.forEach((el, i) => {
        if (!el) return;
        const ph = (s.wine.ripplePhase + i / 3) % 1;
        const r = s.wine.radius * (0.15 + ph * 0.8);
        el.setAttribute("cy", String(-lvl));
        el.setAttribute("rx", String(r));
        el.setAttribute("ry", String(r * 0.14));
        el.setAttribute("opacity", String(s.wine.agitation * (1 - ph) * 0.7));
      });

      const st = s.stream;
      if (streamRef.current) {
        streamRef.current.setAttribute("d", `M${st.p0.x} ${-st.p0.y} Q${st.p1.x} ${-st.p1.y} ${st.p2.x} ${-st.p2.y}`);
        const len = Math.max(0, st.head - st.tail);
        streamRef.current.setAttribute("stroke-dasharray", `${len} 2`);
        streamRef.current.setAttribute("stroke-dashoffset", String(-st.tail));
        streamRef.current.setAttribute("opacity", st.visible && len > 0.002 ? "1" : "0");
      }
    }

    function loop() {
      const target = progressRef?.current ?? staticProgress;
      smoothP += (target - smoothP) * 0.18;
      if (Math.abs(target - smoothP) < 1e-4) smoothP = target;
      draw(smoothP);
      raf = requestAnimationFrame(loop);
    }
    draw(smoothP);
    if (animate) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [animate, progressRef, staticProgress, frameProgress]);

  return (
    <svg ref={svgRef} className={className} preserveAspectRatio="xMidYMid meet" aria-hidden focusable="false">
      <defs>
        <linearGradient id={id("glass")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="0.18" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="0.82" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={id("wine")} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6e1128" />
          <stop offset="1" stopColor="#6e1128" />
        </linearGradient>
        <radialGradient id={id("shadow")}>
          <stop offset="0" stopColor="#3c1e19" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3c1e19" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("bowl")}>
          <path d={bowlClip} />
        </clipPath>
      </defs>

      <ellipse cx={GLASS_X} cy={0} rx={0.62} ry={0.07} fill={`url(#${id("shadow")})`} />
      <ellipse ref={bottleShadowRef} cx={-0.82} cy={0} rx={0.5} ry={0.06} fill={`url(#${id("shadow")})`} />

      <g ref={bottleRef}>
        <image href={bottleSrc} x={-BOTTLE_W / 2} y={-BOTTLE_H / 2} width={BOTTLE_W} height={BOTTLE_H} preserveAspectRatio="none" />
      </g>

      <g clipPath={`url(#${id("bowl")})`}>
        <rect ref={wineRef} x={GLASS_X - 0.6} y={-BOWL_BOTTOM_Y} width={1.2} height={0} fill={`url(#${id("wine")})`} />
      </g>
      <path
        ref={streamRef}
        d="M0 0"
        pathLength={1}
        fill="none"
        stroke="#6e1128"
        strokeWidth={0.05}
        strokeLinecap="round"
        opacity={0}
      />
      <ellipse ref={surfaceRef} cx={GLASS_X} cy={-BOWL_BOTTOM_Y} rx={0} ry={0} fill="#6e1128" opacity={0} />
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          ref={(el) => {
            rippleRefs.current[i] = el;
          }}
          cx={GLASS_X - 0.02}
          cy={0}
          rx={0}
          ry={0}
          fill="none"
          stroke="#c8788c"
          strokeWidth={0.008}
          opacity={0}
        />
      ))}

      <path d={glassPath} fill={`url(#${id("glass")})`} stroke="#8c7a6e" strokeOpacity={0.45} strokeWidth={0.008} />
      <path d={highlightPath} fill="none" stroke="#ffffff" strokeOpacity={0.7} strokeWidth={0.02} strokeLinecap="round" />
    </svg>
  );
}
