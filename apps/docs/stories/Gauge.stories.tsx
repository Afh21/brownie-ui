import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Gauge } from 'brownie-ui-gauge';

/**
 * Gauge Component - A beautiful animated gauge/credit score indicator
 * 
 * Perfect for displaying credit scores, performance metrics, progress indicators,
 * or any value that fits within a numerical range.
 * 
 * Features:
 * - Animated needle with smooth easing
 * - Color-coded segments (red → yellow → green)
 * - Automatic rating labels
 * - Responsive sizing
 */
const meta: Meta<typeof Gauge> = {
  title: 'Components/Gauge',
  component: Gauge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An animated gauge component perfect for credit scores and metrics.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 300, max: 900, step: 1 },
      description: 'Current value to display',
    },
    min: {
      control: 'number',
      description: 'Minimum value of the scale',
      table: { defaultValue: { summary: '300' } },
    },
    max: {
      control: 'number',
      description: 'Maximum value of the scale',
      table: { defaultValue: { summary: '900' } },
    },
    title: {
      control: 'text',
      description: 'Title displayed at the top',
    },
    showAutoLabel: {
      control: 'boolean',
      description: 'Show automatic rating label',
      table: { defaultValue: { summary: 'true' } },
    },
    size: {
      control: { type: 'range', min: 200, max: 500, step: 10 },
      description: 'Size of the gauge in pixels',
      table: { defaultValue: { summary: '320' } },
    },
    animationDuration: {
      control: 'number',
      description: 'Animation duration in milliseconds',
      table: { defaultValue: { summary: '1500' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'compact'],
      description: 'Visual variant of the gauge',
      table: { defaultValue: { summary: 'default' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default gauge - Credit score style
 */
export const Default: Story = {
  args: {
    value: 821,
    title: 'My Credit Score',
    min: 300,
    max: 900,
    showAutoLabel: true,
  },
};

/**
 * Poor credit score (red zone)
 */
export const PoorScore: Story = {
  args: {
    value: 450,
    title: 'Credit Score',
    min: 300,
    max: 900,
  },
  parameters: {
    docs: {
      description: {
        story: 'Score in the poor range (red color)',
      },
    },
  },
};

/**
 * Fair credit score (orange/yellow zone)
 */
export const FairScore: Story = {
  args: {
    value: 650,
    title: 'Credit Score',
    min: 300,
    max: 900,
  },
  parameters: {
    docs: {
      description: {
        story: 'Score in the fair range (orange/yellow color)',
      },
    },
  },
};

/**
 * Good credit score (lime/green zone)
 */
export const GoodScore: Story = {
  args: {
    value: 780,
    title: 'Credit Score',
    min: 300,
    max: 900,
  },
  parameters: {
    docs: {
      description: {
        story: 'Score in the good range (lime color)',
      },
    },
  },
};

/**
 * Excellent credit score (green zone)
 */
export const ExcellentScore: Story = {
  args: {
    value: 850,
    title: 'Credit Score',
    min: 300,
    max: 900,
  },
  parameters: {
    docs: {
      description: {
        story: 'Score in the excellent range (green color)',
      },
    },
  },
};

/**
 * Compact variant - Smaller footprint
 */
export const Compact: Story = {
  args: {
    value: 821,
    title: 'Score',
    variant: 'compact',
    size: 240,
    min: 300,
    max: 900,
  },
};

/**
 * Minimal variant - Just the gauge
 */
export const Minimal: Story = {
  args: {
    value: 821,
    variant: 'minimal',
    size: 200,
    min: 300,
    max: 900,
    showAutoLabel: false,
  },
};

/**
 * Custom scale - Different min/max values
 */
export const CustomScale: Story = {
  args: {
    value: 75,
    title: 'Performance Score',
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Using a 0-100 scale instead of the default 300-900',
      },
    },
  },
};

/**
 * Using ranges prop - Define colors with absolute values
 * This is the easiest way to customize color sections
 */
export const WithRanges: Story = {
  render: () => (
    <Gauge
      value={650}
      min={0}
      max={1000}
      title="Custom Ranges"
      ranges={[
        { min: 0, max: 400, color: '#ef4444' },    // Red: 0-400
        { min: 401, max: 600, color: '#f59e0b' },  // Orange: 401-600
        { min: 601, max: 800, color: '#eab308' },  // Yellow: 601-800
        { min: 801, max: 1000, color: '#22c55e' }, // Green: 801-1000
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the `ranges` prop to define color sections with absolute values instead of percentages',
      },
    },
  },
};

/**
 * Uneven ranges - Different sized sections
 */
export const UnevenRanges: Story = {
  render: () => (
    <Gauge
      value={720}
      min={300}
      max={900}
      title="Credit Score"
      ranges={[
        { min: 300, max: 500, color: '#ef4444' },   // Poor: 200 points
        { min: 501, max: 650, color: '#f97316' },   // Fair: 150 points
        { min: 651, max: 750, color: '#eab308' },   // Good: 100 points
        { min: 751, max: 900, color: '#22c55e' },   // Excellent: 150 points
      ]}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ranges can have different sizes. Red section is larger (200pts), Good is smaller (100pts)',
      },
    },
  },
};

/**
 * Large size - Big display
 */
export const Large: Story = {
  args: {
    value: 821,
    title: 'Credit Score',
    size: 400,
    min: 300,
    max: 900,
  },
};

/**
 * Interactive demo with slider
 */
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState(650);
    
    return (
      <div className="flex flex-col items-center gap-8">
        <Gauge
          value={value}
          title="Interactive Gauge"
          min={300}
          max={900}
        />
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value: {value}
          </label>
          <input
            type="range"
            min={300}
            max={900}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>300</span>
            <span>600</span>
            <span>900</span>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Multiple gauges - Dashboard style
 */
export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Gauge
        value={450}
        title="Credit Score"
        variant="compact"
        size={220}
      />
      <Gauge
        value={720}
        title="Performance"
        variant="compact"
        size={220}
      />
      <Gauge
        value={890}
        title="Savings Goal"
        variant="compact"
        size={220}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Multiple gauges in a dashboard layout',
      },
    },
  },
};

/**
 * Loading animation demo
 */
export const AnimationDemo: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    
    return (
      <div className="flex flex-col items-center gap-4">
        <Gauge
          key={key}
          value={821}
          title="Animated Score"
          animationDuration={2000}
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
 * Custom label example
 */
export const CustomLabel: Story = {
  args: {
    value: 85,
    title: 'System Health',
    label: 'All systems operational',
    showAutoLabel: false,
    min: 0,
    max: 100,
    size: 300,
  },
};

/**
 * No label
 */
export const NoLabel: Story = {
  args: {
    value: 821,
    title: 'Credit Score',
    min: 300,
    max: 900,
    showAutoLabel: false,
  },
};

/**
 * Different sizes comparison
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-wrap items-end justify-center gap-8">
      <Gauge
        value={821}
        title="Small"
        size={200}
        variant="compact"
      />
      <Gauge
        value={821}
        title="Medium"
        size={280}
      />
      <Gauge
        value={821}
        title="Large"
        size={360}
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};


