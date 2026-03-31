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
   * Format function for the value
   */
  formatValue?: (value: number) => string;
  /**
   * Whether to highlight the last active segment
   */
  highlightLast?: boolean;
  /**
   * Whether to show the value below the last active segment
   */
  showValue?: boolean;
  /**
   * Gap between segments in pixels (default: 2)
   */
  gap?: number;
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
  position = Math.max(0, Math.min(1, position));
  
  let lower = gradient[0];
  let upper = gradient[gradient.length - 1];
  
  for (let i = 0; i < gradient.length - 1; i++) {
    if (position >= gradient[i].position && position <= gradient[i + 1].position) {
      lower = gradient[i];
      upper = gradient[i + 1];
      break;
    }
  }
  
  if (lower.position === upper.position) {
    return lower.color;
  }
  
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
 * Brighten a color by a factor (0-1)
 * Makes the color more vivid/intense
 */
function brightenColor(color: string, factor: number = 0.3): string {
  const hex = color.replace('#', '');
  
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Increase each channel towards 255
  r = Math.min(255, Math.round(r + (255 - r) * factor));
  g = Math.min(255, Math.round(g + (255 - g) * factor));
  b = Math.min(255, Math.round(b + (255 - b) * factor));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * PerformanceLinear Component - A linear segmented bar gauge
 * 
 * Perfect for Fear & Greed Index, progress indicators, and horizontal metrics.
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
      formatValue = (v) => v.toString(),
      highlightLast = true,
      showValue = true,
      gap,
      className,
      ...props
    },
    ref
  ) => {
    // Gap between segments (default 2px)
    const gapSize = gap ?? 2;
    
    // Calculate percentage (0-1) - clamped
    const percentage = React.useMemo(() => {
      return Math.max(0, Math.min(1, (value - min) / (max - min)));
    }, [value, min, max]);

    // Find the last active segment index
    const lastActiveIndex = Math.floor(percentage * (segments - 1));
    
    // Calculate position for value label
    // We use a consistent calculation: total space is divided evenly including gaps
    // Each "unit" = segment + gap (except last segment has no gap after)
    // Position = (lastIndex / (segments - 1)) * 100 for the end of last segment
    // But we want the center, so we add half a segment width
    const segmentPercent = 100 / segments;
    const valuePosition = (lastActiveIndex * segmentPercent) + (segmentPercent / 2);
    
    // Generate bar segments
    const generateSegments = () => {
      const segmentArray = [];
      // With flex and gap in pixels, segments grow to fill space
      // We set width as percentage to maintain proportions
      const segmentWidth = 100 / segments;

      for (let i = 0; i < segments; i++) {
        const position = i / (segments - 1);
        const baseColor = getGradientColor(position, gradient);
        // Segment is active if its position is <= percentage
        const isActive = position <= percentage;
        // Check if this is the last active segment
        const isLastActive = highlightLast && isActive && i === lastActiveIndex;
        // If last active, brighten the color
        const color = isLastActive ? brightenColor(baseColor, 0.4) : baseColor;

        segmentArray.push(
          <div
            key={i}
            className="rounded-sm transition-all duration-300"
            style={{
              width: `${segmentWidth}%`,
              height: '100%',
              backgroundColor: color,
              opacity: isActive ? 1 : 0.15,
              boxShadow: 'none',
              transitionDelay: `${i * 5}ms`,
              zIndex: isLastActive ? 10 : 1,
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

    const displayLabel = label || getDefaultLabel(percentage);

    return (
      <div
        ref={ref}
        className={cn(performanceLinearVariants({}), 'relative', className)}
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

        {/* Bar container with value label */}
        <div className="relative">
          {/* Bars */}
          <div style={{ height: barHeight }}>
            {/* Segmented bars - gap as percentage for consistency */}
            <div className="flex w-full h-full items-center" style={{ gap: '0.25%' }}>
              {generateSegments()}
            </div>
          </div>

          {/* Arrow and value label below last active segment */}
          {showValue && (
            <div
              className="absolute flex flex-col items-center"
              style={{
                left: `${valuePosition}%`,
                top: `${barHeight + 4}px`,
                transform: 'translateX(-50%)',
              }}
            >
              {/* Down arrow */}
              <svg 
                width="12" 
                height="8" 
                viewBox="0 0 12 8" 
                fill="none"
                className="text-gray-600 dark:text-gray-400"
              >
                <path 
                  d="M1 1.5L6 6.5L11 1.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              {/* Value number */}
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
                {formatValue(value)}
              </span>
            </div>
          )}
        </div>

        {/* Scale labels */}
        <div className="flex justify-between" style={{ marginTop: '28px' }}>
          <span className="text-xs text-gray-400">{formatValue(min)}</span>
          <span className="text-xs text-gray-400">{formatValue(max)}</span>
        </div>
      </div>
    );
  }
);

PerformanceLinear.displayName = 'PerformanceLinear';

export { PerformanceLinear, performanceLinearVariants };
