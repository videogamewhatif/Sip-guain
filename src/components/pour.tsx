'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { pourFrame, pourGlass } from '@/lib/pour.mjs';
import PourArt from './pour-art';

export default function Pour() {
  const scene = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = scene.current!;
    const motion = matchMedia('(prefers-reduced-motion: reduce), (max-height: 560px) and (orientation: landscape)');
    const bottle = root.querySelector('#bottle')!;
    const shadow = root.querySelector('#pour-bottle-shadow')!;
    const stream = root.querySelector('#pour-stream')!;
    const glint = root.querySelector('#pour-glint')!;
    const drop = root.querySelector('#pour-drop')!;
    const wine = root.querySelector('#pour-wine')!;
    const liquid = root.querySelector('#liquid')!;
    const surface = root.querySelector('#pour-surface')!;
    const impact = root.querySelector('#pour-impact')!;
    const ripples = Array.from(root.querySelectorAll('[data-pour-ripple]'), ring => ({
      ring, offset: Number(ring.getAttribute('data-pour-ripple')),
    }));
    const readout = root.querySelector('progress')!;
    gsap.registerPlugin(ScrollTrigger);
    let trigger: ScrollTrigger | undefined;

    function draw(p: number) {
      const frame = pourFrame(p);
      const { x, y, rotation, lift, fill, surface: level, surfaceRadius, exit, jet } = frame;
      bottle.setAttribute('transform', `translate(${x} ${y}) rotate(${rotation})`);
      bottle.setAttribute('opacity', String(1 - exit));
      shadow.setAttribute('cx', String(x - 100 * Math.sin(rotation * Math.PI / 180)));
      shadow.setAttribute('rx', String(47 + 55 * lift));
      shadow.setAttribute('opacity', String((.94 - .69 * lift) * (1 - exit)));

      stream.setAttribute('d', jet?.ribbon ?? '');
      stream.setAttribute('opacity', String(frame.stream));
      glint.setAttribute('d', jet?.glint ?? '');
      glint.setAttribute('opacity', String(frame.stream * .68));
      drop.setAttribute('opacity', String(jet?.drop.opacity ?? 0));
      if (jet) {
        const bead = jet.drop;
        drop.setAttribute('transform', `translate(${bead.x} ${bead.y}) rotate(${bead.rotation})`);
      }

      const surfaceDepth = surfaceRadius * pourGlass.rimDepth / pourGlass.rimRadius;
      const impactX = (frame.impactX - pourGlass.centerX) / surfaceRadius;
      wine.setAttribute('opacity', String(Math.min(1, fill * 52)));
      liquid.setAttribute('y', String(level));
      surface.setAttribute('transform', `translate(${pourGlass.centerX} ${level}) scale(${surfaceRadius} ${surfaceDepth})`);
      impact.setAttribute('cx', String(impactX));
      impact.setAttribute('opacity', String(frame.ripple * frame.stream * .85));
      for (const { ring, offset } of ripples) {
        const phase = (p * 15 + offset) % 1;
        ring.setAttribute('cx', String(impactX));
        ring.setAttribute('r', String(.1 + .68 * phase));
        ring.setAttribute('opacity', String(frame.ripple * Math.sin(Math.PI * phase) * .53));
      }

      root.style.setProperty('--exit', String(exit));
      root.dataset.ending = String(exit > 0);
      root.dataset.closing = String(exit > .94);
      readout.value = p;
    }

    function configure() {
      trigger?.kill();
      trigger = undefined;
      if (motion.matches) {
        draw(0);
        return;
      }
      trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => draw(self.progress),
        onRefresh: self => draw(self.progress),
      });
      draw(trigger.progress);
    }

    configure();
    motion.addEventListener('change', configure);
    return () => {
      trigger?.kill();
      motion.removeEventListener('change', configure);
    };
  }, []);

  return (
    <section ref={scene} className="pour-scene" aria-labelledby="pour-title">
      <div className="pour-sticky">
        <div className="pour-grid shell">
          <div className="pour-copy">
            <div className="intro-copy">
              <p className="eyebrow"><span /> Maridaje de vino con letras</p>
              <h1 id="pour-title">Toda gran historia comienza <em>con una copa.</em></h1>
              <p className="lead">Desliza para descubrir nuestra esencia.</p>
              <a className="scroll-link" href="#el-vino-tambien-se-lee"><ChevronDown size={17} /> Ir al primer capítulo</a>
            </div>
            <div className="end-copy">
              <p className="eyebrow">Bienvenido al universo Sip Güain</p>
              <p className="display">Cada etiqueta es una historia, <em>cada copa un capítulo.</em></p>
            </div>
          </div>
          <figure className="pour-visual">
            <div className="art-frame" aria-hidden="true"><span>✦</span><span>✦</span></div>
            <PourArt />
            <figcaption>Malbec · El regalo de la monarca</figcaption>
          </figure>
        </div>
        <progress max={1} value={0} aria-label="Progreso del vertido" />
      </div>
    </section>
  );
}
