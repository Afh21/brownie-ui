import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EventCalendar } from 'brownie-ui-calendar';
import type { CalendarEvent } from 'brownie-ui-calendar';

const meta: Meta<typeof EventCalendar> = {
  title: 'Components/EventCalendar',
  component: EventCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

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
  {
    id: '5',
    title: 'Rythmic',
    start: new Date(2024, 3, 2, 16, 0),
    end: new Date(2024, 3, 2, 17, 0),
    category: 'music',
  },
  {
    id: '6',
    title: 'Zumba dance',
    start: new Date(2024, 3, 20, 18, 0),
    end: new Date(2024, 3, 20, 19, 0),
    category: 'dance',
  },
  {
    id: '7',
    title: 'Water aerobic',
    start: new Date(2024, 3, 27, 9, 0),
    end: new Date(2024, 3, 27, 10, 0),
    category: 'water',
  },
];

const categories = [
  { id: 'dance', name: 'Dance', color: '#8b5cf6' },
  { id: 'music', name: 'Music', color: '#3b82f6' },
  { id: 'sport', name: 'Sport', color: '#ec4899' },
  { id: 'water', name: 'Water', color: '#eab308' },
];

export const Default: Story = {
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
};

export const EditableWithDragDrop: Story = {
  render: () => {
    const [date, setDate] = useState(new Date(2024, 3, 1));
    const [events, setEvents] = useState(defaultEvents);

    const handleDrop = (event: CalendarEvent, newDate: Date) => {
      const updatedEvents = events.map((e) =>
        e.id === event.id
          ? { ...e, start: newDate, end: newDate }
          : e
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
  name: 'Editable (Drag & Drop + Create/Edit/Delete)',
};

export const WeekView: Story = {
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
};

export const WithAllDayEvents: Story = {
  render: () => {
    const [date, setDate] = useState(new Date(2024, 3, 1));
    const [events, setEvents] = useState<CalendarEvent[]>([
      ...defaultEvents,
      {
        id: '8',
        title: 'Holiday',
        start: new Date(2024, 3, 5),
        end: new Date(2024, 3, 5),
        category: 'sport',
        allDay: true,
      },
      {
        id: '9',
        title: 'Conference',
        start: new Date(2024, 3, 15),
        end: new Date(2024, 3, 15),
        category: 'music',
        allDay: true,
        description: 'Full day conference',
      },
    ]);

    return (
      <div className="w-[800px]">
        <EventCalendar
          value={date}
          onChange={setDate}
          events={events}
          categories={categories}
          editable
          showLegend
        />
      </div>
    );
  },
};

export const ManyEvents: Story = {
  render: () => {
    const [date, setDate] = useState(new Date(2024, 3, 1));
    const manyEvents: CalendarEvent[] = Array.from({ length: 30 }, (_, i) => ({
      id: i.toString(),
      title: `Event ${i + 1}`,
      start: new Date(2024, 3, (i % 10) + 1, 10 + (i % 5)),
      end: new Date(2024, 3, (i % 10) + 1, 11 + (i % 5)),
      category: categories[i % 4].id,
    }));

    return (
      <div className="w-[800px]">
        <EventCalendar
          value={date}
          onChange={setDate}
          events={manyEvents}
          categories={categories}
          showLegend
        />
      </div>
    );
  },
};
