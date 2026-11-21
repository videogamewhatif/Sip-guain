"use client";

import { useEffect, useState } from "react";

export type RenderCapability =
  | { status: "pending" }
  | { status: "webgl"; lowPower: boolean }
  | { status: "none" };

/**
 * Detecta si el dispositivo puede renderizar la escena WebGL y si conviene un
 * perfil ligero (pantalla táctil pequeña, poca memoria o pocos núcleos).
 */
export function useRenderCapability(): RenderCapability {
  const [cap, setCap] = useState<RenderCapability>({ status: "pending" });

  useEffect(() => {
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      supported = !!gl;
      (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      supported = false;
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 900;
    const lowPower =
      (coarse && small) || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || (navigator.hardwareConcurrency ?? 8) <= 4;
    // Diferido al siguiente frame para no bloquear la hidratación.
    const id = requestAnimationFrame(() => setCap(supported ? { status: "webgl", lowPower } : { status: "none" }));
    return () => cancelAnimationFrame(id);
  }, []);

  return cap;
}
