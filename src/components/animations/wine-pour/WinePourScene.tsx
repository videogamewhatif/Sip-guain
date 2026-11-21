"use client";
/* eslint-disable react-hooks/immutability --
   Patrón estándar de React Three Fiber: los objetos de three.js (cámara,
   planos, materiales) se mutan imperativamente dentro de useFrame, fuera del
   ciclo de render de React. */

/**
 * Escena WebGL de la botella sirviendo vino (React Three Fiber).
 *
 * - La botella es la fotografía real recortada (plano con alfa): sin deformar
 *   la etiqueta. Solo se traslada y rota sobre su boca, como un vertido real.
 * - La copa es un torno (lathe) con material físico transmisivo.
 * - El vino es el mismo perfil interior recortado por un plano de nivel; la
 *   superficie es un disco que oscila. El chorro es un tubo de radio variable
 *   reconstruido cada fotograma sobre una parábola.
 * - Todo se deriva de `getPourState(progress)`: sin estado acumulado.
 */
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  BOTTLE_H,
  BOTTLE_W,
  GLASS_X,
  getFrame,
  getPourState,
  glassLatheProfile,
  streamPoint,
  wineLatheProfile,
} from "@/lib/pour-timeline";

const CREAM = "#f2e9da";
const WINE = "#6e1128";
const SURFACE_COLOR = new THREE.Color(WINE);
const RIPPLE_COLOR = new THREE.Color("#8a2a44");
const FOV = 30;

interface SceneProps {
  progressRef: RefObject<number>;
  lowPower: boolean;
  bottleSrc: string;
  active: boolean;
  onReady?: () => void;
}

export default function WinePourScene({ progressRef, lowPower, bottleSrc, active, onReady }: SceneProps) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: FOV, near: 0.1, far: 60, position: [0, 2, 8] }}
      onCreated={({ gl }) => {
        // El pase de transmisión del vidrio se limpia con este color: si fuera
        // negro (por defecto), la copa vacía se vería gris en lugar de cristalina.
        gl.setClearColor(CREAM, 1);
        gl.localClippingEnabled = true;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden
    >
      <color attach="background" args={[CREAM]} />
      <Suspense fallback={null}>
        <PourRig progressRef={progressRef} lowPower={lowPower} bottleSrc={bottleSrc} onReady={onReady} />
        <Environment resolution={lowPower ? 64 : 256} frames={1}>
          {/* Tiras estrechas: reflejos finos y verticales, como en una copa real */}
          <Lightformer form="rect" intensity={3} position={[-2.6, 2.2, 2.6]} scale={[0.35, 4.5, 1]} rotation-y={Math.PI / 4} />
          <Lightformer form="rect" intensity={2} position={[2.8, 2, 2.2]} scale={[0.25, 3.5, 1]} rotation-y={-Math.PI / 3} />
          <Lightformer form="ring" intensity={1.2} position={[0, 6, 1]} scale={1.6} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={0.35} color="#f6d9b8" position={[0, 1, -5]} scale={[10, 4, 1]} />
        </Environment>
      </Suspense>
      <ambientLight intensity={0.55} />
      <directionalLight position={[-3, 6, 4]} intensity={1.1} />
    </Canvas>
  );
}

/* ───────────────────────────── Rig principal ───────────────────────────── */

