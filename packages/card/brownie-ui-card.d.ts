declare module 'brownie-ui-card' {
  import * as React from 'react';

  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    image?: string;
    imageAlt?: string;
    title?: string;
    subtitle?: string;
    isConnecting?: boolean;
    avatar?: string;
    username?: string;
    timestamp?: string;
    actionText?: string;
    onAction?: () => void;
    size?: 'sm' | 'md' | 'lg' | 'full';
    footer?: React.ReactNode;
    aspectRatio?: string;
  }

  export const Card: React.ForwardRefExoticComponent<
    CardProps & React.RefAttributes<HTMLDivElement>
  >;
}
