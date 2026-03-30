declare module 'brownie-ui-gauge' {
  import * as React from 'react';

  export interface GaugeSegment {
    start: number;
    end: number;
    color: string;
  }

  export interface GaugeRange {
    min: number;
    max: number;
    color: string;
  }

  export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    min?: number;
    max?: number;
    title?: string;
    label?: string;
    showAutoLabel?: boolean;
    segments?: GaugeSegment[];
    ranges?: GaugeRange[];
    size?: number;
    animationDuration?: number;
    formatValue?: (value: number) => string;
    variant?: 'default' | 'minimal' | 'compact';
  }

  export const Gauge: React.ForwardRefExoticComponent<
    GaugeProps & React.RefAttributes<HTMLDivElement>
  >;

  export type { GaugeSegment, GaugeRange };
}