function PourRig({ progressRef, lowPower, bottleSrc, onReady }: Omit<SceneProps, "active">) {
  const { camera, size } = useThree();
  const bottleRef = useRef<THREE.Mesh>(null);
  const bottleMat = useRef<THREE.MeshBasicMaterial>(null);
  const bottleShadow = useRef<THREE.Mesh>(null);
  const wineMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const wineMesh = useRef<THREE.Mesh>(null);
  const surfaceRef = useRef<THREE.Group>(null);
  const ripples = useRef<THREE.Mesh[]>([]);
  const drops = useRef<THREE.Mesh[]>([]);
  const readySent = useRef(false);
  const smooth = useRef({ p: 0, init: false });

  const texture = useTexture(bottleSrc, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
  });

  const glassGeo = useMemo(() => {
    const pts = glassLatheProfile(lowPower ? 20 : 32).map(([r, y]) => new THREE.Vector2(r, y));
    const g = new THREE.LatheGeometry(pts, lowPower ? 48 : 96);
    g.computeVertexNormals();
    return g;
  }, [lowPower]);

  const wineGeo = useMemo(() => {
    const pts = wineLatheProfile(28).map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(pts, lowPower ? 40 : 72);
  }, [lowPower]);

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);
  const stream = useMemo(() => new StreamTube(lowPower ? 40 : 72, lowPower ? 8 : 12), [lowPower]);
  const shadowTex = useMemo(() => radialTexture(), []);

  useEffect(() => () => {
    glassGeo.dispose();
    wineGeo.dispose();
    stream.geometry.dispose();
    shadowTex.dispose();
  }, [glassGeo, wineGeo, stream, shadowTex]);

  const tmpTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    // Suavizado exponencial independiente del framerate: si el scroll se
    // detiene, converge al fotograma exacto; si retrocede, retrocede.
    const target = progressRef.current ?? 0;
    if (!smooth.current.init) {
      smooth.current = { p: target, init: true };
    }
    const k = 1 - Math.exp(-delta * 14);
    smooth.current.p += (target - smooth.current.p) * k;
    if (Math.abs(target - smooth.current.p) < 1e-5) smooth.current.p = target;
    const s = getPourState(smooth.current.p);

    /* Cámara: encuadra el rectángulo pedido según el aspecto del viewport */
    const aspect = size.width / Math.max(1, size.height);
    const f = getFrame(s.p, aspect);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const dist = Math.max(f.h / 2 / tanHalf, f.w / 2 / (tanHalf * aspect));
    camera.position.set(f.cx, f.cy + dist * 0.07, dist);
    tmpTarget.set(f.cx, f.cy, 0);
    camera.lookAt(tmpTarget);

    /* Botella */
    const b = bottleRef.current;
    if (b) {
      b.position.set(s.bottle.center.x, s.bottle.center.y, 0.02);
      b.rotation.z = s.bottle.angle;
      b.visible = s.bottle.opacity > 0.01;
    }
    if (bottleMat.current) bottleMat.current.opacity = s.bottle.opacity;
    if (bottleShadow.current) {
      bottleShadow.current.position.x = s.bottle.center.x;
      (bottleShadow.current.material as THREE.MeshBasicMaterial).opacity = 0.32 * s.bottle.shadow;
    }

    /* Vino: plano de recorte en coordenadas de mundo */
    if (wineMesh.current && wineMat.current) {
      clipPlane.constant = s.wine.level;
      wineMesh.current.visible = s.wine.level > 0.985;
    }
    const surf = surfaceRef.current;
    if (surf) {
      surf.visible = s.wine.level > 0.985;
      surf.position.set(GLASS_X, s.wine.level, 0);
      surf.scale.setScalar(Math.max(0.001, s.wine.radius));
      surf.rotation.set(s.wine.tiltX, 0, s.wine.tiltZ);
    }

    /* Ondas: anillos que se expanden desde el punto de impacto */
    ripples.current.forEach((m, i) => {
      const ph = (s.wine.ripplePhase + i / ripples.current.length) % 1;
      const r = 0.15 + ph * 0.85;
      m.scale.setScalar(r);
      // Material opaco (para que se vea a través del vidrio transmisivo):
      // la "opacidad" se simula mezclando el color con el de la superficie.
      const mat = m.material as THREE.MeshPhysicalMaterial;
      mat.color.copy(SURFACE_COLOR).lerp(RIPPLE_COLOR, s.wine.agitation * (1 - ph) * 0.55);
      m.visible = s.wine.agitation > 0.01;
    });

    /* Chorro */
    stream.update(s.stream, s.p);

    /* Gotas de salpicadura (deterministas por progreso) */
    drops.current.forEach((d, i) => {
      const local = (s.wine.ripplePhase * 0.9 + i * 0.37) % 1;
      const ang = i * 2.399 + Math.floor(s.wine.ripplePhase * 0.9 + i * 0.37) * 1.7;
      const spread = 0.06 + (i % 3) * 0.025;
      d.position.set(
        GLASS_X - 0.02 + Math.cos(ang) * spread * local,
        s.wine.level + 0.09 * Math.sin(Math.PI * local),
        Math.sin(ang) * spread * local,
      );
      d.visible = s.wine.agitation > 0.05 && local < 0.95;
      d.scale.setScalar(0.012 * (1 - local * 0.6));
    });

    if (!readySent.current) {
      readySent.current = true;
      // Avisar tras el primer fotograma real para hacer el fundido desde el póster SVG.
      requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <group>
      {/* Sombras de contacto suaves */}
      <mesh rotation-x={-Math.PI / 2} position={[GLASS_X, 0.002, 0]} scale={[1.25, 0.9, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.34} depthWrite={false} />
      </mesh>
      <mesh ref={bottleShadow} rotation-x={-Math.PI / 2} position={[0, 0.001, 0]} scale={[1.05, 0.55, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.32} depthWrite={false} />
      </mesh>

      {/* Botella (fotografía real) */}
      <mesh ref={bottleRef} renderOrder={2}>
        <planeGeometry args={[BOTTLE_W, BOTTLE_H]} />
        <meshBasicMaterial ref={bottleMat} map={texture} transparent alphaTest={0.02} toneMapped={false} depthWrite={false} />
      </mesh>

      {/* Copa */}
      <group position={[GLASS_X, 0, 0]}>
        <mesh geometry={glassGeo} renderOrder={3}>
          {lowPower ? (
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.1}
              toneMapped={false}
              roughness={0.06}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              envMapIntensity={1.1}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          ) : (
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={1}
              // Sin tone mapping: el fondo crema visto a través del vidrio
              // debe coincidir exactamente con el fondo real.
              toneMapped={false}
              thickness={0.05}
              roughness={0.03}
              ior={1.47}
              clearcoat={1}
              clearcoatRoughness={0.04}
              envMapIntensity={0.9}
              specularIntensity={0.7}
              attenuationColor="#fff6ea"
              attenuationDistance={4}
            />
          )}
        </mesh>
        {/* Vino dentro de la copa (recortado por el plano de nivel) */}
        <mesh ref={wineMesh} geometry={wineGeo} renderOrder={1}>
          <meshPhysicalMaterial
            ref={wineMat}
            color={WINE}
            emissive={WINE}
            emissiveIntensity={0.35}
            roughness={0.3}
            clearcoat={0}
            envMapIntensity={0.25}
            side={THREE.DoubleSide}
            clippingPlanes={[clipPlane]}
          />
        </mesh>
      </group>

      {/* Superficie del vino + ondas */}
      <group ref={surfaceRef}>
        <mesh rotation-x={-Math.PI / 2}>
          <circleGeometry args={[1, lowPower ? 40 : 72]} />
          <meshPhysicalMaterial color={WINE} emissive={WINE} emissiveIntensity={0.35} roughness={0.3} clearcoat={0} envMapIntensity={0.25} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(m) => {
              if (m) ripples.current[i] = m;
            }}
            rotation-x={-Math.PI / 2}
            position={[-0.02, 0.003, 0]}
          >
            <ringGeometry args={[0.92, 1, 48]} />
            <meshPhysicalMaterial color={WINE} emissive={WINE} emissiveIntensity={0.35} roughness={0.3} clearcoat={0} envMapIntensity={0.25} />
          </mesh>
        ))}
      </group>

      {/* Chorro */}
      <mesh geometry={stream.geometry} renderOrder={1} frustumCulled={false}>
        <meshPhysicalMaterial
          color={WINE}
          emissive={WINE}
          emissiveIntensity={0.35}
          roughness={0.3}
          clearcoat={0}
          envMapIntensity={0.25}
        />
      </mesh>
      {Array.from({ length: lowPower ? 4 : 7 }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) drops.current[i] = m;
          }}
          visible={false}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshPhysicalMaterial color={WINE} emissive={WINE} emissiveIntensity={0.35} roughness={0.3} clearcoat={0} envMapIntensity={0.25} />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────────────────────── Chorro de vino ───────────────────────────── */

