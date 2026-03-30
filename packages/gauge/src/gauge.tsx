'use client';

import * as React from 'react';
import { cva, cn } from 'brownie-ui-core';

/**
 * Gauge variant styles
 */
const gaugeVariants = cva(
  'relative inline-flex flex-col items-center justify-center'
);

/**
 * Helper to convert value to angle (0-180 degrees)
 */
function valueToAngle(value: number, min: number, max: number): number {
  const clampedValue = Math.max(min, Math.min(max, value));
  return ((clampedValue - min) / (max - min)) * 180;
}

/**
 * Get color based on value position
 */
function getScoreColor(value: number, min: number, max: number): string {
  const percentage = (value - min) / (max - min);
  if (percentage <= 0.25) return '#ef4444'; // red-500
  if (percentage <= 0.5) return '#f97316';  // orange-500
  if (percentage <= 0.75) return '#eab308'; // yellow-500
  return '#22c55e'; // green-500
}

/**
 * Get score label based on value
 */
function getScoreLabel(value: number, min: number, max: number): string {
  const percentage = (value - min) / (max - min);
  if (percentage <= 0.25) return 'Poor';
  if (percentage <= 0.5) return 'Fair';
  if (percentage <= 0.75) return 'Good';
  if (percentage <= 0.9) return 'Very Good';
  return 'Excellent';
}

/**
 * Gauge segment configuration
 */
interface GaugeSegment {
  start: number; // 0-1 (percentage of arc)
  end: number;   // 0-1 (percentage of arc)
  color: string;
}

/**
 * Range configuration with absolute values
 */
interface GaugeRange {
  min: number;
  max: number;
  color: string;
}

/**
 * Props for the Gauge component
 */
export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current value to display
   */
  value: number;
  /**
   * Minimum value (default: 300)
   */
  min?: number;
  /**
   * Maximum value (default: 900)
   */
  max?: number;
  /**
   * Title displayed at the top
   */
  title?: string;
  /**
   * Custom label below the value
   */
  label?: string;
  /**
   * Show automatic label ("Your Credit Score is {rating}")
   */
  showAutoLabel?: boolean;
  /**
   * Custom segments for the gauge arc (using 0-1 percentages)
   */
  segments?: GaugeSegment[];
  /**
   * Custom ranges with absolute values (easier to use)
   * Example: [{ min: 0, max: 400, color: '#ef4444' }, { min: 401, max: 600, color: '#f59e0b' }]
   */
  ranges?: GaugeRange[];
  /**
   * Size of the gauge (width in pixels)
   */
  size?: number;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Format function for the value
   */
  formatValue?: (value: number) => string;
  /**
   * Variant style
   */
  variant?: 'default' | 'minimal' | 'compact';
}

/**
 * Gauge Component - A beautiful animated gauge/credit score indicator
 * 
 * Matches the reference image with:
 * - Separated color segments with borders
 * - Circular indicator instead of needle
 * - Clean minimalist design
 * 
 * @example
 * ```tsx
 * <Gauge value={821} title="My Credit Score" />
 * ```
 */
