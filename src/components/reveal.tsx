'use client';

import { motion, useReducedMotion } from 'motion/react';

export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={false}
    whileInView={reduced ? undefined : { y: [12, 0], clipPath: ['inset(0 0 5% 0)', 'inset(0 0 0% 0)'] }}
    viewport={{ once: true, amount: .18 }} transition={{ duration: .55 }}>
    {children}
  </motion.div>;
}
