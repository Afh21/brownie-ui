import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Performance } from 'brownie-ui-performance';

/**
 * Performance Component - A beautiful segmented bar gauge for metrics
 * 
 * Perfect for displaying performance indicators, KPIs, and metrics
 * with an animated bar gauge design.
 * 
 * Features:
 * - Segmented arc with individual bars
 * - Trend indicator with optional info icon
 * - Animated value counter
 * - Customizable colors
 */
const meta: Meta<typeof Performance> = {
  title: 'Components/Performance',
  component: Performance,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A segmented bar gauge component perfect for performance metrics and KPIs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1000, step: 1 },
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
      description: 'Title displayed at the top',
      table: { defaultValue: { summary: '"Performance"' } },
    },
    unit: {
      control: 'text',
      description: 'Unit label',
      table: { defaultValue: { summary: '"point"' } },
    },
    maxSegments: {
      control: { type: 'range', min: 5, max: 40, step: 1 },
      description: 'Maximum number of bars/segments',
      table: { defaultValue: { summary: '20' } },
    },
    size: {
      control: { type: 'range', min: 200, max: 400, step: 10 },
      description: 'Size of the gauge in pixels',
      table: { defaultValue: { summary: '280' } },
    },
    animationDuration: {
      control: 'number',
      description: 'Animation duration in milliseconds',
      table: { defaultValue: { summary: '1200' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      description: 'Visual variant',
      table: { defaultValue: { summary: 'default' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default performance gauge - matches the reference image
 */
export const Default: Story = {
  args: {
    value: 432,
    min: 0,
    max: 1000,
    title: 'Performance',
    unit: 'point',
    trend: { value: '+10%', direction: 'up', showInfo: true },
  },
};

/**
 * Simple trend as string
 */
export const SimpleTrend: Story = {
  args: {
    value: 432,
    title: 'Performance',
    unit: 'point',
    trend: '+10%',
  },
  parameters: {
    docs: {
      description: {
        story: 'Trend can be a simple string like "+10%"',
      },
    },
  },
};

/**
 * No trend indicator
 */
export const NoTrend: Story = {
  args: {
    value: 432,
    title: 'Performance',
    unit: 'point',
  },
};

/**
 * Down trend
 */
export const DownTrend: Story = {
  args: {
    value: 350,
    title: 'Sales',
    unit: 'units',
    trend: { value: '-5%', direction: 'down', showInfo: true },
  },
};

/**
 * Neutral trend
 */
export const NeutralTrend: Story = {
  args: {
    value: 500,
    title: 'Views',
    unit: 'views',
    trend: { value: '0%', direction: 'neutral', showInfo: false },
  },
};

/**
 * Custom colors - Blue theme
 */
export const BlueTheme: Story = {
  args: {
    value: 75,
    title: 'System Health',
    unit: '%',
    trend: '+2%',
    segmentColors: {
      active: '#3b82f6',
      inactive: '#e5e7eb',
    },
  },
};

/**
 * Custom colors - Green theme
 */
export const GreenTheme: Story = {
  args: {
    value: 850,
    title: 'Revenue',
    unit: 'K',
    trend: { value: '+15%', direction: 'up', showInfo: true },
    segmentColors: {
      active: '#22c55e',
      inactive: '#e5e7eb',
    },
  },
};

/**
 * Custom colors - Purple theme
 */
export const PurpleTheme: Story = {
  args: {
    value: 68,
    title: 'Progress',
    unit: '%',
    trend: '+8%',
    segmentColors: {
      active: '#a855f7',
      inactive: '#e5e7eb',
    },
  },
};

/**
 * Compact variant
 */
export const Compact: Story = {
  args: {
    value: 432,
    title: 'Perf',
    unit: 'pt',
    variant: 'compact',
    size: 200,
    trend: '+10%',
  },
};

/**
 * More segments
 */
export const MoreSegments: Story = {
  args: {
    value: 75,
    title: 'Loading',
    unit: '%',
    maxSegments: 30,
    trend: '+3%',
  },
};

/**
 * Fewer segments
 */
export const FewerSegments: Story = {
  args: {
    value: 60,
    title: 'Progress',
    unit: '%',
    maxSegments: 10,
    trend: '+12%',
  },
};

/**
 * Large size
 */
export const Large: Story = {
  args: {
    value: 750,
    title: 'Performance Score',
    unit: 'points',
    size: 350,
    trend: { value: '+10%', direction: 'up', showInfo: true },
  },
};

/**
 * Small size
 */
export const Small: Story = {
  args: {
    value: 432,
    title: 'Perf',
    unit: 'pt',
    size: 220,
    variant: 'compact',
    maxSegments: 15,
    trend: '+10%',
  },
};

/**
 * Custom formatting
 */
export const CustomFormatting: Story = {
  args: {
    value: 1234567,
    title: 'Page Views',
    formatValue: (v) => v.toLocaleString(),
    unit: 'views',
    trend: '+25%',
    maxSegments: 25,
  },
};

/**
 * Percentage display
 */
export const Percentage: Story = {
  args: {
    value: 85,
    title: 'Completion',
    unit: '%',
    trend: '+5%',
    segmentColors: {
      active: '#f59e0b',
      inactive: '#e5e7eb',
    },
  },
};

/**
 * Interactive demo with slider
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(432);
    
    return (
      <div className="flex flex-col items-center gap-8">
        <Performance
          value={value}
          title="Interactive Performance"
          unit="point"
          trend={{ value: value > 400 ? '+10%' : '-5%', direction: value > 400 ? 'up' : 'down', showInfo: true }}
        />
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value: {value}
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>500</span>
            <span>1000</span>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Multiple metrics - Dashboard style
 */
export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Performance
        value={432}
        title="Performance"
        unit="point"
        variant="compact"
        size={220}
        trend={{ value: '+10%', direction: 'up', showInfo: true }}
      />
      <Performance
        value={85}
        title="CPU Usage"
        unit="%"
        variant="compact"
        size={220}
        trend="-2%"
        segmentColors={{ active: '#3b82f6', inactive: '#e5e7eb' }}
      />
      <Performance
        value={920}
        title="Revenue"
        unit="K"
        variant="compact"
        size={220}
        trend={{ value: '+15%', direction: 'up', showInfo: true }}
        segmentColors={{ active: '#22c55e', inactive: '#e5e7eb' }}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Multiple performance gauges in a dashboard layout',
      },
    },
  },
};

/**
 * Animation demo
 */
export const AnimationDemo: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    
    return (
      <div className="flex flex-col items-center gap-4">
        <Performance
          key={key}
          value={432}
          title="Performance"
          unit="point"
          trend={{ value: '+10%', direction: 'up', showInfo: true }}
          animationDuration={1500}
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
 * Different sizes comparison
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-8">
      <Performance
        value={432}
        title="Small"
        unit="pt"
        size={200}
        variant="compact"
        trend="+10%"
      />
      <Performance
        value={432}
        title="Medium"
        unit="point"
        size={280}
        trend={{ value: '+10%', direction: 'up', showInfo: true }}
      />
      <Performance
        value={432}
        title="Large"
        unit="points"
        size={340}
        trend={{ value: '+10%', direction: 'up', showInfo: true }}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * No info icon
 */
export const NoInfoIcon: Story = {
  args: {
    value: 650,
    title: 'Growth',
    unit: '%',
    trend: { value: '+25%', direction: 'up', showInfo: false },
    segmentColors: {
      active: '#22c55e',
      inactive: '#e5e7eb',
    },
  },
};
