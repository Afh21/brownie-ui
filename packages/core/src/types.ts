import * as React from 'react';

/**
 * Base props that all Brownie UI components accept
 */
export interface BrownieComponentProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Child elements
   */
  children?: React.ReactNode;
}

/**
 * Standard variants for Brownie UI components
 */
export type Variant = 'default' | 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'link';

/**
 * Standard sizes for Brownie UI components
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Polymorphic component props helper
 */
export type PolymorphicProps<Element extends React.ElementType, Props = {}> = Props &
  Omit<React.ComponentPropsWithRef<Element>, keyof Props | 'as'> & {
    as?: Element;
  };
