# brownie-ui-day-picker

A highly customizable day picker component for React with support for multiple languages, custom styling, and rich day information.

## Installation

```bash
npm install brownie-ui-day-picker
# or
pnpm add brownie-ui-day-picker
# or
yarn add brownie-ui-day-picker
```

## Features

- 🎨 **Fully Customizable** - Style every part with custom classNames
- 🌍 **i18n Support** - English and Spanish translations built-in
- 📅 **Smart Date Handling** - ISO dates, timestamps, week numbers
- ♿ **Accessible** - Keyboard navigation and ARIA labels
- 🚫 **Disable/Exclude Days** - Hide weekends or disable specific dates
- 📱 **Responsive** - Works on all screen sizes
- 🔧 **TypeScript** - Full type support

## Quick Start

```tsx
import { DayPicker } from 'brownie-ui-day-picker';
import 'brownie-ui-core/styles.css'; // Don't forget the styles!

const days = [
  { day: 'Sun', date: 5, fullDate: new Date(2026, 3, 5) },
  { day: 'Mon', date: 6, fullDate: new Date(2026, 3, 6) },
  // ... more days
];

function App() {
  return (
    <DayPicker
      days={days}
      locale="es"
      onChange={(dayInfo) => console.log(dayInfo.isoDate)}
    />
  );
}
```

## Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `days` | `DayOption[]` | **Required** | Array of days to display |
| `selectedIndex` | `number` | - | Controlled selected index |
| `defaultSelectedIndex` | `number` | `0` | Initial selected index |
| `onChange` | `(dayInfo: DayInfo) => void` | - | Callback when day is selected |
| `onNavigate` | `(direction: 'prev' \| 'next') => void` | - | Callback when navigation arrows clicked |
| `className` | `string` | - | Additional CSS class for container |

### Day Filtering Props

| Prop | Type | Description |
|------|------|-------------|
| `visibleDays` | `number` | Limit number of days shown |
| `excludedDays` | `string[]` | Hide days by name (e.g., `['Sun', 'Sat']`) |
| `disabledDates` | `string[]` | Disable specific ISO dates (e.g., `['2026-04-15']`) |

### Navigation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `canNavigatePrev` | `boolean` | `!!onNavigate` | Enable/disable previous arrow |
| `canNavigateNext` | `boolean` | `!!onNavigate` | Enable/disable next arrow |

### Display Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showMonth` | `boolean` | `true` | Show/hide month header |
| `monthFormat` | `'long' \| 'short'` | `'long'` | Month name format |
| `locale` | `'en' \| 'es'` | `'en'` | Language for translations |

### Styling Props

| Prop | Type | Description |
|------|------|-------------|
| `classNames` | `object` | Custom classes for each part (see below) |

## DayOption Interface

```tsx
interface DayOption {
  day: string;        // Short day name (Mon, Tue, etc.)
  date: number;       // Day of month (1-31)
  fullDate?: Date;    // Full JavaScript Date object
  disabled?: boolean; // Disable this specific day
}
```

## DayInfo Interface (onChange callback)

When a day is selected, `onChange` returns a rich `DayInfo` object:

```tsx
interface DayInfo {
  day: DayOption;           // Original day object
  index: number;            // Index in visible (filtered) array
  originalIndex: number;    // Index in original array
  dayName: string;          // Short name (e.g., "Lun")
  dayNameLong: string;      // Long name (e.g., "Lunes")
  date: number;             // Day of month (1-31)
  fullDate: Date;           // JavaScript Date object
  isoDate: string;          // ISO format: "2026-04-15"
  monthName: string;        // Full month name
  monthNameShort: string;   // Short month name
  year: number;             // Year (e.g., 2026)
  isSelected: boolean;      // Whether this day is selected
  isDisabled: boolean;      // Whether this day is disabled
  weekNumber: number;       // Week of year (1-52)
  timestamp: number;        // Unix timestamp in ms
}
```

## Custom Styling

Use the `classNames` prop to customize every part:

```tsx
<DayPicker
  days={days}
  classNames={{
    container: 'shadow-xl rounded-2xl',
    monthHeader: 'bg-blue-600 px-6 py-4',
    monthText: 'text-lg font-bold text-white',
    navButton: 'hover:bg-white/20 rounded-full',
    daysContainer: 'bg-white p-4 gap-3',
    day: 'min-w-[64px] px-4 py-4 rounded-xl',
    daySelected: 'bg-blue-500 text-white shadow-lg',
    dayDisabled: 'opacity-25 grayscale',
  }}
/>
```

### Available classNames Keys

| Key | Description |
|-----|-------------|
| `container` | Root container |
| `monthHeader` | Dark header bar with month name |
| `monthText` | Month text element |
| `navButton` | Navigation arrow buttons |
| `daysContainer` | Container for day buttons |
| `day` | Applied to all day buttons |
| `daySelected` | Applied when day is selected |
| `dayDisabled` | Applied when day is disabled |

## Usage Examples

### Basic Usage

```tsx
const weekDays = [
  { day: 'Mon', date: 6, fullDate: new Date(2026, 3, 6) },
  { day: 'Tue', date: 7, fullDate: new Date(2026, 3, 7) },
  { day: 'Wed', date: 8, fullDate: new Date(2026, 3, 8) },
  // ...
];

<DayPicker days={weekDays} />
```

### Spanish Language

```tsx
<DayPicker
  days={weekDays}
  locale="es"
  monthFormat="long" // "Abril 2026"
/>
```

### Hide Weekends

```tsx
<DayPicker
  days={weekDays}
  excludedDays={['Sun', 'Sat']}
/>
```

### Disable Specific Dates

```tsx
<DayPicker
  days={weekDays}
  disabledDates={['2026-04-15', '2026-04-16']}
/>
```

### With Navigation

```tsx
const [weekOffset, setWeekOffset] = useState(0);

<DayPicker
  days={currentWeekDays}
  onNavigate={(direction) => {
    setWeekOffset(prev => 
      direction === 'prev' ? prev - 1 : prev + 1
    );
  }}
  canNavigatePrev={weekOffset > -4}
  canNavigateNext={weekOffset < 4}
/>
```

### Full Example: Booking Calendar

```tsx
import { useState } from 'react';
import { DayPicker, DayInfo } from 'brownie-ui-day-picker';

function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<DayInfo | null>(null);
  
  const weekDays = generateWeekDays(new Date()); // Your helper
  
  return (
    <div>
      <DayPicker
        days={weekDays}
        locale="es"
        excludedDays={['Sun']} // No Sundays
        disabledDates={['2026-04-15']} // Holiday
        onChange={setSelectedDate}
        onNavigate={handleWeekChange}
        classNames={{
          monthHeader: 'bg-indigo-600',
          daySelected: 'bg-indigo-500 text-white',
        }}
      />
      
      {selectedDate && (
        <p>
          Selected: {selectedDate.dayNameLong}, {selectedDate.date} of {selectedDate.monthName}
        </p>
      )}
    </div>
  );
}
```

## Generating Week Days

Here's a helper function to generate week days:

```tsx
const generateWeekDays = (startDate: Date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      fullDate: date,
    };
  });
};

// Usage
const sunday = new Date();
sunday.setDate(sunday.getDate() - sunday.getDay()); // Get Sunday

const weekDays = generateWeekDays(sunday);
```

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

## License

MIT © Brownie UI Team
