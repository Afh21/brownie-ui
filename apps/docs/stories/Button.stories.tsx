import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@brownie-inc/button';

/**
 * Button component - A versatile, accessible button with multiple variants
 * 
 * The Button component is the foundation of user interactions. It supports
 * multiple visual variants, sizes, and states to fit any design need.
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A beautiful button component with Pinterest-inspired designs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'primary',
        'secondary',
        'outline',
        'ghost',
        'destructive',
        'link',
        'glass',
        'gradient',
        'soft',
      ],
      description: 'Visual style variant of the button',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon'],
      description: 'Size of the button',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state with spinner',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Border radius style',
      table: {
        defaultValue: { summary: 'lg' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button - Clean and minimal
 */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'md',
  },
};

/**
 * Primary button - Main call-to-action
 */
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

/**
 * Secondary button - Alternative action
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

/**
 * Outline button - Subtle border style
 */
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

/**
 * Ghost button - Minimal, no background
 */
export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

/**
 * Destructive button - For delete/danger actions
 */
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

/**
 * Link button - Looks like a hyperlink
 */
export const Link: Story = {
  args: {
    children: 'Learn More',
    variant: 'link',
  },
};

// Pinterest-inspired variants

/**
 * Glass button - Modern translucent style
 * Perfect for overlays and modern UIs
 */
export const Glass: Story = {
  args: {
    children: 'Glass Effect',
    variant: 'glass',
  },
  parameters: {
    backgrounds: { default: 'chocolate' },
  },
};

/**
 * Gradient button - Beautiful gradient background
 */
export const Gradient: Story = {
  args: {
    children: 'Get Started',
    variant: 'gradient',
    size: 'lg',
  },
};

/**
 * Soft button - Muted, pastel style
 */
export const Soft: Story = {
  args: {
    children: 'Soft Touch',
    variant: 'soft',
  },
};

// Size variations

/**
 * All sizes showcase
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium (default)</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

// States

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
    variant: 'primary',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
    variant: 'primary',
  },
};

// Shape variations

/**
 * Rounded variations
 */
export const Rounded: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button rounded="none">No Radius</Button>
      <Button rounded="sm">Small</Button>
      <Button rounded="md">Medium</Button>
      <Button rounded="lg">Large (default)</Button>
      <Button rounded="xl">Extra Large</Button>
      <Button rounded="full">Full</Button>
    </div>
  ),
};

// Full width

/**
 * Full width button
 */
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    variant: 'primary',
  },
  parameters: {
    layout: 'padded',
  },
};

// With icons (example)

/**
 * Button with icons
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        variant="primary"
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        }
      >
        Next Step
      </Button>
      <Button
        variant="outline"
        rightIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
        }
      >
        Download
      </Button>
    </div>
  ),
};

// Comprehensive showcase

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Button variant="default">Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
      <Button variant="glass">Glass</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="soft">Soft</Button>
    </div>
  ),
};

