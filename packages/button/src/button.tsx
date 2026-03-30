'use client';

import * as React from 'react';
import { cva, cn, type VariantProps } from 'brownie-ui-core';

/**
 * Button variants using class-variance-authority
 * Define all visual variations of the button in one place
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-lg text-sm font-medium',
    'transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      /**
       * Visual style variant
       */
      variant: {
        default: [
          'bg-stone-800 text-stone-50',
          'hover:bg-stone-700',
          'focus-visible:ring-stone-500',
          'shadow-sm hover:shadow-md',
        ],
        primary: [
          'bg-amber-700 text-white',
          'hover:bg-amber-800',
          'focus-visible:ring-amber-500',
          'shadow-sm hover:shadow-md',
        ],
        secondary: [
          'bg-stone-100 text-stone-900',
          'hover:bg-stone-200',
          'focus-visible:ring-stone-400',
        ],
        outline: [
          'border-2 border-stone-300 bg-transparent',
          'text-stone-700',
          'hover:border-stone-400 hover:bg-stone-50',
          'focus-visible:ring-stone-400',
        ],
        ghost: [
          'bg-transparent text-stone-700',
          'hover:bg-stone-100',
          'focus-visible:ring-stone-400',
        ],
        destructive: [
          'bg-red-600 text-white',
          'hover:bg-red-700',
          'focus-visible:ring-red-500',
          'shadow-sm hover:shadow-md',
        ],
        link: [
          'bg-transparent text-amber-700 underline-offset-4',
          'hover:underline',
          'focus-visible:ring-amber-500',
        ],
        // Pinterest-inspired variants
        glass: [
          'bg-white/80 backdrop-blur-md text-stone-800',
          'border border-white/20',
          'hover:bg-white/90',
          'shadow-lg hover:shadow-xl',
          'focus-visible:ring-stone-400',
        ],
        gradient: [
          'bg-gradient-to-r from-amber-700 to-orange-600 text-white',
          'hover:from-amber-800 hover:to-orange-700',
          'shadow-md hover:shadow-lg',
          'focus-visible:ring-orange-500',
        ],
        soft: [
          'bg-amber-100 text-amber-900',
          'hover:bg-amber-200',
          'focus-visible:ring-amber-400',
        ],
      },
      /**
       * Size variant
       */
      size: {
        xs: 'h-7 px-2.5 text-xs gap-1.5',
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2.5',
        xl: 'h-14 px-8 text-lg gap-3',
        icon: 'h-10 w-10 p-2',
      },
      /**
       * Full width option
       */
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      /**
       * Loading state
       */
      loading: {
        true: 'cursor-wait opacity-70',
        false: '',
      },
      /**
       * Rounded corners style
       */
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: false,
      loading: false,
      rounded: 'lg',
    },
  }
);

/**
 * Props for the Button component
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Loading state - shows spinner and disables button
   */
  loading?: boolean;
  /**
   * Loading text to display (defaults to children)
   */
  loadingText?: string;
  /**
   * Element to render as (for polymorphic usage with Link, etc.)
   */
  asChild?: boolean;
  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon element
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button component - A versatile, accessible button with multiple variants
 * 
 * @example
 * ```tsx
 * <Button>Default</Button>
 * <Button variant="primary" size="lg">Primary Large</Button>
 * <Button variant="glass" leftIcon={<Icon />}>With Icon</Button>
 * <Button loading>Loading...</Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      loadingText,
      rounded,
      children,
      disabled,
      leftIcon,
      rightIcon,
      asChild = false,
      ...props
    },
    ref
  ) => {
    // Simple button implementation (without Slot for now to avoid extra dependency)
    const Comp = 'button';
    
    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            loading,
            rounded,
          }),
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner className="animate-spin" size={size} />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="button-icon-left">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="button-icon-right">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

/**
 * Loading spinner component for button
 */
interface LoadingSpinnerProps {
  className?: string;
  size?: VariantProps<typeof buttonVariants>['size'];
}

function LoadingSpinner({ className, size }: LoadingSpinnerProps) {
  const iconSize =
    size === 'xs' || size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 20 : 16;

  return (
    <svg
      className={cn('shrink-0', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export { Button, buttonVariants };



