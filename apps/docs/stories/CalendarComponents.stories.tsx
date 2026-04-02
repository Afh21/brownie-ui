import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Calendar, DatePicker, DateRangePicker, EventCalendar } from 'brownie-ui-calendar';
import type { CalendarEvent } from 'brownie-ui-calendar';

// Calendar Component Stories
const calendarMeta: Meta<typeof Calendar> = {
  title: 'Components/Calendar/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Basic calendar component for date display and selection',
      },
    },
  },
  tags: ['autodocs'],
};

export default calendarMeta;
type CalendarStory = StoryObj<typeof calendarMeta>;

export const BasicCalendar: CalendarStory = {
  render: () => {
    const [date, setDate] = useState(new Date());
    return (
      <div className="w-[400px]">
        <Calendar value={date} onChange={setDate} />
      </div>
    );
  },
  name: 'Basic',
};

export const CalendarWithMinMax: CalendarStory = {
  render: () => {
    const [date, setDate] = useState(new Date());
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 7);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    
    return (
      <div className="w-[400px]">
        <Calendar 
          value={date} 
          onChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    );
  },
  name: 'With Min/Max Dates',
};

// DatePicker Stories
const datePickerMeta: Meta<typeof DatePicker> = {
  title: 'Components/Calendar/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Date picker with input field and calendar popup',
      },
    },
  },
  tags: ['autodocs'],
};

export const DatePickerStory = {
  ...datePickerMeta,
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[320px]">
        <DatePicker 
          value={date} 
          onChange={setDate}
          placeholder="Pick a date"
        />
      </div>
    );
  },
  name: 'Default',
};

// DateRangePicker Stories
const dateRangePickerMeta: Meta<typeof DateRangePicker> = {
  title: 'Components/Calendar/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Select a range of dates',
      },
    },
  },
  tags: ['autodocs'],
};

export const DateRangePickerStory = {
  ...dateRangePickerMeta,
  render: () => {
    const [range, setRange] = useState<{ start: Date; end: Date }>();
    return (
      <div className="w-[320px]">
        <DateRangePicker 
          value={range} 
          onChange={setRange}
          placeholder="Select date range"
        />
      </div>
    );
  },
  name: 'Default',
};

// EventCalendar Stories
const eventCalendarMeta: Meta<typeof EventCalendar> = {
  title: 'Components/Calendar/EventCalendar',
  component: EventCalendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Full-featured calendar with events, drag-drop, and editing',
      },
    },
  },
  tags: ['autodocs'],
};

const defaultEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Guitar lesson',
    start: new Date(2024, 3, 9, 14, 0),
    end: new Date(2024, 3, 9, 15, 0),
    category: 'music',
    description: 'Learn guitar basics',
  },
  {
    id: '2',
    title: 'Kayaking',
    start: new Date(2024, 3, 6, 10, 0),
    end: new Date(2024, 3, 6, 12, 0),
    category: 'sport',
    description: 'Morning kayaking session',
  },
  {
    id: '3',
    title: 'Zumba dance',
    start: new Date(2024, 3, 13, 18, 0),
    end: new Date(2024, 3, 13, 19, 0),
    category: 'dance',
  },
  {
    id: '4',
    title: 'Water aerobic',
    start: new Date(2024, 3, 17, 9, 0),
    end: new Date(2024, 3, 17, 10, 0),
    category: 'water',
    description: 'Pool fitness class',
  },
];

const categories = [
  { id: 'dance', name: 'Dance', color: '#8b5cf6' },
  { id: 'music', name: 'Music', color: '#3b82f6' },
  { id: 'sport', name: 'Sport', color: '#ec4899' },
  { id: 'water', name: 'Water', color: '#eab308' },
];

export const EventCalendarDefault = {
  ...eventCalendarMeta,
  render: () => {
    const [date, setDate] = useState(new Date(2024, 3, 1));
    const [events, setEvents] = useState(defaultEvents);

    return (
      <div className="w-[800px]">
        <EventCalendar
          value={date}
          onChange={setDate}
          events={events}
          categories={categories}
          showLegend
        />
      </div>
    );
  },
  name: 'Default',
};

export const EventCalendarEditable = {
  ...eventCalendarMeta,
  render: () => {
    const [date, setDate] = useState(new Date(2024, 3, 1));
    const [events, setEvents] = useState(defaultEvents);

    const handleDrop = (event: CalendarEvent, newDate: Date) => {
      const updatedEvents = events.map((e) =>
        e.id === event.id ? { ...e, start: newDate, end: newDate } : e
      );
      setEvents(updatedEvents);
    };

    const handleEventCreate = (newEvent: Omit<CalendarEvent, 'id'>) => {
      const event: CalendarEvent = {
        ...newEvent,
        id: Math.random().toString(36).substr(2, 9),
      };
      setEvents([...events, event]);
    };

    const handleEventUpdate = (updatedEvent: CalendarEvent) => {
      setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    };

    const handleEventDelete = (eventId: string) => {
      setEvents(events.filter((e) => e.id !== eventId));
    };

    return (
      <div className="w-[800px]">
        <EventCalendar
          value={date}
          onChange={setDate}
          events={events}
          categories={categories}
          editable
          showLegend
          onDrop={handleDrop}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
        />
      </div>
    );
  },
  name: 'Editable (Drag & Drop)',
};

export const EventCalendarWeekView = {
  ...eventCalendarMeta,
  render: () => {
    const [date, setDate] = useState(new Date(2024, 3, 9));
    const [events, setEvents] = useState(defaultEvents);

    return (
      <div className="w-[1000px]">
        <EventCalendar
          value={date}
          onChange={setDate}
          events={events}
          categories={categories}
          editable
          showLegend
          view="week"
          onEventCreate={(e) => {
            setEvents([...events, { ...e, id: Math.random().toString(36).substr(2, 9) }]);
          }}
        />
      </div>
    );
  },
  name: 'Week View',
};
