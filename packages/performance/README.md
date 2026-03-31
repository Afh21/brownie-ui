# brownie-ui-performance

A beautiful performance bar gauge component for Brownie UI. Perfect for displaying metrics, KPIs, and performance indicators with animated segmented bars.

![Performance Gauge](https://via.placeholder.com/400x200?text=Performance+Gauge)

## Installation

```bash
npm install brownie-ui-performance
# or
pnpm add brownie-ui-performance
# or
yarn add brownie-ui-performance
```

## Usage

```tsx
import { Performance } from 'brownie-ui-performance';

function App() {
  return (
    <Performance
      value={432}
      title="Performance"
      unit="point"
      trend={{ value: "+10%", direction: "up", showInfo: true }}
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
| `title` | `string` | `"Performance"` | Title displayed at the top |
| `unit` | `string` | `"point"` | Unit label (point, pts, %, etc.) |
| `maxSegments` | `number` | `20` | Maximum number of bars/segments |
| `activeSegments` | `number` | - | Manual control of active segments |
| `trend` | `TrendIndicator \| string` | - | Trend indicator (+10%, -5%, etc.) |
| `segmentColors` | `object` | `{ active: '#ef4444', inactive: '#e5e7eb' }` | Colors for segments |
| `size` | `number` | `280` | Size of the gauge (width in pixels) |
| `animationDuration` | `number` | `1200` | Animation duration in milliseconds |
| `formatValue` | `(value: number) => string` | `(v) => v.toString()` | Format function for the value |
| `variant` | `'default' \| 'compact'` | `"default"` | Variant style |

## Trend Indicator

The `trend` prop accepts either a string or an object:

```tsx
// Simple string
<Performance value={432} trend="+10%" />

// Full configuration
<Performance 
  value={432} 
  trend={{ 
    value: "+10%", 
    direction: "up",   // 'up' | 'down' | 'neutral'
    showInfo: true     // Shows info icon
  }} 
/>
```

## Customization

### Custom Colors

```tsx
<Performance
  value={75}
  segmentColors={{
    active: '#3b82f6',   // blue
    inactive: '#e5e7eb', // gray
  }}
/>
```

### Custom Range (0-1000)

```tsx
<Performance
  value={432}
  min={0}
  max={1000}
  title="Score"
  unit="points"
/>
```

### Custom Formatting

```tsx
<Performance
  value={1234}
  formatValue={(v) => v.toLocaleString()}
  unit="views"
  trend="+5.2%"
/>
```

### Compact Variant

```tsx
<Performance
  value={85}
  variant="compact"
  size={200}
  maxSegments={15}
/>
```

## License

MIT
