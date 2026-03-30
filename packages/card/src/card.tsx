'use client';

import * as React from 'react';
import { cva, cn } from 'brownie-ui-core';

/**
 * Card variant styles
 */
const cardVariants = cva(
  'relative overflow-hidden bg-white rounded-[32px] shadow-xl',
  {
    variants: {
      size: {
        sm: 'w-64',
        md: 'w-72',
        lg: 'w-80',
        full: 'w-full',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * Props for the Card component
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Image URL for the card
   */
  image?: string;
  /**
   * Alt text for the image
   */
  imageAlt?: string;
  /**
   * Title displayed at the top of the card
   */
  title?: string;
  /**
   * Subtitle or status text
   */
  subtitle?: string;
  /**
   * Show loading/connecting indicator next to subtitle
   */
  isConnecting?: boolean;
  /**
   * Avatar image URL
   */
  avatar?: string;
  /**
   * Username or author name
   */
  username?: string;
  /**
   * Timestamp (e.g., "29m ago")
   */
  timestamp?: string;
  /**
   * Text for the action button
   */
  actionText?: string;
  /**
   * Callback when action button is clicked
   */
  onAction?: () => void;
  /**
   * Size variant of the card
   */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /**
   * Custom footer content (replaces default avatar + button layout)
   */
  footer?: React.ReactNode;
  /**
   * Aspect ratio of the image (default: 4/5)
   */
  aspectRatio?: string;
}

/**
 * Card Component - A beautiful card with image, overlay, avatar, and action button
 * 
 * Perfect for social media posts, profiles, and content cards.
 * 
 * @example
 * ```tsx
 * <Card
 *   image="https://example.com/photo.jpg"
 *   title="Creativestyle"
 *   subtitle="Connecting"
 *   isConnecting={true}
 *   avatar="https://example.com/avatar.jpg"
 *   username="@marvel2025"
 *   timestamp="29m ago"
 *   actionText="More Info"
 * />
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      image,
      imageAlt,
      title,
      subtitle,
      isConnecting = false,
      avatar,
      username,
      timestamp,
      actionText = 'SAVE',
      onAction,
      size = 'md',
      footer,
      aspectRatio = '4/5',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ size }), className)}
        {...props}
      >
        {/* Image Container */}
        {image && (
          <div 
            className="relative w-full overflow-hidden"
            style={{ aspectRatio }}
          >
            <img
              src={image}
              alt={imageAlt || title || 'Card image'}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay - subtle from top */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
            
            {/* Top Content - Title & Subtitle */}
            {(title || subtitle) && (
              <div className="absolute top-5 left-5 right-5 text-white">
                {title && (
                  <h3 className="text-lg font-medium tracking-wide">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isConnecting && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                    <span className="text-xs text-white/90 font-normal">
                      {subtitle}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Custom children overlay */}
            {children && (
              <div className="absolute inset-0">{children}</div>
            )}

            {/* Blur gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 via-35% via-white/40 to-transparent" />
            
            {/* Footer - positioned absolute over image */}
            {footer ? (
              <div className="absolute bottom-4 left-4 right-4">{footer}</div>
            ) : (
              (avatar || username || onAction) && (
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  {/* Avatar & User Info */}
                  {(avatar || username || timestamp) && (
                    <div className="flex items-center gap-2">
                      {avatar && (
                        <img
                          src={avatar}
                          alt={username || 'User'}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      )}
                      {(username || timestamp) && (
                        <div className="flex flex-col">
                          {username && (
                            <span className="text-xs font-semibold text-gray-800">
                              {username}
                            </span>
                          )}
                          {timestamp && (
                            <span className="text-[10px] text-gray-500">
                              {timestamp}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  {onAction && (
                    <button
                      onClick={onAction}
                      className={cn(
                        'flex items-center gap-1 px-3 py-1.5',
                        'bg-white/90 backdrop-blur-sm',
                        'text-gray-700',
                        'text-xs font-medium',
                        'rounded-full',
                        'hover:bg-white',
                        'active:scale-95',
                        'transition-all duration-200'
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      {actionText}
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants };



