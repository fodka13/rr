import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const ease = [0.25, 0.1, 0.25, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
};

const viewportOnce = { once: true, margin: "-60px" };

interface AnimateProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeUp({ children, className, delay = 0 }: AnimateProps) {
  return (
    <motion.div
      className={className}
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className, delay = 0 }: AnimateProps) {
  return (
    <motion.div
      className={className}
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0 }: AnimateProps) {
  return (
    <motion.div
      className={className}
      variants={scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerList({
  children,
  className,
  fast = false,
}: {
  children: ReactNode;
  className?: string;
  fast?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={fast ? staggerContainerFast : staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeInUp}>
      {children}
    </motion.div>
  );
}

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease } },
};
