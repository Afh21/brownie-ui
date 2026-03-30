declare module 'brownie-ui-core' {
  import * as React from 'react';
  import { type ClassValue } from 'clsx';
  import { type VariantProps } from 'class-variance-authority';

  // Utils
  export function cn(...inputs: ClassValue[]): string;
  export function px(value: number): string;
  export function generateId(prefix?: string): string;

  // Types
  export interface BrownieComponentProps {
    className?: string;
    children?: React.ReactNode;
  }

  export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'link';
  export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  export type PolymorphicProps<Element extends React.ElementType, Props = {}> = Props &
    Omit<React.ComponentPropsWithRef<Element>, keyof Props | 'as'> & {
      as?: Element;
    };

  // Theme
  export interface Theme {
    colors: {
      primary: Record<string, string>;
      gray: Record<string, string>;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    fontFamily: {
      sans: string[];
      mono: string[];
    };
    fontSize: Record<string, [string, { lineHeight: string }]>;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
  }

  export const theme: Theme;

  // Re-exports
  export { clsx, type ClassValue };
  export { twMerge };
  export { cva, type VariantProps };
}
