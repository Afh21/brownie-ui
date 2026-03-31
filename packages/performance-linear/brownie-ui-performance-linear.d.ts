declare module 'brownie-ui-performance-linear' {
  import * as React from 'react';

  interface ColorStop {
    position: number;
    color: string;
  }

  export interface PerformanceLinearProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    min?: number;
    max?: number;
    title?: string;
    label?: string;
    segments?: number;
    barHeight?: number;
    gradient?: ColorStop[];
    formatValue?: (value: number) => string;
    highlightLast?: boolean;
    showValue?: boolean;
    gap?: number;
  }

  export const PerformanceLinear: React.ForwardRefExoticComponent<PerformanceLinearProps & React.RefAttributes<HTMLDivElement>>;
  
  export const performanceLinearVariants: (props?: unknown) => string;
}
