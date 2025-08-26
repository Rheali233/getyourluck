/**
 * Animated Card Component
 * Adds entrance animation effects for PHQ-9 test result pages
 */

import React, { useEffect, useRef } from 'react';
import { cn } from '@/utils/classNames';
import type { BaseComponentProps } from '@/types/componentTypes';

interface AnimatedCardProps extends BaseComponentProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  className,
  testId = 'animated-card',
  children,
  delay = 0,
  direction = 'up',
  duration = 600,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Use inline styles to trigger animation
            if (entry.target instanceof HTMLElement) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translate(0, 0)';
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Set initial position based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(30px)';
      case 'down':
        return 'translateY(-30px)';
      case 'left':
        return 'translateX(30px)';
      case 'right':
        return 'translateX(-30px)';
      default:
        return 'translateY(30px)';
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "opacity-0 transition-all duration-700 ease-out",
        className
      )}
      style={{
        transform: getInitialTransform(),
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
      data-testid={testId}
      {...props}
    >
      {children}
      

    </div>
  );
};
