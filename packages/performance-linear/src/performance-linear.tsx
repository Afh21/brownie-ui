'use client';

import * as React from 'react';
import { cva, cn } from 'brownie-ui-core';

/**
 * Performance Linear variant styles
 */
const performanceLinearVariants: (props?: Record<string, unknown>) => string = cva('relative w-full');

/**
 * Color configuration for segments
 */
interface ColorStop {
  position: number; // 0-1
  color: string;
}

/**
 * Props for the PerformanceLinear component
 */
export interface PerformanceLinearProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current value to display
   */
  value: number;
  /**
   * Minimum value of the scale (default: 0)
   */
  min?: number;
  /**
   * Maximum value of the scale (default: 100)
   */
  max?: number;
  /**
   * Title displayed on the left
   */
  title?: string;
  /**
   * Label displayed on the right (e.g., "Extreme Greed")
   */
  label?: string;
  /**
   * Number of bar segments (default: 40)
   */
  segments?: number;
  /**
   * Height of the bars in pixels (default: 24)
   */
  barHeight?: number;
  /**
   * Custom color gradient stops
   */
  gradient?: ColorStop[];
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Format function for the value
   */
  formatValue?: (value: number) => string;
  /**
   * Whether to show the value tooltip on hover
   */
  showTooltip?: boolean;
}

/**
 * Default gradient: Red → Orange → Yellow → Green
 */
const defaultGradient: ColorStop[] = [
  { position: 0, color: '#ef4444' },    // red-500
  { position: 0.25, color: '#f97316' }, // orange-500
  { position: 0.5, color: '#eab308' },  // yellow-500
  { position: 0.75, color: '#84cc16' }, // lime-500
  { position: 1, color: '#22c55e' },    // green-500
];

/**
 * Get color at a specific position in the gradient
 */
function getGradientColor(position: number, gradient: ColorStop[]): string {
  // Clamp position between 0 and 1
  position = Math.max(0, Math.min(1, position));
  
  // Find the two color stops that surround this position
  let lower = gradient[0];
  let upper = gradient[gradient.length - 1];
  
  for (let i = 0; i < gradient.length - 1; i++) {
    if (position >= gradient[i].position && position <= gradient[i + 1].position) {
      lower = gradient[i];
      upper = gradient[i + 1];
      break;
    }
  }
  
  // If at exact position, return that color
  if (lower.position === upper.position) {
    return lower.color;
  }
  
  // Interpolate between the two colors
  const range = upper.position - lower.position;
  const ratio = (position - lower.position) / range;
  
  return interpolateColor(lower.color, upper.color, ratio);
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1: string, color2: string, ratio: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * PerformanceLinear Component - A linear segmented bar gauge
 * 
 * Perfect for Fear & Greed Index, progress indicators, and horizontal metrics.
 * 
 * Features:
 * - Horizontal segmented bars with gradient colors
 * - Vertical indicator bar
 * - Smooth animations
 * - Customizable gradient
 * 
 * @example
 * ```tsx
 * <PerformanceLinear 
 *   value={75} 
 *   title="Fear and Greed Index"
 *   label="Extreme Greed"
 * />
 * ```
 */
const PerformanceLinear = React.forwardRef<HTMLDivElement, PerformanceLinearProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      title = 'Fear and Greed Index',
      label,
      segments = 40,
      barHeight = 24,
      gradient = defaultGradient,
      animationDuration = 1000,
      formatValue = (v) => v.toString(),
      showTooltip = true,
      className,
      ...props
    },
    ref
  ) => {
    // Animated states
    const [displayValue, setDisplayValue] = React.useState(min);
    const [indicatorPosition, setIndicatorPosition] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    // Calculate target percentage (0-1)
    const targetPercentage = Math.max(0, Math.min(1, (value - min) / (max - min)));

    // Store animation start values in refs to avoid dependency issues
    const animationRef = React.useRef({
      startValue: min,
      startPosition: 0,
      targetValue: value,
      targetPosition: targetPercentage,
    });

    // Update refs when value changes
    React.useEffect(() => {
      animationRef.current = {
        startValue: displayValue,
        startPosition: indicatorPosition,
        targetValue: value,
        targetPosition: targetPercentage,
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Trigger animation
    React.useEffect(() => {
      const startTime = Date.now();
      const { startValue, startPosition, targetValue, targetPosition } = animationRef.current;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Easing (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
        const currentPosition = startPosition + (targetPosition - startPosition) * easeOut;
        
        setDisplayValue(currentValue);
        setIndicatorPosition(currentPosition);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [value, animationDuration]);

    // Generate bar segments
    const generateSegments = () => {
      const segmentArray = [];
      const segmentWidth = 100 / segments;
      const gap = 2; // gap percentage
      const actualWidth = segmentWidth - gap;

      for (let i = 0; i < segments; i++) {
        const position = i / (segments - 1);
        const color = getGradientColor(position, gradient);
        const isActive = position <= targetPercentage;

        segmentArray.push(
          <div
            key={i}
            className="rounded-sm transition-opacity duration-300"
            style={{
              width: `${actualWidth}%`,
              height: '100%',
              backgroundColor: color,
              opacity: isActive ? 1 : 0.2,
              transitionDelay: `${i * 10}ms`,
            }}
          />
        );
      }

      return segmentArray;
    };

    // Get label based on position if not provided
    const getDefaultLabel = (pos: number): string => {
      if (pos < 0.2) return 'Extreme Fear';
      if (pos < 0.4) return 'Fear';
      if (pos < 0.6) return 'Neutral';
      if (pos < 0.8) return 'Greed';
      return 'Extreme Greed';
    };

    const displayLabel = label || getDefaultLabel(targetPercentage);

    return (
      <div
        ref={ref}
        className={cn(performanceLinearVariants({}), className)}
        {...props}
      >
        {/* Header with title and label */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h3>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {displayLabel}
          </span>
        </div>

        {/* Bar container */}
        <div
          className="relative"
          style={{ height: barHeight }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Segmented bars */}
          <div className="flex gap-1 w-full h-full">
            {generateSegments()}
          </div>

          {/* Indicator bar */}
          <div
            className="absolute top-0 w-1 bg-gray-800 dark:bg-white rounded-full shadow-md pointer-events-none"
            style={{
              height: '120%',
              left: `${indicatorPosition * 100}%`,
              transform: 'translateX(-50%) translateY(-10%)',
              transition: 'left 0.1s ease-out',
            }}
          />

          {/* Tooltip */}
          {showTooltip && isHovered && (
            <div
              className="absolute -top-10 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg pointer-events-none whitespace-nowrap z-10"
              style={{
                left: `${indicatorPosition * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {formatValue(displayValue)}
            </div>
          )}
        </div>

        {/* Scale labels */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{formatValue(min)}</span>
          <span className="text-xs text-gray-400">{formatValue(max)}</span>
        </div>
      </div>
    );
  }
);

PerformanceLinear.displayName = 'PerformanceLinear';

export { PerformanceLinear, performanceLinearVariants };
