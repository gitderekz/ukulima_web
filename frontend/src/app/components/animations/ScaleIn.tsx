import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  className?: string;
  whileHover?: boolean;
  hoverScale?: number;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  scale = 0.9,
  className = '',
  whileHover = false,
  hoverScale = 1.05,
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      whileHover={whileHover ? { scale: hoverScale } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
