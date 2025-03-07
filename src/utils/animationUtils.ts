
import { useEffect, useState } from 'react';

export interface AnimationProps {
  show: boolean;
  duration?: number;
  className?: string;
  enterFrom?: string;
  enterTo?: string;
  leaveFrom?: string;
  leaveTo?: string;
}

export const useAnimatedVisibility = (
  visible: boolean,
  durationMs: number = 300
): {
  shouldRender: boolean;
  animationClass: string;
} => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [animationClass, setAnimationClass] = useState(
    visible ? 'animate-fade-in' : ''
  );

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Wait a frame before applying the animation class
      const timer = setTimeout(() => {
        setAnimationClass('animate-fade-in');
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationClass('animate-fade-out');
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [visible, durationMs]);

  return { shouldRender, animationClass };
};

// Animation for page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: {
    type: 'tween',
    duration: 0.3,
  },
};

// Staggered animation for list items
export const staggerItems = (index: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay: index * 0.05,
    duration: 0.3,
  },
});

// Scale animation for buttons and interactive elements
export const scaleOnPress = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 400, damping: 17 },
};
