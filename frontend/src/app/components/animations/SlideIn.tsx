import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  from?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

export function SlideIn({
  children,
  delay = 0,
  duration = 0.4,
  from = 'left',
  className = '',
}: SlideInProps) {
  const variants = {
    left: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    top: { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    bottom: { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  };

  return (
    <motion.div
      initial={variants[from].initial}
      animate={variants[from].animate}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
