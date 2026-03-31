declare module 'brownie-ui-performance' {
  import * as React from 'react';

  export interface PerformanceSegment {
    color: string;
    active?: boolean;
  }

  export interface TrendIndicator {
    value: string;
    direction?: 'up' | 'down' | 'neutral';
    showInfo?: boolean;
  }

  export interface PerformanceProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    title?: string;
    unit?: string;
    maxSegments?: number;
    activeSegments?: number;
    trend?: TrendIndicator | string;
    segmentColors?: {
      active: string;
      inactive: string;
    };
    size?: number;
    animationDuration?: number;
    formatValue?: (value: number) => string;
    variant?: 'default' | 'compact';
  }

  export const Performance: React.ForwardRefExoticComponent<PerformanceProps & React.RefAttributes<HTMLDivElement>>;
  
  export const performanceVariants: (props?: unknown) => string;
}