const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(
  (
    {
      value,
      min = 300,
      max = 900,
      title = 'My Credit Score',
      label,
      showAutoLabel = true,
      segments,
      ranges,
      size = 320,
      animationDuration = 1500,
      formatValue = (v) => v.toString(),
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    // Animated value state
    const [displayValue, setDisplayValue] = React.useState(min);
    const [indicatorAngle, setIndicatorAngle] = React.useState(0);
    
    // Trigger animation on value change
    React.useEffect(() => {
      const startTime = Date.now();
      const startValue = displayValue;
      const targetAngle = valueToAngle(value, min, max);
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentValue = Math.round(startValue + (value - startValue) * easeOut);
        const currentAngle = targetAngle * easeOut;
        
        setDisplayValue(currentValue);
        setIndicatorAngle(currentAngle);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [value, min, max, animationDuration]);

    // Default segments matching the image: red, orange, yellow, green with gaps
    // Convert ranges to segments if provided
    const computedSegments = React.useMemo(() => {
      if (ranges && ranges.length > 0) {
        return ranges.map(range => ({
          start: (range.min - min) / (max - min),
          end: (range.max - min) / (max - min),
          color: range.color,
        }));
      }
      return null;
    }, [ranges, min, max]);

    const defaultSegments: GaugeSegment[] = [
      { start: 0, end: 0.22, color: '#ef4444' },    // Red
      { start: 0.26, end: 0.48, color: '#f59e0b' }, // Orange/Yellow
      { start: 0.52, end: 0.74, color: '#fbbf24' }, // Light Yellow
      { start: 0.78, end: 1, color: '#22c55e' },    // Green
    ];

    const activeSegments = computedSegments || segments || defaultSegments;
    const currentColor = getScoreColor(value, min, max);
    const rating = getScoreLabel(value, min, max);

    // SVG configuration - very thin segments for a sleeker look
    const strokeWidth = variant === 'compact' ? 6 : 8;
    const gapSize = 8; // Gap between segments in pixels
    const radius = (size - strokeWidth * 2) / 2;
    const centerX = size / 2;
    const centerY = size / 2 + 40;

    // Generate arc path for a segment
    const describeArc = (startAngle: number, endAngle: number, innerRadius: number) => {
      const start = polarToCartesian(centerX, centerY, innerRadius, endAngle);
      const end = polarToCartesian(centerX, centerY, innerRadius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

      return [
        'M',
        start.x,
        start.y,
        'A',
        innerRadius,
        innerRadius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
      ].join(' ');
    };

    function polarToCartesian(
      centerX: number,
      centerY: number,
      radius: number,
      angleInDegrees: number
    ) {
      const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    }

    // Calculate position for circular indicator
    const indicatorRadius = radius;
    const indicatorPos = polarToCartesian(centerX, centerY, indicatorRadius, indicatorAngle);

    return (
      <div
        ref={ref}
        className={cn(gaugeVariants({}), className)}
        style={{ width: size }}
        {...props}
      >
        {/* Title */}
        {title && variant !== 'minimal' && (
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {title}
          </h3>
        )}

        {/* SVG Gauge */}
        <div className="relative" style={{ width: size, height: size / 2 + 80 }}>
          <svg
            width={size}
            height={size / 2 + 80}
            viewBox={`0 0 ${size} ${size / 2 + 80}`}
            className="overflow-visible"
          >


            {/* Arc segments with gaps */}
            {activeSegments.map((segment, index) => {
              const startAngle = segment.start * 180;
              const endAngle = segment.end * 180;
              // Reduce angle slightly to create gap
              const gapAngle = (gapSize / (Math.PI * radius)) * 180;
              const adjustedStart = startAngle + gapAngle / 2;
              const adjustedEnd = endAngle - gapAngle / 2;
              const segmentPath = describeArc(adjustedStart, adjustedEnd, radius);

              return (
                <path
                  key={index}
                  d={segmentPath}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Dots around the inner arc */}
            {variant !== 'minimal' && Array.from({ length: 31 }).map((_, i) => {
              const angle = (i / 30) * 180; // Distribute 31 dots across 180 degrees
              const dotRadius = radius - strokeWidth - 8; // Position below the colored arc
              const dotPos = polarToCartesian(centerX, centerY, dotRadius, angle);
              
              return (
                <circle
                  key={`dot-${i}`}
                  cx={dotPos.x}
                  cy={dotPos.y}
                  r={2}
                  fill="#d1d5db"
                  opacity={0.6}
                />
              );
            })}

            {/* Circular indicator at current position */}
            <g style={{ transition: 'all 0.1s ease-out' }}>
              {/* Outer ring of indicator - smaller to match thinner segments */}
              <circle
                cx={indicatorPos.x}
                cy={indicatorPos.y}
                r={10}
                fill="white"
                stroke="#10b981"
                strokeWidth={2}
              />
              {/* Inner dot */}
              <circle
                cx={indicatorPos.x}
                cy={indicatorPos.y}
                r={4}
                fill="#10b981"
              />
            </g>


          </svg>

          {/* Center value display - aligned to bottom of gauge with slight padding */}
          <div
            className="absolute left-1/2 text-center"
            style={{ 
              bottom: '35px',
              transform: 'translateX(-50%)',
            }}
          >
            <span
              className={cn(
                'font-bold tabular-nums text-gray-800 dark:text-gray-900 block leading-none',
                variant === 'compact' ? 'text-4xl' : 'text-6xl'
              )}
            >
              {formatValue(displayValue)}
            </span>
          </div>
        </div>

        {/* Labels section */}
        {variant !== 'minimal' && (
          <div className="mt-2 text-center">
            {/* Rating label */}
            {showAutoLabel && (
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Credit Score is{' '}
                <span
                  className="font-semibold"
                  style={{ color: currentColor }}
                >
                  {rating}
                </span>
              </p>
            )}
            {label && <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>}
          </div>
        )}
      </div>
    );
  }
);

Gauge.displayName = 'Gauge';

export { Gauge, gaugeVariants };
export type { GaugeSegment, GaugeRange };



