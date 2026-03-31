# brownie-ui-performance-linear

A linear segmented performance bar component for Brownie UI. Perfect for Fear & Greed Index, progress indicators, and horizontal metrics.

![Performance Linear](https://via.placeholder.com/600x100?text=Fear+and+Greed+Index)

## Installation

```bash
npm install brownie-ui-performance-linear
# or
pnpm add brownie-ui-performance-linear
# or
yarn add brownie-ui-performance-linear
```

## Usage

```tsx
import { PerformanceLinear } from 'brownie-ui-performance-linear';

function App() {
  return (
    <PerformanceLinear
      value={75}
      title="Fear and Greed Index"
      label="Extreme Greed"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Current value to display |
| `min` | `number` | `0` | Minimum value of the scale |
| `max` | `number` | `100` | Maximum value of the scale |
| `title` | `string` | `"Fear and Greed Index"` | Title displayed on the left |
| `label` | `string` | - | Label on the right (auto-generated if not provided) |
| `segments` | `number` | `40` | Number of bar segments |
| `barHeight` | `number` | `24` | Height of the bars in pixels |
| `gradient` | `ColorStop[]` | Red→Green gradient | Custom color gradient |
| `animationDuration` | `number` | `1000` | Animation duration in ms |
| `formatValue` | `(value: number) => string` | `(v) => v.toString()` | Format function |
| `showTooltip` | `boolean` | `true` | Show value tooltip on hover |

## Auto-generated Labels

If you don't provide a `label`, it will be auto-generated based on the value:

| Range | Label |
|-------|-------|
| 0-20% | Extreme Fear |
| 20-40% | Fear |
| 40-60% | Neutral |
| 60-80% | Greed |
| 80-100% | Extreme Greed |

## Custom Gradient

```tsx
<PerformanceLinear
  value={65}
  title="Progress"
  gradient={[
    { position: 0, color: '#ef4444' },    // Red
    { position: 0.5, color: '#eab308' },  // Yellow
    { position: 1, color: '#22c55e' },    // Green
  ]}
/>
```

## Examples

### Fear and Greed Index
```tsx
<PerformanceLinear
  value={75}
  title="Fear and Greed Index"
  label="Extreme Greed"
/>
```

### Progress Bar
```tsx
<PerformanceLinear
  value={60}
  min={0}
  max={100}
  title="Progress"
  segments={20}
  barHeight={16}
/>
```

### Custom Scale
```tsx
<PerformanceLinear
  value={750}
  min={0}
  max={1000}
  title="Score"
  formatValue={(v) => v.toLocaleString()}
/>
```

## License

MIT
