import { Variants } from "framer-motion";

// Global transitions
export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const easeOutTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
};

// Page Level Variants
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.2, 0.8, 0.2, 1], // ease-out-dominant
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

export const childVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

// Component Level Variants
export const cardHoverVariants = {
  idle: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: springTransition,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const dropzoneVariants = {
  idle: { scale: 1, borderColor: "hsl(var(--border))" },
  hover: { scale: 1.01, borderColor: "hsl(var(--primary) / 0.5)" },
  dragActive: {
    scale: 1.02,
    borderColor: "hsl(var(--primary))",
    backgroundColor: "hsl(var(--primary) / 0.05)",
    transition: springTransition,
  },
};

export const buttonTapVariants = {
  hover: { scale: 1.02, y: -1 },
  tap: { scale: 0.97 },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};
