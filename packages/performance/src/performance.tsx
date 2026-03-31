'use client';

import * as React from 'react';
import { cva, cn } from 'brownie-ui-core';

/**
 * Performance variant styles
 */
const performanceVariants = cva('relative inline-flex flex-col');

/**
 * Performance segment configuration
 */
export interface PerformanceSegment {
  /** Color of the segment (tailwind class or hex) */
  color: string;
  /** Whether this segment is active/filled */
  active?: boolean;
}

/**
 * Trend indicator configuration
 */
export interface TrendIndicator {
  /** Trend value (e.g., "+10%", "-5%") */
  value: string;
  /** Trend direction */
  direction?: 'up' | 'down' | 'neutral';
  /** Whether to show info icon */
  showInfo?: boolean;
}

/**
 * Props for the Performance component
 */
export interface PerformanceProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current value to display
   */
  value: number;
  /**
   * Title displayed at the top
   */
  title?: string;
  /**
   * Unit label (e.g., "point", "pts", "%")
   */
  unit?: string;
  /**
   * Maximum number of bars/segments (default: 20)
   */
  maxSegments?: number;
  /**
   * Number of active segments (calculated from value if not provided)
   */
  activeSegments?: number;
  /**
   * Trend indicator (+10%, -5%, etc.)
   */
  trend?: TrendIndicator | string;
  /**
   * Custom colors for segments
   */
  segmentColors?: {
    active: string;
    inactive: string;
  };
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
  variant?: 'default' | 'compact';
}

/**
 * Performance Component - A beautiful segmented bar gauge
 * 
 * Features:
 * - Segmented arc with individual bars
 * - Trend indicator with optional info icon
 * - Animated value counter
 * - Customizable colors
 * 
 * @example
 * ```tsx
 * <Performance 
 *   value={432} 
 *   title="Performance" 
 *   trend={{ value: "+10%", direction: "up", showInfo: true }}
 *   unit="point"
 * />
 * ```
 */
const Performance = React.forwardRef<HTMLDivElement, PerformanceProps>(
  (
    {
      value,
      title = 'Performance',
      unit = 'point',
      maxSegments = 20,
      activeSegments,
      trend,
      segmentColors = {
        active: '#ef4444', // red-500
        inactive: '#e5e7eb', // gray-200
      },
      size = 280,
      animationDuration = 1200,
      formatValue = (v) => v.toString(),
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    // Animated value state
    const [displayValue, setDisplayValue] = React.useState(0);
    const [displaySegments, setDisplaySegments] = React.useState(0);

    // Calculate active segments from value if not provided
    const targetSegments = activeSegments ?? Math.round((value / 100) * maxSegments);
    const clampedSegments = Math.max(0, Math.min(maxSegments, targetSegments));

    // Trend display
    const trendConfig: TrendIndicator | null = typeof trend === 'string' 
      ? { value: trend, direction: trend.startsWith('+') ? 'up' : trend.startsWith('-') ? 'down' : 'neutral' }
      : trend || null;

    // Trigger animation on value change
    React.useEffect(() => {
      const startTime = Date.now();
      const startValue = displayValue;
      const startSegments = displaySegments;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = Math.round(startValue + (value - startValue) * easeOut);
        const currentSegments = Math.round(startSegments + (clampedSegments - startSegments) * easeOut);

        setDisplayValue(currentValue);
        setDisplaySegments(currentSegments);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [value, clampedSegments, animationDuration]);

    // Generate bar segments
    const generateBars = () => {
      const bars = [];
      const centerX = size / 2;
      const centerY = size / 2 + 20;
      const innerRadius = size * 0.25;
      const outerRadius = size * 0.38;
      const startAngle = 180; // Start from left
      const endAngle = 0;     // End at right
      const totalAngle = startAngle - endAngle;

      for (let i = 0; i < maxSegments; i++) {
        const angle = startAngle - (i / (maxSegments - 1)) * totalAngle;
        const isActive = i < displaySegments;

        // Calculate bar position
        const angleRad = (angle * Math.PI) / 180;
        const x1 = centerX + innerRadius * Math.cos(angleRad);
        const y1 = centerY - innerRadius * Math.sin(angleRad);
        const x2 = centerX + outerRadius * Math.cos(angleRad);
        const y2 = centerY - outerRadius * Math.sin(angleRad);

        bars.push(
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isActive ? segmentColors.active : segmentColors.inactive}
            strokeWidth={variant === 'compact' ? 6 : 8}
            strokeLinecap="round"
            style={{
              transition: 'stroke 0.3s ease-out',
              transitionDelay: `${i * 20}ms`,
            }}
          />
        );
      }

      return bars;
    };

    // Trend color based on direction
    const getTrendColor = () => {
      if (!trendConfig) return 'text-gray-600';
      switch (trendConfig.direction) {
        case 'up':
          return 'text-green-600';
        case 'down':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    };

    // Info icon component
    const InfoIcon = () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="ml-1"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 7V11M8 5V5.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );

    return (
      <div
        ref={ref}
        className={cn(performanceVariants({}), className)}
        style={{ width: size }}
        {...props}
      >
        {/* Header with title and trend */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h3>
          {trendConfig && (
            <div className={cn('flex items-center text-sm font-medium', getTrendColor())}>
              <span>{trendConfig.value}</span>
              {trendConfig.showInfo && <InfoIcon />}
            </div>
          )}
        </div>

        {/* Bar Gauge */}
        <div className="relative" style={{ width: size, height: size / 2 + 40 }}>
          <svg
            width={size}
            height={size / 2 + 40}
            viewBox={`0 0 ${size} ${size / 2 + 40}`}
            className="overflow-visible"
          >
            {generateBars()}
          </svg>

          {/* Center value display */}
          <div
            className="absolute left-1/2 text-center"
            style={{
              bottom: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            <span
              className={cn(
                'font-semibold tabular-nums text-gray-800 dark:text-gray-100',
                variant === 'compact' ? 'text-3xl' : 'text-4xl'
              )}
            >
              {formatValue(displayValue)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {unit}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

Performance.displayName = 'Performance';

export { Performance, performanceVariants };
