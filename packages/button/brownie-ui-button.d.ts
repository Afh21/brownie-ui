declare module 'brownie-ui-button' {
  import * as React from 'react';
  import { type VariantProps } from 'brownie-ui-core';

  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariants> {
    loading?: boolean;
    loadingText?: string;
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  }

  export const buttonVariants: (
    props?: ({
      variant?:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'outline'
        | 'ghost'
        | 'destructive'
        | 'link'
        | 'glass'
        | 'gradient'
        | 'soft';
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
      fullWidth?: boolean;
      loading?: boolean;
      rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    } & { class?: string; className?: string }) | undefined
  ) => string;

  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;

  export { buttonVariants };
}
