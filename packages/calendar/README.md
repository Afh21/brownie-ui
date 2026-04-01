# brownie-ui-calendar

A modern, accessible calendar component library for Brownie UI. Inspired by shadcn/ui with powerful features for date picking, event management, and scheduling.

## Features

- 📅 **Calendar** - Beautiful monthly calendar view with navigation
- 📆 **DatePicker** - Single date selection with input
- 📊 **DateRangePicker** - Select date ranges
- 🎯 **EventCalendar** - Full event management with categories
- 🎨 **Customizable** - Tailwind CSS styling
- ♿ **Accessible** - Keyboard navigation and ARIA support
- 📱 **Responsive** - Works on all screen sizes

## Installation

```bash
npm install brownie-ui-calendar
# or
pnpm add brownie-ui-calendar
# or
yarn add brownie-ui-calendar
```

## Components

### Calendar

Basic calendar component for date display and selection.

```tsx
import { Calendar } from 'brownie-ui-calendar';

function App() {
  const [date, setDate] = useState(new Date());
  
  return (
    <Calendar 
      value={date} 
      onChange={setDate} 
      view="month"
    />
  );
}
```

### DatePicker

Date picker with input field and calendar popup.

```tsx
import { DatePicker } from 'brownie-ui-calendar';

function App() {
  const [date, setDate] = useState<Date>();
  
  return (
    <DatePicker 
      value={date}
      onChange={setDate}
      placeholder="Pick a date"
      minDate={new Date()}
    />
  );
}
```

### DateRangePicker

Select a range of dates.

```tsx
import { DateRangePicker } from 'brownie-ui-calendar';

function App() {
  const [range, setRange] = useState<{ start: Date; end: Date }>();
  
  return (
    <DateRangePicker 
      value={range}
      onChange={setRange}
      placeholder="Select date range"
    />
  );
}
```

### EventCalendar

Full-featured calendar with events and categories.

```tsx
import { EventCalendar } from 'brownie-ui-calendar';

const events = [
  {
    id: '1',
    title: 'Guitar lesson',
    start: new Date(2024, 3, 9, 14, 0),
    end: new Date(2024, 3, 9, 15, 0),
    category: 'music',
  },
  {
    id: '2',
    title: 'Kayaking',
    start: new Date(2024, 3, 6, 10, 0),
    end: new Date(2024, 3, 6, 12, 0),
    category: 'sport',
  },
];

const categories = [
  { id: 'music', name: 'Music', color: '#3b82f6' },
  { id: 'sport', name: 'Sport', color: '#ec4899' },
  { id: 'dance', name: 'Dance', color: '#8b5cf6' },
  { id: 'water', name: 'Water', color: '#eab308' },
];

function App() {
  const [date, setDate] = useState(new Date());
  
  return (
    <EventCalendar 
      value={date}
      onChange={setDate}
      events={events}
      categories={categories}
      onEventClick={(event) => console.log('Clicked:', event)}
      editable
      showLegend
    />
  );
}
```

## Props

### Calendar

| Prop | Type | Description |
|------|------|-------------|
| `value` | `Date` | Controlled selected date |
| `defaultValue` | `Date` | Default selected date |
| `onChange` | `(date: Date) => void` | Date change callback |
| `view` | `'month' \| 'week'` | Calendar view mode |
| `minDate` | `Date` | Minimum selectable date |
| `maxDate` | `Date` | Maximum selectable date |
| `disabledDates` | `Date[]` | Disabled specific dates |

### EventCalendar

Additional props to Calendar:

| Prop | Type | Description |
|------|------|-------------|
| `events` | `CalendarEvent[]` | Array of events |
| `categories` | `EventCategory[]` | Event categories with colors |
| `onEventClick` | `(event) => void` | Event click handler |
| `onEventCreate` | `(event) => void` | Create event handler |
| `onEventUpdate` | `(event) => void` | Update event handler |
| `onEventDelete` | `(id) => void` | Delete event handler |
| `onDrop` | `(event, date) => void` | Drag & drop handler |
| `editable` | `boolean` | Enable edit mode |
| `showLegend` | `boolean` | Show category legend |

## License

MIT
