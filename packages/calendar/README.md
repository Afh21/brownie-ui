# brownie-ui-calendar

A modern, accessible calendar component for Brownie UI with full event management, drag & drop, and resizable events.

## Installation

```bash
npm install brownie-ui-calendar
# or
pnpm add brownie-ui-calendar
```

## Quick Start

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
];

const categories = [
  { id: 'music', name: 'Music', color: '#3b82f6' },
  { id: 'sport', name: 'Sport', color: '#ec4899' },
];

function App() {
  return (
    <EventCalendar 
      events={events}
      categories={categories}
      view="month"
      locale="es"
      editable
      onEventClick={(event) => console.log('Clicked:', event)}
      onEventDrop={(event, newDate) => console.log('Moved to:', newDate)}
      onEventResize={(event, newEnd) => console.log('Resized to:', newEnd)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `CalendarEvent[]` | `[]` | Array of events |
| `categories` | `EventCategory[]` | Default colors | Event categories |
| `view` | `'month' \| 'week' \| 'day'` | `'month'` | Current view |
| `value` | `Date` | - | Controlled selected date |
| `defaultDate` | `Date` | `new Date()` | Default selected date |
| `onChange` | `(date: Date) => void` | - | Date change callback |
| `onViewChange` | `(view: CalendarView) => void` | - | View change callback |
| `onEventClick` | `(event: CalendarEvent) => void` | - | Event click handler |
| `onEventDrop` | `(event, newDate) => void` | - | Drag & drop handler |
| `onEventResize` | `(event, newEnd) => void` | - | Resize handler |
| `onSlotClick` | `(date, hour?) => void` | - | Empty slot click handler |
| `editable` | `boolean` | `false` | Enable drag & drop + resize |
| `showLegend` | `boolean` | `false` | Show category legend |
| `locale` | `'en' \| 'es'` | `'es'` | Language |
| `hourFormat` | `'12h' \| '24h'` | `'24h'` | Time format |
| `startHour` | `number` | `0` | First hour to display |
| `endHour` | `number` | `24` | Last hour to display |
| `renderEvent` | `function` | - | Custom event renderer |

## Types

```tsx
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category?: string;
  description?: string;
  allDay?: boolean;
}

interface EventCategory {
  id: string;
  name: string;
  color: string;
}
```

## Features

- **3 Views**: Month, Week, Day
- **Drag & Drop**: Move events between days/hours
- **Resize**: Drag bottom border to extend duration
- **Tooltips**: Hover events for details (shadcn/ui)
- **i18n**: English & Spanish
- **Past days**: Gray styling, disabled interaction
- **Overlap handling**: Events auto-arrange horizontally
- **Custom hour range**: Limit displayed hours (e.g., 6-18)
- **Headless mode**: Custom `renderEvent` for full control

## License

MIT
