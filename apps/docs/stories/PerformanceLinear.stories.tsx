import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PerformanceLinear } from 'brownie-ui-performance-linear';

/**
 * PerformanceLinear Component - A linear segmented bar gauge
 * 
 * Perfect for Fear & Greed Index, progress indicators, and horizontal metrics.
 * 
 * Features:
 * - Horizontal segmented bars with gradient colors
 * - Vertical indicator bar
 * - Smooth animations
 * - Customizable gradient
 * - Auto-generated labels
 */
const meta: Meta<typeof PerformanceLinear> = {
  title: 'Components/PerformanceLinear',
  component: PerformanceLinear,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A linear segmented bar gauge for Fear & Greed Index and progress indicators.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current value to display',
    },
    min: {
      control: 'number',
      description: 'Minimum value of the scale',
      table: { defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'Maximum value of the scale',
      table: { defaultValue: { summary: '100' } },
    },
    title: {
      control: 'text',
      description: 'Title displayed on the left',
      table: { defaultValue: { summary: '"Fear and Greed Index"' } },
    },
    label: {
      control: 'text',
      description: 'Label on the right (auto if not provided)',
    },
    segments: {
      control: { type: 'range', min: 10, max: 60, step: 5 },
      description: 'Number of bar segments',
      table: { defaultValue: { summary: '40' } },
    },
    barHeight: {
      control: { type: 'range', min: 12, max: 40, step: 2 },
      description: 'Height of the bars in pixels',
      table: { defaultValue: { summary: '24' } },
    },
    gap: {
      control: { type: 'range', min: 0, max: 10, step: 1 },
      description: 'Gap between segments in pixels',
      table: { defaultValue: { summary: '2' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default - Fear and Greed Index style
 */
export const Default: Story = {
  args: {
    value: 75,
    title: 'Fear and Greed Index',
    label: 'Extreme Greed',
  },
};

/**
 * Extreme Fear (0-20)
 */
export const ExtremeFear: Story = {
  args: {
    value: 15,
    title: 'Fear and Greed Index',
  },
  parameters: {
    docs: {
      description: {
        story: 'Value in Extreme Fear range (auto-label)',
      },
    },
  },
};

/**
 * Fear (20-40)
 */
export const Fear: Story = {
  args: {
    value: 30,
    title: 'Fear and Greed Index',
  },
  parameters: {
    docs: {
      description: {
        story: 'Value in Fear range (auto-label)',
      },
    },
  },
};

/**
 * Neutral (40-60)
 */
export const Neutral: Story = {
  args: {
    value: 50,
    title: 'Fear and Greed Index',
  },
  parameters: {
    docs: {
      description: {
        story: 'Value in Neutral range (auto-label)',
      },
    },
  },
};

/**
 * Greed (60-80)
 */
export const Greed: Story = {
  args: {
    value: 70,
    title: 'Fear and Greed Index',
  },
  parameters: {
    docs: {
      description: {
        story: 'Value in Greed range (auto-label)',
      },
    },
  },
};

/**
 * Extreme Greed (80-100)
 */
export const ExtremeGreed: Story = {
  args: {
    value: 90,
    title: 'Fear and Greed Index',
  },
  parameters: {
    docs: {
      description: {
        story: 'Value in Extreme Greed range (auto-label)',
      },
    },
  },
};

/**
 * Custom label
 */
export const CustomLabel: Story = {
  args: {
    value: 65,
    title: 'Market Sentiment',
    label: 'Bullish',
  },
};

/**
 * Progress bar style
 */
export const ProgressBar: Story = {
  args: {
    value: 60,
    title: 'Progress',
    segments: 20,
    barHeight: 16,
    label: '60%',
  },
};

/**
 * Thin bars
 */
export const ThinBars: Story = {
  args: {
    value: 75,
    title: 'Completion',
    barHeight: 12,
    segments: 50,
  },
};

/**
 * Thick bars
 */
export const ThickBars: Story = {
  args: {
    value: 85,
    title: 'Score',
    barHeight: 32,
    segments: 30,
  },
};

/**
 * Custom range (0-1000)
 */
export const CustomRange: Story = {
  args: {
    value: 750,
    min: 0,
    max: 1000,
    title: 'Total Score',
    label: 'Excellent',
    formatValue: (v) => v.toLocaleString(),
  },
};

/**
 * Custom gradient - Blue to Purple
 */
export const BluePurpleGradient: Story = {
  args: {
    value: 70,
    title: 'System Load',
    gradient: [
      { position: 0, color: '#3b82f6' },
      { position: 0.5, color: '#8b5cf6' },
      { position: 1, color: '#a855f7' },
    ],
  },
};

/**
 * Custom gradient - Heat map style
 */
export const HeatmapGradient: Story = {
  args: {
    value: 55,
    title: 'Activity Level',
    gradient: [
      { position: 0, color: '#1e3a8a' },
      { position: 0.25, color: '#3b82f6' },
      { position: 0.5, color: '#eab308' },
      { position: 0.75, color: '#f97316' },
      { position: 1, color: '#dc2626' },
    ],
  },
};

/**
 * Without value label
 */
export const NoValueLabel: Story = {
  args: {
    value: 75,
    title: 'Fear and Greed Index',
    showValue: false,
  },
};

/**
 * Interactive demo with slider
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(50);
    
    return (
      <div className="space-y-8 max-w-2xl">
        <PerformanceLinear
          value={value}
          title="Fear and Greed Index"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value: {value}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 (Extreme Fear)</span>
            <span>50 (Neutral)</span>
            <span>100 (Extreme Greed)</span>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Animation demo
 */
export const AnimationDemo: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    
    return (
      <div className="space-y-4 max-w-2xl">
        <PerformanceLinear
          key={key}
          value={85}
          title="Fear and Greed Index"
        />
        <button
          onClick={() => setKey(k => k + 1)}
          className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
        >
          Replay Animation
        </button>
      </div>
    );
  },
};

/**
 * Dashboard - Multiple metrics
 */
export const Dashboard: Story = {
  render: () => (
    <div className="space-y-6 max-w-3xl">
      <PerformanceLinear
        value={25}
        title="Fear and Greed Index"
      />
      <PerformanceLinear
        value={85}
        title="Market Volatility"
        label="High"
        gradient={[
          { position: 0, color: '#22c55e' },
          { position: 0.5, color: '#eab308' },
          { position: 1, color: '#ef4444' },
        ]}
      />
      <PerformanceLinear
        value={60}
        title="Trading Volume"
        label="Above Average"
        gradient={[
          { position: 0, color: '#3b82f6' },
          { position: 1, color: '#06b6d4' },
        ]}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Comparison - Different segment counts
 */
export const SegmentComparison: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <PerformanceLinear
        value={75}
        title="10 Segments"
        segments={10}
      />
      <PerformanceLinear
        value={75}
        title="20 Segments"
        segments={20}
      />
      <PerformanceLinear
        value={75}
        title="40 Segments (default)"
        segments={40}
      />
      <PerformanceLinear
        value={75}
        title="60 Segments"
        segments={60}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Gap comparison - Different gap sizes
 */
export const GapComparison: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <PerformanceLinear
        value={75}
        title="No Gap (0px)"
        segments={40}
        gap={0}
      />
      <PerformanceLinear
        value={75}
        title="Small Gap (2px) - Default"
        segments={40}
        gap={2}
      />
      <PerformanceLinear
        value={75}
        title="Medium Gap (4px)"
        segments={40}
        gap={4}
      />
      <PerformanceLinear
        value={75}
        title="Large Gap (8px)"
        segments={40}
        gap={8}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Green to Gray gradient - Age indicator
 */
export const AgeIndicator: Story = {
  args: {
    value: 45,
    min: 0,
    max: 100,
    title: 'Edad',
    label: 'Edad',
    segments: 40,
    gap: 2,
    gradient: [
      { position: 0, color: '#22c55e' },    // Green
      { position: 0.5, color: '#84cc16' },  // Lime
      { position: 1, color: '#9ca3af' },    // Gray
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Green to Gray gradient with 40 segments and 2px gap',
      },
    },
  },
};

/**
 * With step markers - every 10 units
 */
export const StepsEvery10: Story = {
  args: {
    value: 45,
    min: 0,
    max: 100,
    title: 'Progreso',
    segments: 40,
    showSteps: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows step markers with dots and numbers every 10 units (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100)',
      },
    },
  },
};

/**
 * With step markers - every 5 units
 */
export const StepsEvery5: Story = {
  args: {
    value: 47,
    min: 0,
    max: 100,
    title: 'Progreso detallado',
    segments: 40,
    showSteps: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows step markers with dots and numbers every 5 units',
      },
    },
  },
};

/**
 * With step markers - every 20 units
 */
export const StepsEvery20: Story = {
  args: {
    value: 65,
    min: 0,
    max: 100,
    title: 'Progreso amplio',
    segments: 40,
    showSteps: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows step markers with dots and numbers every 20 units (0, 20, 40, 60, 80, 100)',
      },
    },
  },
};
