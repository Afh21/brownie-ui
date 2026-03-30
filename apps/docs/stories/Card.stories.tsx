import type { Meta, StoryObj } from '@storybook/react';
import { Card } from 'brownie-ui-card';

/**
 * Card Component - A beautiful card with image overlay, avatar, and action button
 * 
 * Perfect for social media posts, user profiles, portfolio items, and content cards.
 * Features gradient overlay, connecting indicator animation, and customizable footer.
 */
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Pinterest-style card component with image, overlay, and action button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Size of the card',
      table: { defaultValue: { summary: 'md' } },
    },
    image: {
      control: 'text',
      description: 'Image URL',
    },
    title: {
      control: 'text',
      description: 'Title displayed at top',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle or status text',
    },
    isConnecting: {
      control: 'boolean',
      description: 'Show connecting indicator',
    },
    username: {
      control: 'text',
      description: 'Username or author name',
    },
    timestamp: {
      control: 'text',
      description: 'Timestamp text',
    },
    actionText: {
      control: 'text',
      description: 'Text for action button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default card - Exactly matching the reference image
 */
export const Default: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop',
    title: 'Creativestyle',
    subtitle: 'Connecting',
    isConnecting: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    username: '@marvel2025',
    timestamp: '29m ago',
    actionText: 'SAVE',
    size: 'md',
    onAction: () => alert('Saved!'),
  },
};

/**
 * Without connecting indicator
 */
export const WithoutConnecting: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
    title: 'Photography',
    subtitle: 'Published',
    isConnecting: false,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    username: '@sarah_design',
    timestamp: '2h ago',
    actionText: 'View',
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-start justify-center">
      <Card
        image="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop"
        title="Small"
        subtitle="256px"
        isConnecting
        size="sm"
        avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
        username="@small"
      />
      <Card
        image="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop"
        title="Medium"
        subtitle="288px"
        isConnecting
        size="md"
        avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
        username="@medium"
      />
      <Card
        image="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=625&fit=crop"
        title="Large"
        subtitle="320px"
        isConnecting
        size="lg"
        avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
        username="@large"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Without action button
 */
export const NoAction: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop',
    title: 'No Action',
    subtitle: 'Just info',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    username: '@readonly',
    timestamp: '1d ago',
  },
};

/**
 * Without avatar
 */
export const NoAvatar: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=500&fit=crop',
    title: 'Nature Shot',
    subtitle: 'Exploring',
    isConnecting: true,
    actionText: 'Explore',
  },
};

/**
 * Minimal - Title and image only
 */
export const Minimal: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=500&fit=crop',
    title: 'Minimal',
  },
};

/**
 * Loading states demo
 */
export const ConnectingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop"
        title="Connecting..."
        subtitle="Establishing"
        isConnecting={true}
        avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
        username="@loading"
        size="sm"
      />
      <Card
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop"
        title="Connected"
        subtitle="Live"
        isConnecting={false}
        avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
        username="@connected"
        actionText="Join"
        size="sm"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};