/**
 * Tubo de radio variable sobre la parábola del chorro. Se reescribe el mismo
 * BufferGeometry cada fotograma (sin asignaciones de memoria).
 */
class StreamTube {
  geometry: THREE.BufferGeometry;
  private positions: Float32Array;
  private normals: Float32Array;
  constructor(
    private segments: number,
    private radial: number,
  ) {
    const verts = (segments + 1) * (radial + 1);
    this.positions = new Float32Array(verts * 3);
    this.normals = new Float32Array(verts * 3);
    const indices: number[] = [];
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radial; j++) {
        const a = i * (radial + 1) + j;
        const b = (i + 1) * (radial + 1) + j;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute("normal", new THREE.BufferAttribute(this.normals, 3).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setIndex(indices);
  }

  update(s: ReturnType<typeof getPourState>["stream"], p: number) {
    const { segments, radial, positions, normals } = this;
    const span = Math.max(0, s.head - s.tail);
    const visible = s.visible && span > 0.001;
    this.geometry.setDrawRange(0, visible ? segments * radial * 6 : 0);
    if (!visible) return;
    for (let i = 0; i <= segments; i++) {
      const t = s.tail + (span * i) / segments;
      const pt = streamPoint(s, t);
      const ahead = streamPoint(s, Math.min(1, t + 0.01));
      const behind = streamPoint(s, Math.max(0, t - 0.01));
      let tx = ahead.x - behind.x;
      let ty = ahead.y - behind.y;
      const len = Math.hypot(tx, ty) || 1;
      tx /= len;
      ty /= len;
      // Normal en el plano xy y binormal = z.
      const nx = -ty;
      const ny = tx;
      // Se adelgaza al caer (acelera) y vibra levemente; los extremos se redondean.
      const taper = 0.03 - 0.012 * t;
      const shimmer = 1 + 0.08 * Math.sin(t * 38 - s.phase * 3) + 0.04 * Math.sin(t * 91 + p * 400);
      // Extremos libres redondeados: el frente que cae y la cola que se desprende.
      const dHead = s.head < 0.999 ? s.head - t : 1;
      const dTail = s.tail > 0.001 ? t - s.tail : 1;
      const x = Math.min(1, Math.max(0, Math.min(dHead, dTail) / 0.035));
      const cap = Math.sqrt(1 - (1 - x) * (1 - x));
      const r = taper * shimmer * Math.max(0.08, cap);
      for (let j = 0; j <= radial; j++) {
        const a = (j / radial) * Math.PI * 2;
        const c = Math.cos(a);
        const sn = Math.sin(a);
        const k = (i * (radial + 1) + j) * 3;
        const ox = nx * c;
        const oy = ny * c;
        const oz = sn;
        positions[k] = pt.x + ox * r;
        positions[k + 1] = pt.y + oy * r;
        positions[k + 2] = oz * r;
        normals[k] = ox;
        normals[k + 1] = oy;
        normals[k + 2] = oz;
      }
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
    this.geometry.computeBoundingSphere();
  }
}

function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(60,30,25,0.85)");
  g.addColorStop(0.45, "rgba(60,30,25,0.35)");
  g.addColorStop(1, "rgba(60,30,25,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
